"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useWatchable;

var _react = require("react");

var _private_utils = require("../private_utils");

var _use_subscription = _interopRequireDefault(require("./use_subscription"));

var noopSubscription = {
  getCurrentValue: () => null,
  subscribe: () => () => {}
};

function useWatchable(model, keys, callback) {
  var compactKeys = (0, _private_utils.compact)(keys); // use a ref to the callback so consumers don't have to provide their own memoization to avoid
  // unwatching and rewatching every render

  var callbackRef = (0, _react.useRef)(callback);
  callbackRef.current = callback; // we use a subscription to model.__getWatchableKey() to track changes. This is because
  // __getWatchableKey will return a value that is:
  //   1. identical by === if nothing watchable in the model has changed. That means we won't
  //      trigger unnecessary re-renders if nothing has changed. Without this, every initial
  //      mount will be double-rendered as useSubscription will think the model changed in the
  //      async gap
  //   2. will be !== if anything watchable in the model has changed. Without this, we might not
  //      re-render when information that we care about has changed.
  //   3. is unique to that model. This means that if we change models, we're guaranteed to get
  //      re-rendered.

  var watchSubscription = (0, _react.useMemo)(() => {
    // flow treats arguments as `let` bindings, so we need to make this `const` to not have to
    // worry about null values
    var constModel = model;

    if (!constModel) {
      return noopSubscription;
    }

    return {
      getCurrentValue: () => constModel.__getWatchableKey(),
      subscribe: notifyChange => {
        var onChange = function onChange() {
          notifyChange();

          if (callbackRef.current) {
            callbackRef.current(...arguments);
          }
        };

        constModel.watch(compactKeys, onChange);
        return () => {
          constModel.unwatch(compactKeys, onChange);
        };
      }
    }; // we spread keysArray below rather than using it as a direct dependency as we're likely to
    // get different array instances containing the same keys across renders, and don't want to
    // have to unwatch and watch after each render. that means that the lint rule can't track
    // that we're using compactKeys though.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, ...compactKeys]); // we don't care about the return value - we just want useSubscription to correctly handle
  // re-rendering the component for us

  (0, _use_subscription.default)(watchSubscription);
}