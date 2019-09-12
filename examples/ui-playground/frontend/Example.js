// @flow
import * as React from 'react';

export type Example = {|
    name: string,
    // eslint-disable-next-line flowtype/no-weak-types
    component: React.ComponentType<any>,
    hasSettings?: boolean,
|};
