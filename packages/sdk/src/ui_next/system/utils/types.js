// @flow
export type ResponsivePropArray<T> = Array<T>;

export type ResponsivePropObject<T> = {
    [key: string]: T,
};

export type ResponsiveProp<T> = ResponsivePropArray<T> | ResponsivePropObject<T>;

export type Prop<T> = T | ResponsiveProp<T> | void | null;

export type Length = number;
