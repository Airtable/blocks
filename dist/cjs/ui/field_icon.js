"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _field = _interopRequireDefault(require("../models/field"));

var _icon = _interopRequireDefault(require("./icon"));

const u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');

const columnTypeProvider = window.__requirePrivateModuleFromAirtable('client_server_shared/column_types/column_type_provider');

/** */
const FieldIcon = props => {
  const {
    field
  } = props;
  const restOfProps = u.omit(props, 'field');

  const type = field.__getRawType();

  const typeOptions = field.__getRawTypeOptions();

  const appInterface = field.parentTable.parentBase.__appInterface;
  const displayType = columnTypeProvider.getDisplayType(type, typeOptions, appInterface);
  const displayTypeConfigs = columnTypeProvider.getDisplayTypeConfigs(type);
  const config = displayTypeConfigs[displayType];
  const name = config.displayTypeIcon;
  return React.createElement(_icon.default, (0, _extends2.default)({
    name: name
  }, restOfProps));
};

const iconPropsWithoutName = u.omit(_icon.default.propTypes, 'name');
FieldIcon.propTypes = { ...iconPropsWithoutName,
  field: _propTypes.default.instanceOf(_field.default).isRequired
};
var _default = FieldIcon;
exports.default = _default;