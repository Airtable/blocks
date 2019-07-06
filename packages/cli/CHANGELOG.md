# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). This project
doesn't currently follow semantic versioning, but will once it reaches 1.0.0.

Not every commit needs to result in a change to this file (e.g. docs and chore commits). Every
commit that affects the code in a way that consumers might care about should include edits to the
'Unreleased' section though. Breaking changes should be prefixed with `**BREAKING:**`.

## [Unreleased](--github-repo-url/compare/v0.0.12...HEAD)

-   **BREAKING** removes support for exporting a React component from the frontend entry file. Use
    `initializeBlock` instead.

## [0.0.12](--github-repo-url/compare/v0.0.11...v0.0.12) - 2019-07-05

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

## [0.0.11](https://github.com/airtable/blocks-cli/compare/v0.0.10...@airtable/blocks-cli0.0.11) - 2019-07-03

No changes.

## [0.0.10](https://github.com/airtable/blocks-cli/releases/tag/v0.0.10) - 2019-07-02

### Added

-   This changelog!
-   `block run` copies bundle URL to clipboard

### Fixed

-   block directory path resolution on windows
