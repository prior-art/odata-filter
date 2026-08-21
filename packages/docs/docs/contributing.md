---
layout: default
title: Contributing
nav_order: 8
---

# Contributing

## Reporting Issues

A good bug report helps us fix the problem quickly without chasing you for more information.
Before opening an issue, please:

1. **Confirm you are on the latest version** of the affected package.
2. **Reproduce the issue** with a minimal filter string and note whether you can reproduce it
   consistently.
3. **Collect environment details**: OS and version, Node.js version, package versions.
4. **Check existing issues** at [github.com/prior-art/odata-filter/issues](https://github.com/prior-art/odata-filter/issues)
   to avoid duplicates.

Once you are ready, [open a new issue](https://github.com/prior-art/odata-filter/issues/new) and
include:

- A clear title describing the problem.
- The filter expression that triggers the issue.
- The expected result and the actual result (including full error messages and stack traces).
- Your environment details (OS, Node.js version, package version).
- Steps to reproduce reliably.

## Setup and Installation

To set up the project locally for development, follow the
[Installation Guide]({% link docs/installation.md %}).

Clone the repository and install dependencies:

```sh
git clone git@github.com:prior-art/odata-filter.git
cd odata-filter
npm i
```

### Build

```sh
npm run build
# or with just
just build
```

### Test

```sh
npm test
# or with just
just test
```

### Lint

```sh
npm run lint
# or with just
just lint
```

## Code Contributions

1. Create a branch from `main` using the pattern `<type>/issues-<number>`
   (e.g. `feat/issues-42`).
2. Keep your branch up to date with `main` by rebasing.
3. Make your changes with focused, incremental commits following
   [Conventional Commits](https://www.conventionalcommits.org/) format:
   `<type>: [Issues: <number>] <description>`
   (e.g. `feat: [Issues: 42] add support for the has operator`).
4. Ensure all tests pass and mutation coverage remains at 100%:
   ```sh
   just test
   just test-mutation
   ```
5. Open a pull request against `main`.
6. The CI pipeline runs automatically — resolve any failures before requesting review.
7. Address review feedback. Once approved, the PR is squash-merged into `main`.

## Release Process

1. After merging, create a
   [pre-release](https://github.com/prior-art/odata-filter/releases/new) using the tag format
   `{package}@x.x.x-rc.x` (e.g. `core@1.0.0-rc.1`).
2. The pre-release publishes the package to GitHub Packages for testing.
3. Once the pre-release is validated, promote it to a full release using the tag format
   `{package}@x.x.x` (e.g. `core@1.0.0`).

## Code Review Process

All pull requests undergo code review. Reviewers provide constructive feedback promptly. Please
be responsive to comments and open to changes. Once approved, the PR is merged.

## Communication

Open a [GitHub Discussion](https://github.com/prior-art/odata-filter/discussions) for questions
that are not bugs or feature requests.
