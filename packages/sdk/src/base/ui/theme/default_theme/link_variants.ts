import {css, cx} from 'emotion';
import {colors, radii, opacities} from './tokens';

const baseStyles = css({
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.default,
    outline: 'none',
    '&:hover': {
        opacity: opacities.quiet,
    },
    '&:active': {
        opacity: 1,
    },
    '&:focus': {
        boxShadow: `0 0 0 2px ${colors.darken3}`,
    },
});

const linkVariants = {
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

export default linkVariants;
