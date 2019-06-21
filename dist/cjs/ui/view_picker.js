"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _private_utils = require("../private_utils");

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _view = _interopRequireDefault(require("../models/view"));

var _table = _interopRequireDefault(require("../models/table"));

var _view2 = require("../types/view");

var _model_picker_select = _interopRequireDefault(require("./model_picker_select"));

var _with_hooks = _interopRequireDefault(require("./with_hooks"));

var _use_watchable = _interopRequireDefault(require("./use_watchable"));

/**
 * Dropdown menu component for selecting views.
 *
 * @example
 * import {TablePicker, ViewPicker, useBase, useRecords} from '@airtable/blocks/ui';
 * import {viewTypes} from '@airtable/blocks/models';
 * import React, {Fragment, useState} from 'react';
 *
 * function Block() {
 *     useBase();
 *     const [table, setTable] = useState(null);
 *     const [view, setView] = useState(null);
 *     const queryResult = view ? view.selectRecords() : null;
 *     const records = useRecords(queryResult);
 *
 *     const summaryText = view ? `${view.name} has ${records.length} record(s).` : 'No view selected.';
 *     return (
 *         <Fragment>
 *             <p style={{marginBottom: 16}}>{summaryText}</p>
 *             <label style={{display: 'block', marginBottom: 16}}>
 *                 <div style={{marginBottom: 8, fontWeight: 500}}>Table</div>
 *                 <TablePicker
 *                     table={table}
 *                     onChange={newTable => {
 *                         setTable(newTable);
 *                         setView(null);
 *                     }}
 *                     shouldAllowPickingNone={true}
 *                 />
 *             </label>
 *             {table && (
 *                 <label>
 *                     <div style={{marginBottom: 8, fontWeight: 500}}>View</div>
 *                     <ViewPicker
 *                         table={table}
 *                         view={view}
 *                         onChange={newView => setView(newView)}
 *                         allowedTypes={[viewTypes.GRID]}
 *                         shouldAllowPickingNone={true}
 *                     />
 *                 </label>
 *             )}
 *         </Fragment>
 *     );
 * }
 */
var ViewPicker =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(ViewPicker, _React$Component);

  function ViewPicker(props) {
    var _this;

    (0, _classCallCheck2.default)(this, ViewPicker);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ViewPicker).call(this, props)); // TODO (stephen): Use React.forwardRef

    _this._select = null;
    _this._onChange = _this._onChange.bind((0, _assertThisInitialized2.default)(_this));
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
        var view = table && !table.isDeleted && viewId ? table.getViewByIdIfExists(viewId) : null;
        onChange(view);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          table = _this$props2.table,
          selectedView = _this$props2.view,
          shouldAllowPickingNone = _this$props2.shouldAllowPickingNone,
          disabled = _this$props2.disabled,
          allowedTypes = _this$props2.allowedTypes,
          placeholder = _this$props2.placeholder,
          id = _this$props2.id,
          className = _this$props2.className,
          style = _this$props2.style,
          tabIndex = _this$props2.tabIndex;

      if (!table || table.isDeleted) {
        return null;
      }

      var placeholderToUse;

      if (placeholder === undefined) {
        // Let's set a good default value for the placeholder, depending
        // on the shouldAllowPickingNone flag.
        placeholderToUse = shouldAllowPickingNone ? 'None' : 'Pick a view...';
      } else {
        placeholderToUse = placeholder;
      }

      var allowedTypesSet = {};

      if (allowedTypes) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = allowedTypes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var allowedType = _step.value;
            allowedTypesSet[allowedType] = true;
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

      var shouldAllowPickingViewFn = view => allowedTypesSet[view.type];

      return React.createElement(_model_picker_select.default, {
        ref: el => this._select = el,
        models: table.views,
        shouldAllowPickingModelFn: shouldAllowPickingViewFn,
        selectedModelId: selectedView && !selectedView.isDeleted ? selectedView.id : null,
        modelKeysToWatch: ['name'],
        onChange: this._onChange,
        disabled: disabled,
        shouldAllowPickingNone: shouldAllowPickingNone,
        placeholder: placeholderToUse,
        id: id,
        className: className,
        style: style,
        tabIndex: tabIndex,
        "aria-labelledby": this.props['aria-labelledby'],
        "aria-describedby": this.props['aria-describedby']
      });
    }
  }]);
  return ViewPicker;
}(React.Component);

(0, _defineProperty2.default)(ViewPicker, "propTypes", {
  table: _propTypes.default.instanceOf(_table.default),
  view: _propTypes.default.instanceOf(_view.default),
  onChange: _propTypes.default.func,
  disabled: _propTypes.default.bool,
  allowedTypes: _propTypes.default.arrayOf(_propTypes.default.oneOf((0, _private_utils.values)(_view2.ViewTypes))),
  shouldAllowPickingNone: _propTypes.default.bool,
  placeholder: _propTypes.default.string,
  id: _propTypes.default.string,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  tabIndex: _propTypes.default.oneOf([_propTypes.default.number, _propTypes.default.string]),
  'aria-labelledby': _propTypes.default.string,
  'aria-describedby': _propTypes.default.string
});
(0, _defineProperty2.default)(ViewPicker, "defaultProps", {
  // Exclude ViewTypes.FORM
  allowedTypes: [_view2.ViewTypes.GRID, _view2.ViewTypes.CALENDAR, _view2.ViewTypes.GALLERY, _view2.ViewTypes.KANBAN]
});

var _default = (0, _with_hooks.default)(ViewPicker, props => {
  (0, _use_watchable.default)((0, _get_sdk.default)().base, ['tables']);
  (0, _use_watchable.default)(props.table, ['views']);
  return {};
});

exports.default = _default;