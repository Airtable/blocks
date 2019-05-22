"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.function.name");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectWithoutProperties"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

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
    var _context;

    var _this;

    (0, _classCallCheck2.default)(this, ModelPickerSelect);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ModelPickerSelect).call(this, props));
    _this._onChange = (0, _bind.default)(_context = _this._onChange).call(_context, (0, _assertThisInitialized2.default)(_this));
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
      var _this2 = this,
          _context2;

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
        ref: function ref(el) {
          return _this2._select = el;
        },
        value: selectedModelId,
        onChange: this._onChange,
        style: style,
        className: className,
        disabled: disabled,
        options: (0, _concat.default)(_context2 = [{
          value: null,
          label: placeholder,
          disabled: !shouldAllowPickingNone
        }]).call(_context2, (0, _toConsumableArray2.default)((0, _map.default)(models).call(models, function (model) {
          return {
            value: model.id,
            label: model.name,
            disabled: shouldAllowPickingModelFn && !shouldAllowPickingModelFn(model)
          };
        })))
      }, restOfProps));
    }
  }]);
  return ModelPickerSelect;
}(React.Component);

var _default = (0, _create_data_container.default)(ModelPickerSelect, function (props) {
  var _context3;

  return (0, _map.default)(_context3 = props.models).call(_context3, function (model) {
    return {
      watch: model,
      key: props.modelKeysToWatch
    };
  });
}, ['focus', 'blur', 'click']);

exports.default = _default;