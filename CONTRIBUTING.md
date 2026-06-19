# CONTRIBUTING.md

* [Reporting Issues](#reporting-issues)
* [Setup and Installation](#setup-and-installation)
* [Code Contributions](#code-contributions)
* [Code Review Process](#code-review-process)
* [Communication Channels](#communication-channels)

## Reporting Issues

What can you do as a open-source contributor to report a bug? 

A good bug report should keep others from chasing you down for more information. Therefore, we ask you to investigate carefully, collect information, and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bugs quickly.

* Make sure that you are using the latest version.
* OS, Platform, and Version (Windows, Linux, macOS, x86, ARM)
* Version of the interpreter, compiler, SDK, runtime environment, and package manager, depending on what is relevant.
* Possibly your input and the output
* Can you reliably reproduce the issue? Can you reproduce it with older versions?

## Setup and Installation

To set up the project locally, follow the steps outlined in our [Installation Guide](INSTALL.md). It includes instructions on dependencies, required environment variables, and other setup specifics.

## Code Contributions

Once you have finished the installation process and run the application described in the [Setup and Installation](#setup-and-installation) section, please follow the steps below to create PRs:

1. Create a branch from `main` following the pattern `feat/DP-12345_brief_description`, depending of type of issue.
2. Keep your branch up to date with the `main` branch by rebasing.
3. Create a PR against `main`.
4. Once the PR is created, the CI pipeline will run automatically.
5. If the pipeline is successful, the PR will be reviewed by the team.
6. If the PR is approved, it will be merged into `main` using the "Squash Merge" strategy.
7. Once the PR is merged, the CI pipeline will run again.
8. Create a [pre-release](https://github.com/prior-art/odata-filter/releases/new) using the tag format {package}@x.x.x-rc.x (e.g. fastify@1.0.0-rc.1). This pre-release will be used for testing purposes.
9. Once the pre-release is created, the package will be published to the Github Packages.
10. The pre-release will be tested by the team.
11. If the pre-release is approved, it will be promoted to a release by creating a new [release](https://github.com/prior-art/odata-filter/releases/new) using the tag format x.x.x (e.g. core@1.0.0).
12. Once the release is created, the package will be published to the Github Packages.

## Code Review Process

All pull requests will undergo code review. We review contributions promptly and provide constructive feedback. Please be open to feedback and responsive to any changes or suggestions. Once your pull request is approved, it will be merged.

