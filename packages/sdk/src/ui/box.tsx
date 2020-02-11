/** @module @airtable/blocks/ui: Box */ /** */
import * as React from 'react';
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import useStyledSystem from './use_styled_system';
import {allStylesPropTypes, AllStylesProps} from './system/index';
import {ariaPropTypes, AriaProps} from './types/aria_props';
import {tooltipAnchorPropTypes, TooltipAnchorProps} from './types/tooltip_anchor_props';
import {dataAttributesPropType, DataAttributesProp} from './types/data_attributes_prop';

/**
 * Props for the Box component. Also accepts:
 * * {@link AllStylesProps}
 * * {@link AriaProps}
 *
 * @docsPath UI/components/Box
 * @noInheritDoc
 */
export interface BoxProps extends AllStylesProps, AriaProps, TooltipAnchorProps {
    /** The element that is rendered. Defaults to `div`. */
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
    /** The contents of the box. */
    children?: React.ReactNode | string;
    /** The `tabIndex` attribute. */
    tabIndex?: number;
    /** The `role` attribute. */
    role?: string;
    /** The `id` attribute. */
    id?: string;
    /** Additional class names to apply, separated by spaces. */
    className?: string;
    /** Additional styles. */
    style?: React.CSSProperties;
    /** Data attributes that are spread onto the element, e.g. `dataAttributes={{'data-*': '...'}}`. */
    dataAttributes?: DataAttributesProp;
}

/**
 * A box component for creating layouts.
 *
 * [[ Story id="box--example" title="Box example" ]]
 *
 * @component
 * @docsPath UI/components/Box
 */
const Box = (props: BoxProps, ref: React.Ref<HTMLElement>) => {
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
};

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
    dataAttributes: dataAttributesPropType,
    ...ariaPropTypes,
    ...tooltipAnchorPropTypes,
    ...allStylesPropTypes,
};

ForwardedRefBox.displayName = 'Box';

export default ForwardedRefBox;
