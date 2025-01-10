/* eslint-disable no-console */
import React from 'react';
import Example from './helpers/example';
import {recordCardListStylePropTypes} from '../src/ui/record_card_list';
import Box from '../src/ui/box';
import {FieldType} from '../src/types/field';
import FakeRecordCard from './helpers/fake_record_card';
import {RecordCardList} from '../src/ui/ui';

export default {
    component: RecordCardList,
};

function RecordCardListExample() {
    const fieldTypes = [
        FieldType.SINGLE_SELECT,
        FieldType.MULTIPLE_RECORD_LINKS,
        FieldType.SINGLE_LINE_TEXT,
    ];
    const fieldNames = ['Animal', 'Friends', 'About'];
    const primaryFieldValues = ['Riley', 'Archie', 'Marlo', 'Fluffy', 'Bryce'];
    const fieldValues = [
        [
            {id: 'cat', name: 'Cat', color: 'blueLight2'},
            ['Marlo', 'Archie'],
            'Riley meows in the middle of the night.',
        ],
        [
            {id: 'dog', name: 'Dog', color: 'greenLight1'},
            ['Marlo', 'Bryce'],
            'Archie loves to go for walks.',
        ],
        [
            {id: 'bunny', name: 'Bunny', color: 'yellowLight1'},
            ['Fluffy', 'Bryce'],
            'Marlo likes to eat carrots.',
        ],
        [
            {id: 'cat', name: 'Cat', color: 'blueLight2'},
            ['Marlo', 'Bryce'],
            'Fluffy enjoys long cat-naps.',
        ],
        [
            {id: 'dog', name: 'Dog', color: 'greenLight1'},
            ['Fluffy', 'Archie'],
            'Bryce likes to play catch.',
        ],
    ];

    return (
        <Example
            styleProps={Object.keys(recordCardListStylePropTypes)}
            renderCodeFn={() => {
                return `
                import {RecordCardList, useBase, useRecords} from '@airtable/blocks/ui';

                const RecordCardListExample = () => {
                   const base = useBase();
                   const table = base.getTableByName('Programmers');
                   const queryResult = table.selectRecords();
                   const records = useRecords(queryResult);

                   return (
                       <Box height="300px" border="thick" backgroundColor="lightGray1">
                            {/* Specify which fields are shown with the \`fields\` prop */}
                            <RecordCardList records={records} />
                        </Box>
                   );
                }
                `;
            }}
        >
            {() => {
                return (
                    <Box
                        height="300px"
                        display="flex"
                        flexDirection="column"
                        margin="5px"
                        padding="5px"
                        border="thick"
                        overflow="auto"
                        backgroundColor="lightGray1"
                    >
                        {primaryFieldValues.map((primaryFieldValue, index) => {
                            return (
                                <FakeRecordCard
                                    primaryFieldValue={primaryFieldValue}
                                    fieldTypes={fieldTypes}
                                    fieldNames={fieldNames}
                                    fieldValues={fieldValues[index]}
                                    showAttachment={false}
                                    isInRecordCardList={true}
                                />
                            );
                        })}
                    </Box>
                );
            }}
        </Example>
    );
}

export const _Example = {
    render: () => <RecordCardListExample />,
};
