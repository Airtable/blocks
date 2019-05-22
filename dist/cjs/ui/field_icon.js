"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectSpread"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _field = _interopRequireDefault(require("../models/field"));

var _icon = _interopRequireDefault(require("./icon"));

var u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');

var columnTypeProvider = window.__requirePrivateModuleFromAirtable('client_server_shared/column_types/column_type_provider');

/** */
var FieldIcon = function FieldIcon(props) {
  var field = props.field;
  var restOfProps = u.omit(props, 'field');

  var type = field.__getRawType();

  var typeOptions = field.__getRawTypeOptions();

  var appInterface = field.parentTable.parentBase.__appInterface;
  var displayType = columnTypeProvider.getDisplayType(type, typeOptions, appInterface);
  var displayTypeConfigs = columnTypeProvider.getDisplayTypeConfigs(type);
  var config = displayTypeConfigs[displayType];
  var name = config.displayTypeIcon;
  return React.createElement(_icon.default, (0, _extends2.default)({
    name: name
  }, restOfProps));
};

var iconPropsWithoutName = u.omit(_icon.default.propTypes, 'name');
FieldIcon.propTypes = (0, _objectSpread2.default)({}, iconPropsWithoutName, {
  field: _propTypes.default.instanceOf(_field.default).isRequired
});
var _default = FieldIcon;
exports.default = _default;