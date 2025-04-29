/** @module @airtable/blocks/ui/system: Responsive props */ /** */

/**
 * An object that specifies the responsive behavior of a {@link ResponsiveProp}.
 * For each viewport size, you may specify the value that will be used for
 * the prop. This is equivalent to defining a media query in CSS.
 */
export interface ResponsivePropObject<T> {
    /** Sets the value of this responsive prop in an extra small viewport. */
    xsmallViewport?: T;
    /** Sets the value of this responsive prop in a small viewport. */
    smallViewport?: T;
    /** Sets the value of this responsive prop in a medium viewport. */
    mediumViewport?: T;
    /** Sets the value of this responsive prop in a large viewport. */
    largeViewport?: T;
}

/** @hidden */
export type ResponsiveKey = keyof ResponsivePropObject<unknown>;

/**
 * A React component prop that may vary based on the viewport width.
 * You can either pass in a single value that applies to all viewports
 * or a {@link ResponsivePropObject} that specifies responsive behavior.
 */
export type ResponsiveProp<T> = T | ResponsivePropObject<T>;

/**
 * An optional {@link ResponsiveProp} that can be null or undefined.
 */
export type OptionalResponsiveProp<T> = ResponsiveProp<T> | undefined | null;

/** @hidden */
export type Length = number;
