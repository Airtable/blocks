import {SdkMode} from '../../sdk_mode';
import useWatchable from './use_watchable';
import {useSdk} from './sdk_context';

/** @internal */
const useSession = <SdkModeT extends SdkMode>(): SdkModeT['SessionT'] => {
    const {session, base} = useSdk();
    useWatchable(session, ['permissionLevel', 'currentUser']);
    // permission checks depend on the base schema, so we need to track that too:
    useWatchable(base, ['schema']);
    return session;
};

export default useSession;
