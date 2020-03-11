import {css} from 'emotion';
import {fontFamilies, colors, radii, opacities} from './tokens';

const baseContainerStyles = css({
    borderRadius: radii.default,
    backgroundColor: colors.lightGray2,
    boxSizing: 'border-box',
    fontFamily: fontFamilies.default,
    overflow: 'hidden',
    display: 'flex',
    userSelect: 'none',
    fontWeight: 400,
    '&:active, &[data-focused="true"]': {
        boxShadow: `inset 0 0 0 2px ${colors.darken3}`,
    },
    '&[data-disabled="true"]': {
        opacity: opacities.quieter,
        cursor: 'default',
    },
});

const baseOptionStyles = css({
    position: 'relative',
    display: 'flex',
    flex: 'auto',
    flexBasis: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    '> label': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        borderRadius: radii.default,
        outline: 0,
        paddingRight: '4px',
        paddingLeft: '4px',
        '&:active': {
            opacity: 1,
        },
    },
    '> input:disabled + label': {
        cursor: 'default',
        opacity: opacities.quieter,
    },
    '> input:not(:disabled) + label': {
        cursor: 'pointer',
    },
    '> input:checked + label': {
        backgroundColor: colors.darken4,
        color: colors.white,
    },
    '> input:not(:checked) + label': {
        color: colors.dark,
    },
    '> input:not(:checked):not(:disabled) + label:hover': {
        opacity: opacities.quiet,
    },
});

const selectButtonsVariants = {
    default: {
        containerClassNameForVariant: baseContainerStyles,
        optionClassNameForVariant: baseOptionStyles,
    },
};

export default selectButtonsVariants;
