"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.function.name");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _valuesInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/values");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/typeof"));

var React = _interopRequireWildcard(require("react"));

var _watchable = _interopRequireDefault(require("../watchable"));

var _table = _interopRequireDefault(require("../models/table"));

var _view = _interopRequireDefault(require("../models/view"));

var _private_utils = require("../private_utils");

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    u = _window$__requirePriv.u; // These helper functions were taken from
// https://github.com/facebook/relay/blob/e918103/src/container/RelayContainerUtils.js


function isReactComponent(component) {
  return !!(component && (0, _typeof2.default)(component.prototype) === 'object' && component.prototype && component.prototype.isReactComponent);
}

function getReactComponent(Component) {
  if (isReactComponent(Component)) {
    // flow-disable-next-line
    return Component;
  } else {
    return null;
  }
}

function getComponentName(Component) {
  var ComponentClass = getReactComponent(Component);

  if (ComponentClass) {
    return ComponentClass.displayName || ComponentClass.name || 'ClassComponent';
  } else if (typeof Component === 'function') {
    // This is a stateless functional component.
    return Component.displayName || Component.name || 'StatelessComponent';
  } else {
    return 'ReactElement';
  }
} // Using 'watch' as a key is kind of strange from an internal perspective, but is
// actually a kind of nice declarative format for when you are consuming the sdk,
// so we'll tolerate the weirdness internally.


/**
 * Returns a HOC component that will watch and unwatch the specified watchable objects.
 *
 * Component can either be a stateful React component class, or a stateless functional
 * component.
 *
 * The getDependencies function will be invoked on componentDidMount, whenever props
 * shallowly change, and whenever one of the watches returned from the getDependencies
 * function is triggered.
 *
 * @example
 * import {UI} from 'airtable-block';
 * const MyComponentWithData = UI.createDataContainer(MyComponent, getDependencies(props) {
 *     // This should return an array of dependency objects:
 *     return [
 *         // Will call forceUpdate when table name changes.
 *         {watch: props.table, key: 'name'},
 *
 *         // Will call this._onFieldsChange when table fields change.
 *         {watch: props.table, key: 'fields', callback: MyComponent.prototype._onFieldsChange},
 *     ];
 * });
 */
