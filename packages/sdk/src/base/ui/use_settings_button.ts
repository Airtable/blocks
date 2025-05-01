/** @module @airtable/blocks/ui: useSettingsButton */ /** */
import {useEffect} from 'react';
import {FlowAnyFunction} from '../../shared/private_utils';
import useWatchable from '../../shared/ui/use_watchable';
import {useSdk} from '../../shared/ui/sdk_context';
import {BaseSdkMode} from '../../sdk_mode';

/**
 * A hook for using the settings button that lives outside the extension's viewport. It will show
 * the settings button (hidden by default) and call the provided callback whenever the settings
 * button is clicked. It will also re-render your component when the settings button is clicked.
 *
 * @param onClickCallback A callback to call when the button is clicked.
 *
 * @example
 * ```js
 * import {useSettingsButton} from '@airtable/blocks/base/ui';
 * import {useState} from 'react';
 *
 * function ComponentWithSettings() {
 *      const [isShowingSettings, setIsShowingSettings] = useState(false);
 *      useSettingsButton(function() {
 *          setIsShowingSettings(!isShowingSettings);
 *      });
 *
 *      if (isShowingSettings) {
 *          return <SettingsComponent />
 *      }
 *      return <MainComponent />
 * }
 * ```
 * @docsPath UI/hooks/useSettingsButton
 * @hook
 */
export default function useSettingsButton(onClickCallback: FlowAnyFunction) {
    const {settingsButton} = useSdk<BaseSdkMode>();

    useEffect(() => {
        settingsButton.show();

        return () => {
            settingsButton.hide();
        };
    }, [settingsButton]); 

    useWatchable(settingsButton, ['click'], onClickCallback);
}
