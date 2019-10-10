[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: TextButton](_airtable_blocks_ui__textbutton.md)

# External module: @airtable/blocks/ui: TextButton

## Index

### Interfaces

-   [TextButtonProps](_airtable_blocks_ui__textbutton.md#textbuttonprops)

### Variables

-   [TextButton](_airtable_blocks_ui__textbutton.md#const-textbutton)

## Interfaces

### TextButtonProps

• **TextButtonProps**:

_Defined in
[src/ui/text_button.tsx:105](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/text_button.tsx#L105)_

**`typedef`** {object} TextButtonProps

**`property`** {'small' | 'default' | 'large' | 'xlarge'} [size='default'] The `size` of the text.
Defaults to `default`. Can be a responsive prop object.

**`property`** {string | React.ReactNode} [icon] The name of the icon or a react node. For more
details, see the [list of supported icons](/packages/sdk/docs/icons.md).

**`property`** {boolean} [disabled] Indicates whether or not the user can interact with the button.

**`property`** {string} [id] The `id` attribute.

**`property`** {number} [tabIndex] The `tabIndex` attribute.

**`property`** {Function} [onClick] Click event handler. Also handles Space and Enter keypress
events.

**`property`** {string} [className] Additional class names to apply, separated by spaces.

**`property`** {object} [style] Additional styles.

**`property`** {object} [dataAttributes] Data attributes that are spread onto the element
`dataAttributes={{'data-*': '...'}}`.

**`property`** {string} [aria-selected] The `aria-selected` attribute.

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

### `Const` TextButton

• **TextButton**:
_ForwardRefExoticComponent‹[TextButtonProps](_airtable_blocks_ui__textbutton.md#textbuttonprops) &
RefAttributes‹HTMLSpanElement››_ = React.forwardRef<HTMLSpanElement, TextButtonProps>( ( { size =
TextSizes.DEFAULT, variant = TextButtonVariants.DEFAULT, icon, children, disabled, id, tabIndex = 0,
dataAttributes, onClick, className, style, onMouseEnter, onMouseLeave, hasOnClick, 'aria-selected':
ariaSelected, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, 'aria-describedby':
ariaDescribedBy, 'aria-controls': ariaControls, 'aria-expanded': ariaExpanded, 'aria-haspopup':
ariaHasPopup, 'aria-hidden': ariaHidden, 'aria-live': ariaLive, ...styleProps }: TextButtonProps,
ref: React.Ref<HTMLSpanElement>, ) => { const classNameForTextButtonVariant =
useTextButtonVariant(variant); // Ignore text color since we define it in the variant. //
eslint-disable-next-line @typescript-eslint/no-unused-vars const {textColor,
...stylePropsForTextSize} = useTextSize(size); const classNameForTextSize = useStyledSystem({
...stylePropsForTextSize, fontWeight: 'strong', }); const classNameForStyleProps =
useStyledSystem<StyleProps>( { display: 'inline-flex', // Use a negative margin to undo the padding.
padding: '0 0.1em', margin: '0 -0.1em', maxWidth: '100%', ...styleProps, }, styleParser, );

        /** @internal */
        function _onKeyDown(e: React.KeyboardEvent<HTMLSpanElement>) {
            if (e.ctrlKey || e.metaKey || e.shiftKey) {
                return;
            }

            //  Use `Spacebar` to support FF <= 37, IE 9-11.
            if ([' ', 'Spacebar', 'Enter'].includes(e.key)) {
                // Prevent scrolling when pressing `Spacebar`.
                e.preventDefault();
                if (onClick) {
                    onClick(e);
                }
            }
        }

        return (
            <span
                ref={ref}
                id={id}
                // Don't set `tabIndex` if `disabled`. We do set it though even if
                // `onClick` is not provided so that it mimics the behavior of a native
                // `button`. We also prevent the user from passing in their own
                // `tabIndex` in the case that it is disabled. This is better than a
                // `-1` because `-1` will make the element focusable but not reachable
                // via keyboard navigation.
                tabIndex={!disabled ? tabIndex : undefined}
                // Only fire these events if the `disabled` prop is not true.
                onClick={!disabled ? onClick : undefined}
                onKeyDown={!disabled ? _onKeyDown : undefined}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                className={cx(
                    classNameForTextButtonVariant,
                    classNameForTextSize,
                    classNameForStyleProps,
                    className,
                )}
                style={style}
                // Always have `role="button"`, even if it is disabled. Combined with
                // `aria-disabled`, screen readers will announce this the same as
                // a native `button` element.
                role="button"
                // Announce to screen readers that the `TextButton` is disabled.
                aria-disabled={disabled ? 'true' : undefined}
                aria-selected={ariaSelected}
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
                {typeof icon === 'string' ? <Icon name={icon} flex="none" size="1em" /> : icon}
                <Box
                    as="span"
                    // The margin is on the span, and not on the icon because it would mean that when using a custom icon
                    // the consumer would manually need to figure out what the margin is supposed to be.
                    marginLeft={icon !== undefined ? '0.5em' : undefined}
                    className={cssHelpers.TRUNCATE}
                >
                    {children}
                </Box>
            </span>
        );
    },

)

_Defined in
[src/ui/text_button.tsx:147](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/text_button.tsx#L147)_

A text button component with sizes and variants.

**`example`** import {TextButton} from '@airtable/blocks/ui'; import React, {Fragment} from 'react';

function TextButtonExample() { return ( <Fragment> <TextButton>Default text, for single line
text</TextButton> <TextButton size="small">Small text button</TextButton> <TextButton size={{
                     xsmallViewport: 'small',
                     smallViewport: 'small',
                     mediumViewport: 'default',
                     largeViewport: 'large'
                 }} >Responsive text button</TextButton> </Fragment> ); }
