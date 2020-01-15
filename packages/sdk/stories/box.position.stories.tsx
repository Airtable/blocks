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
    <React.Fragment>
        <Frame>
            {theme.space.map((spaceOption, i) => (
                <RedCube key={spaceOption} left={i} top={px(100 * i)} />
            ))}
        </Frame>
    </React.Fragment>
));

stories.add('bottom scale', () => (
    <React.Fragment>
        <Frame>
            {theme.space.map((spaceOption, i) => (
                <RedCube key={spaceOption} bottom={i} left={px(100 * i)} />
            ))}
        </Frame>
    </React.Fragment>
));

stories.add('left scale', () => (
    <React.Fragment>
        <Frame>
            {theme.space.map((spaceOption, i) => (
                <RedCube key={spaceOption} left={i} bottom={px(100 * i)} />
            ))}
        </Frame>
    </React.Fragment>
));

stories.add('right scale', () => (
    <React.Fragment>
        <Frame>
            {theme.space.map((spaceOption, i) => (
                <RedCube key={spaceOption} right={i} bottom={px(100 * i)} />
            ))}
        </Frame>
    </React.Fragment>
));

stories.add('position', () => (
    <React.Fragment>
        <Box position="fixed" border="default" top={5} left={5}>
            fixed
        </Box>
    </React.Fragment>
));

stories.add('zIndex', () => (
    <React.Fragment>
        <Box position="fixed" border="default" zIndex={1}>
            zIndex
        </Box>
    </React.Fragment>
));
