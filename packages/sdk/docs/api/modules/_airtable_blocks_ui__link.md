[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Link](_airtable_blocks_ui__link.md)

# External module: @airtable/blocks/ui: Link

## Index

### Interfaces

-   [LinkProps](_airtable_blocks_ui__link.md#linkprops)

### Variables

-   [Link](_airtable_blocks_ui__link.md#const-link)

## Interfaces

### LinkProps

• **LinkProps**:

_Defined in
[src/ui/link.tsx:108](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/link.tsx#L108)_

**`typedef`** {object} LinkProps

**`property`** {'small' | 'default' | 'large' | 'xlarge'} [size="default"] The `size` of the link.
Defaults to `default`. Can be a responsive prop object.

**`property`** {'default' | 'dark' | 'light'} [variant="default"] The `variant` of the link which
defines the color. Defaults to `default`.

**`property`** {string | React.Node} [icon] The name of the icon or a react node. For more details,
see the [list of supported icons](/packages/sdk/docs/icons.md).

**`property`** {boolean} [underline="false"] Adds an underline to the link when true.

**`property`** {string} href The target URL or URL fragment for the link.

**`property`** {string} [target] Specifies where to display the linked URL.

**`property`** {number} [tabIndex] Indicates if the link can be focused and if/where it participates
in sequential keyboard navigation.

**`property`** {string} [className] Additional class names to apply to the link.

**`property`** {object} [style] Additional styles to apply to the link.

**`property`** {object} [dataAttributes] Data attributes that are spread onto the element
`dataAttributes={{'data-*': '...'}}`.

**`property`** {string} [aria-label] The `aria-label` attribute.

**`property`** {string} [aria-labelledby] The `aria-labelledby` attribute. A space separated list of
label element IDs.

**`property`** {string} [aria-describedby] The `aria-describedby` attribute. A space separated list
of description element IDs.

**`property`** {string} [aria-controls] The `aria-controls` attribute.

**`property`** {string} [aria-expanded] The `aria-expanded` attribute.

**`property`** {string} [aria-haspopup] The `aria-haspopup` attribute.

**`property`** {string} [aria-hidden] The `aria-hidden` attribute.

**`property`** {string} [aria-live] The `aria-live` attribute.

## Variables

### `Const` Link

• **Link**: _ForwardRefExoticComponent‹[LinkProps](_airtable_blocks_ui__link.md#linkprops) &
RefAttributes‹HTMLAnchorElement››_ = React.forwardRef<HTMLAnchorElement, LinkProps>( ( { size =
TextSizes.DEFAULT, variant = LinkVariants.DEFAULT, underline = false, icon, href, id, target,
onMouseEnter, onMouseLeave, onClick, hasOnClick, tabIndex, className, style, children,
dataAttributes, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, 'aria-describedby':
ariaDescribedBy, 'aria-controls': ariaControls, 'aria-expanded': ariaExpanded, 'aria-haspopup':
ariaHasPopup, 'aria-hidden': ariaHidden, 'aria-live': ariaLive, ...styleProps }: LinkProps, ref:
React.Ref<HTMLAnchorElement>, ) => { const classNameForLinkVariant = useLinkVariant(variant); //
TODO (jay): Remove `textColor` from `useTextSize` in the future. // eslint-disable-next-line
@typescript-eslint/no-unused-vars const {textColor, ...stylePropsForTextSize} = useTextSize(size);
const classNameForTextSize = useStyledSystem({ ...stylePropsForTextSize, textDecoration: underline ?
'underline' : 'none', }); const classNameForStyleProps = useStyledSystem<StyleProps>( { display:
'inline-flex', // Use a negative margin to undo the padding. padding: '0 0.1em', margin: '0 -0.1em',
maxWidth: '100%', ...styleProps, }, styleParser, );

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
                    classNameForLinkVariant,
                    classNameForTextSize,
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
                    <Icon name={icon} size="1em" flex="none" marginRight="0.5em" />
                ) : (
                    icon
                )}
                {children}
            </a>
        );
    },

)

_Defined in
[src/ui/link.tsx:178](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/link.tsx#L178)_

A wrapper around the `<a>` tag that offers a few security benefits:

-   Limited XSS protection. If the `href` starts with `javascript:` or `data:`, `http://` will be
    prepended.
-   There is [reverse tabnabbing prevention](https://www.owasp.org/index.php/Reverse_Tabnabbing). If
    `target` is set, the `rel` attribute will be set to `noopener noreferrer`.

Developers should use `Link` instead of `a` when possible.

**`augments`** React.StatelessFunctionalComponent

**`param`**

**`example`** import {Link} from '@airtable/blocks/ui';

function MyLinkComponent() { return ( <Link href="https://example.com"> Check out my homepage!
</Link> ); }

```

```
