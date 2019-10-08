import PropTypes from 'prop-types';

// TODO (stephen): decide which components should be valid tooltip anchors
export interface TooltipAnchorProps<T = HTMLElement> {
    onMouseEnter?: (e: React.MouseEvent<T>) => unknown;
    onMouseLeave?: (e: React.MouseEvent<T>) => unknown;
    // Some components such as `TextButton` override `onClick` to contain `MouseEvent` and `KeyboardEvent`.
    // That approach is not completely correctly typed (but works in practice) because inside of `Tooltip`
    // TS is not able to figure out the type of `props.children.onClick`, and it falls back to `any` instead.
    // For now this solution will be the most pragmatic.
    onClick?: (e: React.MouseEvent<T>) => unknown;
    hasOnClick?: boolean;
}

export const tooltipAnchorPropTypes = {
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onClick: PropTypes.func,
    hasOnClick: PropTypes.bool,
};
