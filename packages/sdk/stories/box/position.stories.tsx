import React from 'react';
import Box, {BoxProps} from '../../src/base/ui/box';
import theme from '../../src/base/ui/theme/default_theme';

export default {
    component: Box,
};

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

export const TopScale = {
    render: () => (
        <React.Fragment>
            <Frame>
                {theme.space.map((spaceOption, i) => (
                    <RedCube key={spaceOption} left={i} top={px(100 * i)} />
                ))}
            </Frame>
        </React.Fragment>
    ),
};

export const BottomScale = {
    render: () => (
        <React.Fragment>
            <Frame>
                {theme.space.map((spaceOption, i) => (
                    <RedCube key={spaceOption} bottom={i} left={px(100 * i)} />
                ))}
            </Frame>
        </React.Fragment>
    ),
};

export const LeftScale = {
    render: () => (
        <React.Fragment>
            <Frame>
                {theme.space.map((spaceOption, i) => (
                    <RedCube key={spaceOption} left={i} bottom={px(100 * i)} />
                ))}
            </Frame>
        </React.Fragment>
    ),
};

export const RightScale = {
    render: () => (
        <React.Fragment>
            <Frame>
                {theme.space.map((spaceOption, i) => (
                    <RedCube key={spaceOption} right={i} bottom={px(100 * i)} />
                ))}
            </Frame>
        </React.Fragment>
    ),
};

export const Position = {
    render: () => (
        <React.Fragment>
            <Box position="fixed" border="default" top={5} left={5}>
                fixed
            </Box>
        </React.Fragment>
    ),
};

export const ZIndex = {
    render: () => (
        <React.Fragment>
            <Box position="fixed" border="default" zIndex={1}>
                zIndex
            </Box>
        </React.Fragment>
    ),
};
