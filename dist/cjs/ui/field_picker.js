"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.sort");

require("core-js/modules/es.object.to-string");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

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
class FieldPicker extends React.Component {
  constructor(props) {
    super(props);
    this._select = null;
    this._onChange = this._onChange.bind(this);
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

  _onChange(fieldId) {
    var _this$props = this.props,
        onChange = _this$props.onChange,
        table = _this$props.table;

    if (onChange) {
      var field = table && !table.isDeleted && fieldId ? table.getFieldById(fieldId) : null;
      onChange(field);
    }
  }

  render() {
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
        for (var _iterator = this.props.allowedTypes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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

    var shouldAllowPickingFieldFn = field => {
      return !allowedTypes || allowedTypes[field.type];
    };

    var restOfProps = u.omit(this.props, Object.keys(FieldPicker.propTypes)); // Fields are only ordered within a view, and views' column orders aren't
    // loaded by default. So we'll always list the primary field first, followed
    // by the rest of the fields in alphabetical order.

    var models = table.fields.filter(field => field !== table.primaryField).sort((a, b) => {
      return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
    });
    models.unshift(table.primaryField);
    return React.createElement(_model_picker_select.default, (0, _extends2.default)({
      ref: el => this._select = el,
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

}

(0, _defineProperty2.default)(FieldPicker, "propTypes", {
  table: _propTypes.default.instanceOf(_table.default),
  field: _propTypes.default.instanceOf(_field.default),
  shouldAllowPickingNone: _propTypes.default.bool,
  onChange: _propTypes.default.func,
  allowedTypes: _propTypes.default.arrayOf(_propTypes.default.oneOf((0, _private_utils.values)(_field2.FieldTypes))),
  placeholder: _propTypes.default.string,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  disabled: _propTypes.default.bool
});

var _default = (0, _create_data_container.default)(FieldPicker, props => {
  return [{
    watch: props.table,
    key: 'fields'
  }, {
    watch: (0, _get_sdk.default)().base,
    key: 'tables'
  }];
}, ['focus', 'blur', 'click']);

exports.default = _default;