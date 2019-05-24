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

/** */
var ChoiceToken = (_ref) => {
  var choice = _ref.choice,
      className = _ref.className;
  // Convert the choice color back to a private api choice color.
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