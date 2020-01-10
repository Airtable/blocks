import React from 'react';
import {storiesOf} from '@storybook/react';
import Heading from '../src/ui/heading';
import theme from '../src/ui/theme/default_theme';
import Example from './helpers/example';
import {createJsxPropsStringFromValuesMap, createJsxComponentString} from './helpers/code_utils';
import {keys} from '../src/private_utils';
import {allStylesPropTypes} from '../src/ui/system';
const stories = storiesOf('Heading', module);

function HeadingExample() {
    return (
        <Example
            options={{
                variant: {
                    type: 'selectButtons',
                    label: 'Variant',
                    options: keys(theme.headingStyles),
                },
                size: {
                    type: 'select',
                    label: 'Size',
                    options: keys(theme.headingStyles.default),
                },
                textColor: {
                    type: 'selectButtons',
                    label: 'Text color',
                    options: ['default', 'light'],
                },
            }}
            styleProps={Object.keys(allStylesPropTypes)}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values);
                let sizeOutOfBoundsComment;
                if (
                    values.variant === 'caps' &&
                    !theme.headingStyles.caps.hasOwnProperty(values.size)
                ) {
                    sizeOutOfBoundsComment = `// The caps variant only supports ${keys(
                        theme.headingStyles.caps,
                    ).join(', ')}. It will use the default size otherwise.`;
                } else {
                    sizeOutOfBoundsComment = '';
                }
                return `
                    import {Heading} from '@airtable/blocks/ui';
                    
                    ${sizeOutOfBoundsComment}
                    const headingExample = (
                        <Heading ${props}>The brown fox jumped over the lazy dog</Heading>
                    );
                `;
            }}
        >
            {values => <Heading {...values}>The brown fox jumped over the lazy dog</Heading>}
        </Example>
    );
}

stories.add('example', () => <HeadingExample />);

stories.add('as', () => (
    <>
        {[
            'h1' as const,
            'h2' as const,
            'h3' as const,
            'h4' as const,
            'h5' as const,
            'h6' as const,
        ].map(as => (
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
            aria-live="off"
        >
            Inspect element to see aria attributes
        </Heading>
    </>
));
