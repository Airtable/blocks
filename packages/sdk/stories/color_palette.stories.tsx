import React, {useState} from 'react';
import {storiesOf} from '@storybook/react';
import ColorPalette, {colorPaletteStylePropTypes} from '../src/ui/color_palette';
import Example from './helpers/example';
import colors from '../src/colors';
import {createJsxPropsStringFromValuesMap, CONTROL_WIDTH} from './helpers/code_utils';

const stories = storiesOf('ColorPalette', module);

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
    styleProps: Object.keys(colorPaletteStylePropTypes),
} as const;

function ColorPaletteExample() {
    return (
        <Example
            {...sharedColorPaletteExampleProps}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values, {
                    squareMargin: margin => {
                        if (margin === '4px') return null; // default value
                        return typeof margin === 'string' ? parseInt(margin) : null;
                    },
                });

                return `
                    import React, {useState} from 'react';
                    import {ColorPalette, colors} from '@airtable/blocks/ui';

                    const allowedColors = [colors.BLUE, colors.BLUE_BRIGHT, colors.BLUE_DARK_1, colors.BLUE_LIGHT_1, colors. BLUE_LIGHT_2];

                    const ColorPaletteExample = () => {
                        const [color, setColor] = useState(allowedColors[0]);

                        return <ColorPalette color={color} onChange={newColor => setColor(newColor)} allowedColors={allowedColors} ${props} width="150px"/>;
                    };
                `;
            }}
        >
            {({squareMargin, ...values}) => {
                const allowedColors = [
                    colors.BLUE,
                    colors.BLUE_BRIGHT,
                    colors.BLUE_DARK_1,
                    colors.BLUE_LIGHT_1,
                    colors.BLUE_LIGHT_2,
                ];
                const [color, setColor] = useState<string>(allowedColors[0]);
                const squareMarginNumericValue =
                    typeof squareMargin === 'string' ? parseInt(squareMargin) : undefined;

                return (
                    <ColorPalette
                        color={color}
                        allowedColors={allowedColors}
                        onChange={color => setColor(color as string)}
                        squareMargin={squareMarginNumericValue}
                        {...values}
                        width="150px"
                    />
                );
            }}
        </Example>
    );
}

stories.add('example', () => <ColorPaletteExample />);

function ColorPaletteSyncedExample() {
    return (
        <Example
            {...sharedColorPaletteExampleProps}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values, {
                    squareMargin: margin => {
                        if (margin === '4px') return null; // default value
                        return typeof margin === 'string' ? parseInt(margin) : null;
                    },
                });

                return `
                    import React from 'react';
                    import {ColorPaletteSynced, colors} from '@airtable/blocks/ui';

                    const allowedColors = [colors.BLUE, colors.BLUE_BRIGHT, colors.BLUE_DARK_1, colors.BLUE_LIGHT_1, colors. BLUE_LIGHT_2];

                    const ColorPaletteSyncedExample = () => (
                        <ColorPaletteSynced globalConfigKey="selectedColor" allowedColors={allowedColors} ${props} width="150px"/>
                    );
                `;
            }}
        >
            {({squareMargin, ...values}) => {
                const allowedColors = [
                    colors.BLUE,
                    colors.BLUE_BRIGHT,
                    colors.BLUE_DARK_1,
                    colors.BLUE_LIGHT_1,
                    colors.BLUE_LIGHT_2,
                ];
                const [color, setColor] = useState<string>(allowedColors[0]);
                const squareMarginNumericValue =
                    typeof squareMargin === 'string' ? parseInt(squareMargin) : undefined;

                return (
                    <ColorPalette
                        color={color}
                        allowedColors={allowedColors}
                        onChange={color => setColor(color as string)}
                        squareMargin={squareMarginNumericValue}
                        {...values}
                        width="150px"
                    />
                );
            }}
        </Example>
    );
}

stories.add('synced example', () => <ColorPaletteSyncedExample />);
