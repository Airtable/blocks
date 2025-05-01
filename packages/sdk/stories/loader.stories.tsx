/* eslint-disable no-console */
// @flow
import React from 'react';
import Loader, {loaderStylePropTypes} from '../src/base/ui/loader';
import {createJsxPropsStringFromValuesMap} from './helpers/code_utils';
import Example from './helpers/example';

export default {
    component: Loader,
};

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
                    import {Loader} from '@airtable/blocks/base/ui';

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

export const _Example = {
    render: () => <LoaderExample />,
};
