// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import useStyledSystem from './use_styled_system';
import {allStylesParser, allStylesPropTypes, type AllStylesProps} from './system/index';
import {ariaPropTypes, type AriaProps} from './types/aria_props';
import {tooltipAnchorPropTypes, type TooltipAnchorProps} from './types/tooltip_anchor_props';

type Props = {|
    as?:
        | 'div'
        | 'span'
        | 'section'
        | 'main'
        | 'nav'
        | 'header'
        | 'footer'
        | 'aside'
        | 'article'
        | 'address'
        | 'hgroup'
        | 'blockquote'
        | 'figure'
        | 'figcaption'
        | 'ol'
        | 'ul'
        | 'li'
        | 'pre',
    id?: string,
    children?: React.Node,
    className?: string,
    style?: {+[string]: mixed},
    tabIndex?: number | string,
    role?: string,
    dataAttributes?: {+[string]: mixed},
    ...AriaProps,
    ...TooltipAnchorProps,
    ...AllStylesProps,
|};

/** @private */
function Box(
    {
        as: Component = 'div',
        id,
        children,
        className,
        style,
        tabIndex,
        role,
        onClick,
        onMouseEnter,
        onMouseLeave,
        hasOnClick,
        dataAttributes = {},
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
        'aria-describedby': ariaDescribedBy,
        'aria-controls': ariaControls,
        'aria-expanded': ariaExpanded,
        'aria-haspopup': ariaHasPopup,
        'aria-hidden': ariaHidden,
        'aria-live': ariaLive,
        ...styleProps
    }: Props,
    ref,
) {
    const classNameForStyleProps = useStyledSystem((styleProps: AllStylesProps), allStylesParser);

    return (
        <Component
            ref={ref}
            id={id}
            className={cx(classNameForStyleProps, className)}
            style={style}
            tabIndex={tabIndex}
            role={role}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            aria-controls={ariaControls}
            aria-expanded={ariaExpanded}
            aria-haspopup={ariaHasPopup}
            aria-hidden={ariaHidden}
            aria-live={ariaLive}
            {...dataAttributes}
        >
            {children}
        </Component>
    );
}

const ForwardedRefBox = React.forwardRef/* :: <Props, HTMLElement> */(Box);

// eslint-disable-next-line flowtype/no-weak-types
(ForwardedRefBox: any).propTypes = {
    as: PropTypes.oneOf([
        'div',
        'span',
        'section',
        'main',
        'nav',
        'header',
        'footer',
        'aside',
        'article',
        'address',
        'hgroup',
        'blockquote',
        'figure',
        'figcaption',
        'ol',
        'ul',
        'li',
        'pre',
    ]),
    id: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
    tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    role: PropTypes.string,
    dataAttributes: PropTypes.object,
    ...ariaPropTypes,
    ...tooltipAnchorPropTypes,
    ...allStylesPropTypes,
};

export default ForwardedRefBox;
