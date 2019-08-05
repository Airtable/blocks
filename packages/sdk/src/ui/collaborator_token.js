// @flow
import PropTypes from 'prop-types'; // TODO(kasra): don't depend on liveapp components.
import * as React from 'react';
import isEqual from 'fast-deep-equal';
import {has} from '../private_utils';
import getSdk from '../get_sdk';

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
 * @property {string} [collaborator.profilePicUrl] The URL of the collaborator's profile picture.
 * @property {string} [className] Additional class names to apply to the collaborator token.
 */
type CollaboratorTokenProps = {
    collaborator: {
        id?: string,
        email?: string,
        name?: string,
        profilePicUrl?: string,
        status?: string,
    },
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

    // NOTE: this is a bit strange. We pull the user obj out of app blanket, format it for api v2,
    // and then compare it to the user obj that got passed in. This way, if they are equal, we can
    // do some nice things like use our helper methods and get token-sized prof pic urls. If the two
    // objects are not equal, then we can't use these, so we'll just render what we were given without
    // formatting it nicely.
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
        // Since the object we got passed and the formatted v2 obj are the same, we can just use
        // the private obj and our helpers. We do this so that we can use sized prof pic urls
        // and name helper functions that we couldn't otherwise use.
        profilePicUrl = appBlanketUserObjMethods.getTokenSizedProfilePicUrl(userObj);
        userName = appBlanketUserObjMethods.getName(userObj) || 'Unknown';
        // Note: we purposely don't filter out unaccepted invitees to match liveapp styling
        isActive = appBlanketUserObjMethods.isActive(userObj);
    } else {
        // Can't use helpers to get token-sized prof pic url, since we can't be sure we were
        // given an airtable url.
        profilePicUrl =
            collaborator.profilePicUrl || profilePicHelper.getSizedUnknownProfilePicUrl(18);
        userName = collaborator.name || collaborator.email || 'Unknown';
        isActive = true;
    }

    return (
        <_CollaboratorToken
            profilePicUrl={profilePicUrl}
            userName={userName}
            className={className}
            shouldDim={!isActive}
        />
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
