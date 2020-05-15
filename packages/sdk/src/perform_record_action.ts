import {spawnError} from './error_utils';
import getSdk from './get_sdk';
import {
    AirtableInterface,
    RecordActionData,
    RecordActionDataCallback,
} from './injected/airtable_interface';

/** hidden */
type UnsubscribeFunction = () => void;

/**
 * This class exists to manage registering a callback to receive "Open block" / "Perform record
 * action" messages.
 * This is different to other message handlers (_registerHandlers) since the callback is specified
 * by the block: it registers it during first render (vs the SDK registering during initialisation).
 *
 * On the liveapp side, we ensure that pending messages are held until the block registers the
 * callback (or another message is sent).
 *
 * In the SDK, we only allow one callback to be registered at a time. This is both for
 * simplicity (only your highest level component should handle it) as well as to avoid race
 * conditions where you have multiple handlers, and the message is sent while not all of them
 * have finished registering. We throw if multiple callbacks are registered.
 *
 * However, we do support unregistering the callback. This is to support cleaning up the callback
 * if the component is unmounted for some reason (otherwise we'd throw when the component is
 * mounted again).
 *
 * We handle unregistration at this layer (rather than the AirtableInterface layer): this adds
 * a level of indirection (the handler we register with airtableInterface calls the callback
 * stored in this class, rather than registering the callback as the handler) for a few reasons:
 * - simplifies subscription - we only register a handler with liveapp once, rather than registering
 *   and unregistering different callbacks
 * - simplifies unsubscription - don't need to add an unregister function to AirtableInterface
 *
 * This class is internal: users should use registerRecordActionDataCallback or useRecordActionData.
 *
 * @internal
 * */
export class PerformRecordAction {
    /** @internal */
    _airtableInterface: AirtableInterface;
    /** @internal */
    _hasRegisteredHandler: boolean;
    /** @internal */
    _callback: RecordActionDataCallback | null;

    /** @hidden */
    constructor(airtableInterface: AirtableInterface) {
        this._airtableInterface = airtableInterface;
        this._hasRegisteredHandler = false;
        this._callback = null;

        this._handlePerformRecordAction = this._handlePerformRecordAction.bind(this);
    }

    /** @hidden */
    _handlePerformRecordAction(data: RecordActionData) {
        if (this._callback) {
            this._callback(data);
        }
    }

    /** @hidden */
    registerCallback(callback: RecordActionDataCallback): UnsubscribeFunction {
        if (this._callback) {
            throw spawnError('Cannot call registerCallback with a callback already registered');
        }

        this._callback = callback;

        if (!this._hasRegisteredHandler) {
            // If this is the first time a callback has been registered, we also need to register
            // a handler with airtableInterface to let liveapp know we can receive openWithRecord
            // messages and to handle those messages.
            // TODO(emma); dunno if register needs to be async / registerCallback should be async
            this._airtableInterface.registerOpenWithRecordHandlerAsync(
                this._handlePerformRecordAction,
            );
            this._hasRegisteredHandler = true;
        }

        return () => {
            // Note: we don't unregister the handler for simplicity.
            // Since there's only one callback registered at a time, the unsubscribe function
            // simply clears it..
            this._callback = null;
        };
    }
}

/**
 * Registers a callback to handle "open block" / "perform record action" events (from button field).
 *
 * Your block will not receive "perform record action" events until a callback is registered.
 *
 * Returns a unsubscribe function that can be used to unregister the callback (e.g. on
 * component unmount for cleanup, or if you wish to register a different function.)
 *
 * Only one callback can be registered at a time. It should ideally be registered from the top-level
 * component of your block.
 *
 * @hidden
 */
export function registerRecordActionDataCallback(
    callback: RecordActionDataCallback,
): UnsubscribeFunction {
    const {performRecordAction} = getSdk();
    return performRecordAction.registerCallback(callback);
}
