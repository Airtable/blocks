import React from 'react';
import {invariant} from '../error_utils';
import Sdk from '../sdk';
import {TestMutationTypes} from '../types/test_mutations';
import {FieldId} from '../types/field';
import {ModelChange} from '../types/base';
import {Mutation} from '../types/mutations';
import {RecordId} from '../types/record';
import {TableId} from '../types/table';
import {ViewId} from '../types/view';
import {SdkContext} from '../ui/sdk_context';
import MockAirtableInterface, {
    FixtureData,
    WatchableKeysAndArgs,
} from './mock_airtable_interface_external';

/**
 * A class designed to faciliate the automated testing of Airtable Apps outside
 * of a production Apps environment. Each instance creates a simulated Airtable
 * Base which is distinct from any other Base created in this way. Custom Apps
 * can be applied to a given instance; see {@link Container}.
 */
export default class TestDriver {
    /** @internal */
    _airtableInterface: MockAirtableInterface;
    /** @internal */
    _sdk: Sdk;

    /**
     * Create an instance of the test driver, initializing a simulated Airtable
     * Base to take the state described by the provided fixture data.
     */
    constructor(fixtureData: FixtureData) {
        this._airtableInterface = new MockAirtableInterface(fixtureData);
        this._sdk = new Sdk(this._airtableInterface);
        this.Container = this.Container.bind(this);
    }

    /**
     * The simulated Airtable Base associated with this instance.
     */
    get base() {
        return this._sdk.base;
    }

    /**
     * The Cursor associated with this instance's Base.
     */
    get cursor() {
        return this._sdk.cursor;
    }

    /**
     * A React Component which may be used to wrap App Components, enabling
     * them to run outside of a production Apps environment.
     *
     * @example
     * ```js
     * const MyCustomApp = require('../src/my_custom_app');
     * const testDriver = new TestDriver(fixtureData);
     *
     * render(
     *     <testDriver.Container>
     *         <MyCustomApp />
     *     </testDriver.Container>
     * );
     * ```
     */
    Container({children}: {children: React.ReactNode}) {
        const fallback = React.createElement('div', null);
        return React.createElement(
            React.Suspense,
            {fallback},
            React.createElement(SdkContext.Provider, {value: this._sdk}, children),
        );
    }

    /**
     * Destroy a Field in the simulated Base.
     */
    async deleteFieldAsync(tableIdOrName: TableId | string, fieldIdOrName: FieldId | string) {
        const table = this.base.getTable(tableIdOrName);
        const field = table.getField(fieldIdOrName);

        await this._airtableInterface.applyMutationAsync({
            type: TestMutationTypes.DELETE_SINGLE_FIELD,
            tableId: table.id,
            id: field.id,
        });
    }

    /**
     * Destroy a Table in the simulated Base.
     */
    deleteTable(tableIdOrName: TableId | string) {
        const table = this.base.getTable(tableIdOrName);
        const newOrder = this.base.tables.filter(({id}) => table.id !== id).map(({id}) => id);

        invariant(
            newOrder.length > 0,
            'Table with ID "%s" may not be deleted because it is the only Table present in the Base',
            table.id,
        );

        const updates: Array<ModelChange> = [
            {path: ['tableOrder'], value: newOrder},
            {path: ['tablesById', table.id], value: undefined},
        ];

        if (table.id === this._airtableInterface.sdkInitData.baseData.activeTableId) {
            updates.push({path: ['activeTableId'], value: newOrder[0]});
        }

        this._airtableInterface.triggerModelUpdates(updates);
    }

    /**
     * Destroy a View in the simulated Base.
     */
    async deleteViewAsync(tableIdOrName: TableId | string, viewIdOrName: ViewId | string) {
        const table = this.base.getTable(tableIdOrName);
        const view = table.getView(viewIdOrName);

        await this._airtableInterface.applyMutationAsync({
            type: TestMutationTypes.DELETE_SINGLE_VIEW,
            tableId: table.id,
            id: view.id,
        });
    }

    /**
     * Update the active Table and/or the active View of the App's {@link
     * Cursor}. Either `table` or `view` must be specified.
     *
     * @example
     * ```js
     * testDriver.setActiveCursorModels({view: 'My grid view'});
     * ```
     */
    setActiveCursorModels({
        table: tableIdOrName,
        view: viewIdOrName,
    }:
        | {table: TableId | string; view?: ViewId | string}
        | {table?: TableId | string; view: ViewId | string}) {
        invariant(tableIdOrName || viewIdOrName, 'One of `table` or `view` must be specified.');

        const tableId = tableIdOrName
            ? this.base.getTable(tableIdOrName).id
            : this.cursor.activeTableId;

        invariant(typeof tableId === 'string', 'Cannot set cursor model when table is not loaded');

        const viewId = viewIdOrName
            ? this.base.getTable(tableId).getView(viewIdOrName).id
            : this.cursor.activeViewId;

        invariant(
            !viewId || this.base.getTable(tableId).getViewIfExists(viewId),
            'Cannot change active table to "%s" because active view ("%s") belongs to another table',
            tableIdOrName,
            viewId,
        );

        this._airtableInterface.triggerModelUpdates([
            {
                path: ['activeTableId'],
                value: tableId,
            },
        ]);

        if (viewIdOrName) {
            this._airtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', tableId, 'activeViewId'],
                    value: viewId,
                },
            ]);
        }
    }

    /**
     * Specify the outcome of internal permission checks. This influences the
     * behavior of not only explicit permission checks from Apps code but also
     * the outcome of model operations such as {@link createRecordsAsync}.
     */
    simulatePermissionCheck(check: (mutation: Mutation) => boolean) {
        this._airtableInterface.setUserPermissionCheck(check);
    }

    /**
     * Simulate a user visually selecting a set of Records in the active Table.
     * This operation is unrelated to an App's programmatic "selection" of
     * records via, e.g. {@link Table.selectRecords}. To deselect all records,
     * invoke this method with an empty array.
     */
    userSelectRecords(recordIds: Array<RecordId>) {
        const {baseData} = this._airtableInterface.sdkInitData;
        const {activeTableId} = baseData;

        invariant(activeTableId, 'Cannot select records when no table is active');

        for (const recordId of recordIds) {
            invariant(
                this._airtableInterface.hasRecord(activeTableId, recordId),
                'Record with ID "%s" is not present in active table "%s"',
                recordId,
                activeTableId,
            );
        }

        const selectedRecordIdSet = recordIds.reduce((all, recordId) => {
            all[recordId] = true;
            return all;
        }, {} as {[key: string]: boolean});

        this._airtableInterface.triggerModelUpdates([
            {
                path: ['cursorData', 'selectedRecordIdSet'],
                value: selectedRecordIdSet,
            },
        ]);
    }

    /**
     * Regsiter a function to be invoked in response to a given internal event.
     */
    watch<Key extends keyof WatchableKeysAndArgs>(
        key: Key,
        fn: (data: WatchableKeysAndArgs[Key]) => void,
    ) {
        this._airtableInterface.on(key, fn);
    }

    /**
     * De-regsiter a function which was previously registered with {@link
     * watch}.
     */
    unwatch<Key extends keyof WatchableKeysAndArgs>(
        key: Key,
        fn: (data: WatchableKeysAndArgs[Key]) => void,
    ) {
        this._airtableInterface.off(key, fn);
    }
}
