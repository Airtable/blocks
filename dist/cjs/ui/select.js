"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.to-string");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _classnames = _interopRequireDefault(require("classnames"));

var React = _interopRequireWildcard(require("react"));

var _select_and_select_buttons_helpers = require("./select_and_select_buttons_helpers");

var styleForChevron = {
  // eslint-disable-next-line quotes
  backgroundImage: "url(\"data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' class='mr1' style='shape-rendering:geometricPrecision'%3E%3Cpath fill-rule='evenodd' class='animate' fill='%23777' d='M3.6011,4.00002 L8.4011,4.00002 C8.8951,4.00002 9.1771,4.56402 8.8811,4.96002 L6.4811,8.16002 C6.2411,8.48002 5.7611,8.48002 5.5211,8.16002 L3.1211,4.96002 C2.8241,4.56402 3.1071,4.00002 3.6011,4.00002'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'calc(100% - 6px)',
  paddingRight: 22
}; // This component isn't great right now. It's just a styled <select> with a really hacky
// way of getting the chevron arrow to show up. It also behaves weirdly when you give it
// a margin (I think this is a limitation of <select>). We should probably replace it with
// something like react-select, which would give us nice features like rendering custom
// elements for options (e.g. for field type icons) and typeahead search.

/** */

var Select =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(Select, _React$Component);

  function Select(props) {
    var _this;

    (0, _classCallCheck2.default)(this, Select);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Select).call(this, props));
    _this._select = null;
    _this._onChange = _this._onChange.bind((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(Select, [{
    key: "_onChange",
    value: function _onChange(e) {
      var onChange = this.props.onChange;

      if (onChange) {
        (0, _invariant.default)(e.target instanceof HTMLSelectElement, 'bad input');
        var value = (0, _select_and_select_buttons_helpers.stringToOptionValue)(e.target.value);
        onChange(value);
      }
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
          className = _this$props.className,
          style = _this$props.style,
          _this$props$options = _this$props.options,
          originalOptions = _this$props$options === void 0 ? [] : _this$props$options,
          value = _this$props.value,
          children = _this$props.children,
          onChange = _this$props.onChange,
          restOfProps = (0, _objectWithoutProperties2.default)(_this$props, ["className", "style", "options", "value", "children", "onChange"]); // Check options here for a cleaner stack trace.
      // Also, even though options are required, still check if it's set because
      // the error is really ugly and covers up the prop type check.

      var validationResult = (0, _select_and_select_buttons_helpers.validateOptions)(originalOptions);

      if (!validationResult.isValid) {
        throw new Error("<Select> ".concat(validationResult.reason));
      }

      var didFindOptionMatchingValue = false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = originalOptions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var option = _step.value;

          if (option.value === value) {
            didFindOptionMatchingValue = true;
            break;
          }
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

      var options = [];

      if (!didFindOptionMatchingValue) {
        // Since there's no option that matches the given value, let's add an
        // empty option at the top and log a warning.
        options.push({
          label: '',
          value,
          disabled: true
        }); // eslint-disable-next-line no-console

        console.warn("No option for selected value in <Select>: ".concat(String(value)).substr(0, 100));
      }

      options.push(...originalOptions);
      return React.createElement("select", (0, _extends2.default)({
        ref: el => this._select = el,
        className: (0, _classnames.default)('styled-input p1 rounded normal no-outline darken1 text-dark', {
          'link-quiet pointer': !this.props.disabled,
          quieter: this.props.disabled
        }, className),
        style: (0, _objectSpread2.default)({}, styleForChevron, style),
        value: (0, _select_and_select_buttons_helpers.optionValueToString)(value),
        onChange: this._onChange
      }, restOfProps), options && options.map(option => {
        var valueJson = (0, _select_and_select_buttons_helpers.optionValueToString)(option.value);
        return React.createElement("option", {
          key: valueJson,
          value: valueJson,
          disabled: option.disabled
        }, option.label);
      }));
    }
  }]);
  return Select;
}(React.Component);

(0, _defineProperty2.default)(Select, "propTypes", _select_and_select_buttons_helpers.SelectAndSelectButtonsPropTypes);
var _default = Select;
exports.default = _default;