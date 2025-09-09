/** @module @airtable/blocks/ui: useGlobalConfig */ /** */
import type GlobalConfig from '../global_config';
import useWatchable from './use_watchable';
import {useSdk} from './sdk_context';

/**
 * Returns the extension's {@link GlobalConfig} and updates whenever any key in {@link GlobalConfig}
 * changes.
 *
 * @example
 * ```js
 * import {useGlobalConfig, useRunInfo} from '@airtable/blocks/[placeholder-path]/ui';
 *
 * function SyncedCounter() {
 *     const runInfo = useRunInfo();
 *     const globalConfig = useGlobalConfig();
 *     const count = globalConfig.get('count');
 *
 *     const increment = () => globalConfig.setAsync('count', count + 1);
 *     const decrement = () => globalConfig.setAsync('count', count - 1);
 *     const isEnabled = globalConfig.hasPermissionToSet('count');
 *
 *     if (runInfo.isPageElementInEditMode) {
 *         return (
 *             <div>
 *                 <button onClick={decrement} disabled={!isEnabled} ariaLabel="decrease">-</button>
 *                 {count}
 *                 <button onClick={increment} disabled={!isEnabled} ariaLabel="increase">+</button>
 *             </div>
 *         );
 *     } else {
 *         return <div>{count}</div>;
 *     }
 * }
 * ```
 * @docsPath UI/hooks/useGlobalConfig
 * @hook
 */
export default function useGlobalConfig(): GlobalConfig {
    const {globalConfig, session} = useSdk();
    useWatchable(session, ['permissionLevel']);
    useWatchable(globalConfig, ['*']);
    return globalConfig;
}
