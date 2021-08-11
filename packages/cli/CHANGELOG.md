# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). This project
doesn't currently follow semantic versioning, but will once it reaches 1.0.0.

Not every commit needs to result in a change to this file (e.g. docs and chore commits). Every
commit that affects the code in a way that consumers might care about should include edits to the
'Unreleased' section though. Breaking changes should be prefixed with `**BREAKING:**`.

## [Unreleased](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.65...HEAD)

No changes.

## [0.0.65](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.64...@airtable/blocks-cli@0.0.65) - 2021-08-11

No changes.

## [0.0.64](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.63...@airtable/blocks-cli@0.0.64) - 2021-05-20

No changes.

## [0.0.63](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.62...@airtable/blocks-cli@0.0.63) - 2021-04-26

-   Adds a new optional argument "--http" to `block run`, which will server your block from an HTTP
    server instead of the default HTTPS server.

## [0.0.62](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.61...@airtable/blocks-cli@0.0.62) - 2021-02-23

-   Bump dependency version for `archiver` package.

## [0.0.61](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.60...@airtable/blocks-cli@0.0.61) - 2020-12-02

-   Fix initializing from a github repository.

## [0.0.60](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.59...@airtable/blocks-cli@0.0.60) - 2020-11-24

No changes.

## [0.0.59](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.58...@airtable/blocks-cli@0.0.59) - 2020-09-13

No changes.

## [0.0.58](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.57...@airtable/blocks-cli@0.0.58) - 2020-09-13

No changes.

## [0.0.57](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.56...@airtable/blocks-cli@0.0.57) - 2020-09-13

-   New `block submit` command to submit your app code for review to be listed in the Airtable
    Marketplace.

## [0.0.56](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.55...@airtable/blocks-cli@0.0.56) - 2020-09-03

No changes.

## [0.0.55](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.54...@airtable/blocks-cli@0.0.55) - 2020-08-07

-   Improved error message when doing `block run` without `node_modules`
-   Remove dependency on `git` executable (using octokit.github.io/rest.js under the hood).

## [0.0.54](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.53...@airtable/blocks-cli@0.0.54) - 2020-07-02

-   Revert changes from
    [0.0.53](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.52...@airtable/blocks-cli@0.0.53),
    thus adding back the dependency to `git`. This is because
    [0.0.53](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.52...@airtable/blocks-cli@0.0.53)
    requires macOS users to have the macOS command line tools to be installed to be used properly

## [0.0.53](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.52...@airtable/blocks-cli@0.0.53) - 2020-06-26

-   Remove dependency on `git` executable (using NodeGit under the hood).

## [0.0.52](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.51...@airtable/blocks-cli@0.0.52) - 2020-06-22

-   Fix renaming files across storage devices during `block run`.

## [0.0.51](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.50...@airtable/blocks-cli@0.0.51) - 2020-05-18

-   Regenerate self-signed certificated used by localhost in `block run`

## [0.0.50](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.49...@airtable/blocks-cli@0.0.50) - 2020-05-08

-   More descriptive error message if CLI is below the minimum supported version
-   Output some more error messages when building fails on `block release`

## [0.0.49](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.48...@airtable/blocks-cli@0.0.49) - 2020-04-14

-   Correctly quit on file system "watch" errors. Some operating systems (particularly on a \*nix
    OS), it is easy to run into `ENOSPC` errors due to file watching limitations. We now correctly
    exit if met with this error.

## [0.0.48](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.47...@airtable/blocks-cli@0.0.48) - 2020-04-07

No changes.

## [0.0.47](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.46...@airtable/blocks-cli@0.0.47) - 2020-03-27

No changes.

## [0.0.46](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.45...@airtable/blocks-cli@0.0.46) - 2020-03-16

No changes.

## [0.0.45](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.44...@airtable/blocks-cli@0.0.45) - 2020-03-16

No changes.

## [0.0.44](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.43...@airtable/blocks-cli@0.0.44) - 2020-03-04

No changes.

## [0.0.43](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.42...@airtable/blocks-cli@0.0.43) - 2020-02-18

-   **BREAKING**: Minimum supported Node version is now `12.14.0`

## [0.0.42](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.41...@airtable/blocks-cli@0.0.42) - 2020-02-06

-   Add support for initializing a block from a Github repository

## [0.0.41](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.40...@airtable/blocks-cli@0.0.41) - 2020-01-07

No changes.

## [0.0.40](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.39...@airtable/blocks-cli@0.0.40) - 2020-01-06

