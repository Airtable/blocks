"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _block_wrapper = _interopRequireDefault(require("./block_wrapper"));

var hasBeenInitialized = false;

function initializeBlock(getEntryElement) {
  var body = typeof document !== 'undefined' ? document.body : null;

  if (!body) {
    throw new Error('initializeBlock should only be called from browser environments');
  }

  if (hasBeenInitialized) {
    throw new Error('initializeBlock should only be called once');
  }

  hasBeenInitialized = true;

  if (typeof getEntryElement !== 'function') {
    throw new Error('The first argument to initializeBlock should be a function returning a React element');
  }

  var entryElement = getEntryElement();

  if (!React.isValidElement(entryElement)) {
    throw new Error("The first argument to initializeBlock didn't return a valid React element");
  }

  (0, _get_sdk.default)().__setBatchedUpdatesFn(_reactDom.default.unstable_batchedUpdates);

  var container = document.createElement('div');
  body.appendChild(container);

  _reactDom.default.render(React.createElement(_block_wrapper.default, null, entryElement), container);
}

var _default = initializeBlock;
exports.default = _default;