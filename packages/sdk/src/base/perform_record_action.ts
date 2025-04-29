import {invariant} from '../shared/error_utils';
import {isEnumValue, ObjectValues} from '../shared/private_utils';
import {AirtableInterface} from './types/airtable_interface';
import {RecordActionData, RecordActionDataCallback} from './types/record_action_data';
import AbstractModelWithAsyncData from './models/abstract_model_with_async_data';
import Sdk from './sdk';

/** @hidden */
export const WatchablePerformRecordActionKeys = Object.freeze({
    isDataLoaded: 'isDataLoaded' as const,
    recordActionData: 'recordActionData' as const,
});

/** @hidden */
type WatchablePerformRecordActionKey = ObjectValues<typeof WatchablePerformRecordActionKeys>;

/**
 * Returned by {@link registerRecordActionDataCallback}. Call it to unregister the previously
 * registered function. Do this before registering another function or unmounting the component.
 * */
type UnsubscribeFunction = () => void;

/**
 * This class exists to manage registering a callback to receive "Open block" / "Perform record
 * action" messages.
 * This is different to other message handlers (_registerHandlers) since the callback is specified
 * by the block: it registers it during first render (vs the SDK registering during initialisation).
 *
 * On the liveapp side, we ensure that pending messages are held until the block registers the
 * callback (or another message is sent). If there's a pending message, it is returned at
 * registration.
 *
 * This class implements AbstractModelWithAsyncData in order to take advantage of useLoadable's
 * suspense handling. "Loading" the model means registering the handler with liveapp. This allows us
 * to suspend the block and return the initial pending message on first render.
 *
 * One difference is that _unloadData will not unregister the airtableInterface handler. We don't
 * support unregistering it at this time for simplicity.
 *
 * This class is internal: users should use registerRecordActionDataCallback or useRecordActionData.
 *
 * @internal
 * */
export class PerformRecordAction extends AbstractModelWithAsyncData<
    RecordActionData | null,
    WatchablePerformRecordActionKey
> {
    /** @internal */
    _airtableInterface: AirtableInterface;
    /** @internal */
    _hasRegisteredHandler: boolean;
    /** @internal */
    _hasCompletedInitialDataLoad: boolean;
    /**
     * The data from the latest record action, or null if none have occurred yet.
     *
     * @internal */
    recordActionData: RecordActionData | null;

    /** @hidden */
    constructor(sdk: Sdk, airtableInterface: AirtableInterface) {
        super(sdk, 'performRecordAction');

        this._airtableInterface = airtableInterface;
        this._hasRegisteredHandler = false;
        this._hasCompletedInitialDataLoad = false;
        this.recordActionData = null;

        this._handlePerformRecordAction = this._handlePerformRecordAction.bind(this);
    }

    /** @internal */
    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchablePerformRecordActionKeys, key);
    }

    /** @hidden */
    _handlePerformRecordAction(data: RecordActionData) {
        this.recordActionData = data;
        this._onChange(WatchablePerformRecordActionKeys.recordActionData, data);
    }

    /**
     * This accessor method is defined solely to satisfy the contract of the
     * AbstractModel class.
     *
     * @internal */
    get _dataOrNullIfDeleted() {
        return invariant(
            false,
            'The `data` property of PerformRecordAction should not be referenced',
        ) as never;
    }

    /**
     * This accessor method is defined because the parent implementation uses _dataOrNullIfDeleted
     *
     * @inheritdoc */
    get isDeleted(): boolean {
        return false;
    }

    /**
     * AbstractModelWithAsyncData implementation
     */

    /** @internal */
    _onChangeIsDataLoaded() {
        this._onChange(WatchablePerformRecordActionKeys.isDataLoaded);

        if (!this._hasCompletedInitialDataLoad) {
            this._hasCompletedInitialDataLoad = true;
            if (this.recordActionData) {
                this._handlePerformRecordAction(this.recordActionData);
            }
        }
    }

    /** @internal */
    async _loadDataAsync(): Promise<[]> {
        if (!this._hasRegisteredHandler) {
            this._hasRegisteredHandler = true;
            this.recordActionData = await this._airtableInterface.fetchAndSubscribeToPerformRecordActionAsync(
                this._handlePerformRecordAction,
            );
        }

        return [];
    }

    /** @internal */
    _unloadData() {
    }

    /** @internal */
    static _shouldLoadDataForKey(key: WatchablePerformRecordActionKey): boolean {
        return key === WatchablePerformRecordActionKeys.recordActionData;
    }
}

/**
 * Registers a callback to handle "open block" / "perform record action" events (from button field).
 *
 * Returns a unsubscribe function that should be used to unregister the callback for cleanup on
 * component unmount, or if you wish to register a different function.
 *
 * Also see {@link useRecordActionData}, which subscribes to the same events in a synchronous way.
 *
 * Your block will not receive "perform record action" events until a callback is registered -
 * they're held until registration to ensure the block is ready to handle the event (e.g. has
 * finished loading).
 *
 * Because of this, we recommend only registering a callback once, in your top level component -
 * otherwise, messages could be received while not all callbacks have been successfully registered.
 * Similarly, using both `registerRecordActionDataCallback` and `useRecordActionData` is not
 * supported.
 *
 * You can test your block in development by sending "perform record action" events to your block
 * in the "Advanced" panel of the block developer tools.
 *
 * After releasing your block, you can use it with a button field by choosing the "Open custom
 * block" action and selecting your block.
 *
 * @example
 * ```js
 * import React, {useEffect, useState} from 'react';
 * import {registerRecordActionDataCallback} from '@airtable/blocks/ui';
 *
 * function LatestRecordAction() {
 *     const [recordActionData, setRecordActionData] = useState(null);
 *
 *     const callback = (data) => {
 *         console.log('Record action received', data);
 *         setRecordActionData(data);
 *     }
 *
 *     useEffect(() => {
 *         // Return the unsubscribe function so it's run on cleanup.
 *         return registerRecordActionDataCallback(callback);
 *     }, [callback]);
 *
 *     if (recordActionData === null) {
 *         return <span>No events yet</span>;
 *     }
 *
 *     return (
 *         <ul>
 *             <li>Record id: {recordActionData.recordId}</li>
 *             <li>View id: {recordActionData.viewId}</li>
 *             <li>Table id: {recordActionData.tableId}</li>
 *         </ul>
 *     );
 * }
 * ```
 *
 */
export function registerRecordActionDataCallback(
    callback: RecordActionDataCallback,
): UnsubscribeFunction {
    const {performRecordAction} = sdk;

    const wrappedCallback = (
        model: PerformRecordAction,
        key: WatchablePerformRecordActionKey,
        data: RecordActionData,
    ) => {
        callback(data);
    };

    performRecordAction.watch(WatchablePerformRecordActionKeys.recordActionData, wrappedCallback);
    return () =>
        performRecordAction.unwatch(
            WatchablePerformRecordActionKeys.recordActionData,
            wrappedCallback,
        );
}

let sdk: Sdk;

export function __injectSdkIntoPerformRecordAction(_sdk: Sdk) {
    sdk = _sdk;
}
