/** @module @airtable/blocks/ui: Link */ /** */
import PropTypes from 'prop-types';
import * as React from 'react';
import {cx} from 'emotion';
import {compose} from '@styled-system/core';
import {createEnum, EnumType, createPropTypeFromEnum} from '../private_utils';
import useStyledSystem from './use_styled_system';
import useTheme from './theme/use_theme';
import {ariaPropTypes, AriaProps} from './types/aria_props';
import {dataAttributesPropType, DataAttributesProp} from './types/data_attributes_prop';
import createResponsivePropType from './system/utils/create_responsive_prop_type';
import {OptionalResponsiveProp} from './system/utils/types';
import {
    maxWidth,
    maxWidthPropTypes,
    MaxWidthProps,
    minWidth,
    minWidthPropTypes,
    MinWidthProps,
    width,
    widthPropTypes,
    WidthProps,
    flexItemSet,
    flexItemSetPropTypes,
    FlexItemSetProps,
    positionSet,
    positionSetPropTypes,
    PositionSetProps,
    fontWeight,
    fontWeightPropTypes,
    FontWeightProps,
    spacingSet,
    spacingSetPropTypes,
    SpacingSetProps,
    display,
} from './system';
import {tooltipAnchorPropTypes, TooltipAnchorProps} from './types/tooltip_anchor_props';
import {useTextStyle, TextSize, TextSizeProp, textSizePropType} from './text';
import {IconName, iconNamePropType} from './icon_config';
import Icon from './icon';

/**
 * Style props for the {@link Link} component. Also accepts:
 * * {@link FlexItemSetProps}
 * * {@link FontWeightProps}
 * * {@link MaxWidthProps}
 * * {@link MinWidthProps}
 * * {@link PositionSetProps}
 * * {@link SpacingSetProps}
 * * {@link WidthProps}
 *
 * @noInheritDoc
 */
export interface LinkStyleProps
    extends MaxWidthProps,
        MinWidthProps,
        WidthProps,
        FlexItemSetProps,
        PositionSetProps,
        FontWeightProps,
        SpacingSetProps {
    /** Defines the display type of an element, which consists of the two basic qualities of how an element generates boxes — the outer display type defining how the box participates in flow layout, and the inner display type defining how the children of the box are laid out. */
    display?: OptionalResponsiveProp<'inline-flex' | 'flex' | 'none'>;
}

const styleParser = compose(
    display,
    maxWidth,
    minWidth,
    width,
    flexItemSet,
    positionSet,
    fontWeight,
    spacingSet,
);

export const linkStylePropTypes = {
    display: createResponsivePropType(PropTypes.oneOf(['inline-flex', 'flex', 'none'] as const)),
    ...maxWidthPropTypes,
    ...minWidthPropTypes,
    ...widthPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...fontWeightPropTypes,
    ...spacingSetPropTypes,
};

/**
 * Variants for the {@link Link} component:
 *
 * • **default**
 *
 * Blue text.
 *
 * • **dark**
 *
 * Dark gray text.
 *
 * • **light**
 *
 * Light gray text.
 */
type LinkVariant = EnumType<typeof LinkVariant>;
const LinkVariant = createEnum('default', 'dark', 'light');
const linkVariantPropType = createPropTypeFromEnum(LinkVariant);

/** @internal */
function useLinkVariant(variant: LinkVariant = LinkVariant.default): string {
    const {linkVariants} = useTheme();
    return linkVariants[variant];
}

/**
 * Props for the {@link Link} component. Also supports:
 * * {@link AriaProps}
 * * {@link LinkStyleProps}
 *
 * @docsPath UI/components/Link
 * @noInheritDoc
 */
