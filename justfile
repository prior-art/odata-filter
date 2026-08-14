set dotenv-load

default:
    @just --list

dev *args:
    npm run dev -- {{args}}

build package="":
    {{ if package == "" { "npm run build" } else { "npm run build --workspace=packages/" + package } }}

clean package="":
    {{ if package == "" { "npm run clean" } else { "npm run clean --workspace=packages/" + package } }}

lint package="":
    {{ if package == "" { "npm run lint" } else { "npm run lint --workspace=packages/" + package } }}

lint-fix package="":
    {{ if package == "" { "npm run lint:fix" } else { "npm run lint:fix --workspace=packages/" + package } }}

test package="":
    {{ if package == "" { "npm test" } else { "npm test --workspace=packages/" + package } }}

test-mutation package="":
    {{ if package == "" { "npm run test:mutation" } else { "npm run test:mutation --workspace=packages/" + package } }}

test-watch package:
    npm run --workspace=packages/{{package}} test:watch

audit package:
    npm audit --workspace=packages/{{package}} --omit=dev

deps-report:
    npm run deps:report
