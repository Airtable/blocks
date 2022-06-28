/** @module @airtable/blocks/ui: useSettingsButton */ /** */
import {useEffect} from 'react';
import {FlowAnyFunction} from '../private_utils';
import useWatchable from './use_watchable';
import {useSdk} from './sdk_context';

/**
 * A hook for using the settings button that lives outside the extension's viewport. It will show
 * the settings button (hidden by default) and call the provided callback whenever the settings
 * button is clicked. It will also re-render your component when the settings button is clicked.
 *
 * @param onClickCallback A callback to call when the button is clicked.
 *
 * @example
 * ```js
 * import {useSettingsButton} from '@airtable/blocks/ui';
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
    const {settingsButton} = useSdk();

    useEffect(() => {
        settingsButton.show();

        return () => {
            settingsButton.hide();
        };
    }, [settingsButton]); 

    useWatchable(settingsButton, ['click'], onClickCallback);
}
