/** @module @airtable/blocks/ui: Link */ /** */
import PropTypes from 'prop-types';
import * as React from 'react';
import {cx} from 'emotion';
import {compose} from '@styled-system/core';
import {createEnum, EnumType, createPropTypeFromEnum} from '../private_utils';
import useStyledSystem from './use_styled_system';
import useTheme from './theme/use_theme';
import {ariaPropTypes, AriaProps} from './types/aria_props';
import createResponsivePropType from './system/utils/create_responsive_prop_type';
import {Prop} from './system/utils/types';
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

export interface StyleProps
    extends MaxWidthProps,
        MinWidthProps,
        WidthProps,
        FlexItemSetProps,
        PositionSetProps,
        FontWeightProps,
        SpacingSetProps {
    display?: Prop<'inline-flex' | 'flex' | 'none'>;
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

export const stylePropTypes = {
    display: createResponsivePropType(PropTypes.oneOf(['inline-flex', 'flex', 'none'] as const)),
    ...maxWidthPropTypes,
    ...minWidthPropTypes,
    ...widthPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...fontWeightPropTypes,
    ...spacingSetPropTypes,
};

type LinkVariant = EnumType<typeof LinkVariant>;
const LinkVariant = createEnum('default', 'dark', 'light');
const linkVariantPropType = createPropTypeFromEnum(LinkVariant);

/** @internal */
function useLinkVariant(variant: LinkVariant = LinkVariant.default): string {
    const {linkVariants} = useTheme();
    return linkVariants[variant];
}

/**
 * @typedef {object} LinkProps
 * @property {'small' | 'default' | 'large' | 'xlarge'} [size="default"] The `size` of the link. Defaults to `default`. Can be a responsive prop object.
 * @property {'default' | 'dark' | 'light'} [variant="default"] The `variant` of the link which defines the color. Defaults to `default`.
 * @property {IconName | React.Element} [icon] The name of the icon or a react node. For more details, see the [list of supported icons](/packages/sdk/docs/icons.md).
 * @property {boolean} [underline="false"] Adds an underline to the link when true.
 * @property {string} href The target URL or URL fragment for the link.
 * @property {string} [target] Specifies where to display the linked URL.
 * @property {number} [tabIndex] Indicates if the link can be focused and if/where it participates in sequential keyboard navigation.
 * @property {string} [className] Additional class names to apply to the link.
 * @property {object} [style] Additional styles to apply to the link.
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
interface LinkProps extends TooltipAnchorProps<HTMLAnchorElement>, AriaProps, StyleProps {
    size?: TextSizeProp;
    variant?: LinkVariant;
    icon?: IconName | React.ReactElement;
    underline?: boolean;
    href: string;
    target?: string;
    id?: string;
    tabIndex?: number;
    className?: string;
    style?: React.CSSProperties;
    dataAttributes?: {readonly [key: string]: unknown};
    children: React.ReactNode;
}

// A "reasonable" scheme is one which does not have any escaped characters.
// This means if it passes this regex, we can confidently check to make sure the
// scheme is not "javascript://" to avoid XSS. Otherwise, "javascript" may be encoded
// as "&#106avascript://" or any other permutation of escaped characters.
// Ref: https://tools.ietf.org/html/rfc3986#section-3.1
const reasonableUrlSchemeRegex = /^[a-z0-9]+:\/\//i;

/** @internal */
function _getSanitizedHref(href: string): string | undefined {
    if (!href) {
        return undefined;
    }
    const hasScheme = href.indexOf('://') !== -1;
    if (!hasScheme) {
        // If it's a relative URL (like '/foo'), leave it alone.
        return href;
    } else if (
        reasonableUrlSchemeRegex.test(href) &&
        !/^javascript:/i.test(href) &&
        !/^data:/i.test(href)
    ) {
        // If it has a scheme and we can be 100% sure the scheme is
        // not javascript or data, then leave it alone.
        return href;
    } else {
        // We can't be confident that the scheme isn't javascript or data,
        // (possibly with escaped characters), so prepend http:// to avoid
        // XSS.
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
 * @augments React.StatelessFunctionalComponent
 * @param props
 *
 * @example
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
 */
function Link(props: LinkProps, ref: React.Ref<HTMLAnchorElement>) {
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
    const classNameForStyleProps = useStyledSystem<StyleProps>(
        {
            display: 'inline-flex',
            // Use a negative margin to undo the padding.
            padding: '0 0.1em',
            margin: '0 -0.1em',
            maxWidth: '100%',

            ...styleProps,
        },
        styleParser,
    );

    // Set rel="noopener noreferrer" to avoid reverse tabnabbing.
    // https://www.owasp.org/index.php/Reverse_Tabnabbing
    const rel = target ? 'noopener noreferrer' : undefined;

    return (
        <a
            ref={ref}
            href={_getSanitizedHref(href)}
            target={target}
            id={id}
            rel={rel}
            // TODO (stephen): remove tooltip anchor props
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
}

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
    ...tooltipAnchorPropTypes,
    ...stylePropTypes,
    ...ariaPropTypes,
};

export default ForwardedRefLink;
