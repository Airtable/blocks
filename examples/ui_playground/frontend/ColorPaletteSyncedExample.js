// @flow
import React, {useState} from 'react';
import {ColorPaletteSynced, Input, colors} from '@airtable/blocks/ui';

export default function ColorPaletteSyncedExample(props: void) {
    const [numColors, setNumColors] = useState(15);
    const [marginSize, setMarginSize] = useState(2);

    return (
        <div className="flex flex-column width-full height-full">
            <div className="flex p2 justify-between items-center border-bottom border-darken2">
                <span>Number of colors</span>
                <Input
                    type="number"
                    value={numColors}
                    onChange={e => setNumColors(e.target.value)}
                />
            </div>
            <div className="flex p2 justify-between items-center border-bottom border-darken2">
                <span>Margin size (px)</span>
                <Input
                    type="number"
                    value={marginSize}
                    step={1}
                    onChange={e => setMarginSize(e.target.value)}
                />
            </div>
            <ColorPaletteSynced
                className="width-full mt1"
                globalConfigKey="color"
                squareMargin={marginSize ? parseInt(marginSize) : 0}
                allowedColors={Object.values(colors).slice(0, numColors)}
            />
        </div>
    );
}
