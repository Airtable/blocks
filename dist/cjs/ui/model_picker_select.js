"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _table = _interopRequireDefault(require("../models/table"));

var _view = _interopRequireDefault(require("../models/view"));

var _field = _interopRequireDefault(require("../models/field"));

var _create_data_container = _interopRequireDefault(require("./create_data_container"));

var _select = _interopRequireDefault(require("./select"));

class ModelPickerSelect extends React.Component {
  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
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
    var _this$props = this.props,
        models = _this$props.models,
        selectedModelId = _this$props.selectedModelId,
        style = _this$props.style,
        className = _this$props.className,
        disabled = _this$props.disabled,
        placeholder = _this$props.placeholder,
        shouldAllowPickingNone = _this$props.shouldAllowPickingNone,
        shouldAllowPickingModelFn = _this$props.shouldAllowPickingModelFn,
        modelKeysToWatch = _this$props.modelKeysToWatch,
        onChange = _this$props.onChange,
        restOfProps = (0, _objectWithoutProperties2.default)(_this$props, ["models", "selectedModelId", "style", "className", "disabled", "placeholder", "shouldAllowPickingNone", "shouldAllowPickingModelFn", "modelKeysToWatch", "onChange"]);
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
      }, ...models.map(model => {
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
  return props.models.map(model => {
    return {
      watch: model,
      key: props.modelKeysToWatch
    };
  });
}, ['focus', 'blur', 'click']);

exports.default = _default;