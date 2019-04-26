// @flow
const {h, u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const React = require('block_sdk/frontend/ui/react');
const PropTypes = require('prop-types');
const appBlanketUserObjMethods = window.__requirePrivateModuleFromAirtable('client_server_shared/column_types/helpers/app_blanket_user_obj_methods');
const profilePicHelper = window.__requirePrivateModuleFromAirtable('client_server_shared/profile_pic_helper');
const _CollaboratorToken = window.__requirePrivateModuleFromAirtable('client_server_shared/column_types/components/collaborator_token'); // TODO(kasra): don't depend on liveapp components.
const getSdk = require('block_sdk/shared/get_sdk');

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

/** */
const CollaboratorToken = (props: CollaboratorTokenProps) => {
    const {collaborator, className} = props;

    // NOTE: this is a bit strange. We pull the user obj out of app blanket, format it for api v2,
    // and then compare it to the user obj that got passed in. This way, if they are equal, we can
    // do some nice things like use our helper methods and get token-sized prof pic urls. If the two
    // objects are not equal, then we can't use these, so we'll just render what we were given without
    // formatting it nicely.
    const userInfoById = getSdk().base.__appInterface.getCollaboratorInfoById();
    const userObj = userInfoById && collaborator.id ? userInfoById[collaborator.id] : null;
    const userObjFormattedForPublicApiV2 = userObj ? appBlanketUserObjMethods.formatUserObjForPublicApiV2(userObj) : null;

    let userName;
    let profilePicUrl;
    if (userObj === null) {
        profilePicUrl = profilePicHelper.getSizedUnknownProfilePicUrl(18);
        userName = 'Unknown';
    } else if (u.isEqual(collaborator, userObjFormattedForPublicApiV2)) {
        // Since the object we got passed and the formatted v2 obj are the same, we can just use
        // the private obj and our helpers. We do this so that we can use sized prof pic urls
        // and name helper functions that we couldn't otherwise use.
        profilePicUrl = appBlanketUserObjMethods.getTokenSizedProfilePicUrl(userObj);
        userName = appBlanketUserObjMethods.getName(userObj) || 'Unknown';
    } else {
        // Can't use helpers to get token-sized prof pic url, since we can't be sure we were
        // given an airtable url.
        profilePicUrl = collaborator.profilePicUrl || profilePicHelper.getSizedUnknownProfilePicUrl(18);
        userName = collaborator.name || collaborator.email || 'Unknown';
    }

    return (
        <_CollaboratorToken
            profilePicUrl={profilePicUrl}
            userName={userName}
            className={className}
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

module.exports = CollaboratorToken;
