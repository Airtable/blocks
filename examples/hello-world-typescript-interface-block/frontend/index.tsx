import {initializeBlock} from '@airtable/blocks/interface/ui';
import React from 'react';
import './style.css';

function HelloWorldTypescriptApp() {
    // YOUR CODE GOES HERE
    return <div>Hello world 🚀</div>;
}

initializeBlock({interface: () => <HelloWorldTypescriptApp />});
