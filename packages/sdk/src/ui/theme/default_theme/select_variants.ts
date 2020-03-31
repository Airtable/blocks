import {cx, css} from 'emotion';
import {fontFamilies, colors, radii, opacities} from './tokens';

const styleForChevron = {
    backgroundImage: `url("data:image/svg+xml,%3csvg width='7' height='6' viewBox='0 0 7 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M.601.8h4.8a.6.6 0 01.48.96l-2.4 3.2a.6.6 0 01-.96 0l-2.4-3.2A.6.6 0 01.601.8z' fill='rgba(0%2c 0%2c 0%2c 0.5)'/%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
};

const baseStyles = css({
    fontFamily: fontFamilies.default,
    borderRadius: radii.default,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 0,
    fontWeight: 400,
    outline: 'none',
    appearance: 'none',
    border: 'none',
    ...styleForChevron,
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

const selectVariants = {
    default: cx(
        baseStyles,
        css({
            color: colors.dark,
            backgroundColor: colors.lightGray2,
        }),
    ),
};

export default selectVariants;
