"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var React = _interopRequireWildcard(require("react"));

var _ChoiceToken = window.__requirePrivateModuleFromAirtable('client_server_shared/column_types/components/choice_token'); // TODO(kasra): don't depend on liveapp components.


var colors = window.__requirePrivateModuleFromAirtable('client_server_shared/colors');
/**
 * @typedef {object} ChoiceTokenProps
 * @property {object} choice An object representing a select option. You should not create these objects from scratch, but should instead grab them from base data.
 * @property {string} choice.id The ID of the select option.
 * @property {string} choice.name The name of the select option.
 * @property {string} [choice.color] The color of the select option.
 * @property {string} [className] Additional class names to apply to the collaborator token.
 */


/**
 * A component that shows a single choice in a small token, to be displayed inline or in a list of choices.
 *
 * @augments React.StatelessFunctionalComponent
 * @param {ChoiceTokenProps} props
 *
 * @example
 * import {UI} from '@airtable/blocks';
 *
 * function ChoicesForSelectField({selectField}) {
 *     const choiceNodes = selectField.options.choices.map(choice => (
 *         <UI.ChoiceToken
 *             key={choice.id}
 *             choice={choice}
 *         />
 *     ));
 *
 *     return (
 *         <React.Fragment>
 *             Here are all of your choices:
 *             {choiceNodes}
 *         </React.Fragment>
 *     );
 * }
 */
var ChoiceToken = props => {
  var choice = props.choice,
      className = props.className; // Convert the choice color back to a private api choice color.

  var color = choice.color ? colors.getColorForColorClass(choice.color) : colors.DEFAULT_CHOICE_COLOR;
  return React.createElement(_ChoiceToken, {
    color: color,
    className: (0, _classnames.default)('border-box truncate pill px1 cellToken choiceToken line-height-4 inline-block', className)
  }, React.createElement("div", {
    className: "flex-auto truncate"
  }, choice.name));
};

ChoiceToken.propTypes = {
  choice: _propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    name: _propTypes.default.string.isRequired,
    color: _propTypes.default.string
  }).isRequired,
  className: _propTypes.default.string
};
var _default = ChoiceToken;
exports.default = _default;