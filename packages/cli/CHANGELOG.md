# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). This project
doesn't currently follow semantic versioning, but will once it reaches 1.0.0.

Not every commit needs to result in a change to this file (e.g. docs and chore commits). Every
commit that affects the code in a way that consumers might care about should include edits to the
'Unreleased' section though. Breaking changes should be prefixed with `**BREAKING:**`.

## [Unreleased](https://github.com/airtable/blocks/compare/@airtable/blocks-cli@0.0.27...HEAD)

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
