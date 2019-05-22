"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

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

const u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');

/** */
class ViewPicker extends React.Component {
  constructor(props) {
    var _context;

    super(props);
    this._select = null;
    this._onChange = (0, _bind.default)(_context = this._onChange).call(_context, this);
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

  _onChange(viewId) {
    const {
      onChange,
      table
    } = this.props;

    if (onChange) {
      const view = table && !table.isDeleted && viewId ? table.getViewById(viewId) : null;
      onChange(view);
    }
  }

  render() {
    const {
      view: selectedView,
      table,
      shouldAllowPickingNone,
      style,
      className,
      disabled
    } = this.props;

    if (!table || table.isDeleted) {
      return null;
    }

    let placeholder;

    if (this.props.placeholder === undefined) {
      // Let's set a good default value for the placeholder, depending
      // on the shouldAllowPickingNone flag.
      placeholder = shouldAllowPickingNone ? 'None' : 'Pick a view...';
    } else {
      placeholder = this.props.placeholder;
    }

    let allowedTypes = null;

    if (this.props.allowedTypes) {
      allowedTypes = {};

      for (const allowedType of this.props.allowedTypes) {
        allowedTypes[allowedType] = true;
      }
    }

    const shouldAllowPickingViewFn = view => {
      return !allowedTypes || allowedTypes[view.type];
    };

    const restOfProps = u.omit(this.props, (0, _keys.default)(ViewPicker.propTypes));
    return React.createElement(_model_picker_select.default, (0, _extends2.default)({
      ref: el => this._select = el,
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

}

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

var _default = (0, _create_data_container.default)(ViewPicker, props => {
  return [{
    watch: props.table,
    key: 'views'
  }, {
    watch: (0, _get_sdk.default)().base,
    key: 'tables'
  }];
}, ['focus', 'blur', 'click']);

exports.default = _default;