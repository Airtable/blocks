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
[src/ui/link.tsx:105](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/link.tsx#L105)_

**`typedef`** {object} LinkProps

**`property`** {'small' | 'default' | 'large' | 'xlarge'} [size="default"] The `size` of the link.
Defaults to `default`. Can be a responsive prop object.

**`property`** {'default' | 'dark' | 'light'} [variant="default"] The `variant` of the link which
defines the color. Defaults to `default`.

**`property`** {IconName | React.Element} [icon] The name of the icon or a react node. For more
details, see the [list of supported icons](/packages/sdk/docs/icons.md).

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

### `Optional` alignSelf

• **alignSelf**? : _Prop‹AlignSelfProperty›_

_Inherited from
[AlignSelfProps](_airtable_blocks_ui_system__flex_item.md#alignselfprops).[alignSelf](_airtable_blocks_ui_system__flex_item.md#optional-alignself)_

_Defined in
[src/ui/system/flex_item/align_self.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/align_self.ts#L10)_

Aligns flex items of the current flex line, overriding the `alignItems` value.

### `Optional` aria-controls

• **aria-controls**? : _undefined | string_

_Inherited from
[AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops).[aria-controls](_airtable_blocks_ui_types__aria_props.md#optional-aria-controls)_

_Defined in
[src/ui/types/aria_props.ts:14](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/types/aria_props.ts#L14)_

Identifies the element (or elements) whose contents or presence are controlled by the current
element.

### `Optional` aria-describedby

• **aria-describedby**? : _undefined | string_

_Inherited from
[AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops).[aria-describedby](_airtable_blocks_ui_types__aria_props.md#optional-aria-describedby)_

_Defined in
[src/ui/types/aria_props.ts:12](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/types/aria_props.ts#L12)_

Identifies the element (or elements) that describes the current object.

### `Optional` aria-expanded

• **aria-expanded**? : _undefined | false | true | "false" | "true"_

_Inherited from
[AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops).[aria-expanded](_airtable_blocks_ui_types__aria_props.md#optional-aria-expanded)_

_Defined in
[src/ui/types/aria_props.ts:16](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/types/aria_props.ts#L16)_

Indicates whether the element, or another grouping element it controls, is currently expanded or
collapsed.

### `Optional` aria-haspopup

• **aria-haspopup**? : _undefined | false | true | "grid" | "dialog" | "menu" | "listbox" | "false"
| "true" | "tree"_

_Inherited from
[AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops).[aria-haspopup](_airtable_blocks_ui_types__aria_props.md#optional-aria-haspopup)_

_Defined in
[src/ui/types/aria_props.ts:18](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/types/aria_props.ts#L18)_

Indicates the availability and type of interactive popup element, such as menu or dialog, that can
be triggered by an element.

### `Optional` aria-hidden

• **aria-hidden**? : _undefined | false | true | "false" | "true"_

_Inherited from
[AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops).[aria-hidden](_airtable_blocks_ui_types__aria_props.md#optional-aria-hidden)_

_Defined in
[src/ui/types/aria_props.ts:20](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/types/aria_props.ts#L20)_

Indicates whether the element is exposed to an accessibility API.

### `Optional` aria-label

• **aria-label**? : _undefined | string_

_Inherited from
[AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops).[aria-label](_airtable_blocks_ui_types__aria_props.md#optional-aria-label)_

_Defined in
[src/ui/types/aria_props.ts:8](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/types/aria_props.ts#L8)_

Defines a string value that labels the current element.

### `Optional` aria-labelledby

• **aria-labelledby**? : _undefined | string_

_Inherited from
[AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops).[aria-labelledby](_airtable_blocks_ui_types__aria_props.md#optional-aria-labelledby)_

_Defined in
[src/ui/types/aria_props.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/types/aria_props.ts#L10)_

Identifies the element (or elements) that labels the current object.

### `Optional` aria-live

• **aria-live**? : _undefined | "off" | "assertive" | "polite"_

_Inherited from
[AriaProps](_airtable_blocks_ui_types__aria_props.md#ariaprops).[aria-live](_airtable_blocks_ui_types__aria_props.md#optional-aria-live)_

_Defined in
[src/ui/types/aria_props.ts:22](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/types/aria_props.ts#L22)_

Indicates that an element will be updated, and describes the types of updates the user agents,
assistive technologies, and user can expect from the live region.

### `Optional` bottom

• **bottom**? : _Prop‹BottomProperty‹Length››_

_Inherited from
[BottomProps](_airtable_blocks_ui_system__position.md#bottomprops).[bottom](_airtable_blocks_ui_system__position.md#optional-bottom)_

_Defined in
[src/ui/system/position/bottom.ts:11](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/bottom.ts#L11)_

Specifies the vertical position of a positioned element. It has no effect on non-positioned
elements.

### `Optional` flex

• **flex**? : _Prop‹FlexProperty‹Length››_

_Inherited from
[FlexProps](_airtable_blocks_ui_system__flex_item.md#flexprops).[flex](_airtable_blocks_ui_system__flex_item.md#optional-flex)_

_Defined in
[src/ui/system/flex_item/flex.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/flex.ts#L10)_

Sets how a flex item will grow or shrink to fit the space available in its flex container. It is a
shorthand for `flexGrow`, `flexShrink`, and `flexBasis`.

### `Optional` flexBasis

• **flexBasis**? : _Prop‹FlexBasisProperty‹Length››_

_Inherited from
[FlexBasisProps](_airtable_blocks_ui_system__flex_item.md#flexbasisprops).[flexBasis](_airtable_blocks_ui_system__flex_item.md#optional-flexbasis)_

_Defined in
[src/ui/system/flex_item/flex_basis.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/flex_basis.ts#L10)_

Sets the initial main size of a flex item.

### `Optional` flexGrow

• **flexGrow**? : _Prop‹GlobalsNumber›_

_Inherited from
[FlexGrowProps](_airtable_blocks_ui_system__flex_item.md#flexgrowprops).[flexGrow](_airtable_blocks_ui_system__flex_item.md#optional-flexgrow)_

_Defined in
[src/ui/system/flex_item/flex_grow.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/flex_grow.ts#L10)_

Sets the flex grow factor of a flex item. If the size of flex items is smaller than the flex
container, items grow to fit according to `flexGrow`.

### `Optional` flexShrink

• **flexShrink**? : _Prop‹GlobalsNumber›_

_Inherited from
[FlexShrinkProps](_airtable_blocks_ui_system__flex_item.md#flexshrinkprops).[flexShrink](_airtable_blocks_ui_system__flex_item.md#optional-flexshrink)_

_Defined in
[src/ui/system/flex_item/flex_shrink.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/flex_shrink.ts#L10)_

Sets the flex shrink factor of a flex item. If the size of flex items is larger than the flex
container, items shrink to fit according to `flexShrink`.

### `Optional` fontWeight

• **fontWeight**? : _Prop‹FontWeightProperty | string›_

_Inherited from
[FontWeightProps](_airtable_blocks_ui_system__typography.md#fontweightprops).[fontWeight](_airtable_blocks_ui_system__typography.md#optional-fontweight)_

_Defined in
[src/ui/system/typography/font_weight.ts:11](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/typography/font_weight.ts#L11)_

Specifies the weight (or boldness) of the font.

### `Optional` left

• **left**? : _Prop‹LeftProperty‹Length››_

_Inherited from
[LeftProps](_airtable_blocks_ui_system__position.md#leftprops).[left](_airtable_blocks_ui_system__position.md#optional-left)_

_Defined in
[src/ui/system/position/left.ts:11](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/left.ts#L11)_

Specifies the horizontal position of a positioned element. It has no effect on non-positioned
elements.

### `Optional` margin

• **margin**? : _Prop‹MarginProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[margin](_airtable_blocks_ui_system__spacing.md#optional-margin)_

_Defined in
[src/ui/system/spacing/margin.ts:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L17)_

Sets the margin area on all four sides of an element. It is a shorthand for `marginTop`,
`marginRight`, `marginBottom`, and `marginLeft`.

### `Optional` marginBottom

• **marginBottom**? : _Prop‹MarginBottomProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginBottom](_airtable_blocks_ui_system__spacing.md#optional-marginbottom)_

_Defined in
[src/ui/system/spacing/margin.ts:23](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L23)_

Sets the margin area on the bottom of an element. A positive value places it farther from its
neighbors, while a negative value places it closer.

### `Optional` marginLeft

• **marginLeft**? : _Prop‹MarginLeftProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginLeft](_airtable_blocks_ui_system__spacing.md#optional-marginleft)_

_Defined in
[src/ui/system/spacing/margin.ts:25](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L25)_

Sets the margin area on the left of an element. A positive value places it farther from its
neighbors, while a negative value places it closer.

### `Optional` marginRight

• **marginRight**? : _Prop‹MarginRightProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginRight](_airtable_blocks_ui_system__spacing.md#optional-marginright)_

_Defined in
[src/ui/system/spacing/margin.ts:21](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L21)_

Sets the margin area on the right of an element. A positive value places it farther from its
neighbors, while a negative value places it closer.

### `Optional` marginTop

• **marginTop**? : _Prop‹MarginTopProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginTop](_airtable_blocks_ui_system__spacing.md#optional-margintop)_

_Defined in
[src/ui/system/spacing/margin.ts:19](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L19)_

Sets the margin area on the top of an element. A positive value places it farther from its
neighbors, while a negative value places it closer.

### `Optional` marginX

• **marginX**? : _Prop‹MarginProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginX](_airtable_blocks_ui_system__spacing.md#optional-marginx)_

_Defined in
[src/ui/system/spacing/margin.ts:27](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L27)_

Sets the margin area on the top and bottom of an element. A positive value places it farther from
its neighbors, while a negative value places it closer.

### `Optional` marginY

• **marginY**? : _Prop‹MarginProperty‹Length››_

_Inherited from
[MarginProps](_airtable_blocks_ui_system__spacing.md#marginprops).[marginY](_airtable_blocks_ui_system__spacing.md#optional-marginy)_

_Defined in
[src/ui/system/spacing/margin.ts:29](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/margin.ts#L29)_

Sets the margin area on the left and right of an element. A positive value places it farther from
its neighbors, while a negative value places it closer.

### `Optional` maxWidth

• **maxWidth**? : _Prop‹MaxWidthProperty‹Length››_

_Inherited from
[MaxWidthProps](_airtable_blocks_ui_system__dimensions.md#maxwidthprops).[maxWidth](_airtable_blocks_ui_system__dimensions.md#optional-maxwidth)_

_Defined in
[src/ui/system/dimensions/max_width.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/dimensions/max_width.ts#L10)_

Sets the maximum width of an element. It prevents the used value of the `width` property from
becoming larger than the value specified by `maxWidth`.

### `Optional` minWidth

• **minWidth**? : _Prop‹MinWidthProperty‹Length››_

_Inherited from
[MinWidthProps](_airtable_blocks_ui_system__dimensions.md#minwidthprops).[minWidth](_airtable_blocks_ui_system__dimensions.md#optional-minwidth)_

_Defined in
[src/ui/system/dimensions/min_width.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/dimensions/min_width.ts#L10)_

Sets the minimum width of an element. It prevents the used value of the `width` property from
becoming smaller than the value specified for `minWidth`.

### `Optional` order

• **order**? : _Prop‹GlobalsNumber›_

_Inherited from
[OrderProps](_airtable_blocks_ui_system__flex_item.md#orderprops).[order](_airtable_blocks_ui_system__flex_item.md#optional-order)_

_Defined in
[src/ui/system/flex_item/order.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/flex_item/order.ts#L10)_

Sets the order to lay out an item in a flex container. Items are sorted by ascending `order` value
and then by their source code order.

### `Optional` padding

• **padding**? : _Prop‹PaddingProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[padding](_airtable_blocks_ui_system__spacing.md#optional-padding)_

_Defined in
[src/ui/system/spacing/padding.ts:17](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L17)_

Sets the padding area on all four sides of an element. It is a shorthand for `paddingTop`,
`paddingRight`, `paddingBottom`, and `paddingLeft`.

### `Optional` paddingBottom

• **paddingBottom**? : _Prop‹PaddingBottomProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingBottom](_airtable_blocks_ui_system__spacing.md#optional-paddingbottom)_

_Defined in
[src/ui/system/spacing/padding.ts:23](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L23)_

Sets the height of the padding area on the bottom side of an element.

### `Optional` paddingLeft

• **paddingLeft**? : _Prop‹PaddingLeftProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingLeft](_airtable_blocks_ui_system__spacing.md#optional-paddingleft)_

_Defined in
[src/ui/system/spacing/padding.ts:25](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L25)_

Sets the width of the padding area on the left side of an element.

### `Optional` paddingRight

• **paddingRight**? : _Prop‹PaddingRightProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingRight](_airtable_blocks_ui_system__spacing.md#optional-paddingright)_

_Defined in
[src/ui/system/spacing/padding.ts:21](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L21)_

Sets the width of the padding area on the right side of an element.

### `Optional` paddingTop

• **paddingTop**? : _Prop‹PaddingTopProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingTop](_airtable_blocks_ui_system__spacing.md#optional-paddingtop)_

_Defined in
[src/ui/system/spacing/padding.ts:19](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L19)_

Sets the height of the padding area on the top side of an element.

### `Optional` paddingX

• **paddingX**? : _Prop‹PaddingProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingX](_airtable_blocks_ui_system__spacing.md#optional-paddingx)_

_Defined in
[src/ui/system/spacing/padding.ts:27](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L27)_

Sets the width of the padding area on the left and right sides of an element.

### `Optional` paddingY

• **paddingY**? : _Prop‹PaddingProperty‹Length››_

_Inherited from
[PaddingProps](_airtable_blocks_ui_system__spacing.md#paddingprops).[paddingY](_airtable_blocks_ui_system__spacing.md#optional-paddingy)_

_Defined in
[src/ui/system/spacing/padding.ts:29](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/spacing/padding.ts#L29)_

Sets the height of the padding area on the top and bottom sides of an element.

### `Optional` position

• **position**? : _Prop‹PositionProperty›_

_Inherited from
[PositionProps](_airtable_blocks_ui_system__position.md#positionprops).[position](_airtable_blocks_ui_system__position.md#optional-position)_

_Defined in
[src/ui/system/position/position.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/position.ts#L10)_

Sets how an element is positioned in a document. The `top`, `right`, `bottom`, and `left` properties
determine the final location of positioned elements.

### `Optional` right

• **right**? : _Prop‹RightProperty‹Length››_

_Inherited from
[RightProps](_airtable_blocks_ui_system__position.md#rightprops).[right](_airtable_blocks_ui_system__position.md#optional-right)_

_Defined in
[src/ui/system/position/right.ts:11](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/right.ts#L11)_

Specifies the horizontal position of a positioned element. It has no effect on non-positioned
elements.

### `Optional` top

• **top**? : _Prop‹TopProperty‹Length››_

_Inherited from
[TopProps](_airtable_blocks_ui_system__position.md#topprops).[top](_airtable_blocks_ui_system__position.md#optional-top)_

_Defined in
[src/ui/system/position/top.ts:11](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/top.ts#L11)_

Specifies the vertical position of a positioned element. It has no effect on non-positioned
elements.

### `Optional` width

• **width**? : _Prop‹WidthProperty‹Length››_

_Inherited from
[WidthProps](_airtable_blocks_ui_system__dimensions.md#widthprops).[width](_airtable_blocks_ui_system__dimensions.md#optional-width)_

_Defined in
[src/ui/system/dimensions/width.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/dimensions/width.ts#L10)_

Specifies the width of an element.

### `Optional` zIndex

• **zIndex**? : _Prop‹ZIndexProperty›_

_Inherited from
[ZIndexProps](_airtable_blocks_ui_system__position.md#zindexprops).[zIndex](_airtable_blocks_ui_system__position.md#optional-zindex)_

_Defined in
[src/ui/system/position/z_index.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/system/position/z_index.ts#L10)_

Sets the z-order of a positioned element and its descendants or flex items. Overlapping elements
with larger z-indexes cover those with smaller ones.

## Variables

### `Const` Link

• **Link**: _ForwardRefExoticComponent‹[LinkProps](_airtable_blocks_ui__link.md#linkprops) &
RefAttributes‹HTMLAnchorElement››_ = React.forwardRef<HTMLAnchorElement, LinkProps>( ( { size =
TextSize.default, variant = LinkVariant.default, underline = false, icon, href, id, target,
onMouseEnter, onMouseLeave, onClick, hasOnClick, tabIndex, className, style, children,
dataAttributes, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, 'aria-describedby':
ariaDescribedBy, 'aria-controls': ariaControls, 'aria-expanded': ariaExpanded, 'aria-haspopup':
ariaHasPopup, 'aria-hidden': ariaHidden, 'aria-live': ariaLive, ...styleProps }: LinkProps, ref:
React.Ref<HTMLAnchorElement>, ) => { const classNameForTextStyle = useTextStyle(size); const
classNameForLinkVariant = useLinkVariant(variant); const classNameForUnderline = useStyledSystem({
textDecoration: underline ? 'underline' : 'none', }); const classNameForStyleProps =
useStyledSystem<StyleProps>( { display: 'inline-flex', // Use a negative margin to undo the padding.
padding: '0 0.1em', margin: '0 -0.1em', maxWidth: '100%',

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
    },

)

_Defined in
[src/ui/link.tsx:175](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/link.tsx#L175)_

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
