// @flow
import React, {useState} from 'react';
import {
    Box,
    Button,
    Icon,
    Input,
    RecordCard,
    SelectButtons,
    TablePickerSynced,
    Switch,
    Tooltip,
    useBase,
    useRecords,
} from '@airtable/blocks/ui';

export default function TooltipExample(props: void) {
    const base = useBase();
    const table = base.getTableByIdIfExists(base.tables[0].id);
    const view = table ? table.getViewByIdIfExists(table.views[0].id) : null;
    const records = useRecords(view ? view.selectRecords() : null);
    const [selectValue, setSelectValue] = useState('foo');
    const [inputValue, setInputValue] = useState('');

    return (
        <Box display="flex" flexDirection="column" alignSelf="stretch" alignItems="center">
            <Box marginTop={5}>
                <Tooltip
                    content="Edit content"
                    placementX={Tooltip.placements.CENTER}
                    placementY={Tooltip.placements.TOP}
                    placementOffsetX={0}
                    placementOffsetY={8}
                >
                    <Icon name="edit" />
                </Tooltip>
            </Box>
            <Box marginTop={5}>
                <Tooltip
                    content="This button is disabled"
                    placementX={Tooltip.placements.CENTER}
                    placementY={Tooltip.placements.TOP}
                    placementOffsetX={0}
                    placementOffsetY={8}
                >
                    <Button disabled={true}>Click me</Button>
                </Tooltip>
            </Box>
            <Box marginTop={5}>
                <Tooltip
                    content="This switch is disabled"
                    placementX={Tooltip.placements.CENTER}
                    placementY={Tooltip.placements.TOP}
                    placementOffsetX={0}
                    placementOffsetY={8}
                >
                    <Switch value={false} disabled={true} label="Switch" />
                </Tooltip>
            </Box>
            <Box marginTop={5}>
                <Tooltip
                    content="You don't have permission to change the table"
                    placementX={Tooltip.placements.CENTER}
                    placementY={Tooltip.placements.TOP}
                    placementOffsetX={0}
                    placementOffsetY={8}
                >
                    <TablePickerSynced globalConfigKey="TooltipExample" disabled={true} />
                </Tooltip>
            </Box>
            {records && records[0] && view && (
                <Box marginTop={5}>
                    <Tooltip
                        content="Click to expand record"
                        placementX={Tooltip.placements.CENTER}
                        placementY={Tooltip.placements.TOP}
                        placementOffsetX={0}
                        placementOffsetY={8}
                    >
                        <RecordCard record={records[0]} view={view} />
                    </Tooltip>
                </Box>
            )}
            <Box marginTop={5}>
                <Tooltip
                    content="Select an option"
                    placementX={Tooltip.placements.CENTER}
                    placementY={Tooltip.placements.TOP}
                    placementOffsetX={0}
                    placementOffsetY={8}
                >
                    <SelectButtons
                        value={selectValue}
                        onChange={setSelectValue}
                        options={[{value: 'foo', label: 'foo'}, {value: 'bar', label: 'bar'}]}
                    />
                </Tooltip>
            </Box>
            <Box marginY={5}>
                <Tooltip
                    content="Type something"
                    placementX={Tooltip.placements.CENTER}
                    placementY={Tooltip.placements.TOP}
                    placementOffsetX={0}
                    placementOffsetY={8}
                >
                    <Input
                        value={inputValue}
                        onChange={(e: SyntheticInputEvent<HTMLInputElement>) =>
                            setInputValue(e.target.value)
                        }
                    />
                </Tooltip>
            </Box>
        </Box>
    );
}
