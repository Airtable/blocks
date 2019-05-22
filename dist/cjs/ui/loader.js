"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

// TODO(kasra): don't depend on liveapp components.
const _Loader = window.__requirePrivateModuleFromAirtable('client_server_shared/react/ui/loader/loader');

// Override the default props and then just proxy through to our loader.

/** */
const Loader = ({
  fillColor = '#888',
  scale = 0.3
}) => {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9sb2FkZXIuanMiXSwibmFtZXMiOlsiX0xvYWRlciIsIndpbmRvdyIsIl9fcmVxdWlyZVByaXZhdGVNb2R1bGVGcm9tQWlydGFibGUiLCJMb2FkZXIiLCJmaWxsQ29sb3IiLCJzY2FsZSIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsInN0cmluZyIsIm51bWJlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7QUFDQTs7QUFFQTtBQUNBLE1BQU1BLE9BQU8sR0FBR0MsTUFBTSxDQUFDQyxrQ0FBUCxDQUNaLDZDQURZLENBQWhCOztBQU1BOztBQUNBO0FBQ0EsTUFBTUMsTUFBTSxHQUFHLENBQUM7QUFBQ0MsRUFBQUEsU0FBUyxHQUFHLE1BQWI7QUFBcUJDLEVBQUFBLEtBQUssR0FBRztBQUE3QixDQUFELEtBQXdEO0FBQ25FLFNBQU8sb0JBQUMsT0FBRDtBQUFTLElBQUEsU0FBUyxFQUFFRCxTQUFwQjtBQUErQixJQUFBLEtBQUssRUFBRUM7QUFBdEMsSUFBUDtBQUNILENBRkQ7O0FBSUFGLE1BQU0sQ0FBQ0csU0FBUCxHQUFtQjtBQUNmRixFQUFBQSxTQUFTLEVBQUVHLG1CQUFVQyxNQUROO0FBRWZILEVBQUFBLEtBQUssRUFBRUUsbUJBQVVFO0FBRkYsQ0FBbkI7ZUFLZU4sTSIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG4vLyBUT0RPKGthc3JhKTogZG9uJ3QgZGVwZW5kIG9uIGxpdmVhcHAgY29tcG9uZW50cy5cbmNvbnN0IF9Mb2FkZXIgPSB3aW5kb3cuX19yZXF1aXJlUHJpdmF0ZU1vZHVsZUZyb21BaXJ0YWJsZShcbiAgICAnY2xpZW50X3NlcnZlcl9zaGFyZWQvcmVhY3QvdWkvbG9hZGVyL2xvYWRlcicsXG4pO1xuXG50eXBlIExvYWRlclByb3BUeXBlcyA9IHtmaWxsQ29sb3I6IHN0cmluZywgc2NhbGU6IG51bWJlcn07XG5cbi8vIE92ZXJyaWRlIHRoZSBkZWZhdWx0IHByb3BzIGFuZCB0aGVuIGp1c3QgcHJveHkgdGhyb3VnaCB0byBvdXIgbG9hZGVyLlxuLyoqICovXG5jb25zdCBMb2FkZXIgPSAoe2ZpbGxDb2xvciA9ICcjODg4Jywgc2NhbGUgPSAwLjN9OiBMb2FkZXJQcm9wVHlwZXMpID0+IHtcbiAgICByZXR1cm4gPF9Mb2FkZXIgZmlsbENvbG9yPXtmaWxsQ29sb3J9IHNjYWxlPXtzY2FsZX0gLz47XG59O1xuXG5Mb2FkZXIucHJvcFR5cGVzID0ge1xuICAgIGZpbGxDb2xvcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBzY2FsZTogUHJvcFR5cGVzLm51bWJlcixcbn07XG5cbmV4cG9ydCBkZWZhdWx0IExvYWRlcjtcbiJdfQ==