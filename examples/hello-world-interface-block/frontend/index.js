import {initializeBlock} from '@airtable/blocks/interface/ui';
import React from 'react';
import './style.css';

function HelloWorldApp() {
    // YOUR CODE GOES HERE
    return <div>Hello world 🚀</div>;
}

initializeBlock({interface: () => <HelloWorldApp />});
