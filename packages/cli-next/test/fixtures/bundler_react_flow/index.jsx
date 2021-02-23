/* @flow */
import React from 'react';

function ReactApp({message}: {|message: string|}) {
    return <div>{message}</div>;
}

export function Root() {
    return <ReactApp message="Hello World" />;
}
