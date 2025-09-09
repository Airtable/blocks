import {type SdkMode} from '../../sdk_mode';
import useWatchable from './use_watchable';
import {useSdk} from './sdk_context';

/** @internal */
const useSession = <SdkModeT extends SdkMode>(): SdkModeT['SessionT'] => {
    const {session, base} = useSdk();
    useWatchable(session, ['permissionLevel', 'currentUser']);
    useWatchable(base, ['schema']);
    return session;
};

export default useSession;
