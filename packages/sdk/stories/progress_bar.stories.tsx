/* eslint-disable no-console */
// @flow
import React, {useState} from 'react';
import ProgressBar, {progressBarStylePropTypes} from '../src/ui/progress_bar';
import {keys} from '../src/private_utils';
import Example from './helpers/example';
import {createJsxPropsStringFromValuesMap, CONTROL_WIDTH} from './helpers/code_utils';

export default {
    component: ProgressBar,
};

function ProgressBarExample() {
    return (
        <Example
            options={{
                progress: {
                    type: 'selectButtons',
                    label: 'Progress',
                    options: [0, 0.5, 1.0],
                    defaultValue: 0.5,
                },
            }}
            styleProps={Object.keys(progressBarStylePropTypes)}
            renderCodeFn={values => {
                const props = createJsxPropsStringFromValuesMap(values);

                return `
                    import {ProgressBar} from '@airtable/blocks/ui';

                    const loaderExample = (
                        <ProgressBar ${props} />
                    );
                `;
            }}
        >
            {values => {
                return <ProgressBar {...values} width={CONTROL_WIDTH} />;
            }}
        </Example>
    );
}

export const _Example = {
    render: () => <ProgressBarExample />,
};