//
// IMPORTANT: The passthruMethodNames arg should be reserved for internal blocks SDK use only.
// This is experimental and very subject to change.
function createDataContainer(Component, getDependencies, passthruMethodNames) {
  var ComponentClass = getReactComponent(Component);
  var componentName = getComponentName(Component);

  var DataContainer =
  /*#__PURE__*/
  function (_React$Component) {
    (0, _inherits2.default)(DataContainer, _React$Component);

    function DataContainer(props) {
      var _context;

      var _this;

      (0, _classCallCheck2.default)(this, DataContainer);
      _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(DataContainer).call(this, props)); // If the ref callback is defined as an inline function, it will get called twice during updates,
      // first with null and then again with the DOM element. This is because a new instance of
      // the function is created with each render, so React needs to clear the old ref and set up the new one.
      // We want to avoid setting _wrappedComponent to null during updates, since that will cause crashes
      // with custom callbacks, so instead of using an inline ref function, we use this pre-bound function.

      (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_wrappedComponent", null);
      (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_wrappedWatchConfigs", null);
      (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_shouldUpdateDependenciesOnComponentDidUpdate", false);
      _this._boundSetWrappedComponentRef = (0, _bind.default)(_context = _this._setWrappedComponentRef).call(_context, (0, _assertThisInitialized2.default)(_this));
      return _this;
    }

    (0, _createClass2.default)(DataContainer, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        // NOTE: make sure this is the first thing we do here, since all of the
        // functions that deal with watches check this flag.
        this._dataContainerIsMounted = true;

        this._watchAll();
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this._unwatchAll(); // NOTE: make sure this is the last thing we do here, since all of the
        // functions that deal with watches check this flag.
        // i.e. the _unwatchAll call above checks that the component is still
        // mounted.


        this._dataContainerIsMounted = false;
      }
    }, {
      key: "UNSAFE_componentWillReceiveProps",
      value: function UNSAFE_componentWillReceiveProps(newProps) {
        var shouldUpdateDependencies = !u.isObjectShallowEqual(this.props, newProps);

        if (shouldUpdateDependencies) {
          this._shouldUpdateDependenciesOnComponentDidUpdate = true;
        }
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        if (this._shouldUpdateDependenciesOnComponentDidUpdate) {
          this._recomputeDependencies();

          this._shouldUpdateDependenciesOnComponentDidUpdate = false;
        }
      }
    }, {
      key: "_setWrappedComponentRef",
      value: function _setWrappedComponentRef(el) {
        this._wrappedComponent = el;
      }
    }, {
      key: "_areWatchConfigsEqual",
      value: function _areWatchConfigsEqual(a, b) {
        return a.watchable === b.watchable && a.callback === b.callback && a.context === b.context && u.isEqual(a.key, b.key);
      }
    }, {
      key: "_wrapCallback",
      value: function _wrapCallback(context, unwrappedCallback) {
        var _this2 = this;

        return function () {
          var _context2;

          if (!_this2._dataContainerIsMounted) {
            return;
          } // Reevaluate our watches, since watches may change in response
          // to this event firing.


          _this2._recomputeDependencies();

          for (var _len = arguments.length, callbackArguments = new Array(_len), _key = 0; _key < _len; _key++) {
            callbackArguments[_key] = arguments[_key];
          }

          unwrappedCallback.call.apply(unwrappedCallback, (0, _concat.default)(_context2 = [context]).call(_context2, callbackArguments));
        };
      }
    }, {
      key: "_wrapWatchConfig",
      value: function _wrapWatchConfig(watchConfig) {
        return {
          watchConfig: watchConfig,
          wrappedCallback: this._wrapCallback(watchConfig.context, watchConfig.callback)
        };
      }
    }, {
      key: "_diffWatchConfigs",
      value: function _diffWatchConfigs(newWatchConfigs, oldWrappedWatchConfigs) {
        var _this3 = this;

        var wrappedWatchConfigsToAdd = [];
        var wrappedWatchConfigsToRemove = [];
        var resultingWrappedWatchConfigs = []; // NOTE: this assumes that the order of the watch configs does not change,
        // so it loops through and checks for equality at each index. This is
        // so that we do not have to check every watch config in newWatchConfigs
        // against every watch config in oldWatchConfigs, which would be O(n^2).
        // We may end up unwatching and rewatching some things if the order changes,
        // but that is a worthwhile tradeoff.
        // One unfortunate case is that if a watch switches from falsey to not falsey
        // (or vice versa), the order will change and we'll end up rewatching a bunch
        // of things that did not need to change.
        // TODO: fix the case where a watch switching from falsey <-> not falsey
        // messes up the consistent ordering assumption.

        var minLength = Math.min(newWatchConfigs.length, oldWrappedWatchConfigs.length);

        for (var i = 0; i < minLength; i++) {
          var newWatchConfig = newWatchConfigs[i];
          var oldWrappedWatchConfig = oldWrappedWatchConfigs[i];

          if (!this._areWatchConfigsEqual(oldWrappedWatchConfig.watchConfig, newWatchConfig)) {
            wrappedWatchConfigsToRemove.push(oldWrappedWatchConfig); // Since we're adding a brand new watch config, we need to wrap it.

            var newWrappedWatchConfig = this._wrapWatchConfig(newWatchConfig);

            wrappedWatchConfigsToAdd.push(newWrappedWatchConfig);
            resultingWrappedWatchConfigs.push(newWrappedWatchConfig);
          } else {
            // No need to wrap this watch config, since it's already wrapped. We're
            // just keeping it from the original wrapped watch configs.
            resultingWrappedWatchConfigs.push(oldWrappedWatchConfig);
          }
        } // Add the rest of the longer array (if applicable).


        if (newWatchConfigs.length > oldWrappedWatchConfigs.length) {
          var _context3;

          // Same as above. Since we're adding brand new watch configs, we need to
          // wrap them here.
          var newWrappedWatchConfigs = (0, _map.default)(_context3 = (0, _slice.default)(newWatchConfigs).call(newWatchConfigs, minLength)).call(_context3, function (watchConfig) {
            return _this3._wrapWatchConfig(watchConfig);
          });
          wrappedWatchConfigsToAdd.push.apply(wrappedWatchConfigsToAdd, (0, _toConsumableArray2.default)(newWrappedWatchConfigs)); // Also add any new configs that we're watching to the result array.

          resultingWrappedWatchConfigs.push.apply(resultingWrappedWatchConfigs, (0, _toConsumableArray2.default)(newWrappedWatchConfigs));
        } else if (oldWrappedWatchConfigs.length > newWatchConfigs.length) {
          wrappedWatchConfigsToRemove.push.apply(wrappedWatchConfigsToRemove, (0, _toConsumableArray2.default)((0, _slice.default)(oldWrappedWatchConfigs).call(oldWrappedWatchConfigs, minLength)));
        }

        return {
          wrappedWatchConfigsToAdd: wrappedWatchConfigsToAdd,
          wrappedWatchConfigsToRemove: wrappedWatchConfigsToRemove,
          resultingWrappedWatchConfigs: resultingWrappedWatchConfigs
        };
      }
    }, {
      key: "_recomputeDependencies",
      value: function _recomputeDependencies() {
        if (!this._dataContainerIsMounted) {
          return;
        }

        var newWatchConfigs = this._generateWatchConfigs();

        var oldWrappedWatchConfigs = this._wrappedWatchConfigs || [];

        var diffObj = this._diffWatchConfigs(newWatchConfigs, oldWrappedWatchConfigs);

        this._removeWatchesForWrappedWatchConfigs(diffObj.wrappedWatchConfigsToRemove);

        this._addWatchesForWrappedWatchConfigs(diffObj.wrappedWatchConfigsToAdd); // NOTE: Rather than just setting this to newWatchConfigs, we want to
        // use the resulting watch configs returned in the diffObj. This is because
        // new wrapped callbacks that were created in _generateWatchConfigs will
        // not be equal to the callbacks that we actually used to watch things.


        this._wrappedWatchConfigs = diffObj.resultingWrappedWatchConfigs;
      }
    }, {
      key: "_generateWatchConfigs",
      value: function _generateWatchConfigs() {
        var watchConfigs = [];
        var dependencies = getDependencies(this.props); // TODO(kasra): do runtime checks for the value of `dependencies`
        // to make sure it conforms with its flow type. If it doesn't,
        // show a helpful error message to the block developer.

        if (dependencies) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = (0, _getIterator2.default)(dependencies), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var dependency = _step.value;
              var watchable = dependency && dependency.watch;

              if (dependency && watchable) {
                var key = dependency.key;
                var callback = dependency.callback;
                var context = void 0;

                if (callback) {
                  context = this._wrappedComponent;
                } else {
                  callback = this._invokeForceUpdate;
                  context = this; // eslint-disable-line consistent-this
                }

                var watchConfig = {
                  watchable: watchable,
                  key: key,
                  callback: callback,
                  context: context
                };
                watchConfigs.push(watchConfig);
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }

        return watchConfigs;
      }
    }, {
      key: "_addWatchesForWrappedWatchConfigs",
      value: function _addWatchesForWrappedWatchConfigs(wrappedWatchConfigsToAdd) {
        var viewsToWatchById = {};
        var tablesToWatchById = {};
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = (0, _getIterator2.default)(wrappedWatchConfigsToAdd), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var wrappedWatchConfig = _step2.value;
            var watchConfig = wrappedWatchConfig.watchConfig,
                wrappedCallback = wrappedWatchConfig.wrappedCallback;
            var watchable = watchConfig.watchable,
                key = watchConfig.key,
                context = watchConfig.context; // See hack below for why we special case View and Table.

            if (watchable instanceof _view.default) {
              if (!viewsToWatchById[watchable.id]) {
                viewsToWatchById[watchable.id] = {
                  watchable: watchable,
                  wrappedWatchConfigs: []
                };
              }

              viewsToWatchById[watchable.id].wrappedWatchConfigs.push(wrappedWatchConfig);
            } else if (watchable instanceof _table.default) {
              if (!tablesToWatchById[watchable.id]) {
                tablesToWatchById[watchable.id] = {
                  watchable: watchable,
                  wrappedWatchConfigs: []
                };
              }

              tablesToWatchById[watchable.id].wrappedWatchConfigs.push(wrappedWatchConfig);
            } else {
              watchable.watch(key, wrappedCallback, context);
            }
          } // HACK: we want to fetch view data *before* fetching table data.
          // This minimizes the number of network requests: if the parent table
          // for a view isn't already loaded, liveapp will load the table with
          // that view's data in a single request.
          // TODO(kasra): improve this by moving this logic into liveapp so
          // it can batch multiple view and table loads.

        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = (0, _getIterator2.default)((0, _valuesInstanceProperty(_private_utils))(viewsToWatchById)), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var _step3$value = _step3.value,
                watchable = _step3$value.watchable,
                wrappedWatchConfigs = _step3$value.wrappedWatchConfigs;
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
              for (var _iterator5 = (0, _getIterator2.default)(wrappedWatchConfigs), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var _wrappedWatchConfig = _step5.value;
                var watchConfig = _wrappedWatchConfig.watchConfig,
                    wrappedCallback = _wrappedWatchConfig.wrappedCallback;
                var key = watchConfig.key; // eslint-disable-line flowtype/no-weak-types

                watchable.watch(key, wrappedCallback, watchConfig.context);
              }
            } catch (err) {
              _didIteratorError5 = true;
              _iteratorError5 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                  _iterator5.return();
                }
              } finally {
                if (_didIteratorError5) {
                  throw _iteratorError5;
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = (0, _getIterator2.default)((0, _valuesInstanceProperty(_private_utils))(tablesToWatchById)), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var _step4$value = _step4.value,
                watchable = _step4$value.watchable,
                wrappedWatchConfigs = _step4$value.wrappedWatchConfigs;
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
              for (var _iterator6 = (0, _getIterator2.default)(wrappedWatchConfigs), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var _wrappedWatchConfig2 = _step6.value;
                var watchConfig = _wrappedWatchConfig2.watchConfig,
                    wrappedCallback = _wrappedWatchConfig2.wrappedCallback;
                var _key2 = watchConfig.key; // eslint-disable-line flowtype/no-weak-types

                watchable.watch(_key2, wrappedCallback, watchConfig.context);
              }
            } catch (err) {
              _didIteratorError6 = true;
              _iteratorError6 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
                  _iterator6.return();
                }
              } finally {
                if (_didIteratorError6) {
                  throw _iteratorError6;
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      }
    }, {
      key: "_removeWatchesForWrappedWatchConfigs",
      value: function _removeWatchesForWrappedWatchConfigs(wrappedWatchConfigsToRemove) {
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = (0, _getIterator2.default)(wrappedWatchConfigsToRemove), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var _step7$value = _step7.value,
                watchConfig = _step7$value.watchConfig,
                wrappedCallback = _step7$value.wrappedCallback;
            var watchable = watchConfig.watchable,
                key = watchConfig.key,
                context = watchConfig.context;
            watchable.unwatch(key, wrappedCallback, context);
          }
        } catch (err) {
          _didIteratorError7 = true;
          _iteratorError7 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
              _iterator7.return();
            }
          } finally {
            if (_didIteratorError7) {
              throw _iteratorError7;
            }
          }
        }
      }
    }, {
      key: "_watchAll",
      value: function _watchAll() {
        var _this4 = this;

        if (!this._dataContainerIsMounted) {
          return;
        }

        var newWatchConfigs = this._generateWatchConfigs();

        var newWrappedWatchConfigs = (0, _map.default)(newWatchConfigs).call(newWatchConfigs, function (watchConfig) {
          return _this4._wrapWatchConfig(watchConfig);
        });

        this._addWatchesForWrappedWatchConfigs(newWrappedWatchConfigs);

        this._wrappedWatchConfigs = newWrappedWatchConfigs;
      }
    }, {
      key: "_unwatchAll",
      value: function _unwatchAll() {
        if (!this._dataContainerIsMounted) {
          return;
        }

        if (this._wrappedWatchConfigs) {
          this._removeWatchesForWrappedWatchConfigs(this._wrappedWatchConfigs);

          this._wrappedWatchConfigs = null;
        }
      }
    }, {
      key: "_invokeForceUpdate",
      value: function _invokeForceUpdate() {
        // Call forceUpdate without any args.
        // TODO(kasra): should this debounce, in case there are many events in one frame?
        this.forceUpdate();
      }
    }, {
      key: "render",
      value: function render() {
        if (ComponentClass) {
          return React.createElement(ComponentClass // This is incompatible with the flow definition for the React 16 createRef API.
          // flow-disable-next-line
          , (0, _extends2.default)({
            ref: this._boundSetWrappedComponentRef
          }, this.props));
        } else {
          // Stateless functional component.
          return React.createElement(Component, this.props);
        }
      }
    }]);
    return DataContainer;
  }(React.Component);

  (0, _defineProperty2.default)(DataContainer, "displayName", "DataContainer(".concat(componentName, ")"));

  if (passthruMethodNames) {
    // Let's augment the data container's prototype to have methods that pass through
    // to the wrapped component.
    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
      var _loop = function _loop() {
        var passthruMethodName = _step8.value;

        // flow-disable-next-line
        DataContainer.prototype[passthruMethodName] = function () {
          for (var _len2 = arguments.length, args = new Array(_len2), _key3 = 0; _key3 < _len2; _key3++) {
            args[_key3] = arguments[_key3];
          }

          this._wrappedComponent[passthruMethodName](args);
        };
      };

      for (var _iterator8 = (0, _getIterator2.default)(passthruMethodNames), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
        _loop();
      }
    } catch (err) {
      _didIteratorError8 = true;
      _iteratorError8 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
          _iterator8.return();
        }
      } finally {
        if (_didIteratorError8) {
          throw _iteratorError8;
        }
      }
    }
  } // for developer ease, we return the exact type of the wrapped component rather
  // than a new component. this is slightly incorrect - any methods not listed in
  // passthruMethodNames wont be available, although flow will think they exist.
  // flow-disable-next-line


  return DataContainer;
}

var _default = createDataContainer;
exports.default = _default;