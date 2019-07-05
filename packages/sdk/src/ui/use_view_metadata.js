// @flow
import type ViewMetadataQueryResult from '../models/view_metadata_query_result';
import View from '../models/view';
import useLoadable from './use_loadable';
import useWatchable from './use_watchable';

/**
 * Returns a {@link ViewMetadataQueryResult} for the specified view and re-renders whenever the
 * view meta data changes. Suspends if the view is not already loaded.
 *
 * @param {*} viewOrViewMetadataQueryResult
 *
 * @example
 * import {useBase, useViewMetadata} from '@airtable/blocks/ui';
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
 */
function useViewMetadata(viewOrViewMetadataQueryResult: ?(View | ViewMetadataQueryResult)) {
    const queryResult =
        viewOrViewMetadataQueryResult instanceof View
            ? viewOrViewMetadataQueryResult.selectMetadata()
            : viewOrViewMetadataQueryResult;

    useLoadable(queryResult || null);
    useWatchable(queryResult, ['allFields', 'visibleFields']);

    return queryResult || null;
}

type UseViewMetadataType = (View => ViewMetadataQueryResult) &
    (ViewMetadataQueryResult => ViewMetadataQueryResult) &
    ((null | void) => null);

export default ((useViewMetadata: any): UseViewMetadataType);
