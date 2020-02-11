import React from 'react';
import CollaboratorToken from '../../src/ui/collaborator_token';
import ChoiceToken from '../../src/ui/choice_token';
import Text from '../../src/ui/text';
import Box from '../../src/ui/box';
import Icon from '../../src/ui/icon';
import {CONTROL_WIDTH} from './code_utils';
import choiceOptions from './choice_options';
import collaboratorOptions from './collaborator_options';
import {FieldType} from '../../src/types/field';
import attachments from './attachments';
import FakeForeignRecord from './fake_foreign_record';

export default function FakeCellRenderer({fieldType, value}: {fieldType: FieldType; value?: any}) {
    switch (fieldType) {
        case FieldType.SINGLE_LINE_TEXT:
            return <Text>{value || 'Lorem ipsum'}</Text>;
        case FieldType.EMAIL:
            return <Text>john.doe@example.com</Text>;
        case FieldType.URL:
            return <Text>https://airtable.com</Text>;
        case FieldType.MULTILINE_TEXT:
        case FieldType.RICH_TEXT:
            return (
                <Text maxWidth={CONTROL_WIDTH}>
                    Part spreadsheet, part database, and entirely flexible, teams use Airtable to
                    organize their work, their way.
                </Text>
            );
        case FieldType.NUMBER:
            return <Text>6.00</Text>;
        case FieldType.PERCENT:
            return <Text>80%</Text>;
        case FieldType.CURRENCY:
            return <Text>$1,049.00</Text>;
        case FieldType.SINGLE_SELECT:
            return <ChoiceToken choice={value || (choiceOptions[0] as any)} />;
        case FieldType.MULTIPLE_SELECTS:
            return (
                <React.Fragment>
                    {choiceOptions.map(choice => (
                        <ChoiceToken key={choice.id} choice={choice as any} marginRight={1} />
                    ))}
                </React.Fragment>
            );
        case FieldType.SINGLE_COLLABORATOR:
            return <CollaboratorToken collaborator={collaboratorOptions[0]} />;
        case FieldType.MULTIPLE_COLLABORATORS:
            return (
                <React.Fragment>
                    {collaboratorOptions.map(collaborator => (
                        <CollaboratorToken
                            key={collaborator.id}
                            collaborator={collaborator}
                            marginRight={1}
                        />
                    ))}
                </React.Fragment>
            );
        case FieldType.MULTIPLE_RECORD_LINKS:
            return (
                <Box>
                    {value ? (
                        value.map((item: string, index: number) => (
                            <FakeForeignRecord key={index}>{item}</FakeForeignRecord>
                        ))
                    ) : (
                        <React.Fragment>
                            <FakeForeignRecord>Robinetworks</FakeForeignRecord>
                            <FakeForeignRecord>Bear Paw Solutions</FakeForeignRecord>
                        </React.Fragment>
                    )}
                </Box>
            );
        case FieldType.DATE:
            return <Text>1/9/2019</Text>;
        case FieldType.DATE_TIME:
            return <Text>1/9/2019 12:00am</Text>;
        case FieldType.PHONE_NUMBER:
            return <Text>(123) 456-7890</Text>;
        case FieldType.MULTIPLE_ATTACHMENTS:
            return (
                <Box display="flex">
                    {attachments.map((attachment, index) => (
                        <Box
                            key={index}
                            width="25px"
                            height="25px"
                            overflow="hidden"
                            borderRadius="default"
                            border="default"
                            marginRight={1}
                        >
                            <img
                                src={attachment}
                                alt=""
                                style={{display: 'block', width: '100%', height: '100%'}}
                            />
                        </Box>
                    ))}
                </Box>
            );
        case FieldType.CHECKBOX:
            return <Icon name="check" fillColor="rgb(32, 201, 51)" />;
        case FieldType.FORMULA:
            return <Text>120.00</Text>;
        case FieldType.CREATED_TIME:
            return <Text>8/2/2019 1:47pm</Text>;
        case FieldType.ROLLUP:
            return <Text>91</Text>;
        case FieldType.COUNT:
            return <Text>5</Text>;
        case FieldType.MULTIPLE_LOOKUP_VALUES:
            return <Text>120</Text>;
        case FieldType.AUTO_NUMBER:
            return <Text>129</Text>;
        case FieldType.BARCODE:
            return <Text>123498345908235904540</Text>;
        case FieldType.RATING:
            return (
                <Box padding="7px 6px 3px" style={{color: 'rgb(252, 180, 0)'}}>
                    <Icon name="star" />
                    <Icon name="star" />
                    <Icon name="star" />
                    <Icon name="star" />
                    <Icon name="star" />
                </Box>
            );
        case FieldType.DURATION:
            return <Text>4:30</Text>;
        case FieldType.LAST_MODIFIED_TIME:
            return <Text>1/28/2020 4:36pm</Text>;
    }
}
