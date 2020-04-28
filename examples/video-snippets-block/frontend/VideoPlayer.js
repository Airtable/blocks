import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Box} from '@airtable/blocks/ui';

function VideoPlayer({startTime, endTime, src}) {
    const [isPlayingInitialClip, setIsPlayingInitialClip] = useState(true);

    function _onLoadedMetadata(e) {
        if (startTime) {
            e.currentTarget.currentTime = startTime;
        }
    }

    function _onTimeUpdate(e) {
        if (endTime && isPlayingInitialClip && e.currentTarget.currentTime > endTime) {
            e.currentTarget.pause();
            setIsPlayingInitialClip(false);
        }
    }

    return (
        <Box flex="auto" position="relative" width="100%">
            <video
                autoPlay
                controls
                onTimeUpdate={_onTimeUpdate}
                onLoadedMetadata={_onLoadedMetadata}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    height: '100%',
                }}
            >
                <source src={src} />
                Your browser does not support video playback.
            </video>
        </Box>
    );
}

VideoPlayer.propTypes = {
    startTime: PropTypes.number,
    endTime: PropTypes.number,
    src: PropTypes.string.isRequired,
};

export default VideoPlayer;
