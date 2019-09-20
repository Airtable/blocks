// @flow
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import {has, isDeepEqual} from '../private_utils';
import getSdk from '../get_sdk';
import {type CollaboratorData} from '../types/collaborator';
import Box from './box';
import useStyledSystem from './use_styled_system';
import {
    flexItemSet,
    flexItemSetPropTypes,
    type FlexItemSetProps,
    positionSet,
    positionSetPropTypes,
    type PositionSetProps,
    margin,
    marginPropTypes,
    type MarginProps,
} from './system';

const appBlanketUserObjMethods = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/helpers/app_blanket_user_obj_methods',
);
const profilePicHelper = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/profile_pic_helper',
);
const _CollaboratorToken = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/components/collaborator_token',
);

type StyleProps = {|
    ...FlexItemSetProps,
    ...PositionSetProps,
    ...MarginProps,
|};

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
type CollaboratorTokenProps = {|
    collaborator: $Shape<CollaboratorData>,
    className?: string,
    style?: {[string]: mixed},
    ...StyleProps,
|};

/**
 * A component that shows a single collaborator in a small token, to be displayed inline or in a list of choices.
 *
 * @augments React.StatelessFunctionalComponent
 * @param {CollaboratorTokenProps} props
 *
 * @example
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
 */
const CollaboratorToken = (props: CollaboratorTokenProps) => {
    const {collaborator, className, style, ...styleProps} = props;
    const classNameForStyledProps = useStyledSystem(styleProps, styleParser);

    const userInfoById = getSdk().__appInterface.getCollaboratorInfoById();
    const userObj =
        userInfoById && collaborator.id && has(userInfoById, collaborator.id)
            ? userInfoById[collaborator.id]
            : null;
    const userObjFormattedForPublicApiV2 = userObj
        ? appBlanketUserObjMethods.formatUserObjForPublicApiV2(userObj)
        : null;

    let userName;
    let profilePicUrl;
    let isActive;
    if (userObj !== null && isDeepEqual(collaborator, userObjFormattedForPublicApiV2)) {
        profilePicUrl = appBlanketUserObjMethods.getTokenSizedProfilePicUrl(userObj);
        userName = appBlanketUserObjMethods.getName(userObj) || 'Unknown';
        isActive = appBlanketUserObjMethods.isActive(userObj);
    } else {
        profilePicUrl =
            collaborator.profilePicUrl || profilePicHelper.getSizedUnknownProfilePicUrl(18);
        userName = collaborator.name || collaborator.email || 'Unknown';
        isActive = true;
    }

    return (
        <Box className={cx('baymax', classNameForStyledProps)} style={style} display="inline-block">
            <_CollaboratorToken
                profilePicUrl={profilePicUrl}
                userName={userName}
                className={className}
                shouldDim={!isActive}
            />
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
    ...stylePropTypes,
};

export default CollaboratorToken;
