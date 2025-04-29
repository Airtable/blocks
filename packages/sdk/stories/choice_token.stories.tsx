/* eslint-disable no-console */
import React from 'react';
import ChoiceToken, {choiceTokenStylePropTypes} from '../src/base/ui/choice_token';
import Example from './helpers/example';
import choiceOptions from './helpers/choice_options';

export default {
    component: ChoiceToken,
};

function ChoiceTokenExample() {
    return (
        <Example
            styleProps={Object.keys(choiceTokenStylePropTypes)}
            renderCodeFn={() => {
                return `
                    import {ChoiceToken, useBase} from '@airtable/blocks/ui';

                    const ChoiceTokenExample = () => {
                        const base = useBase();
                        const table = base.getTableByName('Software engineers');
                        const field = table.getFieldByName('Favorite language');

                        return (
                            <React.Fragment>
                                {field.options.choices.map(choice => (
                                    <ChoiceToken key={choice.id} choice={choice} marginRight={1} />
                                ))}
                            </React.Fragment>
                        );
                    }
                `;
            }}
        >
            {() => {
                return (
                    <React.Fragment>
                        {choiceOptions.map(choice => (
                            <ChoiceToken key={choice.id} choice={choice as any} marginRight={1} />
                        ))}
                    </React.Fragment>
                );
            }}
        </Example>
    );
}

export const _Example = {
    render: () => <ChoiceTokenExample />,
};
