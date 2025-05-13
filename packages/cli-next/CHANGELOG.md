# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). This project
started to follow semantic versioning starting from 2.0.0.

Not every commit needs to result in a change to this file (e.g. docs and chore commits). Every
commit that affects the code in a way that consumers might care about should include edits to the
'Unreleased' section though. Breaking changes should be prefixed with `**BREAKING:**`.

## [2.0.8](https://github.com/Airtable/blocks/compare/@airtable/blocks-cli@2.0.7...@airtable/blocks-cli@2.0.8)

-   Migrate from `cpx` dependency, which is no longer maintained, to `cpx2`.

## [2.0.7](https://github.com/Airtable/blocks/compare/@airtable/blocks-cli@2.0.6...@airtable/blocks-cli@2.0.7)

-   Bump dependency on `@airtable/blocks-webpack-bundler` so that `{runtime: 'automatic'}` is set on
    `@babel/preset-react` configuration.

## [2.0.6](https://github.com/Airtable/blocks/compare/@airtable/blocks-cli@2.0.5...@airtable/blocks-cli@2.0.6)

-   Upgrade various dependencies.

## [2.0.5](https://github.com/Airtable/blocks/compare/@airtable/blocks-cli@2.0.4...@airtable/blocks-cli@2.0.5)

-   Perform routine version upgrade to various dependencies
-   Update README to say TOKEN instead of APIKEY

## [2.0.4](https://github.com/Airtable/blocks/compare/@airtable/blocks-cli@2.0.3...@airtable/blocks-cli@2.0.4)

-   Updated help text for the `set-api-key` command to prompt for personal access tokens.

## [2.0.3](https://github.com/Airtable/blocks/compare/@airtable/blocks-cli@2.0.2...@airtable/blocks-cli@2.0.3)

-   Added forwards-compatibility support for personal access tokens, in addition to user API keys.

## [2.0.2](https://github.com/Airtable/blocks/compare/@airtable/blocks-cli@2.0.1...@airtable/blocks-cli@2.0.2)

-   Use the default branch (instead of `master`) when fetching a template from GitHub.

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
        extension source code into publishable artifacts.
