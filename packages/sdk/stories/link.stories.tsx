import React from 'react';
import {storiesOf} from '@storybook/react';
import {values, keys} from '../src/private_utils';
import Box from '../src/ui/box';
import {iconNames} from '../src/ui/icon_config';
import Link, {linkStylePropTypes} from '../src/ui/link';
import Text from '../src/ui/text';
import Tooltip from '../src/ui/tooltip';
import useTheme from '../src/ui/theme/use_theme';
import Example from './helpers/example';
import {createJsxPropsStringFromValuesMap, createJsxComponentString} from './helpers/code_utils';

const stories = storiesOf('Link', module);

function LinkExample() {
    const {linkVariants, textStyles} = useTheme();
    return (
        <Example
            options={{
                variant: {
                    type: 'select',
                    label: 'Variant',
                    options: keys(linkVariants),
                },
                size: {
                    type: 'select',
                    label: 'Size',
                    options: keys(textStyles.default),
                },
                disabled: {
                    type: 'switch',
                    label: 'Disabled',
                    defaultValue: false,
                },
                icon: {
                    type: 'switch',
                    label: 'Show icon',
                    defaultValue: true,
                },
                hasLabel: {
                    type: 'switch',
                    label: 'Show label',
                    defaultValue: true,
                },
            }}
            styleProps={Object.keys(linkStylePropTypes)}
            renderCodeFn={({hasLabel, ...restOfValues}) => {
                const props = createJsxPropsStringFromValuesMap(restOfValues as any, {
                    icon: value => (value ? 'home' : null),
                });

                const ariaLabel = hasLabel ? '' : 'aria-label="Go to homepage"';
                const ariaLabelComment = hasLabel
                    ? ''
                    : '// Make sure to add an "aria-label" prop when only using an icon.';

                const children = hasLabel ? 'Link' : null;

                const buttonComponentString = createJsxComponentString(
                    'Link',
                    [
                        'href="https://airtable.com/developers/blocks"',
                        'target="_blank"',
                        props,
                        ariaLabel,
                    ],
                    children,
                );

                return `
                    import {Link} from '@airtable/blocks/ui';
                    
                    ${ariaLabelComment}
                    const linkExample = (
                        ${buttonComponentString}
                    );
                `;
            }}
        >
            {({icon, hasLabel, ...restOfValues}) => (
                <Link
                    href="https://airtable.com/developers/blocks"
                    target="_blank"
                    {...restOfValues}
                    icon={icon ? 'home' : undefined}
                    aria-label={hasLabel ? undefined : 'Go to homepage'}
                >
                    {hasLabel ? 'Link' : null}
                </Link>
            )}
        </Example>
    );
}

stories.add('example', () => <LinkExample />);

stories.add('variants', () => (
    <React.Fragment>
        <Link href="#" margin={3}>
            Default
        </Link>
        <Link href="#" variant="dark" margin={3}>
            Dark
        </Link>
        <Link href="#" variant="light" margin={3}>
            Light
        </Link>
    </React.Fragment>
));

stories.add('inside of text', () => (
    <Text size="large" margin={5}>
        Some text with a{' '}
        <Link href="#" size="large">
            link
        </Link>
    </Text>
));

stories.add('inside of paragraph', () => (
    <Text variant="paragraph" margin={5} maxWidth="40em">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco{' '}
        <Link href="#">laboris nisi ut aliquip</Link> ex ea commodo consequat. Duis aute irure dolor
        in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
        sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum. <Link href="#">mollit anim id est laborum</Link>
    </Text>
));

stories.add('inside of paragraph with underline', () => (
    <Text variant="paragraph" margin={5} maxWidth="40em">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco{' '}
        <Link href="#" underline={true}>
            laboris nisi ut aliquip
        </Link>{' '}
        ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
        in culpa qui officia deserunt mollit anim id est laborum.{' '}
        <Link href="#" underline={true}>
            mollit anim id est laborum
        </Link>
    </Text>
));

stories.add('with icon', () => (
    <Box margin={5}>
        <Link href="#" icon="multicollaborator">
            Community forum
        </Link>
    </Box>
));

stories.add('with all icons', () => (
    <Box>
        {values(iconNames).map(iconName => (
            <Box key={iconName}>
                <Link href="#" icon={iconName} padding={1} margin={1} onClick={() => {}}>
                    {iconName.substr(0, 1).toUpperCase()}
                    {iconName.substr(1)}
                </Link>
            </Box>
        ))}
    </Box>
));

stories.add('responsive size with icon', () => (
    <Link
        href="#"
        icon="cube"
        size={{
            xsmallViewport: 'small',
            smallViewport: 'small',
            mediumViewport: 'default',
            largeViewport: 'large',
        }}
    >
        Responsive text button
    </Link>
));

stories.add('flex', () => (
    <Text size="large" margin={5}>
        <Link href="#" display="flex" icon="upload" size="large">
            Link
        </Link>
    </Text>
));

stories.add('fontWeight', () => (
    <Text size="large" margin={5}>
        <Link fontWeight="strong" href="#" icon="upload" size="large">
            Strong link
        </Link>
    </Text>
));

stories.add('custom icon', () => (
    <Text size="large" margin={5}>
        <Link
            href="#"
            icon={
                <svg
                    viewBox="0 0 24 24"
                    preserveAspectRatio="xMidYMid meet"
                    style={{flex: 'none', width: '1em', height: '1em', marginRight: '0.5em'}}
                >
                    <path
                        fill="currentColor"
                        d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"
                    ></path>
                </svg>
            }
            size="large"
            paddingX={1}
            marginX={-1}
        >
            Custom icon
        </Link>
    </Text>
));

stories.add('wrapping an image', () => (
    <Link href="#">
        <img
            src="https://airtable.com/images/home/shapes_collaboration.png"
            alt="shapes"
            width="300px"
            style={{display: 'block'}}
        />
    </Link>
));

stories.add('with tooltip', () => (
    <Tooltip
        content="Tooltip content"
        placementX={Tooltip.placements.CENTER}
        placementY={Tooltip.placements.BOTTOM}
        placementOffsetX={0}
        placementOffsetY={8}
    >
        <Link href="#">Link with tooltip</Link>
    </Tooltip>
));
