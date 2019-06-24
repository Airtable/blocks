"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

// TODO(kasra): don't depend on liveapp components.
var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    u = _window$__requirePriv.u;

var appBlanketUserObjMethods = window.__requirePrivateModuleFromAirtable('client_server_shared/column_types/helpers/app_blanket_user_obj_methods');

var profilePicHelper = window.__requirePrivateModuleFromAirtable('client_server_shared/profile_pic_helper');

var _CollaboratorToken = window.__requirePrivateModuleFromAirtable('client_server_shared/column_types/components/collaborator_token');
/**
 * @typedef {object} CollaboratorTokenProps
 * @property {object} collaborator An object representing a collaborator. You should not create these objects from scratch, but should instead grab them from base data.
 * @property {string} [collaborator.id] The user ID of the collaborator.
 * @property {string} [collaborator.email] The email address of the collaborator.
 * @property {string} [collaborator.name] The name of the collaborator.
 * @property {string} [collaborator.profilePicUrl] The URL of the collaborator's profile picture.
 * @property {string} [className] Additional class names to apply to the collaborator token.
 */


/**
 * A component that shows a single collaborator in a small token, to be displayed inline or in a list of choices.
 *
 * @augments React.StatelessFunctionalComponent
 * @param {CollaboratorTokenProps} props
 *
 * @example
 * import {UI, base} from '@airtable/blocks';
 *
 * function CurrentUserGreeter() {
 *     return (
 *         <React.Fragment>
 *             Hello,
 *             <UI.CollaboratorToken collaborator={base.currentUser} />!
 *         </React.Fragment>
 *     );
 * }
 */
var CollaboratorToken = props => {
  var collaborator = props.collaborator,
      className = props.className; // NOTE: this is a bit strange. We pull the user obj out of app blanket, format it for api v2,
  // and then compare it to the user obj that got passed in. This way, if they are equal, we can
  // do some nice things like use our helper methods and get token-sized prof pic urls. If the two
  // objects are not equal, then we can't use these, so we'll just render what we were given without
  // formatting it nicely.

  var userInfoById = (0, _get_sdk.default)().base.__appInterface.getCollaboratorInfoById();

  var userObj = userInfoById && collaborator.id ? userInfoById[collaborator.id] : null;
  var userObjFormattedForPublicApiV2 = userObj ? appBlanketUserObjMethods.formatUserObjForPublicApiV2(userObj) : null;
  var userName;
  var profilePicUrl;

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

  return React.createElement(_CollaboratorToken, {
    profilePicUrl: profilePicUrl,
    userName: userName,
    className: className
  });
};

CollaboratorToken.propTypes = {
  collaborator: _propTypes.default.shape({
    id: _propTypes.default.string,
    email: _propTypes.default.string,
    name: _propTypes.default.string,
    profilePicUrl: _propTypes.default.string,
    status: _propTypes.default.string
  }).isRequired,
  className: _propTypes.default.string
};
var _default = CollaboratorToken;
exports.default = _default;