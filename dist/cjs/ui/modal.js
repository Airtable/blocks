"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/objectSpread"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _icon = _interopRequireDefault(require("./icon"));

var ModalCloseButton =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(ModalCloseButton, _React$Component);

  function ModalCloseButton() {
    (0, _classCallCheck2.default)(this, ModalCloseButton);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ModalCloseButton).apply(this, arguments));
  }

  (0, _createClass2.default)(ModalCloseButton, [{
    key: "render",
    value: function render() {
      return React.createElement("a", {
        onClick: this.context.onModalClose,
        className: this.props.className || 'pointer link-quiet',
        style: this.props.style,
        tabIndex: -1
      }, this.props.children !== null && this.props.children !== undefined ? this.props.children : React.createElement(_icon.default, {
        name: "x",
        size: 12
      }));
    }
  }]);
  return ModalCloseButton;
}(React.Component);

(0, _defineProperty2.default)(ModalCloseButton, "propTypes", {
  className: _propTypes.default.string,
  style: _propTypes.default.object
});
(0, _defineProperty2.default)(ModalCloseButton, "contextTypes", {
  onModalClose: _propTypes.default.func
});

/** */
var Modal =
/*#__PURE__*/
function (_React$Component2) {
  (0, _inherits2.default)(Modal, _React$Component2);

  // automatically pass onClose to any descendants that are Modal.CloseButton
  function Modal(props) {
    var _context, _context2;

    var _this;

    (0, _classCallCheck2.default)(this, Modal);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Modal).call(this, props));
    _this._background = null;
    _this._container = null;
    _this._mouseDownOutsideModal = false;
    _this._onMouseDown = (0, _bind.default)(_context = _this._onMouseDown).call(_context, (0, _assertThisInitialized2.default)(_this));
    _this._onMouseUp = (0, _bind.default)(_context2 = _this._onMouseUp).call(_context2, (0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(Modal, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        onModalClose: this.props.onClose
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this._container = document.createElement('div');
      var container = this._container;
      container.setAttribute('tabIndex', '0');
      container.style.zIndex = '99999'; // If we don't set `position: fixed`, the outline and box-shadow
      // of elements that are in theory underneath this element will cover
      // up the modal.

      container.style.position = 'fixed';
      (0, _invariant.default)(document.body, 'no document body');
      document.body.appendChild(container);

      this._refreshContainer(); // If the frame is focused, move focus to the modal's container.
      // Next time the user presses tab, it will focus the first focusable element in the modal.
      // We only do this if the document is focused to avoid the frame becoming
      // programmatically focused if a modal is displayed without user interaction.


      if (document.hasFocus()) {
        container.focus();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this._refreshContainer();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var container = this._container;
      (0, _invariant.default)(container, 'No modal container');

      _reactDom.default.unmountComponentAtNode(container);

      container.remove();
    }
  }, {
    key: "_refreshContainer",
    value: function _refreshContainer() {
      var _this2 = this;

      var backgroundClassName = (0, _classnames.default)('fixed all-0 darken3 flex items-center justify-center', this.props.backgroundClassName);
      var backgroundStyle = this.props.backgroundStyle;
      var contentClassName = (0, _classnames.default)('white rounded-big overflow-auto light-scrollbar width-full stroked1 animate-bounce-in', this.props.className);
      var contentStyle = (0, _objectSpread2.default)({
        maxWidth: '95vw',
        maxHeight: '95vh'
      }, this.props.style); // TODO(jb): we'll need to change this to support all versions of ReactDOM.
      // Probably shouldn't be using unstable methods like this when we release the
      // editor.

      _reactDom.default.unstable_renderSubtreeIntoContainer(this, React.createElement("div", {
        ref: function ref(el) {
          return _this2._background = el;
        },
        className: backgroundClassName,
        style: backgroundStyle,
        onMouseDown: this._onMouseDown,
        onMouseUp: this._onMouseUp
      }, React.createElement("div", {
        className: contentClassName,
        style: contentStyle
      }, this.props.children)), this._container);
    }
  }, {
    key: "_onMouseDown",
    value: function _onMouseDown(e) {
      if (this._shouldClickingOnElementCloseModal(e.target)) {
        this._mouseDownOutsideModal = true;
      }
    }
  }, {
    key: "_onMouseUp",
    value: function _onMouseUp(e) {
      if (this._mouseDownOutsideModal && this.props.onClose && this._shouldClickingOnElementCloseModal(e.target)) {
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
      return null;
    }
  }]);
  return Modal;
}(React.Component);

(0, _defineProperty2.default)(Modal, "CloseButton", ModalCloseButton);
(0, _defineProperty2.default)(Modal, "propTypes", {
  onClose: _propTypes.default.func,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  backgroundClassName: _propTypes.default.string,
  backgroundStyle: _propTypes.default.object
});
(0, _defineProperty2.default)(Modal, "childContextTypes", {
  onModalClose: _propTypes.default.func
});
var _default = Modal;
exports.default = _default;