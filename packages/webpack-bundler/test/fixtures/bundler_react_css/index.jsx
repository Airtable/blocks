import React from 'react';
import './index.css';

function ReactApp() {
    return <div className="red">Hello World</div>;
}

export function Root() {
    return <ReactApp />;
}

initializeBlock(Root());
