import {initializeBlock} from '@airtable/blocks/ui';
import React, {ReactElement} from 'react';

// Add the baymax class to the root to use the global baymax styles.
// This was previously the default, but is now opt-in.
document.body.classList.add('baymax');

function MeetingModeratorApp(): ReactElement {
    return (
        <div className="absolute all-0 flex flex-column items-center justify-center center darken1 p2">
            Beginning June 24, 2023, the Topic timer extension is no longer available or supported.
        </div>
    );
}

initializeBlock(() => <MeetingModeratorApp />);
