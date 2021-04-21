import {initializeBlock} from '@airtable/blocks/ui';
import React from 'react';

import {hello} from '../../hello-world-shared';
import {world} from 'hello-world-file-url';

function HelloWorldTypescriptApp() {
    // YOUR CODE GOES HERE
    return (
        <div>
            {hello()} {world()} 🚀
        </div>
    );
}

initializeBlock(() => <HelloWorldTypescriptApp />);
