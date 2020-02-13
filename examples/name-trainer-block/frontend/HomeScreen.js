import React from 'react';
import PropTypes from 'prop-types';

import IdleGameScreen from './IdleGameScreen';

/**
 * The HomeScreen is shown when the settings are valid and the player can start the game.
 */
export default function HomeScreen({onStartGame, onShowSettings}) {
    return (
        <IdleGameScreen
            emoji="👁 👁"
            title="How many people do you recognize?"
            text="Each round will show you a name and multiple pictures, select the picture that matches!"
            buttonLabel="Start game"
            onStartGame={onStartGame}
            onShowSettings={onShowSettings}
        />
    );
}

HomeScreen.propTypes = {
    onStartGame: PropTypes.func.isRequired,
    onShowSettings: PropTypes.func.isRequired,
};
