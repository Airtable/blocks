import {type ObjectMap} from '../../../../shared/private_utils';
import {type TypographySetProps, type MarginProps} from '../../system';

/** @hidden */
type HeadingVariant = 'default' | 'caps';
/** @hidden */
type HeadingSize = 'xsmall' | 'small' | 'default' | 'large' | 'xlarge' | 'xxlarge';

const headingStyles: ObjectMap<
    HeadingVariant,
    {[Size in HeadingSize]?: TypographySetProps & MarginProps}
> = {
    default: {
        xsmall: {
            fontSize: 3,
            fontWeight: 700,
            lineHeight: '22px',
            textColor: 'default',
            marginTop: 0,
            marginBottom: 1,
        },
        small: {
            fontSize: 4,
            fontWeight: 600,
            lineHeight: '24px',
            textColor: 'default',
            marginTop: 0,
            marginBottom: 1,
        },
        default: {
            fontSize: 6,
            fontWeight: 500,
            lineHeight: '26px',
            textColor: 'default',
            marginTop: 0,
            marginBottom: 2,
        },
        large: {
            fontSize: 7,
            fontWeight: 500,
            lineHeight: '29px',
            textColor: 'default',
            marginTop: 0,
            marginBottom: 2,
        },
        xlarge: {
            fontSize: 8,
            fontWeight: 500,
            lineHeight: '34px',
            textColor: 'default',
            marginTop: 0,
            marginBottom: 3,
        },
        xxlarge: {
            fontSize: 9,
            fontWeight: 500,
            lineHeight: '44px',
            letterSpacing: '-0.01em',
            textColor: 'default',
            marginTop: 0,
            marginBottom: 3,
        },
    },
    caps: {
        xsmall: {
            fontSize: 1,
            fontWeight: 700,
            lineHeight: '16px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            textColor: 'light',
            marginTop: 0,
            marginBottom: 2,
        },
        small: {
            fontSize: 2,
            fontWeight: 600,
            lineHeight: '16px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            textColor: 'light',
            marginTop: 0,
            marginBottom: 2,
        },
        default: {
            fontSize: 3,
            fontWeight: 500,
            lineHeight: '20px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            textColor: 'light',
            marginTop: 0,
            marginBottom: 3,
        },
    },
};

export default headingStyles;
