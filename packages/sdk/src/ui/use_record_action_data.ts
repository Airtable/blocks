import getSdk from '../get_sdk';
import {RecordActionData} from '../injected/airtable_interface';
import {WatchablePerformRecordActionKeys} from '../perform_record_action';
import {useLoadable, useWatchable} from './ui';

/**
 * A hook to watch "open block" / "perform record action" events (from button field). Returns
 * the data corresponding to the latest action, or `null` if no actions have occurred yet. If there
 * was a pending event for the block (for example, because a button that opens this block was
 * clicked while the blocks dashboard was closed) it will be returned as the initial value.
 *
 * Like {@link useLoadable}, this hook puts the block in suspense while subscribing to events and
 * fetching the initial data.
 *
 * Also see {@link registerRecordActionDataCallback}, which subscribes to the same events in an
 * asynchronous (callback based) way.
 *
 * Like {@link registerRecordActionDataCallback}, your block won't receive events until this hook is
 * used for the first time. Because of that, we recommend only using this hook once, in the top
 * level component of your block. Similarly, using both `registerRecordActionDataCallback` and
 * `useRecordActionData` is not supported.
 *
 * TODO(emma): improve documentation, examples, mention dev tools
 *
 * @hidden
 */

export const useRecordActionData = (): RecordActionData | null => {
    const {performRecordAction} = getSdk();

    // Puts the block in suspense until the liveapp handler has been registered.
    useLoadable(performRecordAction);

    // Note: if we were to pass a callback to useWatchable, it would drop the callback for the
    // initial recordActionData (if it exists) when the component is mounted.
    // We'd have to trigger it manually by comparing recordActionData to it's previous value in an
    // effect, but would need to be careful to not erroneously trigger it when the component
    // unmounts and remounts.
    // So, using a callback with useRecordActionData isn't supported right now for simplicity.
    useWatchable(performRecordAction, WatchablePerformRecordActionKeys.recordActionData);

    return performRecordAction.recordActionData;
};

// TODO(emma): switch to default export when exposing outside of private utils
