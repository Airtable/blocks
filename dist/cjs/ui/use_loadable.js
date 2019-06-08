"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.to-string");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useLoadable;

var _react = require("react");

var _use_subscription = _interopRequireDefault(require("./use_subscription"));

var noop = () => {};

var noopSubscription = {
  getCurrentValue: () => null,
  subscribe: () => () => {}
};
var SUSPENSE_CLEAN_UP_MS = 60000;

function useLoadable(model) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$shouldSuspend = _ref.shouldSuspend,
      shouldSuspend = _ref$shouldSuspend === void 0 ? true : _ref$shouldSuspend;

  var modelConst = model;

  if (modelConst !== null && typeof modelConst.loadDataAsync !== 'function') {
    throw new Error("useLoadable called with ".concat(typeof modelConst === 'object' ? modelConst.toString() : typeof modelConst, ", which is not a loadable"));
  }

  if (shouldSuspend && modelConst && !modelConst.isDataLoaded) {
    // if data isn't loaded and we're in suspense mode, we need to start the data loading and
    // throw the load promise. when we throw though, the render tree gets thrown away and none
    // of out hooks will be retained - so we can't attach this QueryResult to a component
    // lifecycle and use that to unload it. Instead, we load it and keep it loaded for a long
    // enough time that it can resolve and then be rendered successfully. After the timeout has
    // passed, we unload it, allowing the data to be released as long as it's not used anywhere
    // else in the block.
    setTimeout(() => {
      modelConst.unloadData();
    }, SUSPENSE_CLEAN_UP_MS);
    throw modelConst.loadDataAsync();
  } // re-render when loaded state changes. technically, we could use `useWatchable` here, but as
  // our LoadableModel isn't a Watchable, we can't. There's no way to preserve flow errors when
  // watching something that doesn't have a 'isDataLoaded' watch key and use `Watchable`.


  var modelIsLoadedSubscription = (0, _react.useMemo)(() => modelConst ? {
    getCurrentValue: () => modelConst.isDataLoaded,
    subscribe: cb => {
      var onChange = function onChange() {
        cb();
      };

      modelConst.watch('isDataLoaded', onChange);
      return () => {
        modelConst.unwatch('isDataLoaded', onChange);
      };
    }
  } : noopSubscription, [modelConst]);
  (0, _use_subscription.default)(modelIsLoadedSubscription); // the main part of this hook comes down to managing the query result data loading in sync with
  // the component lifecycle. That means loading the data when the component mounts, and
  // unloading it when the component unmounts.

  (0, _react.useEffect)(() => {
    if (modelConst) {
      modelConst.loadDataAsync();
      return () => {
        modelConst.unloadData();
      };
    } else {
      return noop;
    }
  }, [modelConst]);
}