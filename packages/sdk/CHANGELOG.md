# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). This project
doesn't currently follow semantic versioning, but will once it reaches 1.0.0.

Not every commit needs to result in a change to this file (e.g. docs and chore commits). Every
commit that affects the code in a way that consumers might care about should include edits to the
'Unreleased' section though. Breaking changes should be prefixed with `**BREAKING:**`.

## [Unreleased](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.33...HEAD)

No changes.

## [0.0.33](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.32...@airtable/blocks@0.0.33) - 2019-09-26

-   New settings button helpers: `useSettingsButton`, `settingsButton.show()` and
    `settingsButton.hide()`.
-   **BREAKING**: `settingsButton.isVisible` is no longer settable. Use `settingsButton.show()` and
    `settingsButton.hide()` instead.

## [0.0.32](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.31...@airtable/blocks@0.0.32) - 2019-09-20

-   **BREAKING:** Removed `localStorage` and `sessionStorage` wrappers.
-   Fix a bug where the `value` prop wouldn't get correctly passed through to `Input`

## [0.0.31](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.30...@airtable/blocks@0.0.31) - 2019-09-18

-   New record writes API! You can now create, update, and delete records directly from your block.
    Check out the new
    [writes guide](https://github.com/Airtable/blocks/blob/master/packages/sdk/docs/guide_writes.md)
    for more information.
-   **BREAKING**: several `globalConfig` APIs have changed to be consistent with the new record
    writes & permissions APIs:
    -   `globalConfig.set()` has been removed - use the new `globalConfig.setAsync()` method
        instead.
    -   `globalConfig.canSet()` has been renamed to `globalConfig.hasPermissionToSet()`.
    -   `globalConfig.setPaths()` has been removed - use the new `globalConfig.setPathsAsync()`
        method instead.
    -   `globalConfig.canSetPaths()` has been renamed to `globalConfig.hasPermissionToSetPaths()`.
-   **BREAKING:** Remove `models.generateGuid()`. Use an ID generator like
    [`uuid`](https://www.npmjs.com/package/uuid) instead.
-   **BREAKING:** Deprecated `UI.AutocompletePopover`.
-   Upgrade flow to 0.106.3
-   Fix a flow error with `react-window`.
-   `view.selectRecords()` now colors records according to that view by default.
-   Allow passing an array of models to `useLoadable` to load several things at once.

## [0.0.30](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.29...@airtable/blocks@0.0.30) - 2019-08-26

No changes.

## [0.0.29](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.28...@airtable/blocks@0.0.29) - 2019-08-22

No changes.

## [0.0.28](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.27...@airtable/blocks@0.0.28) - 2019-08-21

No changes.

## [0.0.27](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.26...@airtable/blocks@0.0.27) - 2019-08-21

No changes.

## [0.0.26](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.25...@airtable/blocks@0.0.26) - 2019-08-19

-   UI.RecordCardList: fixed a bug where records weren't expanded by default when clicked.

## [0.0.25](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.24...@airtable/blocks@0.0.25) - 2019-08-19

-   Add Print Records block docs example block

## [0.0.24](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.23...@airtable/blocks@0.0.24) - 2019-08-14

No changes.

## [0.0.23](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.22...@airtable/blocks@0.0.23) - 2019-08-09

### Fixed

-   The `disabled` attribute on `<Select>` components (including model pickers and synced model
    pickers) now correctly disables the element

## [0.0.22](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.21...@airtable/blocks@0.0.22) - 2019-07-18

No changes.

## [0.0.21](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.20...@airtable/blocks@0.0.21) - 2019-07-18

No changes.

## [0.0.20](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.19...@airtable/blocks@0.0.20) - 2019-07-15

### Fixed

-   A bug with UI.Toggle that made it difficult to style

## [0.0.19](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.18...@airtable/blocks@0.0.19) - 2019-07-11

No changes.

## [0.0.18](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.17...@airtable/blocks@0.0.18) - 2019-07-10

-   Update documentation links & eslint-plugin-blocks

## [0.0.17](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.16...@airtable/blocks@0.0.17) - 2019-07-09

No changes.

## [0.0.16](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.15...@airtable/blocks@0.0.16) - 2019-07-05

-   **BREAKING:** Removed view.visibleFields and view.allFields - use view.selectMetadata instead
-   Added view.selectMetadata() for querying a view's field order and list of visible fields

## [0.0.15](https://github.com/airtable/blocks/compare/v0.0.14...@airtable/blocks@0.0.15) - 2019-07-03

No changes.

## [0.0.14](https://github.com/airtable/blocks/compare/v0.0.13...v0.0.14) - 2019-07-02

-   **BREAKING:** Removed `currentUser` from `Base` since it is now accessible through `Session`.
-   **BREAKING:** Renamed QueryResult to RecordQueryResult
-   Added base.watch('schema') to get notified when base schema changes.
-   Added Session to expose data about the current user's session.
-   Added globalConfig.watch('\*') to get notified of any global config key change.
-   Added useGlobalConfig() to subscribe to global config changes from a react component.

## [0.0.13](https://github.com/airtable/blocks/releases/tag/v0.0.13) - 2019-06-21

### Removed

-   **BREAKING:** Removed `createDataContainer`. Use `useWatchable` or other hooks instead.
-   **BREAKING:** FieldIcon no longer accepts arbitrary props - only those in it's propTypes can be
    used.

### Added

-   This changelog!

### Fixed

-   FieldPicker placeholder typo
-   SVGElement flow error
