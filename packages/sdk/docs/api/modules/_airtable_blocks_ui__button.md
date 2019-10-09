[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: Button](_airtable_blocks_ui__button.md)

# External module: @airtable/blocks/ui: Button

## Index

### Interfaces

-   [ButtonProps](_airtable_blocks_ui__button.md#buttonprops)

### Variables

-   [Button](_airtable_blocks_ui__button.md#const-button)

## Interfaces

### ButtonProps

• **ButtonProps**:

_Defined in
[src/ui/button.tsx:106](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L106)_

**`typedef`** {object} ButtonProps

**`property`** {'small' | 'default' | 'large'} [size='default'] The size of the button. Defaults to
`default`. Can be a responsive prop object.

**`property`** {'default' | 'primary' | 'secondary' | 'danger'} [variant='default'] The variant of
the button. Defaults to `default`.

**`property`** {string | React.Node} [icon] The name of the icon or a react node. For more details,
see the [list of supported icons](/packages/sdk/docs/icons.md).

**`property`** {'button' | 'submit' | 'reset'} [type='button'] The type of the button. Defaults to
`button`.

**`property`** {string} [id] The `id` attribute.

**`property`** {boolean} [disabled] Indicates whether or not the user can interact with the button.

**`property`** {number} [tabIndex] Indicates if the button can be focused and if/where it
participates in sequential keyboard navigation.

**`property`** {Function} [onClick] Click event handler. Also handles Space and Enter keypress
events.

**`property`** {string} [className] Extra `className`s to apply to the button, separated by spaces.

**`property`** {object} [style] Extra styles to apply to the button.

**`property`** {string} [aria-selected] The `aria-selected` attribute.

**`property`** {string} [aria-label] The `aria-label` attribute. Use this if the button lacks a
visible text label.

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

### `Const` Button

• **Button**: _ForwardRefExoticComponent‹[ButtonProps](_airtable_blocks_ui__button.md#buttonprops) &
RefAttributes‹HTMLButtonElement››_ = React.forwardRef( ( { size = ControlSizes.DEFAULT, variant =
ButtonVariants.DEFAULT, icon, id, className, style, onMouseEnter, onMouseLeave, onClick, type =
'button', disabled, tabIndex, children, 'aria-label': ariaLabel, 'aria-selected': ariaSelected,
...styleProps }: ButtonProps, ref: React.Ref<HTMLButtonElement>, ) => { const classNameForButtonSize
= useButtonSize(size); const classNameForButtonVariant = useButtonVariant(variant); const
classNameForStyleProps = useStyledSystem( {display: 'inline-flex', ...styleProps}, styleParser, );
const hasIcon = icon !== undefined;

        return (
            <button
                ref={ref}
                id={id}
                className={cx(
                    classNameForButtonVariant,
                    classNameForButtonSize,
                    classNameForStyleProps,
                    className,
                )}
                style={style}
                // TODO (stephen): remove tooltip anchor props
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
                type={type}
                disabled={disabled}
                tabIndex={tabIndex}
                aria-label={ariaLabel}
                aria-selected={ariaSelected}
            >
                {typeof icon === 'string' ? (
                    <Icon name={icon} size="1em" fillColor="currentColor" flex="none" />
                ) : (
                    icon
                )}

                <Box
                    as="span"
                    // The margin is on the span, and not on the icon because it would mean that when using a custom icon
                    // the consumer would manually need to figure out what the margin is supposed to be.
                    marginLeft={hasIcon ? '0.5em' : undefined}
                    className={cssHelpers.TRUNCATE}
                >
                    {children}
                </Box>
            </button>
        );
    },

)

_Defined in
[src/ui/button.tsx:141](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/ui/button.tsx#L141)_

Clickable button component.

**`example`**

```js
import {Button} from '@airtable/blocks/ui';

const button = (
    <Button onClick={() => alert('Clicked!')} disabled={false} variant="primary">
        Click here!
    </Button>
);
```
