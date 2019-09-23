// @flow
import React from 'react';
import {storiesOf} from '@storybook/react';
import Text from '../src/ui/text';

const stories = storiesOf('Text', module);

stories.add('as', () => (
    <>
        {[
            'p',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'span',
            'li',
            'em',
            'strong',
            'kbd',
            'mark',
            'q',
            's',
            'samp',
            'small',
            'sub',
            'sup',
            'time',
            'var',
            'blockquote',
        ].map(as => (
            <Text key={as} as={as}>
                {as}
            </Text>
        ))}
    </>
));

stories.add('textColor', () => (
    <>
        <Text textColor="light">(light) The brown fox jumped over the lazy dog</Text>
        <Text>(default = dark) The brown fox jumped over the lazy dog</Text>
    </>
));

stories.add('ref', () => (
    <>
        <Text
            ref={node => {
                // eslint-disable-next-line no-console
                console.log(node);
            }}
        >
            Look into your console to see the ref
        </Text>
    </>
));

stories.add('custom className', () => (
    <>
        <Text className="user-provided-class">Inspect element to see class name</Text>
    </>
));

stories.add('id attribute', () => (
    <>
        <Text id="my-id">Inspect element to see class name</Text>
    </>
));

stories.add('style attribute', () => (
    <>
        <Text
            style={{
                transform: 'scale(0.95)',
            }}
        >
            Inspect element to see style attribute
        </Text>
    </>
));

stories.add('data attributes', () => (
    <>
        <Text
            dataAttributes={{
                'data-something': true,
                'data-other': 'string value',
            }}
        >
            Inspect element to see data attributes
        </Text>
    </>
));

stories.add('role attribute', () => (
    <>
        <Text role="nav">Inspect element to see role attribute</Text>
    </>
));

stories.add('aria attributes', () => (
    <>
        <Text
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
        </Text>
    </>
));
