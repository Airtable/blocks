import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import Box from '../src/ui/box';
import Button from '../src/ui/button';
import Tooltip from '../src/ui/tooltip';

const stories = storiesOf('Button', module);

stories.add('variants & sizes', () => (
    <>
        <Box margin={5}>
            <Button icon="edit" size="small" onClick={action('clicked')} marginRight={2}>
                Default
            </Button>
            <Button
                icon="plus"
                size="small"
                variant="primary"
                onClick={action('clicked')}
                marginRight={2}
            >
                Primary
            </Button>
            <Button
                icon="filter"
                size="small"
                variant="secondary"
                onClick={action('clicked')}
                marginRight={2}
            >
                Secondary
            </Button>
            <Button
                icon="trash"
                size="small"
                variant="danger"
                onClick={action('clicked')}
                marginRight={2}
            >
                Danger
            </Button>
        </Box>
        <Box margin={5}>
            <Button icon="edit" onClick={action('clicked')} marginRight={2}>
                Default
            </Button>
            <Button icon="plus" variant="primary" onClick={action('clicked')} marginRight={2}>
                Primary
            </Button>
            <Button icon="filter" variant="secondary" onClick={action('clicked')} marginRight={2}>
                Secondary
            </Button>
            <Button icon="trash" variant="danger" onClick={action('clicked')} marginRight={2}>
                Danger
            </Button>
        </Box>
        <Box margin={5}>
            <Button icon="edit" size="large" onClick={action('clicked')} marginRight={2}>
                Default
            </Button>
            <Button
                icon="plus"
                size="large"
                variant="primary"
                onClick={action('clicked')}
                marginRight={2}
            >
                Primary
            </Button>
            <Button
                icon="filter"
                size="large"
                variant="secondary"
                onClick={action('clicked')}
                marginRight={2}
            >
                Secondary
            </Button>
            <Button
                icon="trash"
                size="large"
                variant="danger"
                onClick={action('clicked')}
                marginRight={2}
            >
                Danger
            </Button>
        </Box>
    </>
));

stories.add('with icon', () => (
    <Button icon="upload" onClick={action('clicked')}>
        With icon
    </Button>
));

stories.add('responsive size', () => (
    <Button
        size={{xsmallViewport: 'small', mediumViewport: 'default', largeViewport: 'large'}}
        onClick={action('clicked')}
    >
        Resize the window
    </Button>
));

stories.add('disabled', () => (
    <Button disabled={true} onClick={action('clicked')}>
        Disabled
    </Button>
));

stories.add('aria-label', () => (
    <Button aria-label="Aria label" onClick={action('clicked')}>
        This should be an icon
    </Button>
));

stories.add('type="submit"', () => (
    <Button type="submit" onClick={action('clicked')}>
        Submit
    </Button>
));

stories.add('full width', () => (
    <Box padding={4}>
        <Button icon="edit" width="100%">
            Full width
        </Button>
    </Box>
));

stories.add('truncate', () => (
    <Box padding={4} maxWidth="80px">
        <Button icon="edit" width="100%">
            Full width
        </Button>
    </Box>
));

stories.add('display', () => (
    <Box padding={4}>
        {(['flex', 'inline-flex', 'none'] as const).map(display => (
            <Button key={display} display={display} margin={2}>
                {display}
            </Button>
        ))}
    </Box>
));

stories.add('ref', () => (
    <>
        <Button
            ref={node => {
                // eslint-disable-next-line no-console
                console.log(node);
            }}
        >
            Look into your console to see the ref
        </Button>
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
        <Button onClick={action('Clicked')}>Button with tooltip</Button>
    </Tooltip>
));
