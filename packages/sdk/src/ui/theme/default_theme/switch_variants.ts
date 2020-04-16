import {cx, css} from 'emotion';
import cssHelpers from '../../css_helpers';
import {space, colors, radii, opacities, fontFamilies} from './tokens';

const SWITCH_WIDTH = 20;
const SWITCH_HEIGHT = 12;
const SWITCH_PADDING = 2;
const CIRCLE_SIZE = SWITCH_HEIGHT - 2 * SWITCH_PADDING;

const switchClassName = css({
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    transition: '0.085s all ease-in',
    borderRadius: radii.circle,
    backgroundColor: colors.white,
});

const switchContainerClassName = css({
    flex: 'none',
    width: SWITCH_WIDTH,
    height: SWITCH_HEIGHT,
    padding: SWITCH_PADDING,
    transition: '0.085s all ease-in',
    boxSizing: 'border-box',
    borderRadius: radii.circle,
    backgroundColor: colors.darken2,
});

const switchLabelClassName = css({
    cursor: 'inherit',
    userSelect: 'none',
    marginLeft: space[2],
    color: colors.dark,
    flex: 'auto',
});

const baseStyles = css({
    alignItems: 'center',
    borderRadius: radii.default,
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: fontFamilies.default,
    backgroundColor: colors.lightGray2,
    '&[aria-disabled="true"]': {
        opacity: opacities.quieter,
    },
    '&:not([aria-disabled="true"])': {
        cursor: 'pointer',
        '&:hover': {
            opacity: opacities.quiet,
        },
        '&:focus': {
            boxShadow: `inset 0 0 0 2px ${colors.darken3}`,
        },
    },
    [`&[aria-checked="true"] .${switchClassName}`]: {
        transform: 'translateX(100%)',
    },
});

const subcomponentClassNames = {
    switchClassName,
    switchContainerClassName,
    switchLabelClassName: cx(switchLabelClassName, cssHelpers.TRUNCATE),
};

const switchVariants = {
    default: {
        baseClassName: cx(
            baseStyles,
            css({
                [`&[aria-checked="true"] > .${switchContainerClassName}`]: {
                    backgroundColor: colors.greenBright,
                },
            }),
        ),
        ...subcomponentClassNames,
    },
    danger: {
        baseClassName: cx(
            baseStyles,
            css({
                [`&[aria-checked="true"] > .${switchContainerClassName}`]: {
                    backgroundColor: colors.redBright,
                },
            }),
        ),
        ...subcomponentClassNames,
    },
};

export default switchVariants;
