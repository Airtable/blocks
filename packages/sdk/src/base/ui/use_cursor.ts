/** @module @airtable/blocks/ui: useCursor */ /** */
import type Cursor from '../models/cursor';
import useWatchable from '../../shared/ui/use_watchable';
import {useSdk} from '../../shared/ui/sdk_context';
import {type BaseSdkMode} from '../../sdk_mode';

/**
 * A hook for connecting a React component to your base's cursor. This returns a {@link Cursor}
 * instance and will re-render your component whenever the active Table or active View changes.
 * It excludes any change to the selected Records or selected Fields.
 *
 * `useCursor` should meet most of your needs for working with base cursors. If you need more granular
 * control of when your component updates or want to do anything other than re-render, the lower
 * level {@link useWatchable} hook might help.
 *
 * Returns the current cursor.
 *
 * @example
 * ```js
 * import {useBase, useCursor} from '@airtable/blocks/base/ui';
 *
 * // renders a list of tables and automatically updates
 * function TableList() {
 *      const base = useBase();
 *      const cursor = useCursor();
 *
 *      const table = base.getTableById(cursor.activeTableId);
 *
 *      return <p>The table named "{table.name}" is active!</p>;
 * }
 * ```
 * @docsPath UI/hooks/useCursor
 * @hook
 */
const useCursor = (): Cursor => {
    const {cursor} = useSdk<BaseSdkMode>();

    useWatchable(cursor, ['activeTableId', 'activeViewId']);

    return cursor;
};

export default useCursor;
