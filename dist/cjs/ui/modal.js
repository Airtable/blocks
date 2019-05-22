"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _icon = _interopRequireDefault(require("./icon"));

class ModalCloseButton extends React.Component {
  render() {
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

}

(0, _defineProperty2.default)(ModalCloseButton, "propTypes", {
  className: _propTypes.default.string,
  style: _propTypes.default.object
});
(0, _defineProperty2.default)(ModalCloseButton, "contextTypes", {
  onModalClose: _propTypes.default.func
});

/** */
class Modal extends React.Component {
  // automatically pass onClose to any descendants that are Modal.CloseButton
  constructor(props) {
    var _context, _context2;

    super(props);
    this._background = null;
    this._container = null;
    this._mouseDownOutsideModal = false;
    this._onMouseDown = (0, _bind.default)(_context = this._onMouseDown).call(_context, this);
    this._onMouseUp = (0, _bind.default)(_context2 = this._onMouseUp).call(_context2, this);
  }

  getChildContext() {
    return {
      onModalClose: this.props.onClose
    };
  }

  componentDidMount() {
    this._container = document.createElement('div');
    const container = this._container;
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

  componentDidUpdate() {
    this._refreshContainer();
  }

  componentWillUnmount() {
    const container = this._container;
    (0, _invariant.default)(container, 'No modal container');

    _reactDom.default.unmountComponentAtNode(container);

    container.remove();
  }

  _refreshContainer() {
    const backgroundClassName = (0, _classnames.default)('fixed all-0 darken3 flex items-center justify-center', this.props.backgroundClassName);
    const backgroundStyle = this.props.backgroundStyle;
    const contentClassName = (0, _classnames.default)('white rounded-big overflow-auto light-scrollbar width-full stroked1 animate-bounce-in', this.props.className);
    const contentStyle = {
      maxWidth: '95vw',
      maxHeight: '95vh',
      ...this.props.style
    }; // TODO(jb): we'll need to change this to support all versions of ReactDOM.
    // Probably shouldn't be using unstable methods like this when we release the
    // editor.

    _reactDom.default.unstable_renderSubtreeIntoContainer(this, React.createElement("div", {
      ref: el => this._background = el,
      className: backgroundClassName,
      style: backgroundStyle,
      onMouseDown: this._onMouseDown,
      onMouseUp: this._onMouseUp
    }, React.createElement("div", {
      className: contentClassName,
      style: contentStyle
    }, this.props.children)), this._container);
  }

  _onMouseDown(e) {
    if (this._shouldClickingOnElementCloseModal(e.target)) {
      this._mouseDownOutsideModal = true;
    }
  }

  _onMouseUp(e) {
    if (this._mouseDownOutsideModal && this.props.onClose && this._shouldClickingOnElementCloseModal(e.target)) {
      this.props.onClose();
    }

    this._mouseDownOutsideModal = false;
  }

  _shouldClickingOnElementCloseModal(element) {
    return element === this._background;
  }

  render() {
    return null;
  }

}

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