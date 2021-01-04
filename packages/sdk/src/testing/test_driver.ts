import React from 'react';
import Sdk from '../sdk';
import {TestMutationTypes} from '../types/test_mutations';
import {FieldId} from '../types/field';
import {TableId} from '../types/table';
import {Mutation} from '../types/mutations';
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
     * Specify the outcome of internal permission checks. This influences the
     * behavior of not only explicit permission checks from Apps code but also
     * the outcome of model operations such as {@link createRecordsAsync}.
     */
    simulatePermissionCheck(check: (mutation: Mutation) => boolean) {
        this._airtableInterface.setUserPermissionCheck(check);
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
