## Links
- [Documentation](https://www.kasrak.com/121a0699b674cd3d03e2983b667a4cdd/)
- [Local development tool](https://github.com/Hyperbase/blocks-cli)
- [Airtable styleguide](https://airtable.com/styleguide)

## Blocks development best practices

There are a few best practices that we've found make block developing easier.
That said, nothing is set in stone, so let us know if you have any ideas for improvements!

### Fetching data

* Using `UI.createDataContainer` is preferable to using the manual watch / unwatch methods in almost
all cases since it takes care of loading data when components are mounted, unloading when
components are unmounted, and automatically re-rendering when data changes. You should only
use the manual watch / unwatch methods if you need to load / unload data on the fly.

* Instead of using `table.loadDataAsync`, `view.loadDataAsync`, or watching `table.records` /
`view.visibleRecords`, it's preferable to use `QueryResult`. This lets you have
better control on which fields you're loading. Example:

```js
// To load the primary field and assignee field values
// for the records in the "Open bugs" view:
import {base, UI} from 'airtable-block';
const table = base.getTableByName('Bugs');
const view = table.getViewByName('Open bugs');
const queryResult = view.select({
    fields: [table.primaryField, table.getFieldByName('Assignee')],
});

// Can now use queryResult.loadDataAsync, or just watch records/cellValues
// on queryResult directly:
const Component = UI.createDataContainer(() => {
    if (!queryResult.isDataLoaded) {
        return <UI.Loader />;
    } else {
        return <div>There are {queryResult.records.length} records.</div>;
    }
}, () => [
    // The component will re-render when records are added/removed/reordered
    // in the view, or when the primary field or assignee cell values change.
    {watch: queryResult, key: ['records', 'cellValues']},
]);
```

### Global config

* You should use the synced pickers (which read and write to globalConfig automatically, and
handle permissions) wherever possible, and only using the regular pickers where necessary. To
make a custom synced component, use `UI.Synced`.

* Wrapping your block-specific configuration in a singleton class can help get rid of some of
the boilerplate code (for setting default values and validating the block configuration) that
is needed when dealing with globalConfig. An example of a potential `SettingsStore` singleton:

```js
import {base, globalConfig, UI} from 'airtable-block';

const SCHEMA_VERSION = 1;

const ConfigKeys = {
    // By convention: it's a good idea to store a schemaVersion
    // integer in globalConfig and watch its value from the root
    // component. If its value changes to be > SCHEMA_VERSION,
    // prompt the user to reload the block using UI.globalAlert.showReloadPrompt()
    // This will make it easy to make breaking changes in the future.
    schemaVersion: 'schemaVersion',
    tableId: 'tableId',
};

class SettingsStore {
    constructor() {
        if (
            // Make sure the user can write to globalConfig (read/comment-only
            // users can't update globalConfig)
            globalConfig.canSet(ConfigKeys.schemaVersion) &&
            globalConfig.get(ConfigKeys.schemaVersion) === undefined
        ) {
            globalConfig.set(ConfigKeys.schemaVersion, SCHEMA_VERSION);
        }
    }
    // This function should contain all of the checks to determine whether the
    // block is fully configured. This way, you can simply call this method to
    // determine if config is valid, and display the appropriate message if it
    // is not.
    validate() {
        if (!this.table) {
            return {isValid: false, message: 'Pick a table'};
        }
        return {isValid: true};
    }
    get table() {
        // getters can decide what the default value should be
        // if the config value is not set, and translate model IDs
        // into model instances.
        const tableId = globalConfig.get(ConfigKeys.tableId);
        return tableId ? base.getTableById(tableId) : null;
    }
    set table(newTable) {
        // setters translate models back to model IDs.
        const tableId = newTable ? newTable.id : null;
        globalConfig.set(ConfigKeys.tableId, tableId);
    }
    // This is useful, since all of the watches that can affect config values
    // are scoped to this one place.
    // E.g. if you store a table and a field in global config, you wouldn't need
    // to remember to watch the tables in case a field's parent table is deleted.
    get watches() {
        // Example watches
        return [
            // Watch all the relevant globalConfig keys.
            {watch: globalConfig, key: Object.keys(ConfigKeys)},
            {watch: base, key: 'permissionLevel'},
            // Watch for table deletion.
            {watch: base, key: 'tables'},
            // Watch for field deletion.
            {watch: this.table, key: 'fields'},
        ];
    }
    isSchemaVersionOutOfDate() {
        return globalConfig.get(ConfigKeys.schemaVersion) > SCHEMA_VERSION;
    }
}

// Settings store usage
const settingsStore = new SettingsStore();

class RootComponent extends React.Component {
    componentDidMount() {
        this._showReloadPromptIfNeeded();
    }
    _showReloadPromptIfNeeded() {
        if (settingsStore.isSchemaVersionOutOfDate) {
            UI.globalAlert.showReloadPrompt();
        }
    }
    render() {
        const {table} = settingsStore;
        if (table) {
            return <div>{table.name}</div>;
        } else {
            return <div>No table</div>;
        }
    }
}

export default UI.createDataContainer(RootComponent, props => [
    ...settingsStore.watches,
    {
        watch: globalConfig,
        key: ConfigKeys.schemaVersion,
        callback: RootComponent.prototype._showReloadPromptIfNeeded,
    },
]);
```

### Local storage

* Instead of using `window.localStorage` or `window.sessionStorage`, use `localStorage` and
`sessionStorage` from `airtable-block`. Those have the same API as the native storage options,
but will seamlessly fall back to in-memory storage when native localStorage/sessionStorage aren't
available due to privacy settings (e.g. when Chrome's “Block third-pary cookies” option is turned on).
The native APIs will throw in that scenario.

```js
import {localStorage, sessionStorage} from 'airtable-block';
```

## Blocks testing checklist

When building and testing a block, here are some common things to test:

### Permissions

* Does the block correctly handle the different user permission levels? You can simulate this in development mode.
    * In read-only mode the block should not attempt to mutate any records or globalConfig. You can check before performing actions by using:
        * globalConfig.canSet, globalConfig.canSetPaths
        * record.canSetCellValue, record.canSetCellValues, record.canDelete
        * table.canSetCellValues, table.canCreateRecord, table.canCreateRecords, table.canDeleteRecord, table.canDeleteRecords
* Note that the user's permission level may change in real-time! Your components should watch base.permissionLevel to re-render appropriately (e.g. to disable any relevant inputs or buttons)
* The Synced components will automatically disable themselves for read-only users.

### Model mutation

* Does the block correctly handle the deletion of any models (e.g. table, view, field, record) it depends on? Two cases to test:
    * the model is deleted while the block is running (block needs to handle the deletion in real-time)
    * the model is deleted while the block is not running (block needs to handle the deletion next time it runs). To test this, stop running the block (or disable it), delete the model, then run the block again.
* Note that the type of a field can change. E.g. a text field may turn into a formula field, in which case trying to write to it will fail. Or a text field may turn into a number field, in which case writing a string to it will throw an error.
* Note that model deletions/updates can come from the current client or remote collaborators. You generally shouldn't need to do anything special to handle the two different cases as long as you're watching the right things.

### Viewport sizes

* As much as reasonably possible, blocks should be responsive to different viewport sizes.
* On the smaller end, use viewport.setMinSize to set the breakpoint below which we'll show a “Please make this block bigger” message.
* For certain blocks, it may make sense to use viewport.setMaxFullscreenSize to constrain the maximum height or width of the block when it is fullscreen. This does not affect the block when it's not fullscreen. This is useful for dialog-type blocks (e.g. batch update), but should not be used to overly constrain visualization-type blocks (e.g. map, timeline)

### Browser compatibility

* Officially, these are browsers that Airtable supports: https://support.airtable.com/hc/en-us/articles/217990018-What-are-the-technical-requirements-for-using-Airtable-
    * If supporting these requirements in the block you're building is too onerous, we can reconsider the requirements.
* Note that we currently only include regenerator-runtime instead of the full babel polyfill, which can lead to issues in slightly older browsers (e.g. Object.values in older Chrome). We'll probably serve a more robust polyfill in the future.


## flow

Supported flow version: 0.52.0.

The `stubs` folder contains empty stub files so you can run Flow in this
directory without it complaining.

### Setting up flow for a block

Install flow and the SDK repo:

```sh
npm i --save-dev flow-bin@0.52 git+ssh://git@github.com:Hyperbase/blocks-sdk.git
```

Create a `.flowconfig` file in your repo and add the following:
```
[ignore]

[include]

[libs]

[lints]

[options]
unsafe.enable_getters_and_setters=true
suppress_comment= \\(.\\|\n\\)*flow-disable-next-line
module.name_mapper='^frontend\/\(.*\)$' -> '<PROJECT_ROOT>/frontend/\1'
module.name_mapper='^airtable-block$' -> '<PROJECT_ROOT>/node_modules/blocks-sdk/flow-index.js'
module.name_mapper='^airtable-block\/\(.*\)$' -> '<PROJECT_ROOT>/node_modules/blocks-sdk/\1'
module.name_mapper='^client\/blocks\/sdk\/\(.*\)$' -> '<PROJECT_ROOT>/node_modules/blocks-sdk/\1'
module.name_mapper='^client\/\(.*\)$' -> '<PROJECT_ROOT>/node_modules/blocks-sdk/stubs/client/\1'
module.name_mapper='^client_server_shared\/\(.*\)$' -> '<PROJECT_ROOT>/node_modules/blocks-sdk/stubs/client_server_shared/\1'
```

Add a flow script to package.json:

```json
  "scripts": {
    "flow": "flow"
  }
```

Run flow:
```sh
npm run flow
```
