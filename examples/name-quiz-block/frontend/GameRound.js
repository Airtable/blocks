import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {Text, Box, Heading} from '@airtable/blocks/ui';

import Picture from './Picture';

/**
 * The game round state describes the state of the game.
 */
const GameRoundStates = Object.freeze({
    /** The round has started, nothing is selected, time has not run out yet. */
    IDLE: 'idle',
    /** The player selected the right option within the time period. */
    SUCCESS: 'success',
    /** The player selected the wrong option, or failed to select an option within the time period. */
    FAIL: 'fail',
});

/**
 * The GameRound component is responsible for showing the options and allowing the player to select an option.
 * It also keeps track of time, when the user fails to pick an option within the time, it's a fail.
 */
export default function GameRound({
    options,
    winnerName,
    numTotal,
    numCompleted,
    roundTimeMs,
    onSuccess,
    onFail,
}) {
    const [roundState, setRoundState] = useState(GameRoundStates.IDLE);
    const isRoundComplete = [GameRoundStates.SUCCESS, GameRoundStates.FAIL].includes(roundState);

    // Whenever `roundState` changes, we want to wait a second before going to the round or game state.
    // This allows the player to see which option was correct.
    useEffect(() => {
        let timeoutId;
        switch (roundState) {
            case GameRoundStates.SUCCESS: {
                timeoutId = setTimeout(() => {
                    onSuccess();
                }, 1000);
                break;
            }
            case GameRoundStates.FAIL: {
                timeoutId = setTimeout(() => {
                    onFail();
                }, 1000);
                break;
            }
        }

        return () => {
            // It's a best practice to cleanup for unexpected unmounts of the component.
            clearTimeout(timeoutId);
        };

        // `onFail` and `onSuccess` are added as dependencies primarily to please eslint,
        // in practice only `roundState` will trigger the effect hook.
    }, [roundState, onFail, onSuccess]);

    function onSelect(option) {
        // We compare names and not id's to work with people with the same name.
        setRoundState(option.name === winnerName ? GameRoundStates.SUCCESS : GameRoundStates.FAIL);
    }

    function onTimeEnd() {
        setRoundState(GameRoundStates.FAIL);
    }

    // Sample some fun emojis to make the game more amusing.
    let emoji;
    if (isRoundComplete) {
        if (roundState === GameRoundStates.SUCCESS) {
            emoji = _.sample(['😍', '👌', '🤗', '🤙', '🤘', '😎', '👏']);
        } else if (roundState === GameRoundStates.FAIL) {
            emoji = _.sample(['🤯', '😵', '😯', '😫', '😩', '😓', '💩']);
        }
    } else {
        emoji = _.sample(['🤔', '🙃', '😅', '🧐', '👀', '🤭', '😕', '😧']);
    }

    const emojiClassNames = ['GameRoundEmoji'];
    if (isRoundComplete) {
        emojiClassNames.push('GameRoundEmoji-isRoundComplete');
    }

    return (
        <Box flex="auto" display="flex" flexDirection="column">
            <Box flex="none" textAlign="center" marginTop="4vh" paddingX={4}>
                <span className={emojiClassNames.join(' ')}>{emoji}</span>
                <Heading textAlign="center" marginTop={2}>
                    Who is {winnerName}?
                </Heading>
                <div className="ProgressBar">
                    <div
                        className="ProgressBar-fill"
                        style={{
                            animationDuration: `${roundTimeMs}ms`,
                            animationPlayState: isRoundComplete ? 'paused' : 'inherit',
                        }}
                        // For the timer we are simply waiting on the CSS transition to complete.
                        onAnimationEnd={isRoundComplete ? undefined : onTimeEnd}
                    />
                </div>
                <Text>
                    Score: {numCompleted} / {numTotal}
                </Text>
            </Box>
            <div className={`PictureGrid PictureGrid-${options.length}-options`}>
                {options.map(option => {
                    return (
                        <Picture
                            key={option.recordId}
                            largePictureUrl={option.largePictureUrl}
                            smallPictureUrl={option.smallPictureUrl}
                            onClick={() => onSelect(option)}
                            isRoundComplete={isRoundComplete}
                            shouldPresentAsWinner={isRoundComplete && winnerName === option.name}
                            didUserPickSuccessfully={
                                isRoundComplete && roundState === GameRoundStates.SUCCESS
                            }
                        />
                    );
                })}
            </div>
        </Box>
    );
}

GameRound.propTypes = {
    winnerName: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            largePictureUrl: PropTypes.string.isRequired,
            smallPictureUrl: PropTypes.string.isRequired,
        }).isRequired,
    ).isRequired,
    numTotal: PropTypes.number.isRequired,
    numCompleted: PropTypes.number.isRequired,
    roundTimeMs: PropTypes.number.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onFail: PropTypes.func.isRequired,
};
