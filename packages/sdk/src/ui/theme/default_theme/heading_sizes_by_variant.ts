import {ObjectMap} from '../../../private_utils';
import {TypographySetProps, MarginProps} from '../../system';

type HeadingVariant = 'default' | 'caps';
type HeadingSize = 'xsmall' | 'small' | 'default' | 'large' | 'xlarge' | 'xxlarge';

const headingSizesByVariant: ObjectMap<
    HeadingVariant,
    {[Size in HeadingSize]?: TypographySetProps & MarginProps}
> = {
    default: {
        xsmall: {
            fontSize: 3,
            fontWeight: 700,
            lineHeight: '22px',
            textColor: 'default',
            fontFamily: 'default',
            marginTop: 0,
            marginBottom: 1,
        },
        small: {
            fontSize: 4,
            fontWeight: 600,
            lineHeight: '24px',
            textColor: 'default',
            fontFamily: 'default',
            marginTop: 0,
            marginBottom: 1,
        },
        // We skip fontSize 5, because font sizes below 6 (21px) the font will render SF Pro Text instead of SF Pro Display.
        // SF Pro Text visually looks slightly bigger than SF Pro Display and 5 and 6 would look very similar.
        default: {
            fontSize: 6,
            fontWeight: 500,
            lineHeight: '26px',
            textColor: 'default',
            fontFamily: 'default',
            marginTop: 0,
            marginBottom: 2,
        },
        large: {
            fontSize: 7,
            fontWeight: 500,
            lineHeight: '29px',
            textColor: 'default',
            fontFamily: 'default',
            marginTop: 0,
            marginBottom: 2,
        },
        xlarge: {
            fontSize: 8,
            fontWeight: 500,
            lineHeight: '34px',
            textColor: 'default',
            fontFamily: 'default',
            marginTop: 0,
            marginBottom: 3,
        },
        xxlarge: {
            fontSize: 9,
            fontWeight: 500,
            lineHeight: '44px',
            letterSpacing: '-0.01em',
            textColor: 'default',
            fontFamily: 'default',
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
            fontFamily: 'default',
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
            fontFamily: 'default',
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
            fontFamily: 'default',
            marginTop: 0,
            marginBottom: 3,
        },
        // Bigger all caps heading sizes are are omitted since they are not desirable.
    },
};

export default headingSizesByVariant;
