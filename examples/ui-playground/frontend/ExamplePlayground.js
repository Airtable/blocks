// @flow
import React, {useState} from 'react';
import {Box, Button} from '@airtable/blocks/ui';
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
        <Box
            position="absolute"
            top={0}
            right={0}
            bottom={0}
            left={0}
            display="flex"
            flexDirection="column"
        >
            <div className="baymax">
                <div className="border-bottom border-darken2 p1 flex items-center">
                    <div style={{width: 80}}>
                        <Button onClick={onBack}>Back</Button>
                    </div>
                    <div className="strong big center flex-auto truncate px1">{example.name}</div>
                    <div style={{width: 80, textAlign: 'right'}}>
                        {example.hasSettings ? (
                            <Button onClick={_onClickSettings}>Settings</Button>
                        ) : null}
                    </div>
                </div>
            </div>
            <Box display="flex" flex="auto" alignItems="center" justifyContent="center">
                <example.component shouldShowSettings={shouldShowSettings} />
            </Box>
        </Box>
    );
}
