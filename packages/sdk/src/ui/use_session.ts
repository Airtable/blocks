/** @module @airtable/blocks/ui: useSession */ /** */
import getSdk from '../get_sdk';
import Session from '../models/session';
import useWatchable from './use_watchable';

/**
 * A hook for connecting a React component to the current session. This returns a {@link Session}
 * instance and will re-render your component whenever the session changes (e.g. when the current user's
 * permissions change or when the current user's name changes).
 *
 * `useSession` should meet most of your needs for working with {@link Session}. If you need more granular
 * control of when your component updates or want to do anything other than re-render, the lower
 * level {@link useWatchable} hook might help.
 *
 * @returns The current session.
 *
 * @example
 * ```js
 * import {CollaboratorToken, useSession} from '@airtable/blocks/ui';
 *
 * // Says hello to the current user and updates in realtime if the current user's
 * // name or profile pic changes.
 * function CurrentUserGreeter() {
 *     const session = useSession();
 *     return (
 *         <React.Fragment>
 *             Hello,
 *             <CollaboratorToken collaborator={session.currentUser} />!
 *         </React.Fragment>
 *     );
 * }
 * ```
 */
export default function useSession(): Session {
    const {session, base} = getSdk();
    useWatchable(session, ['permissionLevel', 'currentUser']);
    useWatchable(base, ['schema']);
    return session;
}
