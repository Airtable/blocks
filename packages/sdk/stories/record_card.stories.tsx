/* eslint-disable no-console */
import React from 'react';
import Example from './helpers/example';
import {recordCardStylePropTypes} from '../src/base/ui/record_card';
import FakeRecordCard from './helpers/fake_record_card';
import {RecordCard} from '../src/base/ui/ui';

export default {
    component: RecordCard,
};

function RecordCardExample() {
    return (
        <Example
            styleProps={Object.keys(recordCardStylePropTypes)}
            renderCodeFn={() => {
                return `
                import {RecordCard, useBase, useRecords} from '@airtable/blocks/base/ui';

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

export const _Example = {
    render: () => <RecordCardExample />,
};
