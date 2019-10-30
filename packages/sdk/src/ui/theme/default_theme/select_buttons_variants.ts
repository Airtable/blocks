import {css} from 'emotion';
import {fontFamilies, colors, radii, opacities} from './tokens';

const baseContainerStyles = css({
    borderRadius: radii.default,
    backgroundColor: colors.darken2,
    boxSizing: 'border-box',
    fontFamily: fontFamilies.default,
    overflow: 'hidden',
    display: 'flex',
    userSelect: 'none',
    fontWeight: 400,
    '&[aria-disabled="true"]': {
        cursor: 'default',
        opacity: opacities.quieter,
    },
});

const baseOptionStyles = css({
    display: 'flex',
    flex: 'auto',
    flexBasis: 0,
    overflow: 'hidden',
    paddingRight: '4px',
    paddingLeft: '4px',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radii.default,
    outline: 0,
    '&:not([aria-disabled="true"])': {
        cursor: 'pointer',
        '&:focus': {
            outline: 0,
            boxShadow: `inset 0 0 0 2px ${colors.darken3}`,
        },
    },
    '&[aria-disabled="true"]': {
        cursor: 'default',
        opacity: opacities.quieter,
    },
    '&[aria-checked="true"]': {
        backgroundColor: colors.darken4,
        color: colors.white,
    },
    '&:not([aria-checked="true"])': {
        color: colors.dark,
    },
    '&:not([aria-checked="true"]):not([aria-disabled="true"])': {
        opacity: opacities.quiet,
        '&:hover': {
            opacity: 1,
        },
    },
});

const selectButtonsVariants = {
    default: {
        containerClassNameForVariant: baseContainerStyles,
        optionClassNameForVariant: baseOptionStyles,
    },
};

export default selectButtonsVariants;
