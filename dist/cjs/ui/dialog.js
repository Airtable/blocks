"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.includes");

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

var _icon = _interopRequireDefault(require("./icon"));

var _modal = _interopRequireDefault(require("./modal"));

/**
 * A button that closes {@link Dialog}.
 *
 * @alias Dialog.CloseButton
 */
var DialogCloseButton =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(DialogCloseButton, _React$Component);

  function DialogCloseButton(props) {
    var _this;

    (0, _classCallCheck2.default)(this, DialogCloseButton);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(DialogCloseButton).call(this, props));
    _this._onKeyDown = _this._onKeyDown.bind((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(DialogCloseButton, [{
    key: "_onKeyDown",
    value: function _onKeyDown(e) {
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }

      if (['Enter', ' '].includes(e.key)) {
        e.preventDefault();
        this.context.onDialogClose();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          style = _this$props.style,
          tabIndex = _this$props.tabIndex,
          children = _this$props.children;
      var shouldUseDefaultStyling = !children;
      var defaultClassName = 'absolute top-0 right-0 mt1 mr1 flex items-center justify-center circle darken1-hover darken1-focus no-outline pointer';
      var defaultStyle = {
        width: 24,
        height: 24
      };
      return React.createElement("div", {
        onClick: this.context.onDialogClose,
        onKeyDown: this._onKeyDown,
        className: (0, _classnames.default)({
          [defaultClassName]: shouldUseDefaultStyling
        }, className),
        style: (0, _objectSpread2.default)({}, shouldUseDefaultStyling ? defaultStyle : {}, style),
        tabIndex: tabIndex || 0,
        role: "button",
        "aria-label": "Close dialog"
      }, children ? children : React.createElement(_icon.default, {
        name: "x",
        size: 12,
        className: "quieter"
      }));
    }
  }]);
  return DialogCloseButton;
}(React.Component);
/**
 * @typedef {object} DialogProps
 * @property {function} onClose Callback function to fire when the dialog is closed.
 * @property {string} [className] Extra `className`s to apply to the dialog element, separated by spaces.
 * @property {Object} [style] Extra styles to apply to the dialog element.
 * @property {string} [backgroundClassName] Extra `className`s to apply to the lightbox element, separated by spaces.
 * @property {Object} [backgroundStyle] Extra styles to apply to the lightbox element.
 */


(0, _defineProperty2.default)(DialogCloseButton, "propTypes", {
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  tabIndex: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  children: _propTypes.default.node
});
(0, _defineProperty2.default)(DialogCloseButton, "contextTypes", {
  onDialogClose: _propTypes.default.func
});

/**
 * A styled modal dialog component.
 *
 * @example
 * import {Button, Dialog} from '@airtable/blocks/ui';
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
 *                 <Dialog onClose={() => setIsDialogOpen(false)}>
 *                     <Fragment>
 *                         <Dialog.CloseButton />
 *                         <h1
 *                             style={{
 *                                 marginBottom: 8,
 *                                 fontSize: 20,
 *                                 fontWeight: 500,
 *                             }}
 *                         >
 *                             Dialog
 *                         </h1>
 *                         <p>This is the dialog content.</p>
 *                     </Fragment>
 *                 </Dialog>
 *             )}
 *         </Fragment>
 *     );
 * }
 */
// TODO (stephen): focus trapping
var Dialog =
/*#__PURE__*/
function (_React$Component2) {
  (0, _inherits2.default)(Dialog, _React$Component2);

  // automatically pass onClose to any descendants that are Dialog.CloseButton
  function Dialog(props) {
    var _this2;

    (0, _classCallCheck2.default)(this, Dialog);
    _this2 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Dialog).call(this, props));
    _this2._onKeyDown = _this2._onKeyDown.bind((0, _assertThisInitialized2.default)(_this2));
    return _this2;
  }

  (0, _createClass2.default)(Dialog, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        onDialogClose: this.props.onClose
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      window.addEventListener('keydown', this._onKeyDown, false);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('keydown', this._onKeyDown, false);
    }
  }, {
    key: "_onKeyDown",
    value: function _onKeyDown(e) {
      if (e.key === 'Escape') {
        this.props.onClose();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          onClose = _this$props2.onClose,
          className = _this$props2.className,
          style = _this$props2.style,
          backgroundClassName = _this$props2.backgroundClassName,
          backgroundStyle = _this$props2.backgroundStyle,
          children = _this$props2.children;
      return React.createElement(_modal.default, {
        onClose: onClose,
        className: (0, _classnames.default)('relative p2 big line-height-4', className),
        style: style,
        backgroundClassName: backgroundClassName,
        backgroundStyle: backgroundStyle
      }, children);
    }
  }]);
  return Dialog;
}(React.Component);

(0, _defineProperty2.default)(Dialog, "CloseButton", DialogCloseButton);
(0, _defineProperty2.default)(Dialog, "propTypes", {
  onClose: _propTypes.default.func.isRequired,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  backgroundClassName: _propTypes.default.string,
  backgroundStyle: _propTypes.default.object,
  children: _propTypes.default.node.isRequired
});
(0, _defineProperty2.default)(Dialog, "childContextTypes", {
  onDialogClose: _propTypes.default.func
});
var _default = Dialog;
exports.default = _default;