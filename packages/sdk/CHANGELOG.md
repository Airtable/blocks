# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). This project
doesn't currently follow semantic versioning, but will once it reaches 1.0.0.

Not every commit needs to result in a change to this file (e.g. docs and chore commits). Every
commit that affects the code in a way that consumers might care about should include edits to the
'Unreleased' section though. Breaking changes should be prefixed with `**BREAKING:**`.

## [Unreleased](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.48...HEAD)

No changes.

## [0.0.48](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.47...@airtable/blocks@0.0.48) - 2020-04-30

No changes.

## [0.0.47](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.46...@airtable/blocks@0.0.47) - 2020-04-23

-   UI components that don't depend on base data can now be used outside of the blocks environment.

## [0.0.46](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.45...@airtable/blocks@0.0.46) - 2020-04-16

-   `FieldType.RICH_TEXT` has been added, which encompasses long text fields with the new rich text
    formatting option enabled. (See Airtable's announcement regarding
    [rich text formatting in long text fields](https://blog.airtable.com/4-workflows-for-rich-text-formatting/))
-   `Switch` and `SwitchSynced` now truncate the label.
-   Fix a bug where `RecordCard` performs the default expand record behavior, even if an `onClick`
    override is supplied. It now properly handles overrides as described in the documentation. This
    fix also applies to `onRecordClick` in `RecordCardList`.
-   Beta: New field and table writes API! You can now create tables and fields and update field
    options.
    -   `base.unstable_createTableAsync`
    -   `table.unstable_createFieldAsync`
    -   `field.unstable_updateOptionsAsync`
    -   These APIs are unstable and may have breaking changes in the future.
    -   Not all field types are supported at this time. Refer to `FieldType` documentation for
        details.

## [0.0.45](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.44...@airtable/blocks@0.0.45) - 2020-03-31

-   **DEPRECATED:** `record.primaryCellValue` and `record.primaryCellValueAsString`.
    -   The `primaryCellValue` watch key on `record` is also deprecated - use the `name` watch key
        instead.
-   Add the following APIs to match the new scripting block:
    -   **Convenience model getters.** These are useful when you're working on a block for a
        specific base, but best-practice for more generic blocks is to prefer the existing
        `ById`/`ByName` methods.
        -   `base.getCollaboratorIfExists`
        -   `base.getCollaborator`
        -   `base.getTableIfExists`
        -   `base.getTable`
        -   `table.getFieldIdExists`
        -   `table.getField`
        -   `table.getViewIfExists`
        -   `table.getView`
    -   **Async `select` queries.** For creating UIs from a query, the best practice is still to use
        `useRecords` etc. Directly querying data is useful for one-off data processing though.
        -   `table.selectRecordsAsync`
        -   `view.selectRecordsAsync`
        -   `view.selectMetadataAsync`
        -   `record.selectLinkedRecordsFromCellAsync`
    -   **`record.name`** replaces `record.primaryCellValueAsString`.
-   Fix some incorrectly redacted internal typescript types

## [0.0.44](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.43...@airtable/blocks@0.0.44) - 2020-03-27

-   `TextButton` now supports including an icon without a label.
-   Properly export the `useSynced` hook.
-   Errors now output model names instead of IDs when available.
-   Fix a positioning bug with `SelectButtons` where unwanted empty space could appear when the
    component is used in a scrollable list.

## [0.0.43](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.42...@airtable/blocks@0.0.43) - 2020-02-28

-   Export the `useSynced` hook for syncing a component to `GlobalConfig`.

## [0.0.42](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.41...@airtable/blocks@0.0.42) - 2020-02-10

-   **BREAKING**: Field type and view type enums are now exported from '@airtable/blocks/models' as
    `FieldType` and `ViewType` (previously `fieldTypes` and `viewTypes`). Relatedly, these types are
    no longer exported from '@airtable/blocks/types', as they can now be referenced from the model
    exports.
-   Updates to record convenience hooks
    -   `useRecords` now accepts a `Table` or `View` and optional `RecordQueryResultOpts`. Passing a
        `RecordQueryResult` is still supported.
    -   `useRecordIds` now accepts a `Table` or `View` and optional `RecordIdQueryResultOpts`.
        Passing a `RecordQueryResult` is still supported.
    -   `useRecordById` now accepts a `Table` or `View` and optional `SingleRecordQueryResultOpts`.
        Passing a `RecordQueryResult` is still supported.
-   Added `cursor.selectedFieldIds` which returns the field IDs that are selected in grid view

## [0.0.41](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.40...@airtable/blocks@0.0.41) - 2020-01-27

-   **BREAKING**: `useWatchable` will now throw an error if the second argument `keys` is
    `undefined`. Previously, this would no-op.
-   Added support for `setActiveTable` and `setActiveView` to the `cursor` API. These can be used to
    manipulate the current table and/or view on the main Airtable page from inside a block.
-   Table.createRecordsAsync now accepts an array of objects containing a `fields` object of field
    \-> cell value mappings, rather an accepting field -> cell value mappings directly. This brings
    its API in line with `updateRecordsAsync` and other Airtable APIs. The old behavior is still
    supported but has been deprecated and will be removed in a future version.
-   Fixed issue where blocks would crash in MS Edge due to a browser bug with `super` method calls.
-   Changed default Tooltip `placementOffsetX` and `placementOffsetY` to `8` pixels. `undefined`.
    Previously, this would no-op.
-   Added default blue `barColor` to `ProgressBar`.

## [0.0.40](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.39...@airtable/blocks@0.0.40) - 2020-01-09

-   Added permission checks that don't require specifying a table to `session`:
    -   `session.checkPermissionsForUpdateRecords()`
    -   `session.hasPermissionToUpdateRecords()`
    -   `session.checkPermissionsForCreateRecords()`
    -   `session.hasPermissionToCreateRecords()`
    -   `session.checkPermissionsForDeleteRecords()`
    -   `session.hasPermissionToDeleteRecords()`

## [0.0.39](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.38...@airtable/blocks@0.0.39) - 2019-12-12

-   Changed the font sizes for the `size` variants of `Select` and `Button`.
-   `useWatchable` now supports single string watch keys being passed in (as well as the existing
    array support)
-   Fixed bug where `shouldAllowPickingNone` didn't work in `FieldPicker` and `FieldPickerSynced`.
-   Updated `fullscreen` and `fullscreenMicro` icons.
-   Updated UI.Button component to better support icon buttons containing no text. An error is now
    logged to the console if you attempt to use a UI.Button component with no text/children and no
    aria-label.

## [0.0.36](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.35...@airtable/blocks@0.0.36) - 2019-11-18

-   Added `table.description` and `field.description`, and `description` watch key on `table` and
    `field`.

## [0.0.35](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.34...@airtable/blocks@0.0.35) - 2019-11-11

-   UI library
    -   New API for styling UI components. Each component now exposes a certain set of CSS
        properties as React props. Styling via the `className` and `style` props is still supported
        but is no longer recommended. For more information, see the documentation for
        [style props](https://github.com/Airtable/blocks/blob/master/packages/sdk/docs/api/modules/_airtable_blocks_ui_system__all_style_props.md#allstylesprops).
    -   New components:
        -   `Text` and `Heading` for typography.
        -   `Label` and `FormField` for labeling controls or form fields.
        -   `TextButton` for buttons that can be rendered inline with text.
    -   **BREAKING**: `Toggle` has been renamed to `Switch`.
    -   **BREAKING**: `Button` and `Switch` no longer accept the `theme` prop. Instead, you can
        specify the colors for these components with the `variant` prop.
    -   `Link` also supports the `variant` prop, which determines the text color of the link.
    -   `Button`, `Input`, `Link`, `SelectButtons`, `Select`, `Switch`, and the model picker
        components can now be resized via the `size` prop (one of `small`, `default`, or `large`).
    -   `Button`, `Icon`, `Input`, `Link`, `SelectButtons`, `Select`, `Switch`, and the model picker
        components are now functional components that use the
        [`React.forwardRef`](https://reactjs.org/docs/forwarding-refs.html) API.
    -   `SelectButtons` is now keyboard/screenreader accessible.
-   Typescript
    -   **BREAKING** The SDK has been migrated from Flow to TypeScript. We no longer provide flow
        type definitions with the release of the SDK. TypeScript definitions are provided instead.

## [0.0.34](https://github.com/airtable/blocks/compare/@airtable/blocks@0.0.33...@airtable/blocks@0.0.34) - 2019-10-04

-   Fix a regression where `UI.ConfirmationDialog` would crash the block.
-   Allow passing an array of models to `useWatchable` to watch several models at once.
-   **BREAKING**: `fieldTypes.LOOKUP` is now `fieldTypes.MULTIPLE_LOOKUP_VALUES`. The underlying
    string has also changed from `lookup` to `multipleLookupValues`.
-   Fix a regression where cover images in `UI.RecordCard` would render as `[Object object]`.

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
