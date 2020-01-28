import React from 'react';
import {storiesOf} from '@storybook/react';
import Box from '../src/ui/box';
import theme from '../src/ui/theme/default_theme';
import {keys} from '../src/private_utils';

const stories = storiesOf('Box/appearance', module);

stories.add('backgroundColor', () => (
    <React.Fragment>
        {Object.keys(theme.colors).map(colorKey => (
            <Box key={colorKey} backgroundColor={colorKey} padding={2}>
                {colorKey}
            </Box>
        ))}
    </React.Fragment>
));

stories.add('borderRadius', () => (
    <React.Fragment>
        Themed border radius
        {Object.keys(theme.radii).map(radiusKey => (
            <Box
                key={radiusKey}
                borderRadius={radiusKey}
                padding={3}
                margin={2}
                backgroundColor="redLight2"
            >
                {radiusKey}
            </Box>
        ))}
        <Box borderRadius="10px" backgroundColor="blueLight2" padding={3} margin={2}>
            Custom border radius
        </Box>
    </React.Fragment>
));

stories.add('border', () => (
    <React.Fragment>
        {Object.keys(theme.borders).map(borderKey => (
            <Box key={borderKey} border={borderKey} padding={3} margin={2}>
                {borderKey}
            </Box>
        ))}
        <Box borderBottom="thick" padding={3} margin={2}>
            Single side
        </Box>
        <Box borderBottom="thick" borderColor="darken4" padding={3} margin={2}>
            Custom color
        </Box>
    </React.Fragment>
));

stories.add('boxShadow', () => (
    <React.Fragment>
        <Box boxShadow="0 4px 12px rgba(0,0,0,0.8)" padding={3} margin={2}>
            Custom box shadow
        </Box>
    </React.Fragment>
));

stories.add('opacity', () => (
    <React.Fragment>
        <Box backgroundColor="black" overflow="hidden">
            {keys(theme.opacities).map(opacityKey => (
                <Box
                    key={opacityKey}
                    opacity={opacityKey}
                    backgroundColor="white"
                    padding={2}
                    margin={3}
                >
                    {opacityKey}: {theme.opacities[opacityKey]}
                </Box>
            ))}
        </Box>
    </React.Fragment>
));
