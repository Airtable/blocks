import {initializeBlock} from '@airtable/blocks/interface/ui';
import './style.css';

function HelloWorldTypescriptApp() {
    // YOUR CODE GOES HERE
    return <div>Hello world 🚀</div>;
}

initializeBlock({interface: () => <HelloWorldTypescriptApp />});
