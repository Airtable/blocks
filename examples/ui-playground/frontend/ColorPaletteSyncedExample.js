// @flow
import React, {useState} from 'react';
import {Box, ColorPaletteSynced, Input, colors} from '@airtable/blocks/ui';

type Props = {
    shouldShowSettings: boolean,
};

export default function ColorPaletteSyncedExample(props: Props) {
    const [numColors, setNumColors] = useState(15);
    const [marginSize, setMarginSize] = useState(2);

    return (
        <Box display="flex" flexDirection="column" width="100%" height="100%">
            {props.shouldShowSettings && (
                <div className="baymax">
                    <div className="flex p2 justify-between items-center border-bottom border-darken2">
                        <span>Number of colors</span>
                        <Input
                            type="number"
                            value={String(numColors)}
                            onChange={e => setNumColors(Number(e.target.value))}
                        />
                    </div>
                    <div className="flex p2 justify-between items-center border-bottom border-darken2">
                        <span>Margin size (px)</span>
                        <Input
                            type="number"
                            value={String(marginSize)}
                            step={1}
                            onChange={e => setMarginSize(Number(e.target.value))}
                        />
                    </div>
                </div>
            )}
            <ColorPaletteSynced
                globalConfigKey="color"
                squareMargin={marginSize ? parseInt(marginSize, 10) : 0}
                allowedColors={Object.values(colors).slice(0, numColors)}
                width="100%"
                marginTop={2}
            />
        </Box>
    );
}
