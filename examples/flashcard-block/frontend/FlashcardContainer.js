import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {Fragment, useEffect, useState} from 'react';
import {Field, Record} from '@airtable/blocks/models';
import {Box, Button, expandRecord} from '@airtable/blocks/ui';

import Flashcard from './Flashcard';

/**
 * Responsible for picking a random record from the given records.
 * Keeps track of removed records.
 */
export default function FlashcardContainer({records, settings}) {
    const [record, setRecord] = useState(_.sample(records));
    const [removedRecordsSet, setRemovedRecordsSet] = useState(new Set());
    const [shouldShowAnswer, setShouldShowAnswer] = useState(false);

    function handleRemoveRecord() {
        const newRemovedRecordsSet = new Set(removedRecordsSet);
        setRemovedRecordsSet(newRemovedRecordsSet.add(record));
        setShouldShowAnswer(false);
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

    let primaryButton;
    if (record) {
        if (shouldShowAnswer || !settings.answerField) {
            // Either already showing the answer, or there's no answer
            // field. So show the "Next" button to go to the next question.
            primaryButton = (
                <Button marginLeft={3} variant="primary" size="large" onClick={handleRemoveRecord}>
                    Next question
                </Button>
            );
        } else {
            primaryButton = (
                <Button
                    marginLeft={3}
                    variant="primary"
                    size="large"
                    onClick={() => setShouldShowAnswer(true)}
                >
                    Show answer
                </Button>
            );
        }
    } else {
        // No records left.
        primaryButton = (
            <Button marginLeft={3} variant="primary" size="large" icon="redo" onClick={reset}>
                Start over
            </Button>
        );
    }

    return (
        <Fragment>
            <Flashcard record={record} settings={settings} shouldShowAnswer={shouldShowAnswer} />
            <Box flex="none" borderTop="thick" display="flex" marginX={3} paddingY={3}>
                {record && (
                    <Button icon="expand" variant="secondary" onClick={() => expandRecord(record)}>
                        Expand record
                    </Button>
                )}
                <Box flexGrow={1} />
                {primaryButton}
            </Box>
        </Fragment>
    );
}

FlashcardContainer.propTypes = {
    records: PropTypes.arrayOf(PropTypes.instanceOf(Record)).isRequired,
    settings: PropTypes.shape({
        questionField: PropTypes.instanceOf(Field).isRequired,
        answerField: PropTypes.instanceOf(Field),
    }).isRequired,
};
