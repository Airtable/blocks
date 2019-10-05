/** @module @airtable/blocks/ui: UI & typography primitives */ /** */
import * as React from 'react';
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import useStyledSystem from './use_styled_system';
import {allStylesPropTypes, AllStylesProps} from './system/index';
import {ariaPropTypes, AriaProps} from './types/aria_props';
import {tooltipAnchorPropTypes, TooltipAnchorProps} from './types/tooltip_anchor_props';

/**
 * @typedef {object} BoxProps
 * @property {'div' | 'span' | 'section' | 'main' | 'nav' | 'header' | 'footer' | 'aside' | 'article' | 'address' | 'hgroup' | 'blockquote' | 'figure' | 'figcaption' | 'ol' | 'ul' | 'li' | 'pre'} [as='div'] The element that is rendered. Defaults to `div`.
 * @property {string} [id] The `id` attribute.
 * @property {number} [tabIndex] The `tabIndex` attribute.
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
export type BoxProps = {
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
        | 'pre';
} & (AllStylesProps) & {
        children?: React.ReactNode;
        tabIndex?: number;
        role?: string;
        id?: string;
        style?: React.CSSProperties;
        dataAttributes?: {readonly [key: string]: unknown};
    } & (AriaProps) &
    (TooltipAnchorProps) & {className?: string};

/**
 * A box component for creating layouts.
 *
 * @reactComponent
 * @example
 * ```js
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
 * ```
 */
function Box(props: BoxProps, ref: React.Ref<HTMLElement>) {
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const classNameForStyleProps = useStyledSystem<AllStylesProps>(styleProps);

    return (
        <Component
            ref={ref as any}
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

const ForwardedRefBox = React.forwardRef<HTMLElement, BoxProps>(Box);

(ForwardedRefBox as any).propTypes = {
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
    tabIndex: PropTypes.number,
    role: PropTypes.string,
    dataAttributes: PropTypes.object,
    ...ariaPropTypes,
    ...tooltipAnchorPropTypes,
    ...allStylesPropTypes,
};

export default ForwardedRefBox;
