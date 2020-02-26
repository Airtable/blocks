import React from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Text,
    Heading,
    TextButton,
    useRecords,
    useSettingsButton,
} from '@airtable/blocks/ui';

import {useSettings, MIN_AMOUNT_OF_PICTURES} from './settings';
import FullScreenBox from './FullScreenBox';
import getListOfNamesWithPictures from './getListOfNamesWithPictures';

/**
 * This screen is re-used by the game completed screen and home screen which share the same layout and
 * functionality, but have different content.
 */
export default function IdleGameScreen({
    emoji,
    title,
    text,
    buttonLabel,
    onStartGame,
    onShowSettings,
}) {
    // We are watching the settings here to make sure the settings are still valid for a new game.
    // If the settings are not valid we will ask the user to update the settings before playing a new game.
    // This could be because someone else changed the settings or because something in the schema changed.
    const {isValid, settings} = useSettings();
    useSettingsButton(onShowSettings);

    // Get the records, and also re-render when changes happen to the records.
    const records = useRecords(settings.queryResult);

    const listOfNamesWithPictures =
        isValid && records
            ? getListOfNamesWithPictures({
                  records,
                  nameField: settings.nameField,
                  attachmentField: settings.attachmentField,
              })
            : null;

    const hasEnoughRecords =
        settings.queryResult &&
        settings.queryResult.isDataLoaded &&
        listOfNamesWithPictures &&
        listOfNamesWithPictures.length > MIN_AMOUNT_OF_PICTURES;

    let callToActions;
    if (isValid && hasEnoughRecords) {
        callToActions = (
            <React.Fragment>
                <Button
                    onClick={() => onStartGame(listOfNamesWithPictures)}
                    icon="play"
                    size="large"
                    variant="primary"
                    marginTop={4}
                >
                    {buttonLabel}
                </Button>
                <TextButton onClick={onShowSettings} variant="light" marginTop={3}>
                    Change settings
                </TextButton>
            </React.Fragment>
        );
    } else {
        callToActions = (
            <React.Fragment>
                <Button onClick={onShowSettings} size="large" marginTop={4}>
                    Change settings
                </Button>
                <Text textColor="light" marginTop={3}>
                    {isValid
                        ? 'Not enough records with a name and picture'
                        : 'The settings are not configured completely'}
                </Text>
            </React.Fragment>
        );
    }

    return (
        <FullScreenBox
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            textAlign="center"
            paddingX={3}
        >
            <span className="GameEmoji">{emoji}</span>
            <Heading marginTop={4}>{title}</Heading>
            <Text textColor="light">{text}</Text>
            {callToActions}
        </FullScreenBox>
    );
}

IdleGameScreen.propTypes = {
    emoji: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    buttonLabel: PropTypes.string.isRequired,
    onStartGame: PropTypes.func.isRequired,
    onShowSettings: PropTypes.func.isRequired,
};
