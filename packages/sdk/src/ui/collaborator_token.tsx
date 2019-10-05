/** @module @airtable/blocks/ui: CollaboratorToken */ /** */
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import {CollaboratorStatuses, CollaboratorData} from '../types/collaborator';
import Box from './box';
import {baymax} from './baymax_utils';
import useStyledSystem from './use_styled_system';
import {
    flexItemSet,
    flexItemSetPropTypes,
    FlexItemSetProps,
    positionSet,
    positionSetPropTypes,
    PositionSetProps,
    margin,
    marginPropTypes,
    MarginProps,
} from './system';
import {tooltipAnchorPropTypes, TooltipAnchorProps} from './types/tooltip_anchor_props';

const UNKNOWN_PROFILE_PIC_URL =
    'https://static.airtable.com/images/userIcons/user_icon_unknown.png';

type StyleProps = (FlexItemSetProps) & (PositionSetProps) & (MarginProps);

const styleParser = compose(
    flexItemSet,
    positionSet,
    margin,
);

const stylePropTypes = {
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
};

/**
 * @typedef {object} CollaboratorTokenProps
 * @property {object} collaborator An object representing a collaborator. You should not create these objects from scratch, but should instead grab them from base data.
 * @property {string} [collaborator.id] The user ID of the collaborator.
 * @property {string} [collaborator.email] The email address of the collaborator.
 * @property {string} [collaborator.name] The name of the collaborator.
 * @property {string} [collaborator.status] The status of the collaborator.
 * @property {string} [collaborator.profilePicUrl] The URL of the collaborator's profile picture.
 * @property {string} [className] Additional class names to apply to the collaborator token.
 * @property {string} [style] Additional styles to apply to the collaborator token.
 */
type CollaboratorTokenProps = {
    collaborator: Partial<CollaboratorData>;
    className?: string;
    style?: React.CSSProperties;
} & (TooltipAnchorProps) &
    (StyleProps);

/**
 * A component that shows a single collaborator in a small token, to be displayed inline or in a list of choices.
 *
 * @augments React.StatelessFunctionalComponent
 * @param {CollaboratorTokenProps} props
 *
 * @example
 * ```js
 * import {CollaboratorToken, useSession} from '@airtable/blocks/ui';
 *
 * function CurrentUserGreeter() {
 *     const session = useSession();
 *     return (
 *         <React.Fragment>
 *             Hello,
 *             <CollaboratorToken collaborator={session.currentUser} />!
 *         </React.Fragment>
 *     );
 * }
 * ```
 */
const CollaboratorToken = (props: CollaboratorTokenProps) => {
    const {
        collaborator,
        onMouseEnter,
        onMouseLeave,
        onClick,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        hasOnClick,
        className,
        style,
        ...styleProps
    } = props;
    const classNameForStyledProps = useStyledSystem<StyleProps>(styleProps, styleParser);

    const userName =
        collaborator.name ||
        collaborator.email ||
        (collaborator.status === CollaboratorStatuses.INVITED && 'Invited user') ||
        'Unknown';
    const profilePicUrl = collaborator.profilePicUrl || UNKNOWN_PROFILE_PIC_URL;
    const isActive = collaborator.status
        ? collaborator.status === CollaboratorStatuses.CURRENT
        : true;

    return (
        <Box
            // TODO (stephen): remove tooltip anchor props
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            className={cx(baymax('truncate print-color-exact'), classNameForStyledProps, className)}
            style={style}
            alignItems="center"
            display="inline-flex"
        >
            {profilePicUrl && (
                <Box
                    className={baymax('background-cover background-center')}
                    style={{backgroundImage: `url("${profilePicUrl}")`}}
                    border="1px solid #eee"
                    width="22px"
                    height="22px"
                    borderRadius="circle"
                    zIndex={1}
                    flex="none"
                    opacity={isActive ? 1 : 0.5}
                    backgroundColor="grayLight2"
                />
            )}
            <Box
                className={baymax('truncate')}
                paddingRight={2}
                paddingLeft={3}
                textColor="dark"
                display="inline-flex"
                borderRadius="circle"
                alignItems="center"
                flex="none"
                backgroundColor="grayLight2"
                marginLeft="-12px"
                lineHeight={1.4}
            >
                {userName}
            </Box>
        </Box>
    );
};

CollaboratorToken.propTypes = {
    collaborator: PropTypes.shape({
        id: PropTypes.string,
        email: PropTypes.string,
        name: PropTypes.string,
        profilePicUrl: PropTypes.string,
        status: PropTypes.string,
    }).isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    ...tooltipAnchorPropTypes,
    ...stylePropTypes,
};

export default CollaboratorToken;
