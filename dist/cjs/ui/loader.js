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
/**
 * @typedef {object} LoaderProps
 * @property {string} [fillColor='#888'] The color of the loading spinner.
 * @property {number} [scale=0.3] A scalar for the loader. Increasing the scale increases the size of the loader.
 */


// Override the default props and then just proxy through to our loader.

/**
 * A loading spinner component.
 *
 * @augments React.StatelessFunctionalComponent
 * @param {LoaderProps} props
 *
 * @example
 * import {Loader} from '@airtable/blocks/ui';
 *
 * function MyDataComponent() {
 *     if (myDataHasLoaded) {
 *         return <div>Here's your data!</div>;
 *     } else {
 *         return <Loader />
 *     }
 * }
 */
var Loader = props => {
  var fillColor = props.fillColor,
      scale = props.scale;
  return React.createElement(_Loader, {
    fillColor: fillColor,
    scale: scale
  });
};

Loader.propTypes = {
  fillColor: _propTypes.default.string.isRequired,
  scale: _propTypes.default.number.isRequired
};
Loader.defaultProps = {
  fillColor: '#888',
  scale: 0.3
};
var _default = Loader;
exports.default = _default;