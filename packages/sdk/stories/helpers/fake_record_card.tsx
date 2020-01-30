import React, {useState} from 'react';
import {css} from 'emotion';

import Box from '../../src/ui/box';
import Text from '../../src/ui/text';
import Heading from '../../src/ui/heading';
import Dialog from '../../src/ui/dialog';
import Button from '../../src/ui/button';
import FakeCellRenderer from './fake_cell_renderer';
import {FieldType} from './field_type';
import {recordCardAttachment} from './attachments';
import {CONTROL_WIDTH} from './code_utils';

// Mimics style of our existing RecordCard component without requiring airtable interface
// NOTE: This is not a pixel-perfect clone.
export default function FakeRecordCard() {
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
                position="relative"
                boxShadow="0 0 0 2px hsla(0,0%,0%,0.1)"
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
                    right="80px"
                    flexDirection="column"
                >
                    {/* record title */}
                    <Box display="flex" alignItems="center">
                        <Text fontSize="14px" height="18px" fontWeight="500">
                            John Doe
                        </Text>
                    </Box>

                    {/* record fields */}
                    <Box marginTop="3px" textColor="#555555" display="flex">
                        <Box display="inline-block" width="132px" paddingRight={2}>
                            <FieldHeader fieldName="Language" />
                            <Box height="34px">
                                <Box display="flex" padding="4px" overflow="auto">
                                    <FakeCellRenderer fieldType={FieldType.SINGLE_SELECT} />
                                </Box>
                            </Box>
                        </Box>
                        <Box display="inline-block" width="132px" paddingRight={2}>
                            <FieldHeader fieldName="Pictures" />
                            <Box height="34px">
                                <Box display="flex" padding="4px" overflow="auto">
                                    <FakeCellRenderer fieldType={FieldType.MULTIPLE_ATTACHMENTS} />
                                </Box>
                            </Box>
                        </Box>
                        <Box display="inline-block" flex="auto" paddingRight={2}>
                            <FieldHeader fieldName="About" />
                            <Box height="34px">
                                <Box display="flex" padding="4px" overflow="auto" fontSize="12px">
                                    <FakeCellRenderer fieldType={FieldType.SINGLE_LINE_TEXT} />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* attachment field cover image */}
                <Box
                    position="absolute"
                    right="0"
                    overflow="hidden"
                    style={{borderTopRightRadius: 2, borderBottomRightRadius: 2}}
                >
                    <img src={recordCardAttachment} />
                </Box>
            </Box>
            {isDialogOpen && (
                <Dialog onClose={() => setIsDialogOpen(false)} width={CONTROL_WIDTH}>
                    <Dialog.CloseButton />
                    <Heading>Record detail stub</Heading>
                    <Text variant="paragraph">
                        Clicking on a record card inside of blocks will open the expanded record
                        detail view by default. This behavior can be overridden by setting the
                        `onClick` prop.
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
