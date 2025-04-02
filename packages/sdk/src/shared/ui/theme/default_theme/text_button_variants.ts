import {css, cx} from 'emotion';
import {colors, radii, opacities, fontWeights} from './tokens';

const NOT_DISABLED = '&:not([aria-disabled="true"])';
const DISABLED = '&[aria-disabled="true"]';

const baseStyles = css({
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.default,
    outline: 'none',
    fontWeight: fontWeights.strong,
    [NOT_DISABLED]: {
        cursor: 'pointer',
        '&:hover': {
            opacity: opacities.quiet,
        },
        '&:active': {
            opacity: 1,
        },
        '&:focus': {
            boxShadow: `0 0 0 2px ${colors.darken3}`,
        },
    },
    [DISABLED]: {
        opacity: opacities.quieter,
    },
});

const textButtonVariants = {
    default: cx(
        baseStyles,
        css({
            color: colors.blueBright,
        }),
    ),
    dark: cx(
        baseStyles,
        css({
            color: colors.dark,
        }),
    ),
    light: cx(
        baseStyles,
        css({
            color: colors.light,
        }),
    ),
};

export default textButtonVariants;
