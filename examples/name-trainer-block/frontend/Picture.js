import React from 'react';
import PropTypes from 'prop-types';

export default function Picture({
    largePictureUrl,
    smallPictureUrl,
    onClick,
    isRoundComplete,
    shouldPresentAsWinner,
    didUserPickSuccessfully,
}) {
    const classNames = ['Picture'];
    if (isRoundComplete) {
        classNames.push('Picture-isRoundComplete');

        if (shouldPresentAsWinner) {
            classNames.push('Picture-winner');
            classNames.push(
                didUserPickSuccessfully
                    ? 'Picture-pickedSucessfully'
                    : 'Picture-pickedUnsuccessfully',
            );
        } else {
            classNames.push('Picture-loser');
        }
    }
    return (
        <div
            // This game can only be played with the mouse by sighted users.
            // In any other case, adding a `onClick` to a `div` is bad practice, and you should us a button instead.
            onClick={onClick}
            className={classNames.join(' ')}
            style={{
                // Use multiple background URLs to provide a quick loading fallback to make the game playable on poor connection.
                backgroundImage: `url("${largePictureUrl}"), url("${smallPictureUrl}")`,
            }}
        />
    );
}

Picture.propTypes = {
    largePictureUrl: PropTypes.string.isRequired,
    smallPictureUrl: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    isRoundComplete: PropTypes.bool,
    shouldPresentAsWinner: PropTypes.bool,
    didUserPickSuccessfully: PropTypes.bool,
};
