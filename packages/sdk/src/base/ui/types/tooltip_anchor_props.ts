import React from 'react';
import PropTypes from 'prop-types';

// TODO (stephen): decide which components should be valid tooltip anchors
/** @hidden */
export interface TooltipAnchorProps<T = HTMLElement> {
    /** @hidden */
    onMouseEnter?: (e: React.MouseEvent<T>) => unknown;
    /** @hidden */
    onMouseLeave?: (e: React.MouseEvent<T>) => unknown;
    // Some components such as `TextButton` override `onClick` to contain `MouseEvent` and `KeyboardEvent`.
    // That approach is not completely correctly typed (but works in practice) because inside of `Tooltip`
    // TS is not able to figure out the type of `props.children.onClick`, and it falls back to `any` instead.
    // For now this solution will be the most pragmatic.
    /** @hidden */
    onClick?: (e: React.MouseEvent<T>) => unknown;
    /** @hidden */
    hasOnClick?: boolean;
}

export const tooltipAnchorPropTypes = {
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onClick: PropTypes.func,
    hasOnClick: PropTypes.bool,
};
