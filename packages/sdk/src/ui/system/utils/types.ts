export type ResponsivePropObject<T> = {
    xsmallViewport?: T;
    smallViewport?: T;
    mediumViewport?: T;
    largeViewport?: T;
};

export type ResponsiveKey = keyof ResponsivePropObject<unknown>;

export type Prop<T> = T | ResponsivePropObject<T> | void | null;

export type Length = number;
