set dotenv-load

# List available recipes
default:
    @just --list

# Run the CLI in dev mode (requires schema.json at repo root)
dev *args:
    npm run dev -- {{args}}

# Build all packages
build:
    npm run build

# Remove build artifacts and node_modules across all packages
clean:
    npm run clean

# Lint all packages
lint:
    npm run lint

# Lint and auto-fix all packages
lint-fix:
    npm run lint:fix

# Run tests across all packages
test:
    npm test

# Run mutation tests across all packages
test-mutation:
    npm run test:mutation

# Run tests in watch mode (scoped to a package, e.g. `just test-watch core`)
test-watch package:
    npm run --workspace=packages/{{package}} test:watch
