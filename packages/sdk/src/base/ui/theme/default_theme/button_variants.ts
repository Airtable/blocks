import {cx, css} from 'emotion';
import {fontFamilies, colors, radii, opacities} from './tokens';

const baseStyles = css({
    fontFamily: fontFamilies.default,
    borderRadius: radii.default,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    fontWeight: 500,
    userSelect: 'none',
    outline: 'none',
    appearance: 'none',
    border: 'none',
    '&:not(:disabled)': {
        cursor: 'pointer',
        '&:hover': {
            opacity: opacities.quiet,
        },
        '&:active': {
            opacity: 1,
        },
        '&:focus': {
            boxShadow: `inset 0 0 0 2px ${colors.darken3}`,
        },
    },
    '&:disabled': {
        cursor: 'default',
        opacity: opacities.quieter,
    },
});

const buttonVariants = {
    default: cx(
        baseStyles,
        css({
            color: colors.dark,
            backgroundColor: colors.lightGray2,
        }),
    ),
    primary: cx(
        baseStyles,
        css({
            color: colors.white,
            backgroundColor: colors.blueBright,
        }),
    ),
    secondary: cx(
        baseStyles,
        css({
            color: colors.dark,
            backgroundColor: 'transparent',
            '&:hover': {
                backgroundColor: colors.lightGray2,
            },
        }),
    ),
    danger: cx(
        baseStyles,
        css({
            color: colors.white,
            backgroundColor: colors.redBright,
        }),
    ),
};

export default buttonVariants;
