import React, {useState} from 'react';
import {viewport, runInfo} from '@airtable/blocks';
import {initializeBlock, Icon, colorUtils, colors} from '@airtable/blocks/ui';

import SettingsForm from './SettingsForm';
import HomeScreen from './HomeScreen';
import GameCompletedScreen from './GameCompletedScreen';
import Game from './Game';
import loadCSS from './loadCSS';
import FullScreenBox from './FullScreenBox';

// Add the baymax class to the root to use the global baymax styles.
// This was previously the default, but is now opt-in.
document.body.classList.add('baymax');

// Load all the CSS used in our extension.
loadCSS();

// Determines the minimum size the extension needs before it asks the user to enlarge the extension.
viewport.addMinSize({
    height: 520,
    width: 600,
});

// Determines the maximum size of the extension in fullscreen mode.
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
 * The name trainer extension is a game that shows a single name for multiple pictures.
 * Each round the player needs to select the matching picture for the name within the time limit.
 *
 * This component handles all of the game lifecycle and renders a component based on the state of the game.
 */
function NameQuizExtension() {
    const [gameData, setGameData] = useState({
        // On first run of the extension show the settings screen.
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
        // Enter the extension in fullscreen to have more real estate to play the game.
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

    function  _renderDeprecationBanner() {
        return (
            <div className="flex p1 red-light2 pb1 pt1">
                <div className="ml1 flex flex-column justify-start">
                    <Icon name="warning" fillColor={colorUtils.getHexForColor(colors.RED_BRIGHT)} />
                </div>
                <div className="ml1">
                    <p className="strong mb1">
                        We have removed support for this extension, but it is still usable through
                        June 24, 2023. After June 24, 2023, we will permanently deprecate and remove
                        this extension.
                    </p>
                </div>
            </div>
        );
    }

    function _gameMode() {
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

    return (
        <FullScreenBox display="flex" flexDirection="column">
            {_renderDeprecationBanner()}
            {_gameMode()}
        </FullScreenBox>
    )
   
}

initializeBlock(() => <NameQuizExtension />);
