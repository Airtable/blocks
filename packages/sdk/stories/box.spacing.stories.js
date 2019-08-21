// @flow
import React from 'react';
import {storiesOf} from '@storybook/react';
import Box from '../src/ui/box';
import theme from '../src/ui/theme/default_theme';

const stories = storiesOf('Box/spacing', module);

stories.add('padding spacing scale', () => (
    <>
        {theme.space.map((spaceOption, i) => (
            <>
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
            </>
        ))}
    </>
));

stories.add('margin spacing scale', () => (
    <>
        {theme.space.map((spaceOption, i) => (
            <>
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
                    <Box marginX={i}>{`<Box marginX={${i}}>marginX: ${spaceOption}px</Box>`}</Box>
                    <Box marginY={i}>{`<Box marginY={${i}}>marginY: ${spaceOption}px</Box>`}</Box>
                </Box>
            </>
        ))}
    </>
));

stories.add('negative margins', () => (
    <>
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
    </>
));

stories.add('margin px', () => (
    <>
        <Box margin="10px">{'<Box margin="10px" />'}</Box>
        <Box marginTop="10px">{'<Box marginTop="10px" />'}</Box>
        <Box marginRight="10px">{'<Box marginRight="10px" />'}</Box>
        <Box marginBottom="10px">{'<Box marginBottom="10px" />'}</Box>
        <Box marginLeft="10px">{'<Box marginLeft="10px" />'}</Box>
        <Box marginX="10px">{'<Box marginX="10px" />'}</Box>
        <Box marginY="10px">{'<Box marginY="10px" />'}</Box>
    </>
));

stories.add('margin unit types', () => (
    <>
        Non-exhaustive list of unit types
        <Box margin="10em">{'<Box margin="10em" />'}</Box>
        <Box marginTop="10vh">{'<Box marginTop="10vh" />'}</Box>
    </>
));

stories.add('margin combination behavior', () => (
    <>
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
    </>
));

stories.add('padding error when exceeding scale', () => (
    <>
        <Box padding={20} />
    </>
));

stories.add('padding error when negative number', () => (
    <>
        <Box padding={-2} />
    </>
));

stories.add('padding error with non-integer', () => (
    <>
        <Box padding={0.5} />
    </>
));

stories.add('margin error when exceeding scale', () => (
    <>
        <Box margin={20} />
    </>
));

stories.add('margin error with non-integer', () => (
    <>
        <Box margin={0.5} />
    </>
));
