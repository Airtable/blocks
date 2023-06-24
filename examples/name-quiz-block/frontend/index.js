import React from 'react';
import {initializeBlock} from '@airtable/blocks/ui';

// Add the baymax class to the root to use the global baymax styles.
// This was previously the default, but is now opt-in.
document.body.classList.add('baymax');

/**
 * The name trainer extension is a game that shows a single name for multiple pictures.
 * Each round the player needs to select the matching picture for the name within the time limit.
 *
 * This component handles all of the game lifecycle and renders a component based on the state of the game.
 */
function NameQuizExtension() {
    return (
        <div className="absolute all-0 flex flex-column items-center justify-center center darken1 p2">
            Beginning June 24, 2023, the Name quiz extension is no longer available or supported.
        </div>
    );
}

initializeBlock(() => <NameQuizExtension />);
