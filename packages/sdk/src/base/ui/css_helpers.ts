import {css} from 'emotion';

const cssHelpers = {
    TRUNCATE: css({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    }),
    VISUALLY_HIDDEN: css({
        position: 'absolute',
        height: '1px',
        width: '1px',
        overflow: 'hidden',
        clip: ['rect(1px, 1px, 1px, 1px)', 'rect(1px 1px 1px 1px)'] /* fallback for IE6, IE7 */,
        whiteSpace: 'nowrap' /* added line */,
    }),
};

export default cssHelpers;
