set dotenv-load

# List available recipes
default:
    @just --list

# Run the CLI in dev mode (requires schema.json at repo root)
dev *args:
    npm run dev -- {{args}}

# Build all packages (or a single package: `just build core`)
build package="":
    {{ if package == "" { "npm run build" } else { "npm run build --workspace=packages/" + package } }}

# Remove build artifacts and node_modules (or a single package: `just clean core`)
clean package="":
    {{ if package == "" { "npm run clean" } else { "npm run clean --workspace=packages/" + package } }}

# Lint all packages (or a single package: `just lint core`)
lint package="":
    {{ if package == "" { "npm run lint" } else { "npm run lint --workspace=packages/" + package } }}

# Lint and auto-fix all packages (or a single package: `just lint-fix core`)
lint-fix package="":
    {{ if package == "" { "npm run lint:fix" } else { "npm run lint:fix --workspace=packages/" + package } }}

# Run tests across all packages (or a single package: `just test core`)
test package="":
    {{ if package == "" { "npm test" } else { "npm test --workspace=packages/" + package } }}

# Run mutation tests across all packages (or a single package: `just test-mutation core`)
test-mutation package="":
    {{ if package == "" { "npm run test:mutation" } else { "npm run test:mutation --workspace=packages/" + package } }}

# Run tests in watch mode for a package (e.g. `just test-watch core`)
test-watch package:
    npm run --workspace=packages/{{package}} test:watch

# Audit a package for vulnerabilities (e.g. `just audit core`)
audit package:
    npm audit --workspace=packages/{{package}} --omit=dev
