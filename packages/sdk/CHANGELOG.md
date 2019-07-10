# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). This project
doesn't currently follow semantic versioning, but will once it reaches 1.0.0.

Not every commit needs to result in a change to this file (e.g. docs and chore commits). Every
commit that affects the code in a way that consumers might care about should include edits to the
'Unreleased' section though. Breaking changes should be prefixed with `**BREAKING:**`.

## [Unreleased](https://github.com/airtable/blocks-sdk/compare/@airtable/blocks@0.0.17...HEAD)

No changes.

## [0.0.17](https://github.com/airtable/blocks-sdk/compare/@airtable/blocks@0.0.16...@airtable/blocks@0.0.17) - 2019-07-09

No changes.

## [0.0.16](https://github.com/airtable/blocks-sdk/compare/@airtable/blocks@0.0.15...@airtable/blocks@0.0.16) - 2019-07-05

-   **BREAKING:** Removed view.visibleFields and view.allFields - use view.selectMetadata instead
-   Added view.selectMetadata() for querying a view's field order and list of visible fields

## [0.0.15](https://github.com/airtable/blocks-sdk/compare/v0.0.14...@airtable/blocks@0.0.15) - 2019-07-03

No changes.

## [0.0.14](https://github.com/airtable/blocks-sdk/compare/v0.0.13...v0.0.14) - 2019-07-02

-   **BREAKING:** Removed `currentUser` from `Base` since it is now accessible through `Session`.
-   **BREAKING:** Renamed QueryResult to RecordQueryResult
-   Added base.watch('schema') to get notified when base schema changes.
-   Added Session to expose data about the current user's session.
-   Added globalConfig.watch('\*') to get notified of any global config key change.
-   Added useGlobalConfig() to subscribe to global config changes from a react component.

## [0.0.13](https://github.com/airtable/blocks-sdk/releases/tag/v0.0.13) - 2019-06-21

### Removed

-   **BREAKING:** Removed `createDataContainer`. Use `useWatchable` or other hooks instead.
-   **BREAKING:** FieldIcon no longer accepts arbitrary props - only those in it's propTypes can be
    used.

### Added

-   This changelog!

### Fixed

-   FieldPicker placeholder typo
-   SVGElement flow error
