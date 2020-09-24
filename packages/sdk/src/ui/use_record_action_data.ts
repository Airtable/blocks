/** @module @airtable/blocks/ui: useRecordActionData */ /** */
import getSdk from '../get_sdk';
import {RecordActionData} from '../types/record_action_data';
import {WatchablePerformRecordActionKeys} from '../perform_record_action';
import {useLoadable, useWatchable} from './ui';

/**
 * A hook to watch "open app" / "perform record action" events (from button field). Returns
 * the data corresponding to the latest action, or `null` if no actions have occurred yet. If there
 * was a pending event for the app (for example, because a button that opens this app was
 * clicked while the apps dashboard was closed) it will be returned as the initial value.
 *
 * Like {@link useLoadable}, this hook puts the app in suspense while subscribing to events and
 * fetching the initial data.
 *
 * Also see {@link registerRecordActionDataCallback}, which subscribes to the same events in an
 * asynchronous (callback based) way. An advantage of using this hook over the callback is that you
 * immediately can handle any pending events when your app opens - with a callback, your app
 * will finish it's initial render before handling the event.
 *
 * Like {@link registerRecordActionDataCallback}, your app won't receive events until this hook is
 * used for the first time. Because of that, we recommend only using this hook once, in the top
 * level component of your app. Similarly, using both `registerRecordActionDataCallback` and
 * `useRecordActionData` is not supported.
 *
 * You can test your app in development by sending "perform record action" events to your app
 * in the "Advanced" panel of the app developer tools.
 *
 * After releasing your app, you can use it with a button field by choosing the "Open custom
 * app" action and selecting your app.
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
 * @docsPath UI/hooks/useRecordActionData
 * @hook
 */

export default function useRecordActionData(): RecordActionData | null {
    const {performRecordAction} = getSdk();

    useLoadable(performRecordAction);

    useWatchable(performRecordAction, WatchablePerformRecordActionKeys.recordActionData);

    return performRecordAction.recordActionData;
}
