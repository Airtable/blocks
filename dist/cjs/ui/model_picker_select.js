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

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _table = _interopRequireDefault(require("../models/table"));

var _view = _interopRequireDefault(require("../models/view"));

var _field = _interopRequireDefault(require("../models/field"));

var _create_data_container = _interopRequireDefault(require("./create_data_container"));

var _select = _interopRequireDefault(require("./select"));

class ModelPickerSelect extends React.Component {
  constructor(props) {
    var _context;

    super(props);
    this._onChange = (0, _bind.default)(_context = this._onChange).call(_context, this);
    this._select = null;
  }

  _onChange(value) {
    (0, _invariant.default)(value === null || typeof value === 'string', 'value must be null or model id');
    this.props.onChange(value);
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
      models,
      selectedModelId,
      style,
      className,
      disabled,
      placeholder,
      shouldAllowPickingNone,
      shouldAllowPickingModelFn,
      // Filter these out so they're not
      // included in restOfProps:
      modelKeysToWatch,
      // eslint-disable-line no-unused-vars
      onChange,
      // eslint-disable-line no-unused-vars
      ...restOfProps
    } = this.props;
    return React.createElement(_select.default, (0, _extends2.default)({
      ref: el => this._select = el,
      value: selectedModelId,
      onChange: this._onChange,
      style: style,
      className: className,
      disabled: disabled,
      options: [{
        value: null,
        label: placeholder,
        disabled: !shouldAllowPickingNone
      }, ...(0, _map.default)(models).call(models, model => {
        return {
          value: model.id,
          label: model.name,
          disabled: shouldAllowPickingModelFn && !shouldAllowPickingModelFn(model)
        };
      })]
    }, restOfProps));
  }

}

