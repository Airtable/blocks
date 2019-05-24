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

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _table = _interopRequireDefault(require("../models/table"));

var _view = _interopRequireDefault(require("../models/view"));

var _field = _interopRequireDefault(require("../models/field"));

var _create_data_container = _interopRequireDefault(require("./create_data_container"));

var _select = _interopRequireDefault(require("./select"));

var ModelPickerSelect =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(ModelPickerSelect, _React$Component);

  function ModelPickerSelect(props) {
    var _this;

    (0, _classCallCheck2.default)(this, ModelPickerSelect);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ModelPickerSelect).call(this, props));
    _this._onChange = _this._onChange.bind((0, _assertThisInitialized2.default)(_this));
    _this._select = null;
    return _this;
  }

  (0, _createClass2.default)(ModelPickerSelect, [{
    key: "_onChange",
    value: function _onChange(value) {
      (0, _invariant.default)(value === null || typeof value === 'string', 'value must be null or model id');
      this.props.onChange(value);
    }
  }, {
    key: "focus",
    value: function focus() {
      (0, _invariant.default)(this._select, 'No select to focus');

      this._select.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      (0, _invariant.default)(this._select, 'No select to blur');

      this._select.blur();
    }
  }, {
    key: "click",
    value: function click() {
      (0, _invariant.default)(this._select, 'No select to click');

      this._select.click();
    }
  }, {
    key: "render",
    value: function render() {
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
  }]);
  return ModelPickerSelect;
}(React.Component);

var _default = (0, _create_data_container.default)(ModelPickerSelect, props => {
  return props.models.map(model => {
    return {
      watch: model,
      key: props.modelKeysToWatch
    };
  });
}, ['focus', 'blur', 'click']);

exports.default = _default;