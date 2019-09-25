// @flow
import React from 'react';
import {storiesOf} from '@storybook/react';
import Heading from '../src/ui/heading';

const stories = storiesOf('Heading', module);

stories.add('as', () => (
    <>
        {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(as => (
            <Heading key={as} as={as}>
                {as}
            </Heading>
        ))}
    </>
));

stories.add('ref', () => (
    <>
        <Heading
            ref={node => {
                // eslint-disable-next-line no-console
                console.log(node);
            }}
        >
            Look into your console to see the ref
        </Heading>
    </>
));

stories.add('custom className', () => (
    <>
        <Heading className="user-provided-class">Inspect element to see class name</Heading>
    </>
));

stories.add('id attribute', () => (
    <>
        <Heading id="my-id">Inspect element to see id</Heading>
    </>
));

stories.add('style attribute', () => (
    <>
        <Heading
            style={{
                transform: 'scale(0.95)',
            }}
        >
            Inspect element to see style attribute
        </Heading>
    </>
));

stories.add('data attributes', () => (
    <>
        <Heading
            dataAttributes={{
                'data-something': true,
                'data-other': 'string value',
            }}
        >
            Inspect element to see data attributes
        </Heading>
    </>
));

stories.add('role attribute', () => (
    <>
        <Heading role="nav">Inspect element to see role attribute</Heading>
    </>
));

stories.add('aria attributes', () => (
    <>
        <Heading
            aria-label="__label__"
            aria-labelledby="__id__"
            aria-describedby="__id__"
            aria-controls="__id__"
            aria-expanded={false}
            aria-haspopup={false}
            aria-hidden={false}
            aria-live={false}
        >
            Inspect element to see aria attributes
        </Heading>
    </>
));
