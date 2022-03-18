# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). This project
started to follow semantic versioning starting from 2.0.0.

Not every commit needs to result in a change to this file (e.g. docs and chore commits). Every
commit that affects the code in a way that consumers might care about should include edits to the
'Unreleased' section though. Breaking changes should be prefixed with `**BREAKING:**`.

## [Unreleased](https://github.com/Airtable/blocks/compare/@airtable/blocks-cli@2.0.1...HEAD)

No changes.

## [2.0.1](https://github.com/Airtable/blocks/compare/@airtable/blocks-cli@2.0.0...@airtable/blocks-cli@2.0.1) - 2022-03-18

-   Added this changelog.

## [2.0.0](https://github.com/Airtable/blocks/compare/@airtable/blocks-cli@2.0.0) - 2022-03-16

-   Bringing the beta CLI to general availability!
-   The CLI now uses webpack under the hood, and has improved support for flexible directory
    structures and custom bundler configuration.

### Added

-   Using code from other directories
    -   The new CLI allows this method of code-sharing by allowing “sibling directories” outside the
        source directory to be bundled. Those other directories can include npm imports based on
        link or file.
-   Using a custom bundler
    -   Custom bundlers allow users to replace the CLI's built-in bundling functionality that turns
        app source code into publishable artifacts.
