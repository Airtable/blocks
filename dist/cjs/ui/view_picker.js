"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _view = _interopRequireDefault(require("../models/view"));

var _table = _interopRequireDefault(require("../models/table"));

var _view2 = require("../types/view");

var _model_picker_select = _interopRequireDefault(require("./model_picker_select"));

var _create_data_container = _interopRequireDefault(require("./create_data_container"));

var u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');

/** */
var ViewPicker =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(ViewPicker, _React$Component);

  function ViewPicker(props) {
    var _context;

    var _this;

    (0, _classCallCheck2.default)(this, ViewPicker);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ViewPicker).call(this, props));
    _this._select = null;
    _this._onChange = (0, _bind.default)(_context = _this._onChange).call(_context, (0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(ViewPicker, [{
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
    key: "_onChange",
    value: function _onChange(viewId) {
      var _this$props = this.props,
          onChange = _this$props.onChange,
          table = _this$props.table;

      if (onChange) {
        var view = table && !table.isDeleted && viewId ? table.getViewById(viewId) : null;
        onChange(view);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props2 = this.props,
          selectedView = _this$props2.view,
          table = _this$props2.table,
          shouldAllowPickingNone = _this$props2.shouldAllowPickingNone,
          style = _this$props2.style,
          className = _this$props2.className,
          disabled = _this$props2.disabled;

      if (!table || table.isDeleted) {
        return null;
      }

      var placeholder;

      if (this.props.placeholder === undefined) {
        // Let's set a good default value for the placeholder, depending
        // on the shouldAllowPickingNone flag.
        placeholder = shouldAllowPickingNone ? 'None' : 'Pick a view...';
      } else {
        placeholder = this.props.placeholder;
      }

      var allowedTypes = null;

      if (this.props.allowedTypes) {
        allowedTypes = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator2.default)(this.props.allowedTypes), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var allowedType = _step.value;
            allowedTypes[allowedType] = true;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      var shouldAllowPickingViewFn = function shouldAllowPickingViewFn(view) {
        return !allowedTypes || allowedTypes[view.type];
      };

      var restOfProps = u.omit(this.props, (0, _keys.default)(ViewPicker.propTypes));
      return React.createElement(_model_picker_select.default, (0, _extends2.default)({
        ref: function ref(el) {
          return _this2._select = el;
        },
        models: table.views,
        selectedModelId: selectedView && !selectedView.isDeleted ? selectedView.id : null,
        shouldAllowPickingModelFn: shouldAllowPickingViewFn,
        onChange: this._onChange,
        style: style,
        className: className,
        disabled: disabled,
        placeholder: placeholder,
        shouldAllowPickingNone: shouldAllowPickingNone,
        modelKeysToWatch: ['name']
      }, restOfProps));
    }
  }]);
  return ViewPicker;
}(React.Component);

(0, _defineProperty2.default)(ViewPicker, "propTypes", {
  table: _propTypes.default.instanceOf(_table.default),
  view: _propTypes.default.instanceOf(_view.default),
  shouldAllowPickingNone: _propTypes.default.bool,
  onChange: _propTypes.default.func,
  allowedTypes: _propTypes.default.arrayOf(_propTypes.default.oneOf((0, _values.default)(u).call(u, _view2.ViewTypes))),
  placeholder: _propTypes.default.string,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  disabled: _propTypes.default.bool
});

var _default = (0, _create_data_container.default)(ViewPicker, function (props) {
  return [{
    watch: props.table,
    key: 'views'
  }, {
    watch: (0, _get_sdk.default)().base,
    key: 'tables'
  }];
}, ['focus', 'blur', 'click']);

exports.default = _default;