var _default = (0, _create_data_container.default)(ModelPickerSelect, props => {
  var _context2;

  return (0, _map.default)(_context2 = props.models).call(_context2, model => {
    return {
      watch: model,
      key: props.modelKeysToWatch
    };
  });
}, ['focus', 'blur', 'click']);

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9tb2RlbF9waWNrZXJfc2VsZWN0LmpzIl0sIm5hbWVzIjpbIk1vZGVsUGlja2VyU2VsZWN0IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiX29uQ2hhbmdlIiwiX3NlbGVjdCIsInZhbHVlIiwib25DaGFuZ2UiLCJmb2N1cyIsImJsdXIiLCJjbGljayIsInJlbmRlciIsIm1vZGVscyIsInNlbGVjdGVkTW9kZWxJZCIsInN0eWxlIiwiY2xhc3NOYW1lIiwiZGlzYWJsZWQiLCJwbGFjZWhvbGRlciIsInNob3VsZEFsbG93UGlja2luZ05vbmUiLCJzaG91bGRBbGxvd1BpY2tpbmdNb2RlbEZuIiwibW9kZWxLZXlzVG9XYXRjaCIsInJlc3RPZlByb3BzIiwiZWwiLCJsYWJlbCIsIm1vZGVsIiwiaWQiLCJuYW1lIiwid2F0Y2giLCJrZXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFtQkEsTUFBTUEsaUJBQU4sU0FBaURDLEtBQUssQ0FBQ0MsU0FBdkQsQ0FBZ0c7QUFHNUZDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUF1QztBQUFBOztBQUM5QyxVQUFNQSxLQUFOO0FBRUEsU0FBS0MsU0FBTCxHQUFpQixtQ0FBS0EsU0FBTCxpQkFBb0IsSUFBcEIsQ0FBakI7QUFDQSxTQUFLQyxPQUFMLEdBQWUsSUFBZjtBQUNIOztBQUNERCxFQUFBQSxTQUFTLENBQUNFLEtBQUQsRUFBMkI7QUFDaEMsNEJBQVVBLEtBQUssS0FBSyxJQUFWLElBQWtCLE9BQU9BLEtBQVAsS0FBaUIsUUFBN0MsRUFBdUQsZ0NBQXZEO0FBQ0EsU0FBS0gsS0FBTCxDQUFXSSxRQUFYLENBQW9CRCxLQUFwQjtBQUNIOztBQUNERSxFQUFBQSxLQUFLLEdBQUc7QUFDSiw0QkFBVSxLQUFLSCxPQUFmLEVBQXdCLG9CQUF4Qjs7QUFDQSxTQUFLQSxPQUFMLENBQWFHLEtBQWI7QUFDSDs7QUFDREMsRUFBQUEsSUFBSSxHQUFHO0FBQ0gsNEJBQVUsS0FBS0osT0FBZixFQUF3QixtQkFBeEI7O0FBQ0EsU0FBS0EsT0FBTCxDQUFhSSxJQUFiO0FBQ0g7O0FBQ0RDLEVBQUFBLEtBQUssR0FBRztBQUNKLDRCQUFVLEtBQUtMLE9BQWYsRUFBd0Isb0JBQXhCOztBQUNBLFNBQUtBLE9BQUwsQ0FBYUssS0FBYjtBQUNIOztBQUNEQyxFQUFBQSxNQUFNLEdBQUc7QUFDTCxVQUFNO0FBQ0ZDLE1BQUFBLE1BREU7QUFFRkMsTUFBQUEsZUFGRTtBQUdGQyxNQUFBQSxLQUhFO0FBSUZDLE1BQUFBLFNBSkU7QUFLRkMsTUFBQUEsUUFMRTtBQU1GQyxNQUFBQSxXQU5FO0FBT0ZDLE1BQUFBLHNCQVBFO0FBUUZDLE1BQUFBLHlCQVJFO0FBU0Y7QUFDQTtBQUNBQyxNQUFBQSxnQkFYRTtBQVdnQjtBQUNsQmIsTUFBQUEsUUFaRTtBQVlRO0FBQ1YsU0FBR2M7QUFiRCxRQWNGLEtBQUtsQixLQWRUO0FBZUEsV0FDSSxvQkFBQyxlQUFEO0FBQ0ksTUFBQSxHQUFHLEVBQUVtQixFQUFFLElBQUssS0FBS2pCLE9BQUwsR0FBZWlCLEVBRC9CO0FBRUksTUFBQSxLQUFLLEVBQUVULGVBRlg7QUFHSSxNQUFBLFFBQVEsRUFBRSxLQUFLVCxTQUhuQjtBQUlJLE1BQUEsS0FBSyxFQUFFVSxLQUpYO0FBS0ksTUFBQSxTQUFTLEVBQUVDLFNBTGY7QUFNSSxNQUFBLFFBQVEsRUFBRUMsUUFOZDtBQU9JLE1BQUEsT0FBTyxFQUFFLENBQ0w7QUFBQ1YsUUFBQUEsS0FBSyxFQUFFLElBQVI7QUFBY2lCLFFBQUFBLEtBQUssRUFBRU4sV0FBckI7QUFBa0NELFFBQUFBLFFBQVEsRUFBRSxDQUFDRTtBQUE3QyxPQURLLEVBRUwsR0FBRyxrQkFBQU4sTUFBTSxNQUFOLENBQUFBLE1BQU0sRUFBS1ksS0FBSyxJQUFJO0FBQ25CLGVBQU87QUFDSGxCLFVBQUFBLEtBQUssRUFBRWtCLEtBQUssQ0FBQ0MsRUFEVjtBQUVIRixVQUFBQSxLQUFLLEVBQUVDLEtBQUssQ0FBQ0UsSUFGVjtBQUdIVixVQUFBQSxRQUFRLEVBQ0pHLHlCQUF5QixJQUFJLENBQUNBLHlCQUF5QixDQUFDSyxLQUFEO0FBSnhELFNBQVA7QUFNSCxPQVBRLENBRko7QUFQYixPQWtCUUgsV0FsQlIsRUFESjtBQXNCSDs7QUEvRDJGOztlQWtFakYsb0NBQ1h0QixpQkFEVyxFQUVYSSxLQUFLLElBQUk7QUFBQTs7QUFDTCxTQUFPLDhCQUFBQSxLQUFLLENBQUNTLE1BQU4sa0JBQWlCWSxLQUFLLElBQUk7QUFDN0IsV0FBTztBQUFDRyxNQUFBQSxLQUFLLEVBQUVILEtBQVI7QUFBZUksTUFBQUEsR0FBRyxFQUFFekIsS0FBSyxDQUFDaUI7QUFBMUIsS0FBUDtBQUNILEdBRk0sQ0FBUDtBQUdILENBTlUsRUFPWCxDQUFDLE9BQUQsRUFBVSxNQUFWLEVBQWtCLE9BQWxCLENBUFcsQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgaW52YXJpYW50IGZyb20gJ2ludmFyaWFudCc7XG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgVGFibGVNb2RlbCBmcm9tICcuLi9tb2RlbHMvdGFibGUnO1xuaW1wb3J0IFZpZXdNb2RlbCBmcm9tICcuLi9tb2RlbHMvdmlldyc7XG5pbXBvcnQgRmllbGRNb2RlbCBmcm9tICcuLi9tb2RlbHMvZmllbGQnO1xuaW1wb3J0IGNyZWF0ZURhdGFDb250YWluZXIgZnJvbSAnLi9jcmVhdGVfZGF0YV9jb250YWluZXInO1xuaW1wb3J0IFNlbGVjdCBmcm9tICcuL3NlbGVjdCc7XG5pbXBvcnQge3R5cGUgU2VsZWN0T3B0aW9uVmFsdWV9IGZyb20gJy4vc2VsZWN0X2FuZF9zZWxlY3RfYnV0dG9uc19oZWxwZXJzJztcblxudHlwZSBBbnlNb2RlbCA9IFRhYmxlTW9kZWwgfCBWaWV3TW9kZWwgfCBGaWVsZE1vZGVsO1xuXG4vLyBQcml2YXRlIGNvbXBvbmVudCB1c2VkIGJ5IFRhYmxlUGlja2VyLCBWaWV3UGlja2VyLCBGaWVsZFBpY2tlci5cbnR5cGUgTW9kZWxQaWNrZXJTZWxlY3RQcm9wczxNb2RlbDogQW55TW9kZWw+ID0ge1xuICAgIG1vZGVsczogQXJyYXk8TW9kZWw+LFxuICAgIHNlbGVjdGVkTW9kZWxJZDogc3RyaW5nIHwgbnVsbCxcbiAgICBvbkNoYW5nZTogKHN0cmluZyB8IG51bGwpID0+IHZvaWQsXG4gICAgc3R5bGU/OiBPYmplY3QsXG4gICAgY2xhc3NOYW1lPzogc3RyaW5nLFxuICAgIGRpc2FibGVkPzogYm9vbGVhbixcbiAgICBwbGFjZWhvbGRlcjogc3RyaW5nLFxuICAgIHNob3VsZEFsbG93UGlja2luZ05vbmU/OiBib29sZWFuLFxuICAgIG1vZGVsS2V5c1RvV2F0Y2g6IEFycmF5PHN0cmluZz4sXG4gICAgc2hvdWxkQWxsb3dQaWNraW5nTW9kZWxGbj86IE1vZGVsID0+IGJvb2xlYW4sXG59O1xuXG5jbGFzcyBNb2RlbFBpY2tlclNlbGVjdDxNb2RlbDogQW55TW9kZWw+IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PE1vZGVsUGlja2VyU2VsZWN0UHJvcHM8TW9kZWw+PiB7XG4gICAgX3NlbGVjdDogU2VsZWN0IHwgbnVsbDtcbiAgICBfb25DaGFuZ2U6IFNlbGVjdE9wdGlvblZhbHVlID0+IHZvaWQ7XG4gICAgY29uc3RydWN0b3IocHJvcHM6IE1vZGVsUGlja2VyU2VsZWN0UHJvcHM8TW9kZWw+KSB7XG4gICAgICAgIHN1cGVyKHByb3BzKTtcblxuICAgICAgICB0aGlzLl9vbkNoYW5nZSA9IHRoaXMuX29uQ2hhbmdlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX3NlbGVjdCA9IG51bGw7XG4gICAgfVxuICAgIF9vbkNoYW5nZSh2YWx1ZTogU2VsZWN0T3B0aW9uVmFsdWUpIHtcbiAgICAgICAgaW52YXJpYW50KHZhbHVlID09PSBudWxsIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycsICd2YWx1ZSBtdXN0IGJlIG51bGwgb3IgbW9kZWwgaWQnKTtcbiAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh2YWx1ZSk7XG4gICAgfVxuICAgIGZvY3VzKCkge1xuICAgICAgICBpbnZhcmlhbnQodGhpcy5fc2VsZWN0LCAnTm8gc2VsZWN0IHRvIGZvY3VzJyk7XG4gICAgICAgIHRoaXMuX3NlbGVjdC5mb2N1cygpO1xuICAgIH1cbiAgICBibHVyKCkge1xuICAgICAgICBpbnZhcmlhbnQodGhpcy5fc2VsZWN0LCAnTm8gc2VsZWN0IHRvIGJsdXInKTtcbiAgICAgICAgdGhpcy5fc2VsZWN0LmJsdXIoKTtcbiAgICB9XG4gICAgY2xpY2soKSB7XG4gICAgICAgIGludmFyaWFudCh0aGlzLl9zZWxlY3QsICdObyBzZWxlY3QgdG8gY2xpY2snKTtcbiAgICAgICAgdGhpcy5fc2VsZWN0LmNsaWNrKCk7XG4gICAgfVxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgbW9kZWxzLFxuICAgICAgICAgICAgc2VsZWN0ZWRNb2RlbElkLFxuICAgICAgICAgICAgc3R5bGUsXG4gICAgICAgICAgICBjbGFzc05hbWUsXG4gICAgICAgICAgICBkaXNhYmxlZCxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyLFxuICAgICAgICAgICAgc2hvdWxkQWxsb3dQaWNraW5nTm9uZSxcbiAgICAgICAgICAgIHNob3VsZEFsbG93UGlja2luZ01vZGVsRm4sXG4gICAgICAgICAgICAvLyBGaWx0ZXIgdGhlc2Ugb3V0IHNvIHRoZXkncmUgbm90XG4gICAgICAgICAgICAvLyBpbmNsdWRlZCBpbiByZXN0T2ZQcm9wczpcbiAgICAgICAgICAgIG1vZGVsS2V5c1RvV2F0Y2gsIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgICAgICAgIG9uQ2hhbmdlLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICAgICAgICAuLi5yZXN0T2ZQcm9wc1xuICAgICAgICB9ID0gdGhpcy5wcm9wcztcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxTZWxlY3RcbiAgICAgICAgICAgICAgICByZWY9e2VsID0+ICh0aGlzLl9zZWxlY3QgPSBlbCl9XG4gICAgICAgICAgICAgICAgdmFsdWU9e3NlbGVjdGVkTW9kZWxJZH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5fb25DaGFuZ2V9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuICAgICAgICAgICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgICAgICAgICBvcHRpb25zPXtbXG4gICAgICAgICAgICAgICAgICAgIHt2YWx1ZTogbnVsbCwgbGFiZWw6IHBsYWNlaG9sZGVyLCBkaXNhYmxlZDogIXNob3VsZEFsbG93UGlja2luZ05vbmV9LFxuICAgICAgICAgICAgICAgICAgICAuLi5tb2RlbHMubWFwKG1vZGVsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IG1vZGVsLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBtb2RlbC5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG91bGRBbGxvd1BpY2tpbmdNb2RlbEZuICYmICFzaG91bGRBbGxvd1BpY2tpbmdNb2RlbEZuKG1vZGVsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIF19XG4gICAgICAgICAgICAgICAgey4uLnJlc3RPZlByb3BzfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZURhdGFDb250YWluZXIoXG4gICAgTW9kZWxQaWNrZXJTZWxlY3QsXG4gICAgcHJvcHMgPT4ge1xuICAgICAgICByZXR1cm4gcHJvcHMubW9kZWxzLm1hcChtb2RlbCA9PiB7XG4gICAgICAgICAgICByZXR1cm4ge3dhdGNoOiBtb2RlbCwga2V5OiBwcm9wcy5tb2RlbEtleXNUb1dhdGNofTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBbJ2ZvY3VzJywgJ2JsdXInLCAnY2xpY2snXSxcbik7XG4iXX0=