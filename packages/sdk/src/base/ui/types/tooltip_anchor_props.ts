import PropTypes from 'prop-types';

/** @hidden */
export interface TooltipAnchorProps<T = HTMLElement> {
    /** @hidden */
    onMouseEnter?: (e: React.MouseEvent<T>) => unknown;
    /** @hidden */
    onMouseLeave?: (e: React.MouseEvent<T>) => unknown;
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
