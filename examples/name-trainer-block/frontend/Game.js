import React, {useState} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import GameRound from './GameRound';
import FullScreenBox from './FullScreenBox';
import {
    COMPLETED_NAMES_BEFORE_MAX_AMOUNT_OF_PICTURES,
    MIN_AMOUNT_OF_PICTURES,
    MAX_AMOUNT_OF_PICTURES,
} from './settings';

/**
 * The Game component is responsible for the game lifecycle.
 */
export default function Game({listOfNamesWithPictures, onComplete}) {
    // We maintain a list of completed people so we know which one to show,
    // and know when the game is completed.
    const [completed, setCompleted] = useState([]);

    // The game is over, notify the parent.
    function gameOver() {
        onComplete({
            numTotal: listOfNamesWithPictures.length,
            numCompleted: completed.length,
        });
    }

    // The user picked the right option! Go to the next round or end the game.
    function nextRound(winner) {
        const newCompleted = [...completed, winner];

        if (newCompleted.length === listOfNamesWithPictures.length) {
            // The game is won! All names are correctly picked.
            onComplete({
                numTotal: listOfNamesWithPictures.length,
                numCompleted: newCompleted.length,
            });
        } else {
            // The game is not won yet, the next round will now be shown.
            setCompleted(newCompleted);
        }
    }

    // Below we will determine the data neccessary for a game round which includes:
    // 1. (winner) The winner
    // 2. (options) The options including the winner
    // 3. (roundTimeMs) How much time the round needs to be completed in.

    // First, get the people that have not been completed yet.
    const notCompleted = _.differenceBy(listOfNamesWithPictures, completed, 'recordId');

    // Next, determine the winner by random.
    const winner = _.sample(notCompleted);

    // Next, create a list without the winner.
    const listOfNamesWithPicturesWithoutTheWinner = _.differenceBy(
        listOfNamesWithPictures,
        [winner],
        'recordId',
    );

    // The game gets harder over time! More options, and less time!
    const optionCount =
        completed.length <= COMPLETED_NAMES_BEFORE_MAX_AMOUNT_OF_PICTURES
            ? MIN_AMOUNT_OF_PICTURES
            : MAX_AMOUNT_OF_PICTURES;
    const normalizedProgress = completed.length / listOfNamesWithPictures.length;
    const roundTimeMs = 5000 - normalizedProgress * 3000;

    // Next, sample some options from the list without the winner.
    const sampledOptionsWithoutTheWinner = _.sampleSize(
        listOfNamesWithPicturesWithoutTheWinner,
        optionCount - 1,
    );

    // Finally, shuffle the winner with the sampled options.
    const options = _.shuffle([winner, ...sampledOptionsWithoutTheWinner]);

    return (
        <FullScreenBox display="flex">
            <GameRound
                // We use a key here to make the component re-mount each round.
                // This is simpler than resetting state within the component.
                key={winner.recordId}
                options={options}
                winnerName={winner.name}
                roundTimeMs={roundTimeMs}
                numCompleted={completed.length}
                numTotal={listOfNamesWithPictures.length}
                onSuccess={() => nextRound(winner)}
                onFail={gameOver}
            />
        </FullScreenBox>
    );
}

Game.propTypes = {
    listOfNamesWithPictures: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            largePictureUrl: PropTypes.string.isRequired,
            smallPictureUrl: PropTypes.string.isRequired,
        }).isRequired,
    ).isRequired,
    onComplete: PropTypes.func.isRequired,
};
