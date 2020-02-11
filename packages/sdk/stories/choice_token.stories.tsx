/* eslint-disable no-console */
import React from 'react';
import {storiesOf} from '@storybook/react';
import ChoiceToken, {choiceTokenStylePropTypes} from '../src/ui/choice_token';
import Example from './helpers/example';
import choiceOptions from './helpers/choice_options';

const stories = storiesOf('ChoiceToken', module);

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
                        const field = base.getFieldByName('Favorite language');

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

stories.add('example', () => <ChoiceTokenExample />);
