"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.function.name");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _valuesInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/values");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));

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

var _private_utils = require("../private_utils");

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _field = _interopRequireDefault(require("../models/field"));

var _table = _interopRequireDefault(require("../models/table"));

var _field2 = require("../types/field");

var _model_picker_select = _interopRequireDefault(require("./model_picker_select"));

var _create_data_container = _interopRequireDefault(require("./create_data_container"));

var u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');

/** */
var FieldPicker =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(FieldPicker, _React$Component);

  function FieldPicker(props) {
    var _context;

    var _this;

    (0, _classCallCheck2.default)(this, FieldPicker);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(FieldPicker).call(this, props));
    _this._select = null;
    _this._onChange = (0, _bind.default)(_context = _this._onChange).call(_context, (0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(FieldPicker, [{
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
    value: function _onChange(fieldId) {
      var _this$props = this.props,
          onChange = _this$props.onChange,
          table = _this$props.table;

      if (onChange) {
        var field = table && !table.isDeleted && fieldId ? table.getFieldById(fieldId) : null;
        onChange(field);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _context2,
          _context3,
          _this2 = this;

      var _this$props2 = this.props,
          selectedField = _this$props2.field,
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
        placeholder = shouldAllowPickingNone ? 'None' : 'Pick a field...';
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

      var shouldAllowPickingFieldFn = function shouldAllowPickingFieldFn(field) {
        return !allowedTypes || allowedTypes[field.type];
      };

      var restOfProps = u.omit(this.props, (0, _keys.default)(FieldPicker.propTypes)); // Fields are only ordered within a view, and views' column orders aren't
      // loaded by default. So we'll always list the primary field first, followed
      // by the rest of the fields in alphabetical order.

      var models = (0, _sort.default)(_context2 = (0, _filter.default)(_context3 = table.fields).call(_context3, function (field) {
        return field !== table.primaryField;
      })).call(_context2, function (a, b) {
        return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
      });
      models.unshift(table.primaryField);
      return React.createElement(_model_picker_select.default, (0, _extends2.default)({
        ref: function ref(el) {
          return _this2._select = el;
        },
        models: models,
        selectedModelId: selectedField && !selectedField.isDeleted ? selectedField.id : null,
        shouldAllowPickingModelFn: shouldAllowPickingFieldFn,
        onChange: this._onChange,
        style: style,
        className: className,
        disabled: disabled,
        placeholder: placeholder,
        shouldAllowPickingNone: shouldAllowPickingNone,
        modelKeysToWatch: ['name', 'config']
      }, restOfProps));
    }
  }]);
  return FieldPicker;
}(React.Component);

(0, _defineProperty2.default)(FieldPicker, "propTypes", {
  table: _propTypes.default.instanceOf(_table.default),
  field: _propTypes.default.instanceOf(_field.default),
  shouldAllowPickingNone: _propTypes.default.bool,
  onChange: _propTypes.default.func,
  allowedTypes: _propTypes.default.arrayOf(_propTypes.default.oneOf((0, _valuesInstanceProperty(_private_utils))(_field2.FieldTypes))),
  placeholder: _propTypes.default.string,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  disabled: _propTypes.default.bool
});

var _default = (0, _create_data_container.default)(FieldPicker, function (props) {
  return [{
    watch: props.table,
    key: 'fields'
  }, {
    watch: (0, _get_sdk.default)().base,
    key: 'tables'
  }];
}, ['focus', 'blur', 'click']);

exports.default = _default;