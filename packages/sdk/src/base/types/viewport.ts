/** @module @airtable/blocks: viewport */ /** */

/** A constraint on the size of the Block's viewport */
export interface ViewportSizeConstraint {
    /** Width constraint in pixels, or null if no constraint */
    width: number | null;
    /** Height constraint in pixels, or null if no constraint */
    height: number | null;
}
