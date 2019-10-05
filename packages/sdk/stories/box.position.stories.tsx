import React from 'react';
import {storiesOf} from '@storybook/react';
import Box, {BoxProps} from '../src/ui/box';
import theme from '../src/ui/theme/default_theme/';

const stories = storiesOf('Box/position', module);

const Frame = (props: BoxProps) => (
    <Box position="relative" border="default" height="900px" {...props} />
);

const RedCube = (props: BoxProps) => (
    <Box width={60} height={60} position="absolute" backgroundColor="red" {...props} />
);

// eslint-disable-next-line jsdoc/require-jsdoc
function px(n: number): string {
    return `${n}px`;
}

stories.add('top scale', () => (
    <>
        <Frame>
            {theme.space.map((spaceOption, i) => (
                <RedCube key={spaceOption} left={i} top={px(100 * i)} />
            ))}
        </Frame>
    </>
));

stories.add('bottom scale', () => (
    <>
        <Frame>
            {theme.space.map((spaceOption, i) => (
                <RedCube key={spaceOption} bottom={i} left={px(100 * i)} />
            ))}
        </Frame>
    </>
));

stories.add('left scale', () => (
    <>
        <Frame>
            {theme.space.map((spaceOption, i) => (
                <RedCube key={spaceOption} left={i} bottom={px(100 * i)} />
            ))}
        </Frame>
    </>
));

stories.add('right scale', () => (
    <>
        <Frame>
            {theme.space.map((spaceOption, i) => (
                <RedCube key={spaceOption} right={i} bottom={px(100 * i)} />
            ))}
        </Frame>
    </>
));

stories.add('position', () => (
    <>
        <Box position="fixed" border="default" top={5} left={5}>
            fixed
        </Box>
    </>
));

stories.add('zIndex', () => (
    <>
        <Box position="fixed" border="default" zIndex={1}>
            zIndex
        </Box>
    </>
));
