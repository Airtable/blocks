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

var React = _interopRequireWildcard(require("react"));

var _dialog = _interopRequireDefault(require("./dialog"));

var _button = _interopRequireDefault(require("./button"));

/**
 * A styled modal dialog component that prompts the user to confirm or cancel an action.
 * By default, this component will focus the "Confirm" button on mount, so that pressing
 * the Enter key will confirm the action.
 *
 * @example
 * import {Button, Dialog, ConfirmationDialog} from '@airtable/blocks/ui';
 * import React, {Fragment, useState} from 'react';
 *
 * function Block() {
 *     const [isDialogOpen, setIsDialogOpen] = useState(false);
 *     return (
 *         <Fragment>
 *             <Button
 *                 theme={Button.themes.BLUE}
 *                 onClick={() => setIsDialogOpen(true)}
 *             >
 *                 Open dialog
 *             </Button>
 *             {isDialogOpen && (
 *                 <ConfirmationDialog
 *                     title="Are you sure?"
 *                     body="This action can't be undone."
 *                     onConfirm={() => {
 *                         alert('Confirmed.');
 *                         setIsDialogOpen(false);
 *                     }}
 *                     onCancel={() => setIsDialogOpen(false)}
 *                 />
 *             )}
 *         </Fragment>
 *     );
 * }
 */
var ConfirmationDialog =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(ConfirmationDialog, _React$Component);

  function ConfirmationDialog(props) {
    var _this;

    (0, _classCallCheck2.default)(this, ConfirmationDialog);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ConfirmationDialog).call(this, props));
    _this._onConfirm = _this._onConfirm.bind((0, _assertThisInitialized2.default)(_this));
    _this._onCancel = _this._onCancel.bind((0, _assertThisInitialized2.default)(_this));
    _this._confirmButtonRef = null;
    return _this;
  }

  (0, _createClass2.default)(ConfirmationDialog, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this._confirmButtonRef !== null) {
        this._confirmButtonRef.focus();
      }
    }
  }, {
    key: "_onCancel",
    value: function _onCancel() {
      this.props.onCancel();
    }
  }, {
    key: "_onConfirm",
    value: function _onConfirm() {
      this.props.onConfirm();
    }
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
      return React.createElement(_dialog.default, {
        onClose: this._onCancel,
        className: className,
        style: (0, _objectSpread2.default)({
          width: 400
        }, style)
      }, React.createElement("h1", {
        className: "mb1 strong",
        style: {
          fontSize: 20
        }
      }, title), body, React.createElement("div", {
        className: "width-full flex flex-reverse items-center justify-start mt2"
      }, React.createElement(_button.default, {
        ref: element => this._confirmButtonRef = element,
        onClick: this._onConfirm,
        theme: isConfirmActionDangerous ? _button.default.themes.RED : _button.default.themes.BLUE
      }, confirmButtonText), React.createElement(_button.default, {
        onClick: this._onCancel,
        theme: _button.default.themes.TRANSPARENT,
        className: "self-end mr1 border-transparent quiet link-unquiet-focusable text-blue-focus"
      }, cancelButtonText)));
    }
  }]);
  return ConfirmationDialog;
}(React.Component);

(0, _defineProperty2.default)(ConfirmationDialog, "propTypes", {
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
(0, _defineProperty2.default)(ConfirmationDialog, "defaultProps", {
  cancelButtonText: 'Cancel',
  confirmButtonText: 'Okay',
  isConfirmActionDangerous: false
});
var _default = ConfirmationDialog;
exports.default = _default;