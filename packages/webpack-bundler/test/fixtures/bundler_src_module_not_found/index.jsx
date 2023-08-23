import React from 'react';
import ChildComponent from './ChildComponent'

function ReactApp() {
    return (
        <div>
            Hello World
            <ChildComponent />
        </div>
    );
}

export function Root() {
    return <ReactApp />;
}

initializeBlock(Root());
