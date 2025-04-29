import {InterfaceSdkMode} from '../../sdk_mode';
import {SessionCore} from '../../shared/models/session_core';

/**
 * Model class representing the current user's session.
 *
 * @example
 * ```js
 * import {useSession} from '@airtable/blocks/interface/ui';
 *
 * function Username() {
 *     const session = useSession();
 *
 *     if (session.currentUser !== null) {
 *         return <span>The current user's name is {session.currentUser.name}</span>;
 *     } else {
 *         return <span>This extension is being viewed in a public share</span>;
 *     }
 * }
 * ```
 * @docsPath models/Session
 */
export class Session extends SessionCore<InterfaceSdkMode> {}
