// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import useStyledSystem from './use_styled_system';
import {allStylesParser, allStylesPropTypes, type AllStylesProps} from './system/index';
import {ariaPropTypes, type AriaProps} from './types/aria_props';
import {tooltipAnchorPropTypes, type TooltipAnchorProps} from './types/tooltip_anchor_props';

/**
 * @typedef {object} BoxProps
 * @property {'div' | 'span' | 'section' | 'main' | 'nav' | 'header' | 'footer' | 'aside' | 'article' | 'address' | 'hgroup' | 'blockquote' | 'figure' | 'figcaption' | 'ol' | 'ul' | 'li' | 'pre'} [as='div'] The element that is rendered. Defaults to `div`.
 * @property {string} [id] The `id` attribute.
 * @property {string} [tabIndex] The `tabIndex` attribute.
 * @property {string} [role] The `role` attribute.
 * @property {string} [className] Additional class names to apply, separated by spaces.
 * @property {object} [style] Additional styles.
 * @property {object} [dataAttributes] Data attributes that are spread onto the element `dataAttributes={{'data-*': '...'}}`.
 * @property {string} [aria-label] The `aria-label` attribute.
 * @property {string} [aria-labelledby] The `aria-labelledby` attribute. A space separated list of label element IDs.
 * @property {string} [aria-describedby] The `aria-describedby` attribute. A space separated list of description element IDs.
 * @property {string} [aria-controls] The `aria-controls` attribute.
 * @property {string} [aria-expanded] The `aria-expanded` attribute.
 * @property {string} [aria-haspopup] The `aria-haspopup` attribute.
 * @property {string} [aria-hidden] The `aria-hidden` attribute.
 * @property {string} [aria-live] The `aria-live` attribute.
 */
type BoxProps = {|
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
    tabIndex?: number | string,
    role?: string,
    className?: string,
    style?: {+[string]: mixed},
    dataAttributes?: {+[string]: mixed},
    ...AriaProps,
    ...TooltipAnchorProps,
    ...AllStylesProps,
|};

/**
 * A box component for creating layouts.
 *
 * @example
 * import {Box} from '@airtable/blocks/ui';
 * import React, {Fragment} from 'react';
 *
 * function BoxExample() {
 *     return (
 *         <Box display='flex' alignItems='center' justifyContent='center' padding={3} margin={3}>
 *             Hello world
 *         </Box>
 *     );
 * }
 */
function Box(props: BoxProps, ref) {
    const {
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
        // eslint-disable-next-line no-unused-vars
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
    } = props;
    const classNameForStyleProps = useStyledSystem((styleProps: AllStylesProps), allStylesParser);

    return (
        <Component
            ref={ref}
            id={id}
            className={cx(classNameForStyleProps, className)}
            style={style}
            tabIndex={tabIndex}
            role={role}
            // TODO (stephen): remove tooltip anchor props
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

// prettier-ignore
const ForwardedRefBox = React.forwardRef/* :: <BoxProps, HTMLElement> */(Box);

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
