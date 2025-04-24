import {InterfaceSdkMode} from '../../sdk_mode';
import {useSdk} from '../../shared/ui/sdk_context';

/**
 * @hidden
 */
export function useRunInfo(): {isDevelopmentMode: boolean; isPageElementInEditMode: boolean} {
    const sdk = useSdk<InterfaceSdkMode>();
    const runContext = sdk.getBlockRunContext();
    return {
        isDevelopmentMode: sdk.runInfo.isDevelopmentMode,
        isPageElementInEditMode: runContext.isPageElementInEditMode,
    };
}
