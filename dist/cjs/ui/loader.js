"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

// TODO(kasra): don't depend on liveapp components.
var _Loader = window.__requirePrivateModuleFromAirtable('client_server_shared/react/ui/loader/loader');

// Override the default props and then just proxy through to our loader.

/**
 * A loading spinner component.
 *
 * @param {object} [props] The props for the component.
 * @param {string} [props.fillColor='#888'] Fill color for the loading spinner. Gray by default.
 * @param {number} [props.scale=0.3] A scalar for the loader. Increasing the scale increases the size of the loader.
 * @returns A React node.
 * @example
 * import {UI} from '@airtable/blocks';
 *
 * function MyDataComponent() {
 *     if (myDataHasLoaded) {
 *         return <div>Here's your data!</div>;
 *     } else {
 *         return <UI.Loader />
 *     }
 * }
 */
var Loader = (_ref) => {
  var _ref$fillColor = _ref.fillColor,
      fillColor = _ref$fillColor === void 0 ? '#888' : _ref$fillColor,
      _ref$scale = _ref.scale,
      scale = _ref$scale === void 0 ? 0.3 : _ref$scale;
  return React.createElement(_Loader, {
    fillColor: fillColor,
    scale: scale
  });
};

Loader.propTypes = {
  fillColor: _propTypes.default.string,
  scale: _propTypes.default.number
};
var _default = Loader;
exports.default = _default;