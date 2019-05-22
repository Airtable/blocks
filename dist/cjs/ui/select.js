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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9zZWxlY3QuanMiXSwibmFtZXMiOlsic3R5bGVGb3JDaGV2cm9uIiwiYmFja2dyb3VuZEltYWdlIiwiYmFja2dyb3VuZFJlcGVhdCIsImJhY2tncm91bmRQb3NpdGlvbiIsInBhZGRpbmdSaWdodCIsIlNlbGVjdCIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsIl9zZWxlY3QiLCJfb25DaGFuZ2UiLCJlIiwib25DaGFuZ2UiLCJ0YXJnZXQiLCJIVE1MU2VsZWN0RWxlbWVudCIsInZhbHVlIiwiZm9jdXMiLCJibHVyIiwiY2xpY2siLCJyZW5kZXIiLCJjbGFzc05hbWUiLCJzdHlsZSIsIm9wdGlvbnMiLCJvcmlnaW5hbE9wdGlvbnMiLCJjaGlsZHJlbiIsInJlc3RPZlByb3BzIiwidmFsaWRhdGlvblJlc3VsdCIsImlzVmFsaWQiLCJFcnJvciIsInJlYXNvbiIsImRpZEZpbmRPcHRpb25NYXRjaGluZ1ZhbHVlIiwib3B0aW9uIiwicHVzaCIsImxhYmVsIiwiZGlzYWJsZWQiLCJjb25zb2xlIiwid2FybiIsIlN0cmluZyIsInN1YnN0ciIsImVsIiwicXVpZXRlciIsInZhbHVlSnNvbiIsIlNlbGVjdEFuZFNlbGVjdEJ1dHRvbnNQcm9wVHlwZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQVFBLE1BQU1BLGVBQWUsR0FBRztBQUNwQjtBQUNBQyxFQUFBQSxlQUFlLEVBQUcsb2NBRkU7QUFHcEJDLEVBQUFBLGdCQUFnQixFQUFFLFdBSEU7QUFJcEJDLEVBQUFBLGtCQUFrQixFQUFFLGtCQUpBO0FBS3BCQyxFQUFBQSxZQUFZLEVBQUU7QUFMTSxDQUF4QixDLENBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTs7QUFDQSxNQUFNQyxNQUFOLFNBQXFCQyxLQUFLLENBQUNDLFNBQTNCLENBQWtEO0FBSTlDQyxFQUFBQSxXQUFXLENB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QUFHckIsZUFEQTtBQUVILFdBQUdzQjtBQUZBLE9BVlg7QUFjSSxNQUFBLEtBQUssRUFBRSw0REFBb0JOLEtBQXBCLENBZFg7QUFlSSxNQUFBLFFBQVEsRUFBRSxLQUFLTDtBQWZuQixPQWdCUWUsV0FoQlIsR0FrQktILE9BQU8sSUFDSixrQkFBQUEsT0FBTyxNQUFQLENBQUFBLE9BQU8sRUFBS1MsTUFBTSxJQUFJO0FBQ2xCLFlBQU1VLFNBQVMsR0FBRyw0REFBb0JWLE1BQU0sQ0FBQ2hCLEtBQTNCLENBQWxCO0FBQ0EsYUFDSTtBQUFRLFFBQUEsR0FBRyxFQUFFMEIsU0FBYjtBQUF3QixRQUFBLEtBQUssRUFBRUEsU0FBL0I7QUFBMEMsUUFBQSxRQUFRLEVBQUVWLE1BQU0sQ0FBQ0c7QUFBM0QsU0FDS0gsTUFBTSxDQUFDRSxLQURaLENBREo7QUFLSCxLQVBNLENBbkJmLENBREo7QUE4Qkg7O0FBekc2Qzs7OEJBQTVDN0IsTSxlQUNpQnNDLGtFO2VBMkdSdEMsTSIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgaW52YXJpYW50IGZyb20gJ2ludmFyaWFudCc7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gICAgU2VsZWN0QW5kU2VsZWN0QnV0dG9uc1Byb3BUeXBlcyxcbiAgICB2YWxpZGF0ZU9wdGlvbnMsXG4gICAgb3B0aW9uVmFsdWVUb1N0cmluZyxcbiAgICBzdHJpbmdUb09wdGlvblZhbHVlLFxuICAgIHR5cGUgU2VsZWN0QW5kU2VsZWN0QnV0dG9uc1Byb3BzIGFzIFNlbGVjdFByb3BzLFxufSBmcm9tICcuL3NlbGVjdF9hbmRfc2VsZWN0X2J1dHRvbnNfaGVscGVycyc7XG5cbmNvbnN0IHN0eWxlRm9yQ2hldnJvbiA9IHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcXVvdGVzXG4gICAgYmFja2dyb3VuZEltYWdlOiBgdXJsKFwiZGF0YTppbWFnZS9zdmcreG1sO3V0ZjgsJTNDc3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgd2lkdGg9JzEyJyBoZWlnaHQ9JzEyJyB2aWV3Qm94PScwIDAgMTIgMTInIGNsYXNzPSdtcjEnIHN0eWxlPSdzaGFwZS1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uJyUzRSUzQ3BhdGggZmlsbC1ydWxlPSdldmVub2RkJyBjbGFzcz0nYW5pbWF0ZScgZmlsbD0nJTIzNzc3JyBkPSdNMy42MDExLDQuMDAwMDIgTDguNDAxMSw0LjAwMDAyIEM4Ljg5NTEsNC4wMDAwMiA5LjE3NzEsNC41NjQwMiA4Ljg4MTEsNC45NjAwMiBMNi40ODExLDguMTYwMDIgQzYuMjQxMSw4LjQ4MDAyIDUuNzYxMSw4LjQ4MDAyIDUuNTIxMSw4LjE2MDAyIEwzLjEyMTEsNC45NjAwMiBDMi44MjQxLDQuNTY0MDIgMy4xMDcxLDQuMDAwMDIgMy42MDExLDQuMDAwMDInLyUzRSUzQy9zdmclM0VcIilgLFxuICAgIGJhY2tncm91bmRSZXBlYXQ6ICduby1yZXBlYXQnLFxuICAgIGJhY2tncm91bmRQb3NpdGlvbjogJ2NhbGMoMTAwJSAtIDZweCknLFxuICAgIHBhZGRpbmdSaWdodDogMjIsXG59O1xuXG4vLyBUaGlzIGNvbXBvbmVudCBpc24ndCBncmVhdCByaWdodCBub3cuIEl0J3MganVzdCBhIHN0eWxlZCA8c2VsZWN0PiB3aXRoIGEgcmVhbGx5IGhhY2t5XG4vLyB3YXkgb2YgZ2V0dGluZyB0aGUgY2hldnJvbiBhcnJvdyB0byBzaG93IHVwLiBJdCBhbHNvIGJlaGF2ZXMgd2VpcmRseSB3aGVuIHlvdSBnaXZlIGl0XG4vLyBhIG1hcmdpbiAoSSB0aGluayB0aGlzIGlzIGEgbGltaXRhdGlvbiBvZiA8c2VsZWN0PikuIFdlIHNob3VsZCBwcm9iYWJseSByZXBsYWNlIGl0IHdpdGhcbi8vIHNvbWV0aGluZyBsaWtlIHJlYWN0LXNlbGVjdCwgd2hpY2ggd291bGQgZ2l2ZSB1cyBuaWNlIGZlYXR1cmVzIGxpa2UgcmVuZGVyaW5nIGN1c3RvbVxuLy8gZWxlbWVudHMgZm9yIG9wdGlvbnMgKGUuZy4gZm9yIGZpZWxkIHR5cGUgaWNvbnMpIGFuZCB0eXBlYWhlYWQgc2VhcmNoLlxuLyoqICovXG5jbGFzcyBTZWxlY3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8U2VsZWN0UHJvcHM+IHtcbiAgICBzdGF0aWMgcHJvcFR5cGVzID0gU2VsZWN0QW5kU2VsZWN0QnV0dG9uc1Byb3BUeXBlcztcbiAgICBwcm9wczogU2VsZWN0UHJvcHM7XG4gICAgX3NlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnQgfCBudWxsO1xuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBTZWxlY3RQcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG5cbiAgICAgICAgdGhpcy5fc2VsZWN0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2UgPSB0aGlzLl9vbkNoYW5nZS5iaW5kKHRoaXMpO1xuICAgIH1cbiAgICBfb25DaGFuZ2U6IChlOiBFdmVudCkgPT4gdm9pZDtcbiAgICBfb25DaGFuZ2UoZTogRXZlbnQpIHtcbiAgICAgICAgY29uc3Qge29uQ2hhbmdlfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIGlmIChvbkNoYW5nZSkge1xuICAgICAgICAgICAgaW52YXJpYW50KGUudGFyZ2V0IGluc3RhbmNlb2YgSFRNTFNlbGVjdEVsZW1lbnQsICdiYWQgaW5wdXQnKTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gc3RyaW5nVG9PcHRpb25WYWx1ZShlLnRhcmdldC52YWx1ZSk7XG4gICAgICAgICAgICBvbkNoYW5nZSh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9jdXMoKSB7XG4gICAgICAgIGludmFyaWFudCh0aGlzLl9zZWxlY3QsICdObyBzZWxlY3QgdG8gZm9jdXMnKTtcbiAgICAgICAgdGhpcy5fc2VsZWN0LmZvY3VzKCk7XG4gICAgfVxuICAgIGJsdXIoKSB7XG4gICAgICAgIGludmFyaWFudCh0aGlzLl9zZWxlY3QsICdObyBzZWxlY3QgdG8gYmx1cicpO1xuICAgICAgICB0aGlzLl9zZWxlY3QuYmx1cigpO1xuICAgIH1cbiAgICBjbGljaygpIHtcbiAgICAgICAgaW52YXJpYW50KHRoaXMuX3NlbGVjdCwgJ05vIHNlbGVjdCB0byBjbGljaycpO1xuICAgICAgICB0aGlzLl9zZWxlY3QuY2xpY2soKTtcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBjbGFzc05hbWUsXG4gICAgICAgICAgICBzdHlsZSxcbiAgICAgICAgICAgIG9wdGlvbnM6IG9yaWdpbmFsT3B0aW9ucyA9IFtdLFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAvLyBGaWx0ZXIgdGhlc2Ugb3V0IHNvIHRoZXkncmUgbm90XG4gICAgICAgICAgICAvLyBpbmNsdWRlZCBpbiByZXN0T2ZQcm9wczpcbiAgICAgICAgICAgIGNoaWxkcmVuLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICAgICAgICBvbkNoYW5nZSwgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgICAgICAgLi4ucmVzdE9mUHJvcHNcbiAgICAgICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgLy8gQ2hlY2sgb3B0aW9ucyBoZXJlIGZvciBhIGNsZWFuZXIgc3RhY2sgdHJhY2UuXG4gICAgICAgIC8vIEFsc28sIGV2ZW4gdGhvdWdoIG9wdGlvbnMgYXJlIHJlcXVpcmVkLCBzdGlsbCBjaGVjayBpZiBpdCdzIHNldCBiZWNhdXNlXG4gICAgICAgIC8vIHRoZSBlcnJvciBpcyByZWFsbHkgdWdseSBhbmQgY292ZXJzIHVwIHRoZSBwcm9wIHR5cGUgY2hlY2suXG4gICAgICAgIGNvbnN0IHZhbGlkYXRpb25SZXN1bHQgPSB2YWxpZGF0ZU9wdGlvbnMob3JpZ2luYWxPcHRpb25zKTtcbiAgICAgICAgaWYgKCF2YWxpZGF0aW9uUmVzdWx0LmlzVmFsaWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgPFNlbGVjdD4gJHt2YWxpZGF0aW9uUmVzdWx0LnJlYXNvbn1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkaWRGaW5kT3B0aW9uTWF0Y2hpbmdWYWx1ZSA9IGZhbHNlO1xuICAgICAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiBvcmlnaW5hbE9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb24udmFsdWUgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgZGlkRmluZE9wdGlvbk1hdGNoaW5nVmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBbXTtcbiAgICAgICAgaWYgKCFkaWRGaW5kT3B0aW9uTWF0Y2hpbmdWYWx1ZSkge1xuICAgICAgICAgICAgLy8gU2luY2UgdGhlcmUncyBubyBvcHRpb24gdGhhdCBtYXRjaGVzIHRoZSBnaXZlbiB2YWx1ZSwgbGV0J3MgYWRkIGFuXG4gICAgICAgICAgICAvLyBlbXB0eSBvcHRpb24gYXQgdGhlIHRvcCBhbmQgbG9nIGEgd2FybmluZy5cbiAgICAgICAgICAgIG9wdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgIGRpc2FibGVkOiB0cnVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgICAgIGBObyBvcHRpb24gZm9yIHNlbGVjdGVkIHZhbHVlIGluIDxTZWxlY3Q+OiAke1N0cmluZyh2YWx1ZSl9YC5zdWJzdHIoMCwgMTAwKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy5wdXNoKC4uLm9yaWdpbmFsT3B0aW9ucyk7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzZWxlY3RcbiAgICAgICAgICAgICAgICByZWY9e2VsID0+ICh0aGlzLl9zZWxlY3QgPSBlbCl9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAgICAgICAgICAgICAnc3R5bGVkLWlucHV0IHAxIHJvdW5kZWQgbm9ybWFsIG5vLW91dGxpbmUgZGFya2VuMSB0ZXh0LWRhcmsnLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnbGluay1xdWlldCBwb2ludGVyJzogIXRoaXMucHJvcHMuZGlzYWJsZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWlldGVyOiB0aGlzLnByb3BzLmRpc2FibGVkLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWUsXG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAuLi5zdHlsZUZvckNoZXZyb24sXG4gICAgICAgICAgICAgICAgICAgIC4uLnN0eWxlLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgdmFsdWU9e29wdGlvblZhbHVlVG9TdHJpbmcodmFsdWUpfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLl9vbkNoYW5nZX1cbiAgICAgICAgICAgICAgICB7Li4ucmVzdE9mUHJvcHN9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge29wdGlvbnMgJiZcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5tYXAob3B0aW9uID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlSnNvbiA9IG9wdGlvblZhbHVlVG9TdHJpbmcob3B0aW9uLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiBrZXk9e3ZhbHVlSnNvbn0gdmFsdWU9e3ZhbHVlSnNvbn0gZGlzYWJsZWQ9e29wdGlvbi5kaXNhYmxlZH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtvcHRpb24ubGFiZWx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvc2VsZWN0PlxuICAgICAgICApO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0O1xuIl19