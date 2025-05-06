import {initializeBlock} from '@airtable/blocks/interface/ui';
import './style.css';

function HelloWorldApp() {
    // YOUR CODE GOES HERE
    return <div>Hello world 🚀</div>;
}

initializeBlock({interface: () => <HelloWorldApp />});
