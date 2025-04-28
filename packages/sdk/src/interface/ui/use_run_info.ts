/** @module @airtable/blocks/interface/ui: useRunInfo */ /** */
import {InterfaceSdkMode} from '../../sdk_mode';
import {useSdk} from '../../shared/ui/sdk_context';

/**
 * A hook for getting information about the current run context. This can be
 * useful if you'd like to display some configuration options when the page
 * element is in edit mode.
 *
 * `useRunInfo`
 *
 * @example
 * ```js
 * import {useRunInfo} from '@airtable/blocks/interface/ui';
 *
 * // renders a list of tables and automatically updates
 * function MyApp() {
 *      const runInfo = useRunInfo();
 *      return (
 *          <div>
 *              <p>Is development mode: {runInfo.isDevelopmentMode ? 'Yes' : 'No'}</p>
 *              <p>Is page element in edit mode: {runInfo.isPageElementInEditMode ? 'Yes' : 'No'}</p>
 *          </div>
 *      );
 * }
 * ```
 * @docsPath UI/hooks/useRunInfo
 * @hook
 */
export function useRunInfo(): {isDevelopmentMode: boolean; isPageElementInEditMode: boolean} {
    const sdk = useSdk<InterfaceSdkMode>();
    const runContext = sdk.getBlockRunContext();
    return {
        isDevelopmentMode: sdk.runInfo.isDevelopmentMode,
        isPageElementInEditMode: runContext.isPageElementInEditMode,
    };
}
