"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var React = _interopRequireWildcard(require("react"));

var _watchable = _interopRequireDefault(require("../watchable"));

var _table = _interopRequireDefault(require("../models/table"));

var _view = _interopRequireDefault(require("../models/view"));

const {
  u
} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'); // These helper functions were taken from
// https://github.com/facebook/relay/blob/e918103/src/container/RelayContainerUtils.js


function isReactComponent(component) {
  return !!(component && typeof component.prototype === 'object' && component.prototype && component.prototype.isReactComponent);
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
  const ComponentClass = getReactComponent(Component);

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
  const ComponentClass = getReactComponent(Component);
  const componentName = getComponentName(Component);

  class DataContainer extends React.Component {
    constructor(props) {
      var _context;

      super(props); // If the ref callback is defined as an inline function, it will get called twice during updates,
      // first with null and then again with the DOM element. This is because a new instance of
      // the function is created with each render, so React needs to clear the old ref and set up the new one.
      // We want to avoid setting _wrappedComponent to null during updates, since that will cause crashes
      // with custom callbacks, so instead of using an inline ref function, we use this pre-bound function.

      (0, _defineProperty2.default)(this, "_wrappedComponent", null);
      (0, _defineProperty2.default)(this, "_wrappedWatchConfigs", null);
      (0, _defineProperty2.default)(this, "_shouldUpdateDependenciesOnComponentDidUpdate", false);
      this._boundSetWrappedComponentRef = (0, _bind.default)(_context = this._setWrappedComponentRef).call(_context, this);
    }

    componentDidMount() {
      // NOTE: make sure this is the first thing we do here, since all of the
      // functions that deal with watches check this flag.
      this._dataContainerIsMounted = true;

      this._watchAll();
    }

    componentWillUnmount() {
      this._unwatchAll(); // NOTE: make sure this is the last thing we do here, since all of the
      // functions that deal with watches check this flag.
      // i.e. the _unwatchAll call above checks that the component is still
      // mounted.


      this._dataContainerIsMounted = false;
    }

    UNSAFE_componentWillReceiveProps(newProps) {
      const shouldUpdateDependencies = !u.isObjectShallowEqual(this.props, newProps);

      if (shouldUpdateDependencies) {
        this._shouldUpdateDependenciesOnComponentDidUpdate = true;
      }
    }

    componentDidUpdate() {
      if (this._shouldUpdateDependenciesOnComponentDidUpdate) {
        this._recomputeDependencies();

        this._shouldUpdateDependenciesOnComponentDidUpdate = false;
      }
    }

    _setWrappedComponentRef(el) {
      this._wrappedComponent = el;
    }

    _areWatchConfigsEqual(a, b) {
      return a.watchable === b.watchable && a.callback === b.callback && a.context === b.context && u.isEqual(a.key, b.key);
    }

    _wrapCallback(context, unwrappedCallback) {
      return (...callbackArguments) => {
        if (!this._dataContainerIsMounted) {
          return;
        } // Reevaluate our watches, since watches may change in response
        // to this event firing.


        this._recomputeDependencies();

        unwrappedCallback.call(context, ...callbackArguments);
      };
    }

    _wrapWatchConfig(watchConfig) {
      return {
        watchConfig,
        wrappedCallback: this._wrapCallback(watchConfig.context, watchConfig.callback)
      };
    }

    _diffWatchConfigs(newWatchConfigs, oldWrappedWatchConfigs) {
      const wrappedWatchConfigsToAdd = [];
      const wrappedWatchConfigsToRemove = [];
      const resultingWrappedWatchConfigs = []; // NOTE: this assumes that the order of the watch configs does not change,
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

      const minLength = Math.min(newWatchConfigs.length, oldWrappedWatchConfigs.length);

      for (let i = 0; i < minLength; i++) {
        const newWatchConfig = newWatchConfigs[i];
        const oldWrappedWatchConfig = oldWrappedWatchConfigs[i];

        if (!this._areWatchConfigsEqual(oldWrappedWatchConfig.watchConfig, newWatchConfig)) {
          wrappedWatchConfigsToRemove.push(oldWrappedWatchConfig); // Since we're adding a brand new watch config, we need to wrap it.

          const newWrappedWatchConfig = this._wrapWatchConfig(newWatchConfig);

          wrappedWatchConfigsToAdd.push(newWrappedWatchConfig);
          resultingWrappedWatchConfigs.push(newWrappedWatchConfig);
        } else {
          // No need to wrap this watch config, since it's already wrapped. We're
          // just keeping it from the original wrapped watch configs.
          resultingWrappedWatchConfigs.push(oldWrappedWatchConfig);
        }
      } // Add the rest of the longer array (if applicable).


      if (newWatchConfigs.length > oldWrappedWatchConfigs.length) {
        var _context2;

        // Same as above. Since we're adding brand new watch configs, we need to
        // wrap them here.
        const newWrappedWatchConfigs = (0, _map.default)(_context2 = (0, _slice.default)(newWatchConfigs).call(newWatchConfigs, minLength)).call(_context2, watchConfig => {
          return this._wrapWatchConfig(watchConfig);
        });
        wrappedWatchConfigsToAdd.push(...newWrappedWatchConfigs); // Also add any new configs that we're watching to the result array.

        resultingWrappedWatchConfigs.push(...newWrappedWatchConfigs);
      } else if (oldWrappedWatchConfigs.length > newWatchConfigs.length) {
        wrappedWatchConfigsToRemove.push(...(0, _slice.default)(oldWrappedWatchConfigs).call(oldWrappedWatchConfigs, minLength));
      }

      return {
        wrappedWatchConfigsToAdd,
        wrappedWatchConfigsToRemove,
        resultingWrappedWatchConfigs
      };
    }

    _recomputeDependencies() {
      if (!this._dataContainerIsMounted) {
        return;
      }

      const newWatchConfigs = this._generateWatchConfigs();

      const oldWrappedWatchConfigs = this._wrappedWatchConfigs || [];

      const diffObj = this._diffWatchConfigs(newWatchConfigs, oldWrappedWatchConfigs);

      this._removeWatchesForWrappedWatchConfigs(diffObj.wrappedWatchConfigsToRemove);

      this._addWatchesForWrappedWatchConfigs(diffObj.wrappedWatchConfigsToAdd); // NOTE: Rather than just setting this to newWatchConfigs, we want to
      // use the resulting watch configs returned in the diffObj. This is because
      // new wrapped callbacks that were created in _generateWatchConfigs will
      // not be equal to the callbacks that we actually used to watch things.


      this._wrappedWatchConfigs = diffObj.resultingWrappedWatchConfigs;
    }

    _generateWatchConfigs() {
      const watchConfigs = [];
      const dependencies = getDependencies(this.props); // TODO(kasra): do runtime checks for the value of `dependencies`
      // to make sure it conforms with its flow type. If it doesn't,
      // show a helpful error message to the block developer.

      if (dependencies) {
        for (const dependency of dependencies) {
          const watchable = dependency && dependency.watch;

          if (dependency && watchable) {
            const {
              key
            } = dependency;
            let callback = dependency.callback;
            let context;

            if (callback) {
              context = this._wrappedComponent;
            } else {
              callback = this._invokeForceUpdate;
              context = this; // eslint-disable-line consistent-this
            }

            const watchConfig = {
              watchable,
              key,
              callback,
              context
            };
            watchConfigs.push(watchConfig);
          }
        }
      }

      return watchConfigs;
    }

    _addWatchesForWrappedWatchConfigs(wrappedWatchConfigsToAdd) {
      const viewsToWatchById = {};
      const tablesToWatchById = {};

      for (const wrappedWatchConfig of wrappedWatchConfigsToAdd) {
        const {
          watchConfig,
          wrappedCallback
        } = wrappedWatchConfig;
        const {
          watchable,
          key,
          context
        } = watchConfig; // See hack below for why we special case View and Table.

        if (watchable instanceof _view.default) {
          if (!viewsToWatchById[watchable.id]) {
            viewsToWatchById[watchable.id] = {
              watchable,
              wrappedWatchConfigs: []
            };
          }

          viewsToWatchById[watchable.id].wrappedWatchConfigs.push(wrappedWatchConfig);
        } else if (watchable instanceof _table.default) {
          if (!tablesToWatchById[watchable.id]) {
            tablesToWatchById[watchable.id] = {
              watchable,
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


      for (const {
        watchable,
        wrappedWatchConfigs
      } of (0, _values.default)(u).call(u, viewsToWatchById)) {
        for (const wrappedWatchConfig of wrappedWatchConfigs) {
          const {
            watchConfig,
            wrappedCallback
          } = wrappedWatchConfig;
          const key = watchConfig.key; // eslint-disable-line flowtype/no-weak-types

          watchable.watch(key, wrappedCallback, watchConfig.context);
        }
      }

      for (const {
        watchable,
        wrappedWatchConfigs
      } of (0, _values.default)(u).call(u, tablesToWatchById)) {
        for (const wrappedWatchConfig of wrappedWatchConfigs) {
          const {
            watchConfig,
            wrappedCallback
          } = wrappedWatchConfig;
          const key = watchConfig.key; // eslint-disable-line flowtype/no-weak-types

          watchable.watch(key, wrappedCallback, watchConfig.context);
        }
      }
    }

    _removeWatchesForWrappedWatchConfigs(wrappedWatchConfigsToRemove) {
      for (const {
        watchConfig,
        wrappedCallback
      } of wrappedWatchConfigsToRemove) {
        const {
          watchable,
          key,
          context
        } = watchConfig;
        watchable.unwatch(key, wrappedCallback, context);
      }
    }

    _watchAll() {
      if (!this._dataContainerIsMounted) {
        return;
      }

      const newWatchConfigs = this._generateWatchConfigs();

      const newWrappedWatchConfigs = (0, _map.default)(newWatchConfigs).call(newWatchConfigs, watchConfig => {
        return this._wrapWatchConfig(watchConfig);
      });

      this._addWatchesForWrappedWatchConfigs(newWrappedWatchConfigs);

      this._wrappedWatchConfigs = newWrappedWatchConfigs;
    }

    _unwatchAll() {
      if (!this._dataContainerIsMounted) {
        return;
      }

      if (this._wrappedWatchConfigs) {
        this._removeWatchesForWrappedWatchConfigs(this._wrappedWatchConfigs);

        this._wrappedWatchConfigs = null;
      }
    }

    _invokeForceUpdate() {
      // Call forceUpdate without any args.
      // TODO(kasra): should this debounce, in case there are many events in one frame?
      this.forceUpdate();
    }

    render() {
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

  }

  (0, _defineProperty2.default)(DataContainer, "displayName", `DataContainer(${componentName})`);

  if (passthruMethodNames) {
    // Let's augment the data container's prototype to have methods that pass through
    // to the wrapped component.
    for (const passthruMethodName of passthruMethodNames) {
      // flow-disable-next-line
      DataContainer.prototype[passthruMethodName] = function (...args) {
        this._wrappedComponent[passthruMethodName](args);
      };
    }
  } // for developer ease, we return the exact type of the wrapped component rather
  // than a new component. this is slightly incorrect - any methods not listed in
  // passthruMethodNames wont be available, although flow will think they exist.
  // flow-disable-next-line


  return DataContainer;
}

var _default = createDataContainer;
exports.default = _default;