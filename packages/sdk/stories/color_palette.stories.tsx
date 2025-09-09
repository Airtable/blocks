import React, {useState} from 'react';
import ColorPalette from '../src/base/ui/color_palette';
import colors from '../src/shared/colors';
import Example from './helpers/example';
import {createJsxPropsStringFromValuesMap} from './helpers/code_utils';

export default {
    component: ColorPalette,
};

const squareMarginOptions: Array<string> = ['2px', '4px', '8px'];

const sharedColorPaletteExampleProps = {
    options: {
        squareMargin: {
            type: 'selectButtons',
            label: 'Square margin',
            options: squareMarginOptions,
            defaultValue: '4px',
        },
        disabled: {
            type: 'switch',
            label: 'Disabled',
            defaultValue: false,
        },
    },
    styleProps: [] as string[],
} as const;

function ColorPaletteExample() {
    const allowedColors = [
        colors.BLUE,
        colors.BLUE_BRIGHT,
        colors.BLUE_DARK_1,
        colors.BLUE_LIGHT_1,
        colors.BLUE_LIGHT_2,
    ];
    const [color, setColor] = useState<string>(allowedColors[0]);

    return (
        <Example
            {...sharedColorPaletteExampleProps}
            renderCodeFn={(values) => {
                const props = createJsxPropsStringFromValuesMap(values, {
                    squareMargin: (margin) => {
                        if (margin === '4px') {
                            return null;
                        }
                        return typeof margin === 'string' ? parseInt(margin, 10) : null;
                    },
                });

                return `
                    import React, {useState} from 'react';
                    import {ColorPalette, colors} from '@airtable/blocks/base/ui';

                    const allowedColors = [colors.BLUE, colors.BLUE_BRIGHT, colors.BLUE_DARK_1, colors.BLUE_LIGHT_1, colors. BLUE_LIGHT_2];

                    const ColorPaletteExample = () => {
                        const [color, setColor] = useState(allowedColors[0]);

                        return <ColorPalette color={color} onChange={newColor => setColor(newColor)} allowedColors={allowedColors} ${props} width="150px"/>;
                    };
                `;
            }}
        >
            {({squareMargin, ...values}) => {
                const squareMarginNumericValue =
                    typeof squareMargin === 'string' ? parseInt(squareMargin, 10) : undefined;
                return (
                    <ColorPalette
                        color={color}
                        allowedColors={allowedColors}
                        onChange={(newColor) => setColor(newColor as string)}
                        squareMargin={squareMarginNumericValue}
                        {...values}
                        width="150px"
                    />
                );
            }}
        </Example>
    );
}

export const _Example = {
    render: () => <ColorPaletteExample />,
};

function ColorPaletteSyncedExample() {
    const allowedColors = [
        colors.BLUE,
        colors.BLUE_BRIGHT,
        colors.BLUE_DARK_1,
        colors.BLUE_LIGHT_1,
        colors.BLUE_LIGHT_2,
    ];
    const [color, setColor] = useState<string>(allowedColors[0]);
    return (
        <Example
            {...sharedColorPaletteExampleProps}
            renderCodeFn={(values) => {
                const props = createJsxPropsStringFromValuesMap(values, {
                    squareMargin: (margin) => {
                        if (margin === '4px') {
                            return null;
                        }
                        return typeof margin === 'string' ? parseInt(margin, 10) : null;
                    },
                });

                return `
                    import React from 'react';
                    import {ColorPaletteSynced, colors} from '@airtable/blocks/base/ui';

                    const allowedColors = [colors.BLUE, colors.BLUE_BRIGHT, colors.BLUE_DARK_1, colors.BLUE_LIGHT_1, colors. BLUE_LIGHT_2];

                    const ColorPaletteSyncedExample = () => (
                        <ColorPaletteSynced globalConfigKey="selectedColor" allowedColors={allowedColors} ${props} width="150px"/>
                    );
                `;
            }}
        >
            {({squareMargin, ...values}) => {
                const squareMarginNumericValue =
                    typeof squareMargin === 'string' ? parseInt(squareMargin, 10) : undefined;

                return (
                    <ColorPalette
                        color={color}
                        allowedColors={allowedColors}
                        onChange={(newColor) => setColor(newColor as string)}
                        squareMargin={squareMarginNumericValue}
                        {...values}
                        width="150px"
                    />
                );
            }}
        </Example>
    );
}

export const SyncedExample = {
    render: () => <ColorPaletteSyncedExample />,
};
