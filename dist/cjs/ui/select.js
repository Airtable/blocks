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

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _classnames = _interopRequireDefault(require("classnames"));

var React = _interopRequireWildcard(require("react"));

var _select_and_select_buttons_helpers = require("./select_and_select_buttons_helpers");

const styleForChevron = {
  // eslint-disable-next-line quotes
  backgroundImage: `url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' class='mr1' style='shape-rendering:geometricPrecision'%3E%3Cpath fill-rule='evenodd' class='animate' fill='%23777' d='M3.6011,4.00002 L8.4011,4.00002 C8.8951,4.00002 9.1771,4.56402 8.8811,4.96002 L6.4811,8.16002 C6.2411,8.48002 5.7611,8.48002 5.5211,8.16002 L3.1211,4.96002 C2.8241,4.56402 3.1071,4.00002 3.6011,4.00002'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'calc(100% - 6px)',
  paddingRight: 22
}; // This component isn't great right now. It's just a styled <select> with a really hacky
// way of getting the chevron arrow to show up. It also behaves weirdly when you give it
// a margin (I think this is a limitation of <select>). We should probably replace it with
// something like react-select, which would give us nice features like rendering custom
// elements for options (e.g. for field type icons) and typeahead search.

/** */

class Select extends React.Component {
  constructor(props) {
    var _context;

    super(props);
    this._select = null;
    this._onChange = (0, _bind.default)(_context = this._onChange).call(_context, this);
  }

  _onChange(e) {
    const {
      onChange
    } = this.props;

    if (onChange) {
      (0, _invariant.default)(e.target instanceof HTMLSelectElement, 'bad input');
      const value = (0, _select_and_select_buttons_helpers.stringToOptionValue)(e.target.value);
      onChange(value);
    }
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
      className,
      style,
      options: originalOptions = [],
      value,
      // Filter these out so they're not
      // included in restOfProps:
      children,
      // eslint-disable-line no-unused-vars
      onChange,
      // eslint-disable-line no-unused-vars
      ...restOfProps
    } = this.props; // Check options here for a cleaner stack trace.
    // Also, even though options are required, still check if it's set because
    // the error is really ugly and covers up the prop type check.

    const validationResult = (0, _select_and_select_buttons_helpers.validateOptions)(originalOptions);

    if (!validationResult.isValid) {
      throw new Error(`<Select> ${validationResult.reason}`);
    }

    let didFindOptionMatchingValue = false;

    for (const option of originalOptions) {
      if (option.value === value) {
        didFindOptionMatchingValue = true;
        break;
      }
    }

    const options = [];

    if (!didFindOptionMatchingValue) {
      // Since there's no option that matches the given value, let's add an
      // empty option at the top and log a warning.
      options.push({
        label: '',
        value,
        disabled: true
      }); // eslint-disable-next-line no-console

      console.warn(`No option for selected value in <Select>: ${String(value)}`.substr(0, 100));
    }

    options.push(...originalOptions);
    return React.createElement("select", (0, _extends2.default)({
      ref: el => this._select = el,
      className: (0, _classnames.default)('styled-input p1 rounded normal no-outline darken1 text-dark', {
        'link-quiet pointer': !this.props.disabled,
        quieter: this.props.disabled
      }, className),
      style: { ...styleForChevron,
        ...style
      },
      value: (0, _select_and_select_buttons_helpers.optionValueToString)(value),
      onChange: this._onChange
    }, restOfProps), options && (0, _map.default)(options).call(options, option => {
      const valueJson = (0, _select_and_select_buttons_helpers.optionValueToString)(option.value);
      return React.createElement("option", {
        key: valueJson,
        value: valueJson,
        disabled: option.disabled
      }, option.label);
    }));
  }

}

(0, _defineProperty2.default)(Select, "propTypes", _select_and_select_buttons_helpers.SelectAndSelectButtonsPropTypes);
var _default = Select;
exports.default = _default;