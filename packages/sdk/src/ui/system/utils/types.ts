/** @module @airtable/blocks/ui/system: Core */ /** */

/**
 * TODO(stephen): document this maybe
 *
 * @hidden
 */
export interface ResponsivePropObject<T> {
    /** */
    xsmallViewport?: T;
    /** */
    smallViewport?: T;
    /** */
    mediumViewport?: T;
    /** */
    largeViewport?: T;
}

/** @hidden */
export type ResponsiveKey = keyof ResponsivePropObject<unknown>;

/**
 * TODO(stephen): document this maybe
 *
 * @hidden
 */
export type ResponsiveProp<T> = T | ResponsivePropObject<T>;

/**
 * TODO(stephen): document this maybe
 *
 * @hidden
 */
export type Prop<T> = ResponsiveProp<T> | void | null;

/** @hidden */
export type Length = number;
