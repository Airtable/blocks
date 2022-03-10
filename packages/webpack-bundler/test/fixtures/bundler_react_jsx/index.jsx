import React from 'react';

function ReactApp() {
    return <div>Hello World</div>;
}

export function Root() {
    return <ReactApp />;
}

initializeBlock(Root());
