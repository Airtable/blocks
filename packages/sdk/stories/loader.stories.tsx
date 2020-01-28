/* eslint-disable no-console */
// @flow
import React from 'react';
import {storiesOf} from '@storybook/react';
import Loader, {loaderStylePropTypes} from '../src/ui/loader';
import Example from './helpers/example';
import {createJsxPropsStringFromValuesMap} from './helpers/code_utils';

const stories = storiesOf('Loader', module);

function LoaderExample() {
    return (
        <Example
            options={{
                scale: {
                    type: 'selectButtons',
                    label: 'Scale',
                    options: [0.3, 0.5],
                },
            }}
            styleProps={Object.keys(loaderStylePropTypes)}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values);

                return `
                    import {Loader} from '@airtable/blocks/ui';

                    const loaderExample = (
                        <Loader ${props} />
                    );
                `;
            }}
        >
            {values => {
                return <Loader {...values} />;
            }}
        </Example>
    );
}

stories.add('example', () => <LoaderExample />);
