import PropTypes from 'prop-types';

// TODO (stephen): decide which components should be valid tooltip anchors
export type TooltipAnchorProps = {
    onMouseEnter?: (e: React.MouseEvent) => unknown;
    onMouseLeave?: (e: React.MouseEvent) => unknown;
    onClick?: (e: React.MouseEvent) => unknown;
    hasOnClick?: boolean;
};

export const tooltipAnchorPropTypes = {
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onClick: PropTypes.func,
    hasOnClick: PropTypes.bool,
};
