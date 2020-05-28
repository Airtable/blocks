import getSdk from '../get_sdk';
import {RecordActionData} from '../types/record_action_data';
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
 * asynchronous (callback based) way. An advantage of using this hook over the callback is that you
 * immediately can handle any pending events when your block opens - with a callback, your block
 * will finish it's initial render before handling the event.
 *
 * Like {@link registerRecordActionDataCallback}, your block won't receive events until this hook is
 * used for the first time. Because of that, we recommend only using this hook once, in the top
 * level component of your block. Similarly, using both `registerRecordActionDataCallback` and
 * `useRecordActionData` is not supported.
 *
 * You can test your block in development by sending "perform record action" events to your block
 * in the "Advanced" panel of the block developer tools.
 *
 * TODO(emma): update this with instructions on using button field with a custom block when custom
 * blocks are supported in button field config.
 *
 * TODO(emma): This doesn't cover the useLayoutEffect & usePrevious workaround for immediately
 * rendering callback results with this hook (used in scripting) but is probably too advanced.
 * Include it in a guide instead?
 *
 * @example
 * ```js
 * import React from 'react';
 * import {useRecordActionData} from '@airtable/blocks/ui';
 *
 * function LatestRecordAction() {
 *     const recordActionData = useRecordActionData();
 *
 *     if (recordActionData === null) {
 *         return <span>No events yet</div>;
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
 * @hidden
 */

export default function useRecordActionData(): RecordActionData | null {
    const {performRecordAction} = getSdk();

    useLoadable(performRecordAction);

    useWatchable(performRecordAction, WatchablePerformRecordActionKeys.recordActionData);

    return performRecordAction.recordActionData;
}
