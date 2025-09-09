/** @module @airtable/blocks/ui: useRecordActionData */ /** */
import {type RecordActionData} from '../types/record_action_data';
import {WatchablePerformRecordActionKeys} from '../perform_record_action';
import useWatchable from '../../shared/ui/use_watchable';
import {useSdk} from '../../shared/ui/sdk_context';
import {type BaseSdkMode} from '../../sdk_mode';
import useLoadable from './use_loadable';

/**
 * A hook to watch "open extension" / "perform record action" events (from button field). Returns
 * the data corresponding to the latest action, or `null` if no actions have occurred yet. If there
 * was a pending event for the extension (for example, because a button that opens this extension was
 * clicked while the extensions dashboard was closed) it will be returned as the initial value.
 *
 * Like {@link useLoadable}, this hook puts the extension in suspense while subscribing to events and
 * fetching the initial data.
 *
 * Also see {@link registerRecordActionDataCallback}, which subscribes to the same events in an
 * asynchronous (callback based) way. An advantage of using this hook over the callback is that you
 * immediately can handle any pending events when your extension opens - with a callback, your extension
 * will finish it's initial render before handling the event.
 *
 * Like {@link registerRecordActionDataCallback}, your extension won't receive events until this hook is
 * used for the first time. Because of that, we recommend only using this hook once, in the top
 * level component of your extension. Similarly, using both `registerRecordActionDataCallback` and
 * `useRecordActionData` is not supported.
 *
 * You can test your extension in development by sending "perform record action" events to your extension
 * in the "Advanced" panel of the extension developer tools.
 *
 * After releasing your extension, you can use it with a button field by choosing the "Open custom
 * extension" action and selecting your extension.
 *
 * @example
 * ```js
 * import React from 'react';
 * import {useRecordActionData} from '@airtable/blocks/base/ui';
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
    const {performRecordAction} = useSdk<BaseSdkMode>();

    useLoadable(performRecordAction);

    useWatchable(performRecordAction, WatchablePerformRecordActionKeys.recordActionData);

    return performRecordAction.recordActionData;
}
