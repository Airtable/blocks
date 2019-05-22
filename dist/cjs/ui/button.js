"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _freeze = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/freeze"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

const themes = (0, _freeze.default)({
  RED: 'red',
  GREEN: 'green',
  BLUE: 'blue',
  YELLOW: 'yellow',
  WHITE: 'white',
  GRAY: 'gray',
  DARK: 'dark',
  TRANSPARENT: 'transparent'
});
const classNamesByTheme = {
  [themes.RED]: 'red text-white',
  [themes.GREEN]: 'green text-white',
  [themes.BLUE]: 'blue text-white',
  [themes.YELLOW]: 'yellow text-dark',
  [themes.WHITE]: 'white text-blue',
  [themes.DARK]: 'dark text-white',
  [themes.GRAY]: 'grayLight1 text-dark',
  [themes.TRANSPARENT]: 'background-transparent text-dark'
};
/**
 * Clickable button component.
 *
 * @example
 * import {UI} from 'airtable-block';
 * const button = (
 *     <UI.Button
 *        disabled={false}
 *        theme={UI.Button.themes.BLUE}
 *        onClick={() = alert('Clicked!')}>
 *         Done
 *     </UI.Button>
 * );
 */

class Button extends React.Component {
  constructor(props) {
    super(props);
    this._button = null;
  }

  focus() {
    (0, _invariant.default)(this._button, 'No button to focus');

    this._button.focus();
  }

  blur() {
    (0, _invariant.default)(this._button, 'No button to blur');

    this._button.blur();
  }

  click() {
    (0, _invariant.default)(this._button, 'No button to click');

    this._button.click();
  }

  render() {
    const {
      className,
      theme,
      disabled,
      children,
      ...restOfProps
    } = this.props;
    const themeClassNames = classNamesByTheme[theme] || '';
    return React.createElement("button", (0, _extends2.default)({
      ref: el => this._button = el,
      type: "button" // Default type is "submit", which will submit the parent <form> if it exists.
      ,
      disabled: disabled,
      className: (0, _classnames.default)('baymax rounded big strong p1 flex-inline items-center no-outline', themeClassNames, className, {
        'pointer link-quiet': !disabled,
        'noevents quieter': disabled
      })
    }, restOfProps), children);
  }

}

