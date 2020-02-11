/* eslint-disable no-console */
import React from 'react';
import {storiesOf} from '@storybook/react';
import Example from './helpers/example';
import {recordCardStylePropTypes} from '../src/ui/record_card';
import FakeRecordCard from './helpers/fake_record_card';

const stories = storiesOf('RecordCard', module);

function RecordCardExample() {
    return (
        <Example
            styleProps={Object.keys(recordCardStylePropTypes)}
            renderCodeFn={() => {
                return `
                import {RecordCard, useBase, useRecords} from '@airtable/blocks/ui';
                
                const RecordCardExample = () => {
                   const base = useBase();
                   const table = base.getTableByName('Programmers');
                   const queryResult = table.selectRecords();
                   const records = useRecords(queryResult);
 
                   // Specify which fields are shown with the \`fields\` prop
                   return (
                        <RecordCard record={records[0]} />
                   );
                }
                `;
            }}
        >
            {() => {
                return <FakeRecordCard />;
            }}
        </Example>
    );
}

stories.add('example', () => <RecordCardExample />);
