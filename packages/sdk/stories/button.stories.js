// @flow
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import Button from '../src/ui/button';

const stories = storiesOf('Button', module);

stories.add('default', () => <Button onClick={action('clicked')}>Default</Button>);

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

Object.keys(Button.themes).forEach(key => {
    const theme = Button.themes[key];

    stories.add(theme, () => (
        <Button theme={theme} onClick={action('clicked')}>
            {theme}
        </Button>
    ));
});
