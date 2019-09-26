// @flow
import React from 'react';
import {storiesOf} from '@storybook/react';
import Box from '../src/ui/box';
import Text from '../src/ui/text';
import theme from '../src/ui/theme/default_theme';

const stories = storiesOf('Text/size', module);

stories.add('default sizes', () => (
    <>
        {Object.keys(theme.textSizesByVariant.default).map(textSize => (
            <Text key={textSize} size={textSize}>
                The brown fox jumped over the lazy dog
            </Text>
        ))}
    </>
));

stories.add('paragraph sizes', () => (
    <>
        {Object.keys(theme.textSizesByVariant.paragraph).map(textSize => (
            <Box key={textSize} marginBottom="40px">
                <Text variant="paragraph" size={textSize} maxWidth="40em">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </Text>
                <Text variant="paragraph" size={textSize} maxWidth="40em" marginBottom={0}>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                </Text>
            </Box>
        ))}
    </>
));

stories.add('responsive size', () => (
    <>
        Breakpoints: <pre>{JSON.stringify(theme.breakpoints, null, 4)}</pre>
        <Text
            size={{
                xsmallViewport: 'xsmall',
                smallViewport: 'small',
                mediumViewport: 'default',
                largeViewport: 'large',
            }}
            marginTop={2}
            padding={2}
        >
            Resize to see size change
        </Text>
    </>
));
