/** @module @airtable/blocks/ui: useGlobalConfig */ /** */
import GlobalConfig from '../global_config';
import useWatchable from './use_watchable';
import {useSdk} from './sdk_context';

/**
 * Returns the app's {@link GlobalConfig} and updates whenever any key in {@link GlobalConfig}
 * changes.
 *
 * @example
 * ```js
 * import {Button, useGlobalConfig} from '@airtable/blocks/ui';
 *
 * function SyncedCounter() {
 *     const globalConfig = useGlobalConfig();
 *     const count = globalConfig.get('count');
 *
 *     const increment = () => globalConfig.setAsync('count', count + 1);
 *     const decrement = () => globalConfig.setAsync('count', count - 1);
 *     const isEnabled = globalConfig.hasPermissionToSet('count');
 *
 *     return (
 *         <React.Fragment>
 *             <Button icon="minus" onClick={decrement} disabled={!isEnabled} ariaLabel="decrease"/>
 *             {count}
 *             <Button icon="plus" onClick={increment} disabled={!isEnabled} ariaLabel="increase"/>
 *         </React.Fragment>
 *     );
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
