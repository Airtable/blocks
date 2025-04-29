import {SdkMode} from '../../sdk_mode';
import useWatchable from './use_watchable';
import {useSdk} from './sdk_context';

/**
 * @hidden
 */
const useBase = <SdkModeT extends SdkMode>(): SdkModeT['BaseT'] => {
    const {base, session} = useSdk();
    useWatchable(base, ['schema']);
    useWatchable(session, ['permissionLevel']);
    return base;
};

export default useBase;
