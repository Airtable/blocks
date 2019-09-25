// @flow
import PropTypes from 'prop-types';

// TODO (stephen): decide which components should be valid tooltip anchors
export type TooltipAnchorProps = {|
    onMouseEnter?: (e: SyntheticMouseEvent<>) => mixed,
    onMouseLeave?: (e: SyntheticMouseEvent<>) => mixed,
    onClick?: (e: SyntheticMouseEvent<>) => mixed,
    hasOnClick?: boolean,
|};

export const tooltipAnchorPropTypes = {
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onClick: PropTypes.func,
    hasOnClick: PropTypes.bool,
};
