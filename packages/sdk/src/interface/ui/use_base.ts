/** @module @airtable/blocks/interface/ui: useBase */ /** */
import {type InterfaceSdkMode} from '../../sdk_mode';
import useBaseInternal from '../../shared/ui/use_base';
import {type Base} from '../models/base';

/**
 * A hook for connecting a React component to your base's schema. This returns a {@link Base}
 * instance and will re-render your component whenever the base's schema changes. That means any
 * change to your base like tables being added or removed, fields getting renamed, etc. It excludes
 * any change to the actual records in the base.
 *
 * `useBase` should meet most of your needs for working with base schema. If you need more granular
 * control of when your component updates or want to do anything other than re-render, the lower
 * level {@link useWatchable} hook might help.
 *
 * Returns the current base.
 *
 * @example
 * ```js
 * import {useBase} from '@airtable/blocks/interface/ui';
 *
 * // renders a list of tables and automatically updates
 * function TableList() {
 *      const base = useBase();
 *
 *      const tables = base.tables.map(table => {
 *          return <li key={table.id}>{table.name}</li>;
 *      });
 *
 *      return <ul>{tables}</ul>;
 * }
 * ```
 * @docsPath UI/hooks/useBase
 * @hook
 */
export function useBase(): Base {
    return useBaseInternal<InterfaceSdkMode>();
}
