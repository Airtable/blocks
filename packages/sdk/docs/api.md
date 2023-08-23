_____________________
|-i-|-# API reference
|-
|-**Documentation for the Blocks SDK can be found [here](https://airtable.com/developers/blocks/api).
|-`".$_-0/build-js"
|-.$_-0/build.js"=""
_____________________
|-# API REFERENCE
|///---***=
|-"
|-Aggregator
|-Base
|-Cursor
|-|Field
|--|-# GlobalConfig
|---|-Record
|-Session
|-SettingsButton
|-Table
|-View
|-Viewport
|-#-TestDriver
-CreateMultipleRecordsMutation
-CreateSingleFieldMutation
-CreateSingleTableMutation
-DeleteMultipleRecordsMutation
-SetMultipleGlobalConfigPathsMutation
-SetMultipleRecordsCellValuesMutation
-UpdateSingleFieldConfigMutation
-UpdateSingleFieldDescriptionMutation
-UpdateSingleFieldNameMutation
-UpdateViewMetadataMutation
|# BaseProvider
-Box
-Button
-CellRenderer
-ChoiceToken
-CollaboratorToken
-ColorPalette
-ConfirmationDialog
-Dialog
-FieldIcon
-FieldPicker
-FormField
-Heading
-Icon
-Input
-Label
-Link
-Loader
-ProgressBar
-RecordCard
-RecordCardList
-Select
-SelectButtons
-Switch
-TablePicker
-Text
-TextButton
-Tooltip
-ViewPicker
-ViewportConstraint
-useBase
-useCursor
-useGlobalConfig
-useLoadable
-useRecordActionData
-useRecordById
-useRecordIds
-useRecords
-useSession
-useSettingsButton
-useSynced
-useViewMetadata
-useViewport
-useWatchable
|# All styles
-Appearance
-Dimensions
-Display
-FlexContainer
-FlexItem
-Overflow
-Position
-Spacing
|# Typography
-colors
-colorUtils
-expandRecord
-expandRecordList
-expandRecordPickerAsync
-initializeBlock
-loadCSSFromString
-loadCSSFromURLAsync
-loadScriptFromURLAsync
|# MODEL
-GlobalConfig
-View source"
***---///
A key-value store for persisting configuration options for an extension installation.

The contents will be synced in real-time to all logged-in users of the installation. Contents will not be updated in real-time when the installation is running in a publicly shared base.

Any key can be watched to know when the value of the key changes. If you want your component to automatically re-render whenever any key on GlobalConfig changes, try using the useGlobalConfig hook.

You should not need to construct this object yourself.

The maximum allowed size for a given GlobalConfig instance is 150kB. The maximum number of keys for a given GlobalConfig instance is 1000.
`
import {globalConfig} from '@airtable/blocks';
Members
class GlobalConfig extends Watchable<WatchableGlobalConfigKey>
checkPermissionsForSet	
function (
key?: PartialGlobalConfigKey,
value?: GlobalConfigValue
) => PermissionCheckResult
key	
`
A string for the top-level key, or an array of strings describing the path to set.

value	
The value to set at the specified path. Use undefined to delete the value at the given path.

Checks whether the current user has permission to set the given global config key.

Accepts partial input, in the same format as setAsync. The more information provided, the more accurate the permissions check will be.

Returns {hasPermission: true} if the current user can set the specified key,
`
{hasPermission: false, reasonDisplayString: string} otherwise. reasonDisplayString may be used to display an error message to the user.

// Check if user can update a specific key and value.
const setCheckResult =
    globalConfig.checkPermissionsForSet('favoriteColor', 'purple');
if (!setCheckResult.hasPermission) {
    alert(setCheckResult.reasonDisplayString);
}

// Check if user can update a specific key without knowing the value
const setKeyCheckResult =
    globalConfig.checkPermissionsForSet('favoriteColor');

// Check if user can update globalConfig without knowing key or value
const setUnknownKeyCheckResult = globalConfig.checkPermissionsForSet();
checkPermissionsForSetPaths	
function (updates?: ReadonlyArray<PartialGlobalConfigUpdate>) => PermissionCheckResult
updates	
The paths and values to set.
`
Checks whether the current user has permission to perform the specified updates to global config.

Accepts partial input, in the same format as setPathsAsync. The more information provided, the more accurate the permissions check will be.

Returns {hasPermission: true} if the current user can set the specified key, 
`
{hasPermission: false, reasonDisplayString: string} otherwise. reasonDisplayString may be used to display an error message to the user.

// Check if user can update a specific keys and values.
const setPathsCheckResult = globalConfig.checkPermissionsForSet([
    {path: ['topLevelKey1', 'nestedKey1'], value: 'foo'},
    {path: ['topLevelKey2', 'nestedKey2'], value: 'bar'},
]);
if (!setPathsCheckResult.hasPermission) {
    alert(setPathsCheckResult.reasonDisplayString);
}

// Check if user could potentially set globalConfig values.
// Equivalent to globalConfig.checkPermissionsForSet()
const setUnknownPathsCheckResult =
    globalConfig.checkPermissionsForSetPaths();
get	
function (key: GlobalConfigKey) => unknown
key
`
A string for the top-level key, or an array of strings describing the path to the value.

Get the value at a path. Throws an error if the path is invalid.

Returns undefined if no value exists at that path.

import {globalConfig} from '@airtable/blocks';

const topLevelValue = globalConfig.get('topLevelKey');
const nestedValue = globalConfig.get(['topLevelKey', 'nested', 'deeply']);
hasPermissionToSet	
function (
key?: PartialGlobalConfigKey,
value?: GlobalConfigValue
) => boolean
key	
A string for the top-level key, or an array of strings describing the path to set.

value	
The value to set at the specified path. Use undefined to delete the value at the given path.

An alias for globalConfig.checkPermissionsForSet(key, value).hasPermission.

Checks whether the current user has permission to set the given global config key.

Accepts partial input, in the same format as setAsync. The more information provided, the more accurate the permissions check will be.

// Check if user can update a specific key and value.
const canSetFavoriteColorToPurple =
    globalConfig.hasPermissionToSet('favoriteColor', 'purple');
if (!canSetFavoriteColorToPurple) {
    alert('Not allowed!');
}

// Check if user can update a specific key without knowing the value
const canSetFavoriteColor = globalConfig.hasPermissionToSet('favoriteColor');

// Check if user can update globalConfig without knowing key or value
const canSetGlobalConfig = globalConfig.hasPermissionToSet();
hasPermissionToSetPaths	
function (updates?: ReadonlyArray<PartialGlobalConfigUpdate>) => boolean
updates	
The paths and values to set.

An alias for globalConfig.checkPermissionsForSetPaths(updates).hasPermission.

Checks whether the current user has permission to perform the specified updates to global config.

Accepts partial input, in the same format as setPathsAsync. The more information provided, the more accurate the permissions check will be.

// Check if user can update a specific keys and values.
const canSetPaths = globalConfig.hasPermissionToSetPaths([
    {path: ['topLevelKey1', 'nestedKey1'], value: 'foo'},
    {path: ['topLevelKey2', 'nestedKey2'], value: 'bar'},
]);
if (!canSetPaths) {
    alert('not allowed!');
}

// Check if user could potentially set globalConfig values.
// Equivalent to globalConfig.hasPermissionToSet()
const canSetAnyPaths = globalConfig.hasPermissionToSetPaths();
setAsync	
function (
key: GlobalConfigKey,
value?: GlobalConfigValue
) => Promise<void>
key	
A string for the top-level key, or an array of strings describing the path to set.

value	
The value to set at the specified path. Use undefined to delete the value at the given path.

Sets a value at a path. Throws an error if the path or value is invalid.

This action is asynchronous: await the returned promise if you wish to wait for the update to be persisted to Airtable servers.

Updates are applied optimistically locally, so your change will be reflected in GlobalConfig before the promise resolves.

import {globalConfig} from '@airtable/blocks';

function updateFavoriteColorIfPossible(color) {
    if (globalConfig.hasPermissionToSetPaths('favoriteColor', color)) {
        globalConfig.setAsync('favoriteColor', color);
    }
    // The update is now applied within your extension (eg will be
    // reflected in globalConfig) but are still being saved to
    // Airtable servers (e.g. may not be updated for other users yet)
}

async function updateFavoriteColorIfPossibleAsync(color) {
    if (globalConfig.hasPermissionToSet('favoriteColor', color)) {
        await globalConfig.setAsync('favoriteColor', color);
    }
    // globalConfig updates have been saved to Airtable servers.
    alert('favoriteColor has been updated');
}
setPathsAsync	
function (updates: Array<GlobalConfigUpdate>) => Promise<void>
updates	
The paths and values to set.

Sets multiple values. Throws if any path or value is invalid.

This action is asynchronous: await the returned promise if you wish to wait for the updates to be persisted to Airtable servers. Updates are applied optimistically locally, so your changes will be reflected in GlobalConfig before the promise resolves.

import {globalConfig} from '@airtable/blocks';

const updates = [
    {path: ['topLevelKey1', 'nestedKey1'], value: 'foo'},
    {path: ['topLevelKey2', 'nestedKey2'], value: 'bar'},
];

function applyUpdatesIfPossible() {
    if (globalConfig.hasPermissionToSetPaths(updates)) {
        globalConfig.setPathsAsync(updates);
    }
    // The updates are now applied within your extension (eg will be reflected in
    // globalConfig) but are still being saved to Airtable servers (e.g. they
    // may not be updated for other users yet)
}

async function applyUpdatesIfPossibleAsync() {
    if (globalConfig.hasPermissionToSetPaths(updates)) {
        await globalConfig.setPathsAsync(updates);
    }
    // globalConfig updates have been saved to Airtable servers.
    alert('globalConfig has been updated');
}
unwatch	
function (
keys: WatchableGlobalConfigKey | ReadonlyArray<WatchableGlobalConfigKey>,
callback: function (
model: this,
key: WatchableGlobalConfigKey,
args: ...Array<any>
) => unknown,
context?: FlowAnyObject | null
) => Array<WatchableGlobalConfigKey>
keys	
the keys to unwatch

callback	
the function passed to .watch for these keys

context	
the context that was passed to .watch for this callback

Unwatch keys watched with .watch.

Should be called with the same arguments given to .watch.

Returns the array of keys that were unwatched.

watch	
function (
keys: WatchableGlobalConfigKey | ReadonlyArray<WatchableGlobalConfigKey>,
callback: function (
model: this,
key: WatchableGlobalConfigKey,
args: ...Array<any>
) => unknown,
context?: FlowAnyObject | null
) => Array<WatchableGlobalConfigKey>
keys	
the keys to watch

callback	
a function to call when those keys change

context	
an optional context for this in callback.

Get notified of changes to the model.

Every call to .watch should have a matching call to .unwatch.

Returns the array of keys that were watched.-0"`
