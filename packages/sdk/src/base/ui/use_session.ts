/** @module @airtable/blocks/ui: useSession */ /** */
import {BaseSdkMode} from '../../sdk_mode';
import useSessionInternal from '../../shared/ui/use_session';

/**
 * A hook for connecting a React component to the current session. This returns a {@link Session}
 * instance and will re-render your component whenever the session changes (e.g. when the current user's
 * permissions change or when the current user's name changes).
 *
 * `useSession` should meet most of your needs for working with {@link Session}. If you need more granular
 * control of when your component updates or want to do anything other than re-render, the lower
 * level {@link useWatchable} hook might help.
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
 * @docsPath UI/hooks/useSession
 * @hook
 */
function useSession() {
    return useSessionInternal<BaseSdkMode>();
}

export default useSession;