interface LinkProps extends AriaProps, LinkStyleProps, TooltipAnchorProps<HTMLAnchorElement> {
    /** The size of the link. Defaults to `default`. Can be a responsive prop object. */
    size?: TextSizeProp;
    /** The variant of the link, which defines the color. Defaults to `default`. */
    variant?: LinkVariant;
    /** The name of the icon or a react node. For more details, see the [list of supported icons](/packages/sdk/docs/icons.md). */
    icon?: IconName | React.ReactElement;
    /** Adds an underline to the link when true. */
    underline?: boolean;
    /** The target URL or URL fragment for the link. */
    href: string;
    /** Specifies where to display the linked URL. */
    target?: string;
    /** The `id` attribute. */
    id?: string;
    /** Indicates if the link can be focused and if/where it participates in sequential keyboard navigation. */
    tabIndex?: number;
    /** Additional class names to apply to the link. */
    className?: string;
    /** Additional styles to apply to the link. */
    style?: React.CSSProperties;
    /** Data attributes that are spread onto the element, e.g. `dataAttributes={{'data-*': '...'}}`. */
    dataAttributes?: DataAttributesProp;
    /** The contents of the link. */
    children: React.ReactNode | string;
}

const reasonableUrlSchemeRegex = /^[a-z0-9]+:\/\//i;

/** @internal */
function _getSanitizedHref(href: string): string | undefined {
    if (!href) {
        return undefined;
    }
    const hasScheme = href.indexOf('://') !== -1;
    if (!hasScheme) {
        return href;
    } else if (
        reasonableUrlSchemeRegex.test(href) &&
        !/^javascript:/i.test(href) &&
        !/^data:/i.test(href)
    ) {
        return href;
    } else {
        return 'http://' + href;
    }
}

/**
 * A wrapper around the `<a>` tag that offers a few security benefits:
 *
 * - Limited XSS protection. If the `href` starts with `javascript:` or `data:`, `http://` will be prepended.
 * - There is [reverse tabnabbing prevention](https://www.owasp.org/index.php/Reverse_Tabnabbing). If `target` is set, the `rel` attribute will be set to `noopener noreferrer`.
 *
 * Developers should use `Link` instead of `a` when possible.
 *
 * @example
 * ```js
 * import {Link} from '@airtable/blocks/ui';
 *
 * function MyLinkComponent() {
 *     return (
 *         <Link href="https://example.com">
 *             Check out my homepage!
 *         </Link>
 *     );
 * }
 * ```
 * @docsPath UI/components/Link
 * @component
 */
const Link = (props: LinkProps, ref: React.Ref<HTMLAnchorElement>) => {
    const {
        size = TextSize.default,
        variant = LinkVariant.default,
        underline = false,
        icon,
        href,
        id,
        target,
        onMouseEnter,
        onMouseLeave,
        onClick,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        hasOnClick,
        tabIndex,
        className,
        style,
        children,
        dataAttributes,
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

    const classNameForTextStyle = useTextStyle(size);
    const classNameForLinkVariant = useLinkVariant(variant);
    const classNameForUnderline = useStyledSystem({
        textDecoration: underline ? 'underline' : 'none',
    });
    const classNameForStyleProps = useStyledSystem<LinkStyleProps>(
        {
            display: 'inline-flex',
            padding: '0 0.1em',
            margin: '0 -0.1em',
            maxWidth: '100%',

            ...styleProps,
        },
        styleParser,
    );

    const rel = target ? 'noopener noreferrer' : undefined;

    return (
        <a
            ref={ref}
            href={_getSanitizedHref(href)}
            target={target}
            id={id}
            rel={rel}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            tabIndex={tabIndex}
            className={cx(
                classNameForTextStyle,
                classNameForLinkVariant,
                classNameForUnderline,
                classNameForStyleProps,
                className,
            )}
            style={style}
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
            {typeof icon === 'string' ? (
                <Icon name={icon as IconName} size="1em" flex="none" marginRight="0.5em" />
            ) : (
                icon
            )}
            {children}
        </a>
    );
};

const ForwardedRefLink = React.forwardRef<HTMLAnchorElement, LinkProps>(Link);

ForwardedRefLink.propTypes = {
    size: textSizePropType,
    variant: linkVariantPropType,
    icon: PropTypes.oneOfType([iconNamePropType, PropTypes.element]),
    href: PropTypes.string.isRequired,
    target: PropTypes.string,
    tabIndex: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    dataAttributes: dataAttributesPropType,
    ...tooltipAnchorPropTypes,
    ...linkStylePropTypes,
    ...ariaPropTypes,
};

ForwardedRefLink.displayName = 'Link';

export default ForwardedRefLink;
