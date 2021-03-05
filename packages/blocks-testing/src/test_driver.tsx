import React from 'react';
import {FieldId, RecordId, TableId, ViewId} from '@airtable/blocks/types';
import {ModelChange, Mutation, Sdk} from '@airtable/blocks/unstable_testing_utils';
import {BaseProvider} from '@airtable/blocks/ui';
import {invariant} from './error_utils';
import {
    FixtureData,
    default as MockAirtableInterface,
    PickRecord,
    WatchableKeysAndArgs,
} from './mock_airtable_interface';
import {TestMutationTypes} from './test_mutations';

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
     * A session. This will correspond to the first collaborator in your fixture data.
     */
    get session() {
        return this._sdk.session;
    }

    /**
     * A simulated globalConfig. This always starts empty.
     */
    get globalConfig() {
        return this._sdk.globalConfig;
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
        return (
            <React.Suspense fallback={fallback}>
                <BaseProvider value={this.base}>{children}</BaseProvider>
            </React.Suspense>
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
     * Specify the outcome of a request for the user to select a record in the
     * UI created by `expandRecordPickerAsync`.
     *
     * @example
     * ```js
     * import MyCustomApp from '../src/my_custom_app';
     * import {render, screen} from '@testing-library/react';
     * import userEvent from '@testing-library/user-event';
     * import TestDriver from '@airtable/blocks-testing';
     *
     * const testDriver = new TestDriver(fixtureData);
     *
     * testDriver.simulateExpandedRecordSelection((tableId, recordIds) => {
     *     return recordIds[1];
     * });
     *
     * render(
     *     <testDriver.Container>
     *         <MyCustomApp />
     *     </testDriver.Container>
     * );
     *
     * // Simulate a user clicking on a button in MyCustomApp labeled with the
     * // text "Choose record". If MyCustomApp reacts to this event by invoking
     * // the SDK's `expandRecordPickerAsync`, then it will receive the second
     * // available record due to the function that is provided to
     * // `simulateExpandedRecordSelection` above.
     * userEvent.click(screen.getByLabelText('Choose record'));
     * ```
     */
    simulateExpandedRecordSelection(pickRecord: PickRecord) {
        this._airtableInterface.setPickRecord(pickRecord);
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
     * Register a function to be invoked in response to a given internal event.
     */
    watch<Key extends keyof WatchableKeysAndArgs>(
        key: Key,
        fn: (data: WatchableKeysAndArgs[Key]) => void,
    ) {
        this._airtableInterface.on(key, fn);
    }

    /**
     * De-register a function which was previously registered with {@link
     * watch}.
     */
    unwatch<Key extends keyof WatchableKeysAndArgs>(
        key: Key,
        fn: (data: WatchableKeysAndArgs[Key]) => void,
    ) {
        this._airtableInterface.off(key, fn);
    }
}