(0, _defineProperty2.default)(Button, "propTypes", {
  className: _propTypes.default.string,
  disabled: _propTypes.default.bool,
  theme: _propTypes.default.oneOf((0, _keys.default)(classNamesByTheme))
});
(0, _defineProperty2.default)(Button, "defaultProps", {
  theme: themes.GRAY
});
(0, _defineProperty2.default)(Button, "themes", themes);
var _default = Button;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9idXR0b24uanMiXSwibmFtZXMiOlsidGhlbWVzIiwiUkVEIiwiR1JFRU4iLCJCTFVFIiwiWUVMTE9XIiwiV0hJVEUiLCJHUkFZIiwiREFSSyIsIlRSQU5TUEFSRU5UIiwiY2xhc3NOYW1lc0J5VGhlbWUiLCJCdXR0b24iLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJfYnV0dG9uIiwiZm9jdXMiLCJibHVyIiwiY2xpY2siLCJyZW5kZXIiLCJjbGFzc05hbWUiLCJ0aGVtZSIsImRpc2FibGVkIiwiY2hpbGRyZW4iLCJyZXN0T2ZQcm9wcyIsInRoZW1lQ2xhc3NOYW1lcyIsImVsIiwiUHJvcFR5cGVzIiwic3RyaW5nIiwiYm9vbCIsIm9uZU9mIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUEsTUFBTUEsTUFBTSxHQUFHLHFCQUFjO0FBQ3pCQyxFQUFBQSxHQUFHLEVBQUUsS0FEb0I7QUFFekJDLEVBQUFBLEtBQUssRUFBRSxPQUZrQjtBQUd6QkMsRUFBQUEsSUFBSSxFQUFFLE1BSG1CO0FBSXpCQyxFQUFBQSxNQUFNLEVBQUUsUUFKaUI7QUFLekJDLEVBQUFBLEtBQUssRUFBRSxPQUxrQjtBQU16QkMsRUFBQUEsSUFBSSxFQUFFLE1BTm1CO0FBT3pCQyxFQUFBQSxJQUFJLEVBQUUsTUFQbUI7QUFRekJDLEVBQUFBLFdBQVcsRUFBRTtBQVJZLENBQWQsQ0FBZjtBQW9CQSxNQUFNQyxpQkFBaUIsR0FBRztBQUN0QixHQUFDVCxNQUFNLENBQUNDLEdBQVIsR0FBYyxnQkFEUTtBQUV0QixHQUFDRCxNQUFNLENBQUNFLEtBQVIsR0FBZ0Isa0JBRk07QUFHdEIsR0FBQ0YsTUFBTSxDQUFDRyxJQUFSLEdBQWUsaUJBSE87QUFJdEIsR0FBQ0gsTUFBTSxDQUFDSSxNQUFSLEdBQWlCLGtCQUpLO0FBS3RCLEdBQUNKLE1BQU0sQ0FBQ0ssS0FBUixHQUFnQixpQkFMTTtBQU10QixHQUFDTCxNQUFNLENBQUNPLElBQVIsR0FBZSxpQkFOTztBQU90QixHQUFDUCxNQUFNLENBQUNNLElBQVIsR0FBZSxzQkFQTztBQVF0QixHQUFDTixNQUFNLENBQUNRLFdBQVIsR0FBc0I7QUFSQSxDQUExQjtBQVdBOzs7Ozs7Ozs7Ozs7Ozs7QUFjQSxNQUFNRSxNQUFOLFNBQXFCQyxLQUFLLENBQUNDLFNBQTNCLENBQWtEO0FBYzlDQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBcUI7QUFDNUIsVUFBTUEsS0FBTjtBQUVBLFNBQUtDLE9BQUwsR0FBZSxJQUFmO0FBQ0g7O0FBQ0RDLEVBQUFBLEtBQUssR0FBRztBQUNKLDRCQUFVLEtBQUtELE9BQWYsRUFBd0Isb0JBQXhCOztBQUNBLFNBQUtBLE9BQUwsQ0FBYUMsS0FBYjtBQUNIOztBQUNEQyxFQUFBQSxJQUFJLEdBQUc7QUFDSCw0QkFBVSxLQUFLRixPQUFmLEVBQXdCLG1CQUF4Qjs7QUFDQSxTQUFLQSxPQUFMLENBQWFFLElBQWI7QUFDSDs7QUFDREMsRUFBQUEsS0FBSyxHQUFHO0FBQ0osNEJBQVUsS0FBS0gsT0FBZixFQUF3QixvQkFBeEI7O0FBQ0EsU0FBS0EsT0FBTCxDQUFhRyxLQUFiO0FBQ0g7O0FBQ0RDLEVBQUFBLE1BQU0sR0FBRztBQUNMLFVBQU07QUFBQ0MsTUFBQUEsU0FBRDtBQUFZQyxNQUFBQSxLQUFaO0FBQW1CQyxNQUFBQSxRQUFuQjtBQUE2QkMsTUFBQUEsUUFBN0I7QUFBdUMsU0FBR0M7QUFBMUMsUUFBeUQsS0FBS1YsS0FBcEU7QUFFQSxVQUFNVyxlQUFlLEdBQUdoQixpQkFBaUIsQ0FBQ1ksS0FBRCxDQUFqQixJQUE0QixFQUFwRDtBQUVBLFdBQ0k7QUFDSSxNQUFBLEdBQUcsRUFBRUssRUFBRSxJQUFLLEtBQUtYLE9BQUwsR0FBZVcsRUFEL0I7QUFFSSxNQUFBLElBQUksRUFBQyxRQUZULENBRWtCO0FBRmxCO0FBR0ksTUFBQSxRQUFRLEVBQUVKLFFBSGQ7QUFJSSxNQUFBLFNBQVMsRUFBRSx5QkFDUCxrRUFETyxFQUVQRyxlQUZPLEVBR1BMLFNBSE8sRUFJUDtBQUNJLDhCQUFzQixDQUFDRSxRQUQzQjtBQUVJLDRCQUFvQkE7QUFGeEIsT0FKTztBQUpmLE9BYVFFLFdBYlIsR0FlS0QsUUFmTCxDQURKO0FBbUJIOztBQXZENkM7OzhCQUE1Q2IsTSxlQUNpQjtBQUNmVSxFQUFBQSxTQUFTLEVBQUVPLG1CQUFVQyxNQUROO0FBRWZOLEVBQUFBLFFBQVEsRUFBRUssbUJBQVVFLElBRkw7QUFHZlIsRUFBQUEsS0FBSyxFQUFFTSxtQkFBVUcsS0FBVixDQUFnQixtQkFBWXJCLGlCQUFaLENBQWhCO0FBSFEsQzs4QkFEakJDLE0sa0JBT29CO0FBQ2xCVyxFQUFBQSxLQUFLLEVBQUVyQixNQUFNLENBQUNNO0FBREksQzs4QkFQcEJJLE0sWUFXY1YsTTtlQStDTFUsTSIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCBpbnZhcmlhbnQgZnJvbSAnaW52YXJpYW50JztcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcblxuY29uc3QgdGhlbWVzID0gT2JqZWN0LmZyZWV6ZSh7XG4gICAgUkVEOiAncmVkJyxcbiAgICBHUkVFTjogJ2dyZWVuJyxcbiAgICBCTFVFOiAnYmx1ZScsXG4gICAgWUVMTE9XOiAneWVsbG93JyxcbiAgICBXSElURTogJ3doaXRlJyxcbiAgICBHUkFZOiAnZ3JheScsXG4gICAgREFSSzogJ2RhcmsnLFxuICAgIFRSQU5TUEFSRU5UOiAndHJhbnNwYXJlbnQnLFxufSk7XG5cbnR5cGUgQnV0dG9uVGhlbWUgPSAkVmFsdWVzPHR5cGVvZiB0aGVtZXM+O1xuXG50eXBlIEJ1dHRvblByb3BzID0ge1xuICAgIGNsYXNzTmFtZT86IHN0cmluZyxcbiAgICBkaXNhYmxlZD86IGJvb2xlYW4sXG4gICAgdGhlbWU6IEJ1dHRvblRoZW1lLFxuICAgIGNoaWxkcmVuPzogUmVhY3QuTm9kZSxcbn07XG5cbmNvbnN0IGNsYXNzTmFtZXNCeVRoZW1lID0ge1xuICAgIFt0aGVtZXMuUkVEXTogJ3JlZCB0ZXh0LXdoaXRlJyxcbiAgICBbdGhlbWVzLkdSRUVOXTogJ2dyZWVuIHRleHQtd2hpdGUnLFxuICAgIFt0aGVtZXMuQkxVRV06ICdibHVlIHRleHQtd2hpdGUnLFxuICAgIFt0aGVtZXMuWUVMTE9XXTogJ3llbGxvdyB0ZXh0LWRhcmsnLFxuICAgIFt0aGVtZXMuV0hJVEVdOiAnd2hpdGUgdGV4dC1ibHVlJyxcbiAgICBbdGhlbWVzLkRBUktdOiAnZGFyayB0ZXh0LXdoaXRlJyxcbiAgICBbdGhlbWVzLkdSQVldOiAnZ3JheUxpZ2h0MSB0ZXh0LWRhcmsnLFxuICAgIFt0aGVtZXMuVFJBTlNQQVJFTlRdOiAnYmFja2dyb3VuZC10cmFuc3BhcmVudCB0ZXh0LWRhcmsnLFxufTtcblxuLyoqXG4gKiBDbGlja2FibGUgYnV0dG9uIGNvbXBvbmVudC5cbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0IHtVSX0gZnJvbSAnYWlydGFibGUtYmxvY2snO1xuICogY29uc3QgYnV0dG9uID0gKFxuICogICAgIDxVSS5CdXR0b25cbiAqICAgICAgICBkaXNhYmxlZD17ZmFsc2V9XG4gKiAgICAgICAgdGhlbWU9e1VJLkJ1dHRvbi50aGVtZXMuQkxVRX1cbiAqICAgICAgICBvbkNsaWNrPXsoKSA9IGFsZXJ0KCdDbGlja2VkIScpfT5cbiAqICAgICAgICAgRG9uZVxuICogICAgIDwvVUkuQnV0dG9uPlxuICogKTtcbiAqL1xuY2xhc3MgQnV0dG9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PEJ1dHRvblByb3BzPiB7XG4gICAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAgICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIHRoZW1lOiBQcm9wVHlwZXMub25lT2YoT2JqZWN0LmtleXMoY2xhc3NOYW1lc0J5VGhlbWUpKSxcbiAgICB9O1xuXG4gICAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgICAgdGhlbWU6IHRoZW1lcy5HUkFZLFxuICAgIH07XG5cbiAgICBzdGF0aWMgdGhlbWVzID0gdGhlbWVzO1xuXG4gICAgX2J1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsO1xuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBCdXR0b25Qcm9wcykge1xuICAgICAgICBzdXBlcihwcm9wcyk7XG5cbiAgICAgICAgdGhpcy5fYnV0dG9uID0gbnVsbDtcbiAgICB9XG4gICAgZm9jdXMoKSB7XG4gICAgICAgIGludmFyaWFudCh0aGlzLl9idXR0b24sICdObyBidXR0b24gdG8gZm9jdXMnKTtcbiAgICAgICAgdGhpcy5fYnV0dG9uLmZvY3VzKCk7XG4gICAgfVxuICAgIGJsdXIoKSB7XG4gICAgICAgIGludmFyaWFudCh0aGlzLl9idXR0b24sICdObyBidXR0b24gdG8gYmx1cicpO1xuICAgICAgICB0aGlzLl9idXR0b24uYmx1cigpO1xuICAgIH1cbiAgICBjbGljaygpIHtcbiAgICAgICAgaW52YXJpYW50KHRoaXMuX2J1dHRvbiwgJ05vIGJ1dHRvbiB0byBjbGljaycpO1xuICAgICAgICB0aGlzLl9idXR0b24uY2xpY2soKTtcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCB7Y2xhc3NOYW1lLCB0aGVtZSwgZGlzYWJsZWQsIGNoaWxkcmVuLCAuLi5yZXN0T2ZQcm9wc30gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIGNvbnN0IHRoZW1lQ2xhc3NOYW1lcyA9IGNsYXNzTmFtZXNCeVRoZW1lW3RoZW1lXSB8fCAnJztcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIHJlZj17ZWwgPT4gKHRoaXMuX2J1dHRvbiA9IGVsKX1cbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCIgLy8gRGVmYXVsdCB0eXBlIGlzIFwic3VibWl0XCIsIHdoaWNoIHdpbGwgc3VibWl0IHRoZSBwYXJlbnQgPGZvcm0+IGlmIGl0IGV4aXN0cy5cbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWVzKFxuICAgICAgICAgICAgICAgICAgICAnYmF5bWF4IHJvdW5kZWQgYmlnIHN0cm9uZyBwMSBmbGV4LWlubGluZSBpdGVtcy1jZW50ZXIgbm8tb3V0bGluZScsXG4gICAgICAgICAgICAgICAgICAgIHRoZW1lQ2xhc3NOYW1lcyxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAncG9pbnRlciBsaW5rLXF1aWV0JzogIWRpc2FibGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ25vZXZlbnRzIHF1aWV0ZXInOiBkaXNhYmxlZCxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIHsuLi5yZXN0T2ZQcm9wc31cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJ1dHRvbjtcbiJdfQ==