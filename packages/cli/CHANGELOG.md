# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). This project
doesn't currently follow semantic versioning, but will once it reaches 1.0.0.

Not every commit needs to result in a change to this file (e.g. docs and chore commits). Every
commit that affects the code in a way that consumers might care about should include edits to the
'Unreleased' section though. Breaking changes should be prefixed with `**BREAKING:**`.

## [Unreleased](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.39...HEAD)

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
