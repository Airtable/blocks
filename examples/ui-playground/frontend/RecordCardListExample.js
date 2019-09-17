// @flow
import React, {useState} from 'react';
import {Box, RecordCardList, Select, Toggle, useBase, useRecords} from '@airtable/blocks/ui';

type Props = {
    shouldShowSettings: boolean,
};

export default function RecordCardListExample(props: Props) {
    const base = useBase();
    const [numAdditionalFieldsToShow, setNumAdditionalFieldsToShow] = useState(2);
    const [useDefaultOnClick, setUseDefaultOnClick] = useState(false);
    const [numRecordClicks, setNumRecordClicks] = useState(0);
    const [numListScrolls, setNumListScrolls] = useState(0);
    const [numRecordMouseEnters, setNumRecordMouseEnters] = useState(0);
    const [numRecordMouseLeaves, setNumRecordMouseLeaves] = useState(0);

    const table = base.getTableByIdIfExists(base.tables[0].id);
    const view = table ? table.getViewByIdIfExists(table.views[0].id) : null;
    const records = useRecords(view ? view.selectRecords() : null);
    const numAdditionalFieldsToShowOptions = table
        ? Array(table.fields.length)
              .fill(null)
              .map((_, i) => ({value: i, label: i}))
        : [];

    const onRecordClick = () => {
        setNumRecordClicks(numRecordClicks + 1);
    };
    const onScroll = () => {
        setNumListScrolls(numListScrolls + 1);
    };
    const onRecordMouseEnter = () => {
        setNumRecordMouseEnters(numRecordMouseEnters + 1);
    };
    const onRecordMouseLeave = () => {
        setNumRecordMouseLeaves(numRecordMouseLeaves + 1);
    };
    return (
        <Box display="flex" flexDirection="column" width="100%" alignSelf="stretch">
            {props.shouldShowSettings && (
                <Box className="baymax" flex="none">
                    <div className="border-bottom border-darken2 flex flex-none flex-column">
                        <div className="border-bottom border-darken2 p1 justify-between items-center flex">
                            <label>Number of additional fields to show</label>
                            <Select
                                value={numAdditionalFieldsToShow}
                                onChange={value => setNumAdditionalFieldsToShow(Number(value))}
                                options={numAdditionalFieldsToShowOptions}
                            />
                        </div>
                        <div className="border-bottom border-darken2 p1 justify-between items-center flex">
                            <label>
                                Use default <span className="monospace">onRecordClick</span>
                            </label>
                            <Toggle value={useDefaultOnClick} onChange={setUseDefaultOnClick} />
                        </div>
                        {!useDefaultOnClick && (
                            <div className="border-bottom border-darken2 p1 justify-between items-center flex">
                                <label>Number of record clicks</label>
                                <span className="red p1 pill text-white">{numRecordClicks}</span>
                            </div>
                        )}
                        <div className="border-bottom border-darken2 p1 justify-between items-center flex">
                            <label>Number of list scrolls</label>
                            <span className="red p1 pill text-white">{numListScrolls}</span>
                        </div>
                        <div className="border-bottom border-darken2 p1 justify-between items-center flex">
                            <label>Number of record mouse enters</label>
                            <span className="red p1 pill text-white">{numRecordMouseEnters}</span>
                        </div>
                        <div className="border-bottom border-darken2 p1 justify-between items-center flex">
                            <label>Number of record mouse leaves</label>
                            <span className="red p1 pill text-white">{numRecordMouseLeaves}</span>
                        </div>
                    </div>
                </Box>
            )}
            {view && table && records && (
                <RecordCardList
                    view={view}
                    fields={table.fields.slice(1, numAdditionalFieldsToShow + 1)}
                    onRecordClick={useDefaultOnClick ? undefined : onRecordClick}
                    onScroll={onScroll}
                    onRecordMouseEnter={onRecordMouseEnter}
                    onRecordMouseLeave={onRecordMouseLeave}
                    records={records}
                    flex="1 1 0"
                />
            )}
        </Box>
    );
}
