import React from 'react';
import Box from '../../src/base/ui/box';
import theme from '../../src/base/ui/theme/default_theme';

export default {
    component: Box,
};

export const PaddingSpacingScale = {
    render: () => (
        <React.Fragment>
            {theme.space.map((spaceOption, i) => (
                <React.Fragment key={spaceOption}>
                    <Box paddingY={4}>
                        <Box>space: {i}</Box>
                        <Box
                            border="default"
                            padding={i}
                        >{`<Box padding={${i}}>padding: ${spaceOption}px</Box>`}</Box>
                        <Box
                            border="default"
                            paddingTop={i}
                        >{`<Box paddingTop={${i}}>paddingTop: ${spaceOption}px</Box>`}</Box>
                        <Box
                            border="default"
                            paddingRight={i}
                        >{`<Box paddingRight={${i}}>paddingRight: ${spaceOption}px</Box>`}</Box>
                        <Box
                            border="default"
                            paddingBottom={i}
                        >{`<Box paddingBottom={${i}}>paddingBottom: ${spaceOption}px</Box>`}</Box>
                        <Box
                            border="default"
                            paddingLeft={i}
                        >{`<Box paddingLeft={${i}}>paddingLeft: ${spaceOption}px</Box>`}</Box>
                        <Box
                            border="default"
                            paddingX={i}
                        >{`<Box paddingX={${i}}>paddingX: ${spaceOption}px</Box>`}</Box>
                        <Box
                            border="default"
                            paddingY={i}
                        >{`<Box paddingY={${i}}>paddingY: ${spaceOption}px</Box>`}</Box>
                    </Box>
                </React.Fragment>
            ))}
        </React.Fragment>
    ),
};

export const MarginSpacingScale = {
    render: () => (
        <React.Fragment>
            {theme.space.map((spaceOption, i) => (
                <React.Fragment key={spaceOption}>
                    <Box marginY={4}>
                        <Box>space: {i}</Box>
                        <Box margin={i}>{`<Box margin={${i}}>margin: ${spaceOption}px</Box>`}</Box>
                        <Box
                            marginTop={i}
                        >{`<Box marginTop={${i}}>marginTop: ${spaceOption}px</Box>`}</Box>
                        <Box
                            marginRight={i}
                        >{`<Box marginRight={${i}}>marginRight: ${spaceOption}px</Box>`}</Box>
                        <Box
                            marginBottom={i}
                        >{`<Box marginBottom={${i}}>marginBottom: ${spaceOption}px</Box>`}</Box>
                        <Box
                            marginLeft={i}
                        >{`<Box marginLeft={${i}}>marginLeft: ${spaceOption}px</Box>`}</Box>
                        <Box
                            marginX={i}
                        >{`<Box marginX={${i}}>marginX: ${spaceOption}px</Box>`}</Box>
                        <Box
                            marginY={i}
                        >{`<Box marginY={${i}}>marginY: ${spaceOption}px</Box>`}</Box>
                    </Box>
                </React.Fragment>
            ))}
        </React.Fragment>
    ),
};

export const NegativeMargins = {
    render: () => (
        <React.Fragment>
            <Box marginRight={-5}>Negative margins work on the scale:</Box>
            <Box position="relative">
                {theme.space.map((spaceOption, index) => (
                    <Box
                        key={spaceOption}
                        position="absolute"
                        left={6}
                        top={`${index * 15}px`}
                        marginLeft={-index}
                    >
                        -{index}
                    </Box>
                ))}
            </Box>
        </React.Fragment>
    ),
};

export const MarginPx = {
    render: () => (
        <React.Fragment>
            <Box margin="10px">{'<Box margin="10px" />'}</Box>
            <Box marginTop="10px">{'<Box marginTop="10px" />'}</Box>
            <Box marginRight="10px">{'<Box marginRight="10px" />'}</Box>
            <Box marginBottom="10px">{'<Box marginBottom="10px" />'}</Box>
            <Box marginLeft="10px">{'<Box marginLeft="10px" />'}</Box>
            <Box marginX="10px">{'<Box marginX="10px" />'}</Box>
            <Box marginY="10px">{'<Box marginY="10px" />'}</Box>
        </React.Fragment>
    ),
};

export const MarginUnitTypes = {
    render: () => (
        <React.Fragment>
            Non-exhaustive list of unit types
            <Box margin="10em">{'<Box margin="10em" />'}</Box>
            <Box marginTop="10vh">{'<Box marginTop="10vh" />'}</Box>
        </React.Fragment>
    ),
};

export const MarginCombinationBehavior = {
    render: () => (
        <React.Fragment>
            <Box
                margin="1px"
                marginTop="2px"
                marginRight="3px"
                marginBottom="4px"
                marginLeft="5px"
                marginX="6px"
                marginY="7px"
            >
                all margin options
            </Box>
            <Box margin="1px" marginTop="10px">
                margin: 1px + marginTop: 10px = `margin: 10px 1px 1px 1px;`
            </Box>
            <Box marginTop="10px" margin="1px">
                marginTop: 10px + margin: 1px = `margin: 1px`
            </Box>
            <Box margin="1px" marginY="5px" marginTop="10px">
                margin: 1px + marginY: 5px + marginTop: 10px = `margin: 10px 1px 5px 1px;`
            </Box>
            <Box margin="1px" marginTop="10px" marginY="5px">
                margin: 1px + marginTop: 10px + marginY: 5px = `margin: 5px 1px 1px;`
            </Box>
        </React.Fragment>
    ),
};

export const PaddingErrorWhenExceedingScale = {
    render: () => (
        <React.Fragment>
            <Box padding={20} />
        </React.Fragment>
    ),
};

export const PaddingErrorWhenNegativeNumber = {
    render: () => (
        <React.Fragment>
            <Box padding={-2} />
        </React.Fragment>
    ),
};

export const PaddingErrorWithNonInteger = {
    render: () => (
        <React.Fragment>
            <Box padding={0.5} />
        </React.Fragment>
    ),
};

export const MarginErrorWhenExceedingScale = {
    render: () => (
        <React.Fragment>
            <Box margin={20} />
        </React.Fragment>
    ),
};

export const MarginErrorWithNonInteger = {
    render: () => (
        <React.Fragment>
            <Box margin={0.5} />
        </React.Fragment>
    ),
};
