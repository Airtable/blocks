"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _table = _interopRequireDefault(require("../models/table"));

var _view = _interopRequireDefault(require("../models/view"));

var _field = _interopRequireDefault(require("../models/field"));

var _create_data_container = _interopRequireDefault(require("./create_data_container"));

var _select = _interopRequireDefault(require("./select"));

class ModelPickerSelect extends React.Component {
  constructor(props) {
    var _context;

    super(props);
    this._onChange = (0, _bind.default)(_context = this._onChange).call(_context, this);
    this._select = null;
  }

  _onChange(value) {
    (0, _invariant.default)(value === null || typeof value === 'string', 'value must be null or model id');
    this.props.onChange(value);
  }

  focus() {
    (0, _invariant.default)(this._select, 'No select to focus');

    this._select.focus();
  }

  blur() {
    (0, _invariant.default)(this._select, 'No select to blur');

    this._select.blur();
  }

  click() {
    (0, _invariant.default)(this._select, 'No select to click');

    this._select.click();
  }

  render() {
    const {
      models,
      selectedModelId,
      style,
      className,
      disabled,
      placeholder,
      shouldAllowPickingNone,
      shouldAllowPickingModelFn,
      // Filter these out so they're not
      // included in restOfProps:
      modelKeysToWatch,
      // eslint-disable-line no-unused-vars
      onChange,
      // eslint-disable-line no-unused-vars
      ...restOfProps
    } = this.props;
    return React.createElement(_select.default, (0, _extends2.default)({
      ref: el => this._select = el,
      value: selectedModelId,
      onChange: this._onChange,
      style: style,
      className: className,
      disabled: disabled,
      options: [{
        value: null,
        label: placeholder,
        disabled: !shouldAllowPickingNone
      }, ...(0, _map.default)(models).call(models, model => {
        return {
          value: model.id,
          label: model.name,
          disabled: shouldAllowPickingModelFn && !shouldAllowPickingModelFn(model)
        };
      })]
    }, restOfProps));
  }

}

var _default = (0, _create_data_container.default)(ModelPickerSelect, props => {
  var _context2;

  return (0, _map.default)(_context2 = props.models).call(_context2, model => {
    return {
      watch: model,
      key: props.modelKeysToWatch
    };
  });
}, ['focus', 'blur', 'click']);

exports.default = _default;