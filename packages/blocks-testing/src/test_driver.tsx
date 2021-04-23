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
 * An object describing a {@link Table}, a {@link View}, or both.
 */
type TableAndOrView =
    | {table: TableId | string; view?: ViewId | string}
    | {table?: TableId | string; view: ViewId | string};

/**
 * A class designed to facilitate the automated testing of Airtable Apps
 * outside of a production Apps environment. Each instance creates a simulated
 * {@link Base} which is distinct from any other Base created in this way.
 * Custom Apps can be instantiated using an instance of this class; see {@link
 * Container|the `Container` method}.
 *
 * The example code for this class's methods is written in terms of a
 * non-existent Airtable App called `MyCustomApp`. Each example includes a
 * description of the presumed behavior for that App. Consumers of this library
 * will work with their own Apps whose behavior differs from these examples, so
 * their tests will be distinct in this regard.
 *
 * @docsPath testing/TestDriver
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
     * The simulated {@link Base} associated with this instance.
     */
    get base() {
        return this._sdk.base;
    }

    /**
     * The {@link Cursor} instance associated with this instance's Base.
     */
    get cursor() {
        return this._sdk.cursor;
    }

    /**
     * A {@link Session} instance. This will correspond to the first
     * collaborator in your fixture data.
     */
    get session() {
        return this._sdk.session;
    }

    /**
     * A simulated {@link GlobalConfig} instance. This always starts empty.
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
     * import TestDriver from '@airtable/blocks-testing';
     * // Given MyCustomApp, an Airtable App which defines a React Component...
     * const MyCustomApp = require('../src/my_custom_app');
     * // And given myFixtureData, a data structure describing the initial
     * // state of a simulated Airtable Base...
     * const myFixtureData = require('./my_fixture_data');
     *
     * const testDriver = new TestDriver(myFixtureData);
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
     * Destroy a {@link Field} in the simulated {@link Base}.
     *
     * @example
     * ```js
     * import TestDriver from '@airtable/blocks-testing';
     * // Given MyCustomApp, an Airtable App which displays the names of all
     * // the Fields in the active Table...
     * import MyCustomApp from '../src/my_custom_app';
     * // And given myFixtureData, a data structure describing an Airtable
     * // Base which contains a Table named "Table One" with three Fields...
     * import myFixtureData from './my_fixture_data';
     * import {render, screen} from '@testing-library/react';
     *
     * const testDriver = new TestDriver(myFixtureData);
     * let items, itemTexts;
     *
     * render(
     *     <testDriver.Container>
     *         <MyCustomApp />
     *     </testDriver.Container>
     * );
     *
     * // Verify that MyApp initially displays all three Fields
     * items = screen.getAllByRole('listitem');
     * itemTexts = items.map((el) => el.textContent);
     * expect(itemTexts).toEqual(['1st field', '2nd field', '3rd field']);
     *
     * // Simulate the destruction of the Field named "2nd field"
     * await testDriver.deleteFieldAsync('Table One', '2nd field');
     *
     * // Verify that MyApp correctly updates to describe the two remaining
     * // Fields
     * items = screen.getAllByRole('listitem');
     * itemTexts = items.map((el) => el.textContent);
     * expect(itemTexts).toEqual(['1st field', '3rd field']);
     * ```
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
     * Destroy a {@link Table} in the simulated {@link Base}.
     *
     * @example
     * ```js
     * import TestDriver from '@airtable/blocks-testing';
     * // Given MyCustomApp, an Airtable App which displays the names of all
     * // the Tables in the Base...
     * import MyCustomApp from '../src/my_custom_app';
     * // And given myFixtureData, a data structure describing an Airtable
     * // Base which contains three Tables...
     * import myFixtureData from './my_fixture_data';
     * import {render, screen} from '@testing-library/react';
     *
     * const testDriver = new TestDriver(myFixtureData);
     * let items, itemTexts;
     *
     * render(
     *     <testDriver.Container>
     *         <MyCustomApp />
     *     </testDriver.Container>
     * );
     *
     * // Verify that MyApp initially displays all three Tables
     * items = screen.getAllByRole('listitem');
     * itemTexts = items.map((el) => el.textContent);
     * expect(itemTexts).toEqual(['1st table', '2nd table', '3rd table']);
     *
     * // Simulate the destruction of the Table named "2nd table"
     * testDriver.deleteTable('2nd table');
     *
     * // Verify that MyApp correctly updates to describe the two remaining
     * // Table
     * items = screen.getAllByRole('listitem');
     * itemTexts = items.map((el) => el.textContent);
     * expect(itemTexts).toEqual(['1st table', '3rd table']);
     * ```
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
     * Destroy a {@link View} in the simulated {@link Base}.
     *
     * @example
     * ```js
     * import TestDriver from '@airtable/blocks-testing';
     * // Given MyCustomApp, an Airtable App which displays the names of all
     * // the Views in the active Table...
     * import MyCustomApp from '../src/my_custom_app';
     * // And given myFixtureData, a data structure describing an Airtable
     * // Base which contains a Table named "Table One" with three Views...
     * import myFixtureData from './my_fixture_data';
     * import {render, screen} from '@testing-library/react';
     *
     * const testDriver = new TestDriver(myFixtureData);
     * let items, itemTexts;
     *
     * render(
     *     <testDriver.Container>
     *         <MyCustomApp />
     *     </testDriver.Container>
     * );
     *
     * // Verify that MyApp initially displays all three Views
     * items = screen.getAllByRole('listitem');
     * itemTexts = items.map((el) => el.textContent);
     * expect(itemTexts).toEqual(['1st view', '2nd view', '3rd view']);
     *
     * // Simulate the destruction of the Field named "2nd view"
     * await testDriver.deleteViewAsync('Table One', '2nd view');
     *
     * // Verify that MyApp correctly updates to describe the two remaining
     * // Views
     * items = screen.getAllByRole('listitem');
     * itemTexts = items.map((el) => el.textContent);
     * expect(itemTexts).toEqual(['1st view', '3rd view']);
     * ```
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
     * Update the active {@link Table} and/or the active {@link View} of the
     * App's {@link Cursor}. Either `table` or `view` must be specified.
     *
     * @example
     * ```js
     * testDriver.setActiveCursorModels({view: 'My grid view'});
     * ```
     *
     * @example
     * ```js
     * import TestDriver from '@airtable/blocks-testing';
     * // Given MyCustomApp, an Airtable App which displays the names of the
     * // active Table...
     * import MyCustomApp from '../src/my_custom_app';
     * // And given myFixtureData, a data structure describing an Airtable
     * // Base which contains two Tables...
     * import myFixtureData from './my_fixture_data';
     * import {render, screen} from '@testing-library/react';
     *
     * const testDriver = new TestDriver(myFixtureData);
     * let heading;
     *
     * render(
     *     <testDriver.Container>
     *         <MyCustomApp />
     *     </testDriver.Container>
     * );
     *
     * // Verify that MyApp initially displays the first Table
     * heading = screen.getByRole('heading');
     * expect(heading.textContent).toBe('First table');
     *
     * // Simulate the end user selecting the second Table from the Airtable
     * // user interface
     * testDriver.setActiveCursorModels(({table: 'Second table'});
     *
     * // Verify that MyApp correctly updates to describe the newly-selected
     * // Table
     * heading = screen.getByRole('heading');
     * expect(heading.textContent).toBe('Second table');
     * ```
     */
    setActiveCursorModels(tableAndOrView: TableAndOrView) {
        const {table: tableIdOrName, view: viewIdOrName} = tableAndOrView;
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
     *
     * @example
     * ```js
     * import TestDriver from '@airtable/blocks-testing';
     * // Given MyCustomApp, an Airtable App which displays a button labeled
     * // "Add" and which disables that button for users who lack "write"
     * // permissions to the Base...
     * import MyCustomApp from '../src/my_custom_app';
     * // And given myFixtureData, a data structure describing the initial
     * // state of a simulated Airtable Base...
     * import myFixtureData from './my_fixture_data';
     * import {render, screen} from '@testing-library/react';
     *
     * const testDriver = new TestDriver(myFixtureData);
     *
     * // Configure the test driver to reject all "create record" mutations.
     * testDriver.simulatePermissionCheck((mutation) => {
     *     return mutation.type !== 'createMultipleRecords';
     * });
     *
     * render(
     *     <testDriver.Container>
     *         <MyCustomApp />
     *     </testDriver.Container>
     * );
     *
     * // Verify that MyCustomApp recognizes that the current user may not
     * // create Records and that disables the corresponding aspect of the user
     * // interface.
     * const button = screen.getByRole('button', {name: 'Add'});
     * expect(button.disabled).toBe(true);
     * ```
     */
    simulatePermissionCheck(check: (mutation: Mutation) => boolean) {
        this._airtableInterface.setUserPermissionCheck(check);
    }

    /**
     * Specify the outcome of a request for the user to select a record in the
     * UI created by {@link expandRecordPickerAsync}.
     *
     * @example
     * ```js
     * import TestDriver from '@airtable/blocks-testing';
     * // Given MyCustomApp, an Airtable App which prompts the end user to
     * // select a Record and displays the name of the Record they selected...
     * import MyCustomApp from '../src/my_custom_app';
     * // And given myFixtureData, a data structure describing the initial
     * // state of a simulated Airtable Base...
     * import myFixtureData from './my_fixture_data';
     * import {render, screen} from '@testing-library/react';
     * import userEvent from '@testing-library/user-event';
     *
     * const testDriver = new TestDriver(myFixtureData);
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
     * const button = screen.getByRole('button', {name: 'Choose record'});
     * userEvent.click(button);
     *
     * // Verify that MyCustomApp correctly responds to the simulated user's
     * // input
     * const heading = await waitFor(() => screen.getByRole('heading'));
     * expect(heading.textContent)
     *   .toBe('You selected the record named "Number Two"');
     * ```
     */
    simulateExpandedRecordSelection(pickRecord: PickRecord) {
        this._airtableInterface.setPickRecord(pickRecord);
    }

    /**
     * Simulate a user visually selecting a set of {@link Record|Records} in
     * the active {@link Table}. This operation is unrelated to an App's
     * programmatic "selection" of records via, e.g. {@link
     * Table.selectRecords}. To deselect all records, invoke this method with
     * an empty array.
     *
     * @example
     * ```js
     * import TestDriver from '@airtable/blocks-testing';
     * // Given MyCustomApp, an Airtable App which displays the number of
     * // Records that an end user has selected in the active Table...
     * import MyCustomApp from '../src/my_custom_app';
     * // And given myFixtureData, a data structure describing the initial
     * // state of a simulated Airtable Base...
     * import myFixtureData from './my_fixture_data';
     * import {render, screen} from '@testing-library/react';
     *
     * const testDriver = new TestDriver(myFixtureData);
     *
     * render(
     *     <testDriver.Container>
     *         <MyCustomApp />
     *     </testDriver.Container>
     * );
     *
     * // Retrieve all the Records present in the first Table in the Base
     * const records = await testDriver.base.tables[0].selectRecordsAsync();
     *
     * // Simulate an end-user selecting the second and fourth Record
     * testDriver.userSelectRecords([records[1].id, records[3].id]);
     *
     * // Verify that MyCustomApp correctly responds to the simulated user's
     * // input
     * const heading = await waitFor(() => screen.getByRole('heading'));
     * expect(heading.textContent).toBe('2 records selected');
     * ```
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
     * See {@link WatchableKeysAndArgs} for the available keys and the values
     * which are included when they are emitted.
     *
     * @example
     * ```js
     * import TestDriver from '@airtable/blocks-testing';
     * // Given MyCustomApp, an Airtable App which presents the user with one
     * // button for each available Record, and which responds to button clicks
     * // by expanding the Record in the Airtable user interface...
     * import MyCustomApp from '../src/my_custom_app';
     * // And given myFixtureData, a data structure describing an Airtable
     * // Base which contains a Table with three records...
     * import myFixtureData from './my_fixture_data';
     * import {render, screen} from '@testing-library/react';
     * import userEvent from '@testing-library/user-event';
     *
     * const testDriver = new TestDriver(myFixtureData);
     *
     * // Keep track of every time MyCustomApp attempts to expand a Record in
     * // the Airtable user interface
     * let expandedRecordIds = [];
     * testDriver.watch('expandRecord', ({recordId}) => {
     *   expendedRecordIds.push(recordId);
     * });
     *
     * render(
     *     <testDriver.Container>
     *         <MyCustomApp />
     *     </testDriver.Container>
     * );
     *
     * // Verify that MyCustomApp does not expand any Records prior to user
     * // interaction
     * expect(expandedRecords).toEqual([]);
     *
     * // Simulate a user clicking on the second button in MyCustomApp, which
     * // is expected to correspond to the second Record in the simulated Base
     * const buttons = screen.getAllByRole('button');
     * userEvent.click(buttons[1]);
     *
     * // Verify that MyCustomApp correctly expanded the second Record in the
     * // Airtable user interface
     * expect(expandedRecords).toEqual(['rec2']);
     * ```
     */
    watch<Key extends keyof WatchableKeysAndArgs>(
        key: Key,
        fn: (data: WatchableKeysAndArgs[Key]) => void,
    ) {
        this._airtableInterface.on(key, fn);
    }

    /**
     * De-register a function which was previously registered with {@link
     * watch}. See {@link WatchableKeysAndArgs} for the available keys.
     *
     * @example
     * ```js
     * import TestDriver from '@airtable/blocks-testing';
     * // Given MyCustomApp, an Airtable App which enters "full screen" mode
     * // in response to certain interactions...
     * const MyCustomApp = require('../src/my_custom_app');
     * // And given myFixtureData, a data structure describing the initial
     * // state of a simulated Airtable Base...
     * const myFixtureData = require('./my_fixture_data');
     *
     * let testDriver;
     * let enterCount;
     * let increment = () => {
     *   enterCount += 1;
     * });
     *
     * // Configure the test runner to create a TestDriver instance before
     * // every test and to listen for requests to enter "full screen" mode
     * beforeEach(() => {
     *   testDriver = new TestDriver(myFixtureData);
     *   enterCount = 0;
     *   testDriver.watch('enterFullscreen', increment);
     * });
     *
     * // Configure the test runner to remove the event listener after every
     * // test. (The next test will have a new instance of TestDriver with its
     * // own event handler, so this one is no longer necessary.)
     * afterEach(() => {
     *   testDriver.unwatch('enterFullscreen', increment);
     * });
     *
     * // (include tests using the `testDriver` and `enterCount` variables
     * // here)
     * ```
     */
    unwatch<Key extends keyof WatchableKeysAndArgs>(
        key: Key,
        fn: (data: WatchableKeysAndArgs[Key]) => void,
    ) {
        this._airtableInterface.off(key, fn);
    }
}
