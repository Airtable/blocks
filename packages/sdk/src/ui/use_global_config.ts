/** @module @airtable/blocks/ui: useGlobalConfig */ /** */
import getSdk from '../get_sdk';
import GlobalConfig from '../global_config';
import useWatchable from './use_watchable';

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
 *             <Button icon="plus" onClick={increment} disabled={!isEnabled} airaLabel="increase"/>
 *         </React.Fragment>
 *     );
 * }
 * ```
 * @docsPath UI/hooks/useGlobalConfig
 * @hook
 */
export default function useGlobalConfig(): GlobalConfig {
    const {globalConfig, session} = getSdk();
    useWatchable(session, ['permissionLevel']);
    useWatchable(globalConfig, ['*']);
    return globalConfig;
}
