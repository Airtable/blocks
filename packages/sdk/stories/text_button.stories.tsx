import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {values} from '../src/private_utils';
import Box from '../src/ui/box';
import {iconNames} from '../src/ui/icon_config';
import TextButton from '../src/ui/text_button';
import Text from '../src/ui/text';
import Tooltip from '../src/ui/tooltip';

const stories = storiesOf('TextButton', module);

stories.add('variants', () => (
    <>
        <TextButton onClick={action('Clicked')} margin={3}>
            Default
        </TextButton>
        <TextButton variant="dark" onClick={action('Clicked')} margin={3}>
            Dark
        </TextButton>
        <TextButton variant="light" onClick={action('Clicked')} margin={3}>
            Light
        </TextButton>
    </>
));

stories.add('sizes', () => (
    <>
        <TextButton icon="edit" size="small" onClick={action('Clicked')} margin={3}>
            Small
        </TextButton>
        <TextButton icon="edit" size="default" onClick={action('Clicked')} margin={3}>
            Default
        </TextButton>
        <TextButton icon="edit" size="large" onClick={action('Clicked')} margin={3}>
            Large
        </TextButton>
        <TextButton icon="edit" size="xlarge" onClick={action('Clicked')} margin={3}>
            Xlarge
        </TextButton>
    </>
));

stories.add('inside of text', () => (
    <>
        <Text size="large" margin={5}>
            Some text with a{' '}
            <TextButton size="large" onClick={action('Clicked')}>
                text button
            </TextButton>
        </Text>
    </>
));

stories.add('with icon', () => (
    <Box margin={5}>
        <TextButton icon="upload" padding={1} margin={1}>
            Import
        </TextButton>
        <TextButton icon="download" padding={1} margin={1}>
            Export
        </TextButton>
    </Box>
));

stories.add('with all icons', () => (
    <Box>
        {values(iconNames).map(iconName => (
            <Box key={iconName}>
                <TextButton icon={iconName} padding={1} margin={1} onClick={() => {}}>
                    {iconName.substr(0, 1).toUpperCase()}
                    {iconName.substr(1)}
                </TextButton>
            </Box>
        ))}
    </Box>
));

stories.add('disabled', () => <TextButton disabled={true}>Disabled</TextButton>);

stories.add('truncate', () => (
    <Box width="120px">
        <TextButton icon="cube">Lorem ipsum dolar set amet discitupus</TextButton>
    </Box>
));

stories.add('responsive size with icon', () => (
    <TextButton
        icon="cube"
        size={{
            xsmallViewport: 'small',
            smallViewport: 'small',
            mediumViewport: 'default',
            largeViewport: 'large',
        }}
    >
        Responsive text button
    </TextButton>
));

stories.add('flex', () => (
    <>
        <Text size="large" margin={5}>
            <TextButton display="flex" icon="upload" size="large" paddingX={1} marginX={-1}>
                Text button
            </TextButton>
        </Text>
    </>
));

stories.add('custom icon', () => (
    <>
        <Text size="large" margin={5}>
            <TextButton
                icon={
                    <svg
                        viewBox="0 0 24 24"
                        preserveAspectRatio="xMidYMid meet"
                        style={{flex: 'none', width: '1em', height: '1em'}}
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
            </TextButton>
        </Text>
    </>
));

stories.add('with tooltip', () => (
    <Tooltip
        content="Tooltip content"
        placementX={Tooltip.placements.CENTER}
        placementY={Tooltip.placements.BOTTOM}
        placementOffsetX={0}
        placementOffsetY={8}
    >
        <TextButton onClick={action('Clicked')}>Text button with tooltip</TextButton>
    </Tooltip>
));
