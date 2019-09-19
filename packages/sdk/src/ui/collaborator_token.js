// @flow
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import isEqual from 'fast-deep-equal';
import {has} from '../private_utils';
import getSdk from '../get_sdk';
import {type CollaboratorData} from '../types/collaborator';
import {baymax} from './baymax_utils';

const appBlanketUserObjMethods = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/helpers/app_blanket_user_obj_methods',
);
const profilePicHelper = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/profile_pic_helper',
);
const _CollaboratorToken = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/components/collaborator_token',
);

/**
 * @typedef {object} CollaboratorTokenProps
 * @property {object} collaborator An object representing a collaborator. You should not create these objects from scratch, but should instead grab them from base data.
 * @property {string} [collaborator.id] The user ID of the collaborator.
 * @property {string} [collaborator.email] The email address of the collaborator.
 * @property {string} [collaborator.name] The name of the collaborator.
 * @property {string} [collaborator.status] The status of the collaborator.
 * @property {string} [collaborator.profilePicUrl] The URL of the collaborator's profile picture.
 * @property {string} [className] Additional class names to apply to the collaborator token.
 */
type CollaboratorTokenProps = {
    collaborator: $Shape<CollaboratorData>,
    className?: string,
};

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
    const {collaborator, className} = props;

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
    if (userObj !== null && isEqual(collaborator, userObjFormattedForPublicApiV2)) {
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
        <div className={cx('baymax', baymax('flex-inline'))}>
            <_CollaboratorToken
                profilePicUrl={profilePicUrl}
                userName={userName}
                className={className}
                shouldDim={!isActive}
            />
        </div>
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
};

export default CollaboratorToken;
