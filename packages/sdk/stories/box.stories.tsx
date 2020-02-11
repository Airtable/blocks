import React from 'react';
import {storiesOf} from '@storybook/react';
import Box from '../src/ui/box';
import Text from '../src/ui/text';
import theme from '../src/ui/theme/default_theme/';
import Example from './helpers/example';
import {allStylesPropTypes} from '../src/ui/system';
import {keys} from '../src/private_utils';
import {createJsxPropsStringFromValuesMap} from './helpers/code_utils';

const stories = storiesOf('Box', module);

function BoxExample() {
    const flexCenterProps = {
        display: 'flex' as const,
        alignItems: 'center',
        justifyContent: 'center',
    };
    return (
        <Example
            options={{
                backgroundColor: {
                    type: 'select',
                    label: 'Background color',
                    options: ['white', 'lightGray1', 'lightGray2', 'lightGray3', 'lightGray4'],
                    renderLabel: v => v,
                },
                border: {
                    type: 'selectButtons',
                    label: 'Border',
                    options: ['none', ...keys(theme.borders)],
                },
                borderRadius: {
                    type: 'select',
                    label: 'Border radius',
                    options: ['none', ...keys(theme.radii)],
                },
                padding: {
                    type: 'select',
                    label: 'Padding',
                    options: theme.space.map((value, index) => index),
                    renderLabel: option => `${option} (${theme.space[option as any]}px)`,
                },
                isFlexCentered: {
                    type: 'switch',
                    label: 'Center content',
                    defaultValue: false,
                },
            }}
            styleProps={Object.keys(allStylesPropTypes)}
            renderCodeFn={({isFlexCentered, border, ...restOfValues}) => {
                const props = createJsxPropsStringFromValuesMap(restOfValues as any);
                const flexProps = isFlexCentered
                    ? createJsxPropsStringFromValuesMap(flexCenterProps)
                    : '';
                const borderProp = border !== 'none' ? `border="${border}"` : '';
                return `
                    import {Box, Text} from '@airtable/blocks/ui';

                    const boxExample = (
                        <Box
                            ${flexProps}
                            ${borderProp}
                            ${props}
                            width={200}
                            height={200}
                            overflow="hidden"
                        >
                            <Text>Content</Text>
                        </Box>
                    );
                `;
            }}
        >
            {({isFlexCentered, ...restOfValues}) => {
                return (
                    <Box
                        {...(isFlexCentered ? flexCenterProps : null)}
                        width={200}
                        height={200}
                        overflow="hidden"
                        {...restOfValues}
                        style={{boxSizing: 'border-box'}}
                    >
                        <Text>Content</Text>
                    </Box>
                );
            }}
        </Example>
    );
}

stories.add('example', () => <BoxExample />);

stories.add('display', () => (
    <React.Fragment>
        Non-exhaustive list of display options
        {[
            'inherit' as const,
            'initial' as const,
            'unset' as const,
            'block' as const,
            'inline' as const,
            'inline-block' as const,
            'flex' as const,
            'inline-flex' as const,
            'table' as const,
        ].map(display => (
            <Box key={display} display={display} border="default" padding={2} margin={2}>
                {display}
            </Box>
        ))}
    </React.Fragment>
));

stories.add('overflow', () => (
    <React.Fragment>
        Non-exhaustive options
        <Box backgroundColor="blueLight2" overflow="hidden" padding={2} margin={3}>
            overflow="hidden"
        </Box>
        <Box backgroundColor="blueLight2" overflowY="scroll" padding={2} margin={3}>
            overflowY="scroll"
        </Box>
        <Box backgroundColor="blueLight2" overflowX="scroll" padding={2} margin={3}>
            overflowX="scroll"
        </Box>
    </React.Fragment>
));

stories.add('as', () => (
    <React.Fragment>
        {[
            'div' as const,
            'span' as const,
            'section' as const,
            'main' as const,
            'nav' as const,
            'header' as const,
            'footer' as const,
            'aside' as const,
            'article' as const,
            'address' as const,
            'hgroup' as const,
            'blockquote' as const,
            'figure' as const,
            'figcaption' as const,
            'ol' as const,
            'ul' as const,
            'li' as const,
            'pre' as const,
        ].map(as => (
            <Box key={as} as={as}>
                {as}
            </Box>
        ))}
    </React.Fragment>
));

stories.add('ref', () => (
    <React.Fragment>
        <Box
            ref={(node: HTMLElement | null) => {
                // eslint-disable-next-line no-console
                console.log(node);
            }}
        >
            Look into your console to see the ref
        </Box>
    </React.Fragment>
));

stories.add('breakpoints / responsive properties', () => (
    <React.Fragment>
        Breakpoints: <pre>{JSON.stringify(theme.breakpoints, null, 4)}</pre>
        <Box
            backgroundColor={{
                xsmallViewport: 'redLight2',
                smallViewport: 'blueLight2',
                mediumViewport: 'greenLight2',
                largeViewport: 'pinkLight2',
            }}
            marginTop={2}
            padding={2}
        >
            Resize to see color change
        </Box>
    </React.Fragment>
));

stories.add('custom className', () => (
    <React.Fragment>
        <Box className="user-provided-class">Inspect element to see class name</Box>
    </React.Fragment>
));

stories.add('id attribute', () => (
    <React.Fragment>
        <Box id="my-id">Inspect element to see class name</Box>
    </React.Fragment>
));

stories.add('tabindex attribute', () => (
    <React.Fragment>
        <Box tabIndex={-1}>Inspect element to see tabindex</Box>
    </React.Fragment>
));

stories.add('style attribute', () => (
    <React.Fragment>
        <Box
            style={{
                transform: 'scale(0.95)',
            }}
        >
            Inspect element to see style attribute
        </Box>
    </React.Fragment>
));

stories.add('data attributes', () => (
    <React.Fragment>
        <Box
            dataAttributes={{
                'data-something': true,
                'data-other': 'string value',
            }}
        >
            Inspect element to see data attributes
        </Box>
    </React.Fragment>
));

stories.add('role attribute', () => (
    <React.Fragment>
        <Box role="nav">Inspect element to see rol attribute</Box>
    </React.Fragment>
));

stories.add('aria attributes', () => (
    <React.Fragment>
        <Box
            aria-label="__label__"
            aria-labelledby="__id__"
            aria-describedby="__id__"
            aria-controls="__id__"
            aria-expanded={false}
            aria-haspopup={false}
            aria-hidden={false}
            aria-live="off"
        >
            Inspect element to see aria attributes
        </Box>
    </React.Fragment>
));
