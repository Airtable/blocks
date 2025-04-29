import React, {useState} from 'react';
import {css} from 'emotion';

import Box from '../../src/base/ui/box';
import Text from '../../src/base/ui/text';
import Heading from '../../src/base/ui/heading';
import Dialog from '../../src/base/ui/dialog';
import Button from '../../src/base/ui/button';
import {FieldType} from '../../src/shared/types/field';
import FakeCellRenderer from './fake_cell_renderer';
import {recordCardAttachment} from './attachments';
import {CONTROL_WIDTH} from './code_utils';

interface FakeRecordCardProps {
    primaryFieldValue?: string;
    fieldNames?: Array<string>;
    fieldTypes?: Array<FieldType>;
    fieldValues?: Array<any>;
    showAttachment?: boolean;
    isInRecordCardList?: boolean;
}

const defaultFieldNames = ['Language', 'Pictures', 'About'];
const defaultFieldTypes = [
    FieldType.SINGLE_SELECT,
    FieldType.MULTIPLE_ATTACHMENTS,
    FieldType.SINGLE_LINE_TEXT,
];

export default function FakeRecordCard({
    primaryFieldValue = 'John Doe',
    fieldNames = defaultFieldNames,
    fieldTypes = defaultFieldTypes,
    fieldValues,
    showAttachment = true,
    isInRecordCardList = false,
}: FakeRecordCardProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    function handleClick() {
        setIsDialogOpen(true);
    }

    return (
        <React.Fragment>
            <Box
                onClick={handleClick}
                width="568px"
                height="80px"
                minHeight="80px"
                margin="5px"
                position="relative"
                boxShadow="0 0 0 2px hsla(0,0%,0%,0.1)"
                backgroundColor="white"
                borderRadius="default"
                className={css({
                    '&:hover': {
                        boxShadow: '0 0 0 2px hsla(0,0%,0%,0.25)',
                    },
                    cursor: 'pointer',
                    transition: 'box-shadow 0.15s ease-out',
                })}
            >
                <Box
                    backgroundColor="transparent"
                    padding="12px"
                    display="flex"
                    position="absolute"
                    top="0"
                    bottom="0"
                    left="0"
                    right={showAttachment ? '80px' : '0px'}
                    flexDirection="column"
                >
                    {/* record title */}
                    <Box display="flex" alignItems="center">
                        <Text fontSize="14px" height="18px" fontWeight="500">
                            {primaryFieldValue}
                        </Text>
                    </Box>

                    {/* record fields */}
                    <Box marginTop="3px" textColor="#555555" display="flex">
                        {fieldNames.map((fieldName, index) => {
                            return (
                                <Box
                                    display="inline-block"
                                    width={index < fieldNames.length - 1 ? '132px' : undefined}
                                    paddingRight={2}
                                >
                                    <FieldHeader fieldName={fieldName} />
                                    <Box height="34px">
                                        <Box display="flex" padding="4px" overflow="auto">
                                            <FakeCellRenderer
                                                fieldType={fieldTypes[index]}
                                                value={fieldValues ? fieldValues[index] : undefined}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                {/* attachment field cover image */}
                {showAttachment && (
                    <Box
                        position="absolute"
                        right="0"
                        overflow="hidden"
                        style={{borderTopRightRadius: 2, borderBottomRightRadius: 2}}
                    >
                        <img src={recordCardAttachment} />
                    </Box>
                )}
            </Box>
            {isDialogOpen && (
                <Dialog onClose={() => setIsDialogOpen(false)} width={CONTROL_WIDTH}>
                    <Dialog.CloseButton />
                    <Heading>Record detail stub</Heading>
                    <Text variant="paragraph">
                        Clicking on a record card inside of blocks opens the expanded record detail
                        view by default. This behavior can be overridden by setting the{' '}
                        {isInRecordCardList ? '`onRecordClick`' : '`onClick`'} prop.
                    </Text>
                    <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                </Dialog>
            )}
        </React.Fragment>
    );
}

function FieldHeader({fieldName}: {fieldName: string}) {
    return (
        <Text
            letterSpacing="0.1em"
            textColor="#898989"
            fontSize="11px"
            lineHeight="13px"
            textTransform="uppercase"
        >
            {fieldName}
        </Text>
    );
}
