import {cx, css} from 'emotion';
import {fontFamilies, colors, radii, opacities} from './tokens';

const baseInputStyles = css({
    borderRadius: radii.default,
    boxSizing: 'border-box',
    fontFamily: fontFamilies.default,
    fontWeight: 400,
    appearance: 'none',
    outline: 'none',
    border: 'none',
    '&:not(:disabled)': {
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
        opacity: opacities.quieter,
    },
});

const inputVariants = {
    default: cx(
        baseInputStyles,
        css({
            color: colors.dark,
            backgroundColor: colors.lightGray2,
        }),
    ),
};

export default inputVariants;
