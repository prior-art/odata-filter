#!/usr/bin/env node
/**
 * Generates a Markdown dependency-coupling report using dependency-cruiser's
 * programmatic API, at two levels:
 *
 *   1. Project level - the workspace packages mapped to each other.
 *   2. Module level   - within each package, its own source files mapped to
 *                        each other.
 *
 * For every "module" (a package at the project level, a file at the module
 * level) this reports:
 *   - Ce (efferent coupling): how many other modules it depends on.
 *   - Ca (afferent coupling): how many other modules depend on it.
 *   - I  (instability):        Ce / (Ce + Ca). 0 = maximally stable (safe to
 *                               depend on, risky to change), 1 = maximally
 *                               unstable (safe to change, nothing relies on
 *                               it).
 *
 * The goal is to keep reusable modules reusable: foundational modules should
 * stay stable (low I); a module with both high Ca (many things depend on it)
 * *and* high I (it also changes/depends on a lot) is flagged as risky, since
 * that combination means volatile code is widely relied upon.
 *
 * The report is printed to stdout only - nothing is written to the repo.
 * Run with `npm run deps:report` or `just deps-report`.
 */
import { cruise } from "dependency-cruiser";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
// dependency-cruiser reports module paths relative to the process's cwd at
// cruise() time - pin it to the repo root so path math below is reliable
// regardless of where this script is invoked from.
process.chdir(repoRoot);
const packagesDir = join(repoRoot, "packages");

const { default: baseConfig } = await import(
  join(repoRoot, ".dependency-cruiser.js")
);

/**
 * Discovers workspace packages: any `packages/*` directory with a
 * package.json (e.g. `docs`, a Jekyll site with no package.json, is
 * naturally skipped). For each, resolves its real TS entry point -
 * `src/index.ts` by default, `assembly/index.ts` for the one
 * AssemblyScript package (core-wasm).
 */
