import React from 'react';
import Heading from '../src/base/ui/heading';
import Text from '../src/base/ui/text';
import theme from '../src/base/ui/theme/default_theme';
import {keys} from '../src/shared/private_utils';

export default {
    component: Heading,
    title: 'Heading/size',
};

export const DefaultSizes = {
    render: () => (
        <React.Fragment>
            {keys(theme.headingStyles.default).map(size => (
                <React.Fragment key={size}>
                    <Heading key={size} size={size} marginTop="1em">
                        The brown fox jumped over the lazy dog
                    </Heading>
                    <Text variant="paragraph" maxWidth="40em">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat.
                    </Text>
                    <Text variant="paragraph" maxWidth="40em">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                        eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                        sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </Text>
                </React.Fragment>
            ))}
        </React.Fragment>
    ),
};

export const CapsSizes = {
    render: () => (
        <React.Fragment>
            {keys(theme.headingStyles.caps).map(size => (
                <Heading key={size} size={size} variant="caps">
                    The brown fox jumped over the lazy dog
                </Heading>
            ))}
        </React.Fragment>
    ),
};

export const CapsSizeOutOfRangeDefaultFallbackAndWarning = {
    render: () => (
        <React.Fragment>
            <Heading size="large" variant="caps">
                The brown fox jumped over the lazy dog
            </Heading>
        </React.Fragment>
    ),
};

export const ResponsiveSize = {
    render: () => (
        <React.Fragment>
            Breakpoints: <pre>{JSON.stringify(theme.breakpoints, null, 4)}</pre>
            <Heading
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
            </Heading>
        </React.Fragment>
    ),
};