-   Add support for [nullish coalescing](https://github.com/tc39/proposal-nullish-coalescing) and
    [optional chaining](https://github.com/tc39/proposal-optional-chaining) in blocks.
-   Rewrite "@airtable/blocks": "latest" dependency to the specific latest version in block init

## [0.0.39](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.38...@airtable/blocks-cli@0.0.39) - 2019-12-13

-   Fix Node 10.x / 12.x compatibility issue in `block release`.

## [0.0.38](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.37...@airtable/blocks-cli@0.0.38) - 2019-11-18

-   Supports TypeScript 3.7.
-   Notifies when a new version of `@airtable/blocks-cli` is available.
-   Security and bug fixes.

## [0.0.37](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.36...@airtable/blocks-cli@0.0.37) - 2019-09-30

-   New `block list-remotes` and `block remove-remote` commands.
-   **BREAKING**: Restricts frontend bundle size limit to 2MB.

## [0.0.36](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.35...@airtable/blocks-cli@0.0.36) - 2019-09-19

-   Add `block add-remote` command

## [0.0.35](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.34...@airtable/blocks-cli@0.0.35) - 2019-09-18

-   Flexible directory structures are now supported. Blocks code no longer needs to conform to a
    specific directory structure.
-   In blocks' code, using relative paths for `import`/`require` statements is now the default.
-   Enables transpilation of TypeScript source code.
-   Improved build process and bug fixes.

## [0.0.34](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.33...@airtable/blocks-cli@0.0.34) - 2019-08-30

No changes.

## [0.0.33](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.32...@airtable/blocks-cli@0.0.33) - 2019-08-22

-   In `block init` - disable `react/prop-types` eslint rule in the default scaffolded
    `.eslintrc.js` file for the user's block directory.
-   Fix frontend code bundling by configuring `browserify` + `envify` correctly.

## [0.0.32](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.31...@airtable/blocks-cli@0.0.32) - 2019-08-20

-   Can now use an example block as a template to provide starting code for a new block. You can
    specify an example block as part of the normal "Build a block" feature on airtable.com.

## [0.0.31](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.30...@airtable/blocks-cli@0.0.31) - 2019-08-16

-   Some more miscellaneous fixes and address internal process issues. Versions
    [0.0.28](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.27...@airtable/blocks-cli@0.0.28)
    through
    [0.0.30](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.29...@airtable/blocks-cli@0.0.30)
    are unavailable/unpublished and should not be used.

## [0.0.30](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.29...@airtable/blocks-cli@0.0.30) - 2019-08-16

No changes.

## [0.0.29](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.28...@airtable/blocks-cli@0.0.29) - 2019-08-16

-   Some bug fixes related to packaging; version
    [0.0.28](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.27...@airtable/blocks-cli@0.0.28)
    was unpublished due to packaging bugs.

## [0.0.28](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.27...@airtable/blocks-cli@0.0.28) - 2019-08-15

-   Support for multiple API Keys.

## [0.0.27](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.26...@airtable/blocks-cli@0.0.27) - 2019-08-01

-   Change outputted `block init` copy text for cross system compatibility
-   Remove some unused dependencies.

## [0.0.26](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.24...@airtable/blocks-cli@0.0.26) - 2019-07-29

No changes.

## [0.0.24](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.23...@airtable/blocks-cli@0.0.24) - 2019-07-26

-   Removed some unnecessary copy text on `block run`.

## [0.0.23](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.22...@airtable/blocks-cli@0.0.23) - 2019-07-26

No changes.

## [0.0.22](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.19...@airtable/blocks-cli@0.0.22) - 2019-07-26

-   Some Windows compatibility fixes.
-   Some fixes regarding error checking during `block release`.

## [0.0.19](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.18...@airtable/blocks-cli@0.0.19) - 2019-07-18

No changes.

## [0.0.18](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.17...@airtable/blocks-cli@0.0.18) - 2019-07-17

-   Replace `yarn` with `npm` for package management of blocks code. This affects both `block init`
    and `block release`.

## [0.0.17](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.16...@airtable/blocks-cli@0.0.17) - 2019-07-16

-   Fix input prompt contrast on dark terminal backgrounds

## [0.0.16](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.15...@airtable/blocks-cli@0.0.16) - 2019-07-12

-   `block run`: Changed the default port from 8000 to 9000.
-   `block run`: Removed browser versions message.

## [0.0.15](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.14...@airtable/blocks-cli@0.0.15) - 2019-07-11

### Changed

-   Switch HTTP status code for unchanged live-reload long-polling request to a non-error code to
    prevent developer console noise.

## [0.0.14](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.13...@airtable/blocks-cli@0.0.14) - 2019-07-10

-   Update documentation links & eslint-plugin-blocks

## [0.0.13](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.12...@airtable/blocks-cli@0.0.13) - 2019-07-09

### Removed

-   **BREAKING** removes support for exporting a React component from the frontend entry file. Use
    `initializeBlock` instead.

## [0.0.12](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.11...@airtable/blocks-cli@0.0.12) - 2019-07-05

### Added

-   `block set-api-key` command to update your Airtable API key
-   `block init` generates a default ESLint config

### Changed

-   API key storage
    -   `.airtableApiKey` deprecated and replaced by `.airtableblocksrc.json`
    -   `.airtableblocksrc.json` supported in both user config (eg.
        `~/.config/.airtableblocksrc.json`) and at the block level (within your block directory).
    -   `block init` will check for the presence of user config and not prompt for Airtable API key
        if it already exists there

## [0.0.11](https://github.com/airtable/blocks/compare/v0.0.10...@airtable/blocks-cli@0.0.11) - 2019-07-03

No changes.

## [0.0.10](https://github.com/airtable/blocks/releases/tag/v0.0.10) - 2019-07-02

### Added

-   This changelog!
-   `block run` copies bundle URL to clipboard

### Fixed

-   block directory path resolution on windows
