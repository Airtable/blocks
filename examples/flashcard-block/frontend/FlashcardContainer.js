import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {Fragment, useEffect, useState} from 'react';
import {Field, Record} from '@airtable/blocks/models';
import {Box, Button} from '@airtable/blocks/ui';

import Flashcard from './Flashcard';

/**
 * Responsible for picking a random record from the given records.
 * Keeps track of removed records.
 */
export default function FlashcardContainer({records, settings}) {
    const [record, setRecord] = useState(_.sample(records));
    const [removedRecordsSet, setRemovedRecordsSet] = useState(new Set());

    function handleRemoveRecord() {
        const newRemovedRecordsSet = new Set(removedRecordsSet);
        setRemovedRecordsSet(newRemovedRecordsSet.add(record));
        handleNewRecord();
    }

    function handleNewRecord() {
        setRecord(_.sample(records.filter(r => r !== record && !removedRecordsSet.has(r))));
    }

    function reset() {
        setRemovedRecordsSet(new Set());
        // Can't use handleNewRecord here because setting state is async, so removedRecordsSet won't
        // be updated yet.
        setRecord(_.sample(records));
    }

    // Handle updating record and removedRecordsSet due to records changing
    useEffect(() => {
        const allRecordsSet = new Set(records);
        const newRemovedRecordsSet = new Set();
        for (const removedRecord of removedRecordsSet) {
            if (allRecordsSet.has(removedRecord)) {
                newRemovedRecordsSet.add(removedRecord);
            }
        }
        if (newRemovedRecordsSet.size !== removedRecordsSet.size) {
            setRemovedRecordsSet(newRemovedRecordsSet);
        }

        if (!allRecordsSet.has(record)) {
            handleNewRecord();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [records]);

    return (
        <Fragment>
            <Flashcard record={record} settings={settings} />
            <Box
                flex="none"
                borderTop="thick"
                display="flex"
                justifyContent="flex-end"
                marginX={3}
                paddingY={3}
            >
                {record ? (
                    <Button
                        marginLeft={3}
                        variant="primary"
                        size="large"
                        onClick={handleRemoveRecord}
                    >
                        Next
                    </Button>
                ) : (
                    <Button marginLeft={3} variant="primary" size="large" onClick={reset}>
                        Go again
                    </Button>
                )}
            </Box>
        </Fragment>
    );
}

FlashcardContainer.propTypes = {
    records: PropTypes.arrayOf(Record).isRequired,
    settings: PropTypes.shape({
        titleField: PropTypes.instanceOf(Field).isRequired,
        detailsField: PropTypes.instanceOf(Field),
    }).isRequired,
};
