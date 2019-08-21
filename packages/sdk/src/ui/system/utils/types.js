// @flow
export type ResponsivePropObject<T> = {|
    xsmallViewport?: T,
    smallViewport?: T,
    mediumViewport?: T,
    largeViewport?: T,
|};

export type Prop<T> = T | ResponsivePropObject<T> | void | null;

export type Length = number;
