# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). This project
started to follow semantic versioning as of version 1.0.0.

Not every commit needs to result in a change to this file (e.g. docs and chore commits). Every
commit that affects the code in a way that consumers might care about should include edits to the
'Unreleased' section though. Breaking changes should be prefixed with `**BREAKING:**`.

## [Unreleased](https://github.com/airtable/blocks-testing/compare/@airtable/blocks-testing@0.0.5...HEAD)

No changes.

## [0.0.5](https://github.com/airtable/blocks-testing/compare/@airtable/blocks-testing@0.0.4...@airtable/blocks-testing@0.0.5) - 2022-09-23

-   Use `keyof any` instead of `PropertyKey` in type definition to avoid incompatibility with the
    "[keyofStringsOnly](https://www.typescriptlang.org/tsconfig#keyofStringsOnly)" tsconfig option
-   Add mutation testing changes corresponding to blocks-sdk 1.15.0. This should be backward
    compatible with previous blocks-sdk versions. Please refer to the blocks-sdk changelog for date
    time field write changes.

## [0.0.4](https://github.com/airtable/blocks-testing/compare/@airtable/blocks-testing@0.0.3...@airtable/blocks-testing@0.0.4) - 2021-04-23

-   Export `MutationTypes` for use with APIs like `TestDriver#watch` and
    `TestDriver#simulatePermissionCheck`

## [0.0.3](https://github.com/airtable/blocks-testing/releases/tag/@airtable/blocks-testing@0.0.3) - 2021-03-05

-   Create testing library