function discoverPackages() {
  const packages = [];
  for (const entry of readdirSync(packagesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const pkgDir = join(packagesDir, entry.name);
    const pkgJsonPath = join(pkgDir, "package.json");
    if (!existsSync(pkgJsonPath)) continue;

    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
    const srcDir = join(pkgDir, "src");
    const assemblyDir = join(pkgDir, "assembly");
    const srcEntry = join(srcDir, "index.ts");
    const assemblyEntry = join(assemblyDir, "index.ts");

    let entryFile;
    let moduleDir;
    if (existsSync(srcEntry)) {
      entryFile = srcEntry;
      moduleDir = srcDir;
    } else if (existsSync(assemblyEntry)) {
      entryFile = assemblyEntry;
      moduleDir = assemblyDir;
    } else {
      continue;
    }

    packages.push({
      name: pkgJson.name,
      dirName: entry.name,
      entryFile,
      moduleDir,
    });
  }
  return packages;
}

/**
 * Cross-package imports (e.g. `marshalers` importing `@odata-filter/core`)
 * normally resolve through npm workspace symlinks to `dist/index.js`, which
 * is excluded from following (see `.dependency-cruiser.js`'s `doNotFollow`).
 * That means afferent coupling never gets attributed back to the depended-
 * upon package's real source. To fix this, generate a throwaway tsconfig
 * (written outside the repo) that extends the root tsconfig and adds a
 * `paths` alias for every workspace package name straight to its real entry
 * source file, so resolution follows through to source instead of stopping
 * at `dist`.
 */
function buildResolutionTsConfig(packages) {
  const paths = {};
  for (const pkg of packages) {
    paths[pkg.name] = [relative(repoRoot, pkg.entryFile)];
  }

  const tsConfig = {
    extends: join(repoRoot, "tsconfig.json"),
    compilerOptions: {
      baseUrl: repoRoot,
      paths,
    },
    include: [
      join(repoRoot, "packages/*/src/**/*.ts"),
      join(repoRoot, "packages/*/assembly/**/*.ts"),
    ],
  };

  const tmpDir = mkdtempSync(join(tmpdir(), "odata-filter-deps-report-"));
  const tsConfigPath = join(tmpDir, "tsconfig.json");
  writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
  return tsConfigPath;
}

/** Runs dependency-cruiser and returns the parsed JSON cruise result. */
async function runCruise(targets, cruiseOptionOverrides) {
  const { output } = await cruise(targets, {
    doNotFollow: baseConfig.options.doNotFollow,
    combinedDependencies: baseConfig.options.combinedDependencies,
    enhancedResolveOptions: baseConfig.options.enhancedResolveOptions,
    // Keep in sync with .dependency-cruiser.js: without this, type-only
    // imports (`import type { ... }`) aren't tracked as coupling at all,
    // silently under-counting Ca/Ce for TS-heavy modules.
    tsPreCompilationDeps: baseConfig.options.tsPreCompilationDeps,
    metrics: true,
    outputType: "json",
    ...cruiseOptionOverrides,
  });
  return JSON.parse(output);
}

/** Divide-by-zero-safe instability (Ce / (Ce + Ca)). */
function instability(ce, ca) {
  return ce + ca === 0 ? 0 : ce / (ce + ca);
}

function formatInstability(value) {
  return value.toFixed(2);
}

/**
 * Extracts project-level (package-to-package) Ca/Ce/I from the cruise
 * result's folder metrics, plus the actual package -> package edges,
 * derived from the modules' resolved dependency paths (the single source
 * of truth) rather than re-parsing package.json separately.
 */
function computeProjectLevel(result, packages) {
  const dirNameToPackage = new Map(packages.map((pkg) => [pkg.dirName, pkg]));

  const metrics = packages
    .map((pkg) => {
      const folder = result.folders.find(
        (f) => f.name === `packages/${pkg.dirName}`,
      );
      return {
        name: pkg.name,
        dirName: pkg.dirName,
        ca: folder?.afferentCouplings ?? 0,
        ce: folder?.efferentCouplings ?? 0,
        instability: folder?.instability ?? 0,
        moduleCount: folder?.moduleCount ?? 0,
      };
    })
    .sort((a, b) => a.instability - b.instability);

  const edgeSet = new Set();
  for (const mod of result.modules) {
    const fromDirName = packageDirNameFromPath(mod.source, dirNameToPackage);
    if (!fromDirName) continue;

    for (const dependency of mod.dependencies ?? []) {
      const toDirName = packageDirNameFromPath(
        dependency.resolved,
        dirNameToPackage,
      );
      if (!toDirName || toDirName === fromDirName) continue;
      edgeSet.add(`${fromDirName}\u0000${toDirName}`);
    }
  }

  const edges = [...edgeSet].map((key) => {
    const [from, to] = key.split("\u0000");
    return { from, to };
  });

  return { metrics, edges };
}

function packageDirNameFromPath(path, dirNameToPackage) {
  if (!path) return undefined;
  const match = /^packages\/([^/]+)\//.exec(path);
  if (!match) return undefined;
  return dirNameToPackage.has(match[1]) ? match[1] : undefined;
}

/**
 * Extracts module-level (file-to-file, within one package) Ca/Ce/I for a
 * single package, excluding spec files (test files aren't reusable
 * modules, and the repo's own `not-to-spec` rule already discourages
 * depending on them).
 *
 * Only edges *within* the package count towards Ce/Ca here - imports of
 * external npm packages or other workspace packages are intentionally
 * excluded, since this section measures each package's own internal
 * structure, not its external footprint (that's the project-level
 * section's job). Multiple import statements to the same target file
 * (e.g. a `import { x }` plus a separate `import type { Y }` from the same
 * module) are also collapsed into a single edge, so Ce/Ca reflect distinct
 * module-to-module relationships rather than raw import-statement counts.
 */
async function computeModuleLevel(pkg) {
  const result = await runCruise([pkg.moduleDir], {
    exclude: "\\.spec\\.ts$",
  });

  const toRelative = (source) =>
    relative(pkg.moduleDir, isAbsolute(source) ? source : join(repoRoot, source));

  // Only modules that live inside this package's own src/assembly dir -
  // external targets (npm packages, node core modules, other workspace
  // packages resolved to `dist`) resolve to a path outside moduleDir and
  // are dropped here.
  const internal = new Map();
  for (const mod of result.modules) {
    const relPath = toRelative(mod.source);
    if (relPath.startsWith("..")) continue;
    internal.set(relPath, mod);
  }

  const files = [];
  const edgeSet = new Set();
  for (const [relPath, mod] of internal) {
    const targets = new Set();
    for (const dependency of mod.dependencies ?? []) {
      if (!dependency.resolved) continue;
      const targetRelPath = toRelative(dependency.resolved);
      if (!internal.has(targetRelPath)) continue;
      targets.add(targetRelPath);
    }
    const ce = targets.size;
    const ca = (mod.dependents ?? []).filter((dependentSource) =>
      internal.has(toRelative(dependentSource)),
    ).length;

    files.push({ path: relPath, ce, ca, instability: instability(ce, ca) });
    for (const target of targets) edgeSet.add(`${relPath}\u0000${target}`);
  }
  files.sort((a, b) => a.instability - b.instability);

  const edges = [...edgeSet].map((key) => {
    const [from, to] = key.split("\u0000");
    return { from, to };
  });

  return { files, edges };
}

function mermaidId(prefix, name) {
  return `${prefix}_${name.replace(/[^a-zA-Z0-9]/g, "_")}`;
}

function renderProjectMermaid(metrics, edges) {
  const lines = ["```mermaid", "flowchart LR"];
  for (const pkg of metrics) {
    const id = mermaidId("pkg", pkg.dirName);
    lines.push(
      `  ${id}["${pkg.dirName}<br/>I=${formatInstability(pkg.instability)}"]`,
    );
  }
  for (const edge of edges) {
    lines.push(`  ${mermaidId("pkg", edge.from)} --> ${mermaidId("pkg", edge.to)}`);
  }
  lines.push("  classDef stable fill:#d4edda,stroke:#2e7d32,color:#1b5e20;");
  lines.push(
    "  classDef unstable fill:#fff3cd,stroke:#c9a227,color:#7a5b00;",
  );
  for (const pkg of metrics) {
    const id = mermaidId("pkg", pkg.dirName);
    lines.push(`  class ${id} ${pkg.instability <= 0.5 ? "stable" : "unstable"}`);
  }
  lines.push("```");
  return lines.join("\n");
}

function renderModuleMermaid(pkg, files, edges) {
  const lines = ["```mermaid", "flowchart LR"];
  for (const file of files) {
    const id = mermaidId("mod", file.path);
    lines.push(`  ${id}["${file.path}"]`);
  }
  for (const edge of edges) {
    lines.push(`  ${mermaidId("mod", edge.from)} --> ${mermaidId("mod", edge.to)}`);
  }
  lines.push("```");
  return lines.join("\n");
}

function renderProjectTable(metrics) {
  const header = "| Package | Ca | Ce | Instability | Modules |\n|---|---|---|---|---|";
  const rows = metrics.map(
    (pkg) =>
      `| \`${pkg.name}\` | ${pkg.ca} | ${pkg.ce} | ${formatInstability(pkg.instability)} | ${pkg.moduleCount} |`,
  );
  return [header, ...rows].join("\n");
}

function renderModuleTable(files) {
  const header = "| File | Ca | Ce | Instability |\n|---|---|---|---|";
  const rows = files.map(
    (file) =>
      `| \`${file.path}\` | ${file.ca} | ${file.ce} | ${formatInstability(file.instability)} |`,
  );
  return [header, ...rows].join("\n");
}

function renderRiskCallouts(metrics) {
  const risky = metrics.filter((pkg) => pkg.ca > 0 && pkg.instability > 0.5);
  if (risky.length === 0) {
    return "No packages combine high afferent coupling with high instability - the dependency chain looks healthy.";
  }
  return risky
    .map(
      (pkg) =>
        `- ⚠️ \`${pkg.name}\` is depended on by ${pkg.ca} other package(s) but has instability ${formatInstability(
          pkg.instability,
        )} - changes here are riskier than they should be for something this widely used.`,
    )
    .join("\n");
}

async function main() {
  const packages = discoverPackages();
  const tsConfigPath = buildResolutionTsConfig(packages);

  const projectResult = await runCruise(["packages"], {
    tsConfig: { fileName: tsConfigPath },
  });
  const { metrics, edges } = computeProjectLevel(projectResult, packages);

  const sections = [];
  sections.push("# Dependency Coupling Report\n");
  sections.push(
    [
      "Generated with `dependency-cruiser`. Metrics:",
      "",
      "- **Ce (efferent coupling)** - how many other modules this one depends on.",
      "- **Ca (afferent coupling)** - how many other modules depend on this one.",
      "- **I (instability)** - `Ce / (Ce + Ca)`. `0` = maximally stable (safe to",
      "  depend on, risky to change); `1` = maximally unstable (safe to change,",
      "  nothing relies on it).",
      "",
      "Reusable/foundational modules should stay stable (low I, high Ca). Leaf or",
      "adapter modules are expected to be unstable (high I) - that's healthy, not a",
      "problem. What to watch for is a module with **both** high Ca and high I: that",
      "combination means widely-depended-upon code is also volatile.",
    ].join("\n"),
  );

  sections.push("\n## Project level (package \u2192 package)\n");
  sections.push(renderProjectTable(metrics));
  sections.push("\n" + renderProjectMermaid(metrics, edges));
  sections.push("\n### Risk callouts\n");
  sections.push(renderRiskCallouts(metrics));

  sections.push(
    [
      "\n## Module level (file \u2192 file, within each package)\n",
      "Ca/Ce/I here only count edges *between files in the same package* -",
      "imports of external npm packages or other workspace packages are",
      "excluded, so this reflects each package's own internal structure.",
    ].join("\n"),
  );
  for (const pkg of packages) {
    const { files, edges: moduleEdges } = await computeModuleLevel(pkg);
    sections.push(`\n### \`${pkg.name}\`\n`);
    sections.push(renderModuleTable(files));
    sections.push("\n" + renderModuleMermaid(pkg, files, moduleEdges));
  }

  console.log(sections.join("\n"));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
