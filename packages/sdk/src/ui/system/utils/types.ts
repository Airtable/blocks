export interface ResponsivePropObject<T> {
    xsmallViewport?: T;
    smallViewport?: T;
    mediumViewport?: T;
    largeViewport?: T;
}

export type ResponsiveKey = keyof ResponsivePropObject<unknown>;

export type ResponsiveProp<T> = T | ResponsivePropObject<T>;

export type Prop<T> = ResponsiveProp<T> | void | null;

export type Length = number;
