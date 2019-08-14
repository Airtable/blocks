// @flow
import React, {useState} from 'react';
import {Button} from '@airtable/blocks/ui';
import {type Example} from './Example';

type Props = {
    example: Example,
    onBack: () => void | Promise<void>,
};

export default function ExamplePlayground(props: Props) {
    const {example, onBack} = props;
    const [shouldShowSettings, setShouldShowSettings] = useState(false);

    function _onClickSettings() {
        setShouldShowSettings(!shouldShowSettings);
    }

    return (
        <div className="absolute all-0 flex flex-column">
            <div className="border-bottom border-darken2 p1 flex items-center">
                <div style={{width: 80}}>
                    <Button
                        theme={Button.themes.GRAY}
                        style={{height: 32, paddingTop: 0, paddingBottom: 0}}
                        onClick={onBack}
                    >
                        Back
                    </Button>
                </div>
                <div className="strong big center flex-auto truncate px1">{example.name}</div>
                <div style={{width: 80, textAlign: 'right'}}>
                    {example.hasSettings ? (
                        <Button
                            theme={Button.themes.GRAY}
                            style={{height: 32, paddingTop: 0, paddingBottom: 0}}
                            onClick={_onClickSettings}
                        >
                            Settings
                        </Button>
                    ) : null}
                </div>
            </div>
            <div className="flex flex-auto items-center justify-center">
                <example.component shouldShowSettings={shouldShowSettings} />
            </div>
        </div>
    );
}
