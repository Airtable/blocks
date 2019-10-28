/** @module @airtable/blocks/ui/system: Core */ /** */
import PropTypes from 'prop-types';

/** */
export interface DataAttributesProp {
    /** */
    readonly [key: string]: unknown;
}

export const dataAttributesPropType = PropTypes.object as PropTypes.Requireable<{
    readonly [key: string]: unknown;
}>;
