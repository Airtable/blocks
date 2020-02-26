import React, {useState} from 'react';
import {viewport, runInfo} from '@airtable/blocks';
import {initializeBlock} from '@airtable/blocks/ui';

import SettingsForm from './SettingsForm';
import HomeScreen from './HomeScreen';
import GameCompletedScreen from './GameCompletedScreen';
import Game from './Game';
import loadCSS from './loadCSS';

// Load all the CSS used in our block.
loadCSS();

// Determines the minimum size the block needs before it asks the user to enlarge the block.
viewport.addMinSize({
    height: 520,
    width: 600,
});

// Determines the maximum size of the block in fullscreen mode.
viewport.addMaxFullscreenSize({
    height: 740,
    width: 800,
});

/**
 * The game state determines what screen to render.
 */
const GameStates = Object.freeze({
    /**
     * The player is configuring settings to be able to play the game.
     * If the game is configured, other users will see the home screen instead.
     */
    CONFIGURING_SETTINGS: 'configuringSettings',
    /**
     * The player is viewing the home screen and is able to start the game,
     * or when settings are invalid update the settings.
     */
    HOME_SCREEN: 'homeScreen',
    /**
     * The player is playing the game, any update in settings or any update to settings,
     * the records or the base, will not interrupt the game.
     */
    PLAYING: 'playing',
    /**
     * The player completed the game, they either picked all correctly and won the game, or failed.
     * They can go again or update the settings.
     */
    GAME_COMPLETED: 'gameCompleted',
});

/**
 * The name trainer block is a game that shows a single name for multiple pictures.
 * Each round the player needs to select the matching picture for the name within the time limit.
 *
 * This component handles all of the game lifecycle and renders a component based on the state of the game.
 */
function NameQuizBlock() {
    const [gameData, setGameData] = useState({
        // On first run of the block show the settings screen.
        gameState: runInfo.isFirstRun ? GameStates.CONFIGURING_SETTINGS : GameStates.HOME_SCREEN,
        // The game report will be populated when a game ends. It is used by the `GameCompletedScreen`.
        gameReport: null,
        // The list of names with pictures the game will use.
        listOfNamesWithPictures: null,
    });

    const {gameState, gameReport, listOfNamesWithPictures} = gameData;

    /**
     * Start the game with a list of names with pictures.
     *
     * @param {Array<{recordId: string, name: string, largePictureUrl: string, smallPictureUrl: string}>} listOfNamesWithPictures
     */
    function startGame(listOfNamesWithPictures) {
        // Enter the block in fullscreen to have more real estate to play the game.
        viewport.enterFullscreenIfPossible();
        setGameData({
            gameState: GameStates.PLAYING,
            gameReport: null,
            listOfNamesWithPictures,
        });
    }

    function gameCompleted(newGameReport) {
        setGameData({
            gameState: GameStates.GAME_COMPLETED,
            gameReport: newGameReport,
            listOfNamesWithPictures: null,
        });
    }

    function showSettings() {
        setGameData({
            gameState: GameStates.CONFIGURING_SETTINGS,
            gameReport: null,
            listOfNamesWithPictures: null,
        });
    }

    function showHomeScreen() {
        setGameData({
            gameState: GameStates.HOME_SCREEN,
            gameReport: null,
            listOfNamesWithPictures: null,
        });
    }

    switch (gameState) {
        case GameStates.CONFIGURING_SETTINGS:
            return <SettingsForm onDone={showHomeScreen} />;
        case GameStates.PLAYING:
            return (
                <Game
                    listOfNamesWithPictures={listOfNamesWithPictures}
                    onComplete={gameCompleted}
                />
            );
        case GameStates.HOME_SCREEN:
            return <HomeScreen onStartGame={startGame} onShowSettings={showSettings} />;
        case GameStates.GAME_COMPLETED:
            return (
                <GameCompletedScreen
                    gameReport={gameReport}
                    onStartGame={startGame}
                    onShowSettings={showSettings}
                />
            );
        default:
            throw new Error('Unexpected game state: ', gameState);
    }
}

initializeBlock(() => <NameQuizBlock />);
