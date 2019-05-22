"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var React = _interopRequireWildcard(require("react"));

var _modal = _interopRequireDefault(require("./modal"));

var _button = _interopRequireDefault(require("./button"));

const KeyCodes = window.__requirePrivateModuleFromAirtable('client_server_shared/key_codes');

const isReactNodeRenderable = node => {
  return node !== null && node !== undefined && node !== false;
};

class ConfirmationModal extends React.Component {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "_hasBeenAutoFocused", false);
    (0, _defineProperty2.default)(this, "_onCancel", () => {
      this.props.onCancel();
    });
    (0, _defineProperty2.default)(this, "_onConfirm", () => {
      this.props.onConfirm();
    });
    (0, _defineProperty2.default)(this, "_onKeyDown", e => {
      if (e.keyCode === KeyCodes.ESCAPE) {
        this._onCancel();
      }
    });
    (0, _defineProperty2.default)(this, "_confirmButtonRef", confirmButton => {
      if (!this.props.isConfirmActionDangerous) {
        this._autoFocusButtonOnce(confirmButton);
      }
    });
  }

  componentDidMount() {
    window.addEventListener('keydown', this._onKeyDown, false);
  }

  UNSAFE_componentWillMount() {
    window.removeEventListener('keydown', this._onKeyDown, false);
  }

  _autoFocusButtonOnce(button) {
    if (button && !this._hasBeenAutoFocused) {
      button.focus();
      this._hasBeenAutoFocused = true;
    }
  } // usually, auto-focusing the button would be something we'd want to do in
  // componentDidMount. Unfortunately, because of the way UI.Modal works
  // (with unstable_renderSubtreeIntoContainer instead of createPortal),
  // componentDidMount gets called *before* the modal is actually rendered.
  // to get around this, we trigger auto focus in the button refs instead.


  render() {
    const {
      title,
      body,
      cancelButtonText,
      confirmButtonText,
      isConfirmActionDangerous,
      className,
      style
    } = this.props;
    return React.createElement(_modal.default, {
      onClose: this._onCancel,
      className: (0, _classnames.default)('p2', className),
      style: {
        width: 400,
        ...style
      }
    }, React.createElement("div", {
      className: "mb1 strong big line-height-4"
    }, title), isReactNodeRenderable(body) && React.createElement("div", {
      className: "mb2"
    }, body), React.createElement("div", {
      className: "flex items-center justify-end"
    }, React.createElement(_button.default, {
      onClick: this._onCancel,
      theme: _button.default.themes.TRANSPARENT,
      className: "mr1 border-transparent text-blue-focus"
    }, cancelButtonText), React.createElement(_button.default, {
      ref: this._confirmButtonRef,
      onClick: this._onConfirm,
      theme: isConfirmActionDangerous ? _button.default.themes.RED : _button.default.themes.BLUE
    }, confirmButtonText)));
  }

}

(0, _defineProperty2.default)(ConfirmationModal, "propTypes", {
  title: _propTypes.default.string.isRequired,
  body: _propTypes.default.node,
  cancelButtonText: _propTypes.default.string,
  confirmButtonText: _propTypes.default.string,
  isConfirmActionDangerous: _propTypes.default.bool,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  onCancel: _propTypes.default.func.isRequired,
  onConfirm: _propTypes.default.func.isRequired
});
(0, _defineProperty2.default)(ConfirmationModal, "defaultProps", {
  cancelButtonText: 'Cancel',
  confirmButtonText: 'Okay',
  isConfirmActionDangerous: false
});
var _default = ConfirmationModal;
exports.default = _default;