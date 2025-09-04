import React from 'react';
import Text from '../src/base/ui/text';
import theme from '../src/base/ui/theme/default_theme';
import {keys} from '../src/shared/private_utils';
import Example from './helpers/example';
import {createJsxPropsStringFromValuesMap} from './helpers/code_utils';

export default {
    component: Text,
};

const childrenForVariant = {
    default: 'The brown fox jumped over the lazy dog',
    paragraph:
        'Consectetur accusamus accusamus repudiandae est eveniet. Doloribus eligendi et recusandae voluptatem recusandae. Nostrum vitae minus atque blanditiis aliquid voluptate sint.',
} as const;

function TextExample() {
    return (
        <Example
            options={{
                variant: {
                    type: 'selectButtons',
                    label: 'Variant',
                    options: keys(theme.textStyles),
                },
                size: {
                    type: 'select',
                    label: 'Size',
                    options: keys(theme.textStyles.default),
                },
                textColor: {
                    type: 'selectButtons',
                    label: 'Text color',
                    options: ['default', 'light'],
                },
            }}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap({
                    ...values,
                    maxWidth: values.variant === 'paragraph' ? '30em' : null,
                });

                return `
                    import {Text} from '@airtable/blocks/base/ui';

                    const textExample = (
                        <Text ${props}>${childrenForVariant[values.variant]}</Text>
                    );
                `;
            }}
        >
            {values => (
                <Text {...values} maxWidth={values.variant === 'paragraph' ? '30em' : null}>
                    {childrenForVariant[values.variant]}
                </Text>
            )}
        </Example>
    );
}

export const _Example = {
    render: () => <TextExample />,
};

export const As = {
    render: () => (
        <React.Fragment>
            {[
                'p' as const,
                'h1' as const,
                'h2' as const,
                'h3' as const,
                'h4' as const,
                'h5' as const,
                'h6' as const,
                'span' as const,
                'li' as const,
                'em' as const,
                'strong' as const,
                'kbd' as const,
                'mark' as const,
                'q' as const,
                's' as const,
                'samp' as const,
                'small' as const,
                'sub' as const,
                'sup' as const,
                'time' as const,
                'var' as const,
                'blockquote' as const,
            ].map(as => (
                <Text key={as} as={as}>
                    {as}
                </Text>
            ))}
        </React.Fragment>
    ),
};

export const TextColor = {
    render: () => (
        <React.Fragment>
            <Text textColor="light">(light) The brown fox jumped over the lazy dog</Text>
            <Text>(default = dark) The brown fox jumped over the lazy dog</Text>
        </React.Fragment>
    ),
};

export const Ref = {
    render: () => (
        <React.Fragment>
            <Text
                ref={node => {
                    // eslint-disable-next-line no-console
                    console.log(node);
                }}
            >
                Look into your console to see the ref
            </Text>
        </React.Fragment>
    ),
};

export const CustomClassName = {
    render: () => (
        <React.Fragment>
            <Text className="user-provided-class">Inspect element to see class name</Text>
        </React.Fragment>
    ),
};

export const IdAttribute = {
    render: () => (
        <React.Fragment>
            <Text id="my-id">Inspect element to see id</Text>
        </React.Fragment>
    ),
};

export const StyleAttribute = {
    render: () => (
        <React.Fragment>
            <Text
                style={{
                    transform: 'scale(0.95)',
                }}
            >
                Inspect element to see style attribute
            </Text>
        </React.Fragment>
    ),
};

export const DataAttributes = {
    render: () => (
        <React.Fragment>
            <Text
                dataAttributes={{
                    'data-something': true,
                    'data-other': 'string value',
                }}
            >
                Inspect element to see data attributes
            </Text>
        </React.Fragment>
    ),
};

export const RoleAttribute = {
    render: () => (
        <React.Fragment>
            <Text role="nav">Inspect element to see role attribute</Text>
        </React.Fragment>
    ),
};

export const AriaAttributes = {
    render: () => (
        <React.Fragment>
            <Text
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
            </Text>
        </React.Fragment>
    ),
};
