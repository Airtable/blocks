/** @module @airtable/blocks/interface/ui: useSearchParams */ /** */
import {useCallback} from 'react';
import {type InterfaceSdkMode} from '../../sdk_mode';
import {useSdk} from '../../shared/ui/sdk_context';
import useWatchable from '../../shared/ui/use_watchable';
import {spawnError} from '../../shared/error_utils';

/**
 * Parameter type for the `setSearchParamsAsync` function. You can either pass a new object of search params,
 * or an updater function that returns a new object of search params based on the previous search params.
 *
 * ```
 * type SearchParamsUpdater =
 *   | Record<string, string>
 *   | ((prev: Record<string, string>) => Record<string, string>);
 * ```
 */
type SearchParamsUpdater =
    | Record<string, string>
    | ((prev: Record<string, string>) => Record<string, string>);

/**
 * A hook for reading and writing URL search params scoped to this block installation.
 * Enables blocks to act as single-page apps with their own internal routing and
 * deep-linkable state.
 *
 * Each block installation gets its own namespaced set of search params in the page URL.
 * The namespacing is handled automatically — you only work with plain key-value params.
 *
 * Returns an object with:
 * - `searchParams`: the current search params as a `Record<string, string>`.
 * - `setSearchParamsAsync`: a function to update the search params. Accepts either an object
 *   (replaces all params) or a function updater (for merging with existing params).
 *
 * The hook automatically re-renders when search params change externally
 * (e.g., browser back/forward navigation).
 *
 * Param keys must only contain letters, digits, and underscores (`\w+`).
 * Values can contain any characters.
 *
 * @example
 * ```js
 * import {useSearchParams} from '@airtable/blocks/interface/ui';
 *
 * function MyApp() {
 *     const {searchParams, setSearchParamsAsync} = useSearchParams();
 *     const page = searchParams.page ?? 'home';
 *
 *     if (page === 'settings') {
 *         return <Settings onBack={() => setSearchParamsAsync({page: 'home'})} />;
 *     }
 *
 *     return (
 *         <div>
 *             <p>Current page: {page}</p>
 *             <button onClick={() => setSearchParamsAsync({page: 'settings'})}>
 *                 Go to Settings
 *             </button>
 *         </div>
 *     );
 * }
 * ```
 *
 * @example
 * ```js
 * // Merging with existing params using a function updater:
 * const {searchParams, setSearchParamsAsync} = useSearchParams();
 *
 * // Only update 'page', keep other params
 * await setSearchParamsAsync(prev => ({...prev, page: 'details'}));
 * ```
 * @docsPath UI/hooks/useSearchParams
 * @hook
 */
export function useSearchParams(): {
    searchParams: Record<string, string>;
    setSearchParamsAsync: (newParams: SearchParamsUpdater) => Promise<void>;
} {
    const sdk = useSdk<InterfaceSdkMode>();
    const searchParams = sdk._searchParams.getSearchParams();
    useWatchable(sdk._searchParams, ['searchParams']);

    const setSearchParamsAsync = useCallback(
        async (newParams: SearchParamsUpdater): Promise<void> => {
            const resolved = typeof newParams === 'function' ? newParams(searchParams) : newParams;
            const success = await sdk._searchParams.setSearchParamsAsync(resolved);
            if (!success) {
                throw spawnError('Failed to set search params');
            }
        },
        [sdk, searchParams],
    );

    return {
        searchParams,
        setSearchParamsAsync,
    };
}
