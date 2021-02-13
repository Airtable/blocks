import React from 'react';

function ReactApp(): React.ReactElement {
    return <div>Hello World</div>;
}

export function Root(): React.ReactElement {
    return <ReactApp />;
}
