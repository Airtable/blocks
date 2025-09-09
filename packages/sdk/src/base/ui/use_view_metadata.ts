/** @module @airtable/blocks/ui: useViewMetadata */ /** */
import type ViewMetadataQueryResult from '../models/view_metadata_query_result';
import View from '../models/view';
import useWatchable from '../../shared/ui/use_watchable';
import useLoadable from './use_loadable';

/** */
function useViewMetadata(
    viewOrViewMetadataQueryResult: View | ViewMetadataQueryResult,
): ViewMetadataQueryResult;
/** */
function useViewMetadata(viewOrViewMetadataQueryResult?: null | undefined): null;
/** */
function useViewMetadata(
    viewOrViewMetadataQueryResult?: View | ViewMetadataQueryResult | null | undefined,
): ViewMetadataQueryResult | null;

/**
 * Returns a {@link ViewMetadataQueryResult} for the specified view and re-renders whenever the
 * view metadata changes. Suspends if the view is not already loaded.
 *
 * @param viewOrViewMetadataQueryResult The {@link View} or {@link ViewMetadataQueryResult} to watch and use metadata from.
 * @example
 * ```js
 * import {useBase, useViewMetadata} from '@airtable/blocks/base/ui';
 *
 * function ViewFields({view}) {
 *     const viewMetadata = useViewMetadata(view);
 *
 *     return (
 *         <ul>
 *             {viewMetadata.visibleFields.map(field => (
 *                 <li key={field.id}>{field.name}</li>
 *             ))}
 *         </ul>
 *     );
 * }
 * ```
 * @docsPath UI/hooks/useViewMetadata
 * @hook
 */
function useViewMetadata(
    viewOrViewMetadataQueryResult?: View | ViewMetadataQueryResult | null | undefined,
) {
    const queryResult =
        viewOrViewMetadataQueryResult instanceof View
            ? viewOrViewMetadataQueryResult.selectMetadata()
            : viewOrViewMetadataQueryResult;

    useLoadable(queryResult ?? null);
    useWatchable(queryResult, ['allFields', 'visibleFields', 'groupLevels']);

    return queryResult ?? null;
}

export default useViewMetadata;
