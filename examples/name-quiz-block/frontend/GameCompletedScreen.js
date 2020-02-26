import React from 'react';
import PropTypes from 'prop-types';

import IdleGameScreen from './IdleGameScreen';

/**
 * The GameCompletedScreen is shown when the user wins or loses the game.
 */
export default function GameCompletedScreen({gameReport, onStartGame, onShowSettings}) {
    const didUserWinTheGame = gameReport.numCompleted === gameReport.numTotal;
    return (
        <IdleGameScreen
            emoji={didUserWinTheGame ? '🏆' : '💀'}
            title={didUserWinTheGame ? '🎉 Game completed! 🎉' : '🙁 Game over! 🙁'}
            text={
                didUserWinTheGame
                    ? `Congrats, you recognized all ${gameReport.numTotal} people!`
                    : `You recognized ${gameReport.numCompleted} out of ${gameReport.numTotal} people`
            }
            buttonLabel={didUserWinTheGame ? 'Go again' : 'Try again'}
            onStartGame={onStartGame}
            onShowSettings={onShowSettings}
        />
    );
}

GameCompletedScreen.propTypes = {
    gameReport: PropTypes.shape({
        numCompleted: PropTypes.number.isRequired,
        numTotal: PropTypes.number.isRequired,
    }).isRequired,
    onStartGame: PropTypes.func.isRequired,
    onShowSettings: PropTypes.func.isRequired,
};
