"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

require("core-js/modules/web.dom-collections.iterator");

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

var React = _interopRequireWildcard(require("react"));

var _modal = _interopRequireDefault(require("./modal"));

var _button = _interopRequireDefault(require("./button"));

var KeyCodes = window.__requirePrivateModuleFromAirtable('client_server_shared/key_codes');

var isReactNodeRenderable = node => {
  return node !== null && node !== undefined && node !== false;
};

var ConfirmationModal =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(ConfirmationModal, _React$Component);

  function ConfirmationModal() {
    var _this;

    (0, _classCallCheck2.default)(this, ConfirmationModal);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ConfirmationModal).call(this, ...args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_hasBeenAutoFocused", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_onCancel", () => {
      _this.props.onCancel();
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_onConfirm", () => {
      _this.props.onConfirm();
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_onKeyDown", e => {
      if (e.keyCode === KeyCodes.ESCAPE) {
        _this._onCancel();
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_confirmButtonRef", confirmButton => {
      if (!_this.props.isConfirmActionDangerous) {
        _this._autoFocusButtonOnce(confirmButton);
      }
    });
    return _this;
  }

  (0, _createClass2.default)(ConfirmationModal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      window.addEventListener('keydown', this._onKeyDown, false);
    }
  }, {
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      window.removeEventListener('keydown', this._onKeyDown, false);
    }
  }, {
    key: "_autoFocusButtonOnce",
    value: function _autoFocusButtonOnce(button) {
      if (button && !this._hasBeenAutoFocused) {
        button.focus();
        this._hasBeenAutoFocused = true;
      }
    } // usually, auto-focusing the button would be something we'd want to do in
    // componentDidMount. Unfortunately, because of the way UI.Modal works
    // (with unstable_renderSubtreeIntoContainer instead of createPortal),
    // componentDidMount gets called *before* the modal is actually rendered.
    // to get around this, we trigger auto focus in the button refs instead.

  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          title = _this$props.title,
          body = _this$props.body,
          cancelButtonText = _this$props.cancelButtonText,
          confirmButtonText = _this$props.confirmButtonText,
          isConfirmActionDangerous = _this$props.isConfirmActionDangerous,
          className = _this$props.className,
          style = _this$props.style;
      return React.createElement(_modal.default, {
        onClose: this._onCancel,
        className: (0, _classnames.default)('p2', className),
        style: (0, _objectSpread2.default)({
          width: 400
        }, style)
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
  }]);
  return ConfirmationModal;
}(React.Component);

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