// @flow
import React, {useState} from 'react';
import {ColorPalette, colors} from '@airtable/blocks/ui';

type Props = {
    shouldShowSettings: boolean,
};

export default function ColorPaletteSyncedExample(props: Props) {
    const [selectedColor, setSelectedColor] = useState(colors.BLUE);
    // eslint-disable-next-line flowtype/no-weak-types
    const allowedColors = ((Object.values(colors): any): Array<string>);

    return (
        <ColorPalette
            allowedColors={allowedColors.slice(0, 20)}
            color={selectedColor}
            onChange={setSelectedColor}
            width="100%"
            marginTop={2}
        />
    );
}
