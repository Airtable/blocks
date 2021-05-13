import {initializeBlock} from '@airtable/blocks/ui';
import React from 'react';

import {Hello} from '../../hello-world-shared';

function HelloWorldTypescriptApp() {
    // YOUR CODE GOES HERE
    return (
        <div>
            <Hello /> world! 🚀
        </div>
    );
}

initializeBlock(() => <HelloWorldTypescriptApp />);
