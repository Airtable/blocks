"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

/**
 * Generic modal component with minimal styling.
 *
 * @private
 */
var Modal =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(Modal, _React$Component);

  function Modal(props) {
    var _this;

    (0, _classCallCheck2.default)(this, Modal);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Modal).call(this, props));
    _this._background = null;
    _this._container = document.createElement('div');
    _this._originalActiveElement = null;
    _this._mouseDownOutsideModal = false;
    _this._onMouseDown = _this._onMouseDown.bind((0, _assertThisInitialized2.default)(_this));
    _this._onMouseUp = _this._onMouseUp.bind((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(Modal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var container = this._container;
      container.setAttribute('tabIndex', '0');
      container.style.zIndex = '99999'; // If we don't set `position: fixed`, the outline and box-shadow
      // of elements that are in theory underneath this element will cover
      // up the modal.

      container.style.position = 'fixed';
      (0, _invariant.default)(document.body, 'no document body');
      document.body.appendChild(container); // If the frame is focused, move focus to the modal's container.
      // Next time the user presses tab, it will focus the first focusable element in the modal.
      // We only do this if the document is focused to avoid the frame becoming
      // programmatically focused if a modal is displayed without user interaction.

      if (document.hasFocus()) {
        this._originalActiveElement = document.activeElement;
        container.focus();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      (0, _invariant.default)(document.body, 'no document body');
      document.body.removeChild(this._container);

      if (this._originalActiveElement !== null) {
        this._originalActiveElement.focus();
      }
    }
  }, {
    key: "_onMouseDown",
    value: function _onMouseDown(event) {
      if (this._shouldClickingOnElementCloseModal(event.target)) {
        this._mouseDownOutsideModal = true;
      }
    }
  }, {
    key: "_onMouseUp",
    value: function _onMouseUp(event) {
      if (this._mouseDownOutsideModal && this.props.onClose && this._shouldClickingOnElementCloseModal(event.target)) {
        this.props.onClose();
      }

      this._mouseDownOutsideModal = false;
    }
  }, {
    key: "_shouldClickingOnElementCloseModal",
    value: function _shouldClickingOnElementCloseModal(element) {
      return element === this._background;
    }
  }, {
    key: "render",
    value: function render() {
      var backgroundClassName = (0, _classnames.default)('fixed all-0 darken3 flex items-center justify-center', this.props.backgroundClassName);
      var backgroundStyle = this.props.backgroundStyle;
      var contentClassName = (0, _classnames.default)('width-full m2 overflow-auto light-scrollbar white stroked1 rounded-big animate-bounce-in', this.props.className);
      var contentStyle = (0, _objectSpread2.default)({
        maxWidth: '100vw',
        maxHeight: '100vh'
      }, this.props.style);
      return _reactDom.default.createPortal(React.createElement("div", {
        ref: element => this._background = element,
        className: backgroundClassName,
        style: backgroundStyle,
        onMouseDown: this._onMouseDown,
        onMouseUp: this._onMouseUp
      }, React.createElement("div", {
        className: contentClassName,
        style: contentStyle
      }, this.props.children)), this._container);
    }
  }]);
  return Modal;
}(React.Component);

(0, _defineProperty2.default)(Modal, "propTypes", {
  onClose: _propTypes.default.func,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  backgroundClassName: _propTypes.default.string,
  backgroundStyle: _propTypes.default.object
});
var _default = Modal;
exports.default = _default;