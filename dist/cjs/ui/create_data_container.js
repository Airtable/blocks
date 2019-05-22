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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9jcmVhdGVfZGF0YV9jb250YWluZXIuanMiXSwibmFtZXMiOlsidSIsIndpbmRvdyIsIl9fcmVxdWlyZVByaXZhdGVNb2R1bGVGcm9tQWlydGFibGUiLCJpc1JlYWN0Q29tcG9uZW50IiwiY29tcG9uZW50IiwicHJvdG90eXBlIiwiZ2V0UmVhY3RDb21wb25lbnQiLCJDb21wb25lbnQiLCJnZXRDb21wb25lbnROYW1lIiwiQ29tcG9uZW50Q2xhc3MiLCJkaXNwbGF5TmFtZSIsIm5hbWUiLCJjcmVhdGVEYXRhQ29udGFpbmVyIiwiZ2V0RGVwZW5kZW5jaWVzIiwicGFzc3RocnVNZXRob2ROYW1lcyIsImNvbXBvbmVudE5hbWUiLCJEYXRhQ29udGFpbmVyIiwiUmVhY3QiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiX2JvdW5kU2V0V3JhcHBlZENvbXBvbmVudFJlZiIsIl9zZXRXcmFwcGVkQ29tcG9uZW50UmVmIiwiY29tcG9uZW50RGlkTW91bnQiLCJfZGF0YUNvbnRhaW5lcklzTW91bnRlZCIsIl93YXRjaEFsbCIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiX3Vud2F0Y2hBbGwiLCJVTlNBRkVfY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyIsIm5ld1Byb3BzIiwic2hvdWxkVXBkYXRlRGVwZW5kZW5jaWVzIiwiaXNPYmplY3RTaGFsbG93RXF1YWwiLCJfc2hvdWxkVXBkYXRlRGVwZW5kZW5jaWVzT25Db21wb25lbnREaWRVcGRhdGUiLCJjb21wb25lbnREaWRVcGRhdGUiLCJfcmVjb21wdXRlRGVwZW5kZW5jaWVzIiwiZWwiLCJfd3JhcHBlZENvbXBvbmVudCIsIl9hcmVXYXRjaENvbmZpZ3NFcXVhbCIsImEiLCJiIiwid2F0Y2hhYmxlIiwiY2FsbGJhY2siLCJjb250ZXh0IiwiaXNFcXVhbCIsImtleSIsIl93cmFwQ2FsbGJhY2siLCJ1bndyYXBwZWRDYWxsYmFjayIsImNhbGxiYWNrQXJndW1lbnRzIiwiY2FsbCIsIl93cmFwV2F0Y2hDb25maWciLCJ3YXRjaENvbmZpZyIsIndyYXBwZWRDYWxsYmFjayIsIl9kaWZmV2F0Y2hDb25maWdzIiwibmV3V2F0Y2hDb25maWdzIiwib2xkV3JhcHBlZFdhdGNoQ29uZmlncyIsIndyYXBwZWRXYXRjaENvbmZpZ3NUb0FkZCIsIndyYXBwZWRXYXRjaENvbmZpZ3NUb1JlbW92ZSIsInJlc3VsdGluZ1dyYXBwZWRXYXRjaENvbmZpZ3MiLCJtaW5MZW5ndGgiLCJNYXRoIiwibWluIiwibGVuZ3RoIiwiaSIsIm5ld1dhdGNoQ29uZmlnIiwib2xkV3JhcHBlZFdhdGNoQ29uZmlnIiwicHVzaCIsIm5ld1dyYXBwZWRXYXRjaENvbmZpZyIsIm5ld1dyYXBwZWRXYXRjaENvbmZpZ3MiLCJfZ2VuZXJhdGVXYXRjaENvbmZpZ3MiLCJfd3JhcHBlZFdhdGNoQ29uZmlncyIsImRpZmZPYmoiLCJfcmVtb3ZlV2F0Y2hlc0ZvcldyYXBwZWRXYXRjaENvbmZpZ3MiLCJfYWRkV2F0Y2hlc0ZvcldyYXBwZWRXYXRjaENvbmZpZ3MiLCJ3YXRjaENvbmZpZ3MiLCJkZXBlbmRlbmNpZXMiLCJkZXBlbmRlbmN5Iiwid2F0Y2giLCJfaW52b2tlRm9yY2VVcGRhdGUiLCJ2aWV3c1RvV2F0Y2hCeUlkIiwidGFibGVzVG9XYXRjaEJ5SWQiLCJ3cmFwcGVkV2F0Y2hDb25maWciLCJWaWV3IiwiaWQiLCJ3cmFwcGVkV2F0Y2hDb25maWdzIiwiVGFibGUiLCJ1bndhdGNoIiwiZm9yY2VVcGRhdGUiLCJyZW5kZXIiLCJwYXNzdGhydU1ldGhvZE5hbWUiLCJhcmdzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUEsTUFBTTtBQUFDQSxFQUFBQTtBQUFELElBQU1DLE1BQU0sQ0FBQ0Msa0NBQVAsQ0FBMEMseUJBQTFDLENBQVosQyxDQUVBO0FBQ0E7OztBQUNBLFNBQVNDLGdCQUFULENBQTBCQyxTQUExQixFQUFxRDtBQUNqRCxTQUFPLENBQUMsRUFD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QUMsS0FBS0gsdUJBQVYsRUFBbUM7QUFDL0I7QUFDSDs7QUFFRCxVQUFJLEtBQUs2QyxvQkFBVCxFQUErQjtBQUMzQixhQUFLRSxvQ0FBTCxDQUEwQyxLQUFLRixvQkFBL0M7O0FBQ0EsYUFBS0Esb0JBQUwsR0FBNEIsSUFBNUI7QUFDSDtBQUNKOztBQUNEUSxJQUFBQSxrQkFBa0IsR0FBRztBQUNqQjtBQUNBO0FBQ0EsV0FBS1MsV0FBTDtBQUNIOztBQUNEQyxJQUFBQSxNQUFNLEdBQUc7QUFDTCxVQUFJN0UsY0FBSixFQUFvQjtBQUNoQixlQUNJLG9CQUFDLGNBQUQsQ0FDSTtBQUNBO0FBRko7QUFHSSxVQUFBLEdBQUcsRUFBRSxLQUFLVztBQUhkLFdBSVEsS0FBS0QsS0FKYixFQURKO0FBUUgsT0FURCxNQVNPO0FBQ0g7QUFDQSxlQUFPLG9CQUFDLFNBQUQsRUFBZSxLQUFLQSxLQUFwQixDQUFQO0FBQ0g7QUFDSjs7QUF0UzhDOztBQUp0QyxnQ0FJUEgsYUFKTyxpQkFLYSxpQkFBZ0JELGFBQWMsR0FMM0M7O0FBNlNiLE1BQUlELG1CQUFKLEVBQXlCO0FBQ3JCO0FBQ0E7QUFDQSxTQUFLLE1BQU15RSxrQkFBWCxJQUFpQ3pFLG1CQUFqQyxFQUFzRDtBQUNsRDtBQUNBRSxNQUFBQSxhQUFhLENBQUNYLFNBQWQsQ0FBd0JrRixrQkFBeEIsSUFBOEMsVUFBUyxHQUFHQyxJQUFaLEVBQWtCO0FBQzVELGFBQUtyRCxpQkFBTCxDQUF1Qm9ELGtCQUF2QixFQUEyQ0MsSUFBM0M7QUFDSCxPQUZEO0FBR0g7QUFDSixHQXRUWSxDQXdUYjtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0EsU0FBT3hFLGFBQVA7QUFDSDs7ZUFFY0osbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFdhdGNoYWJsZSBmcm9tICcuLi93YXRjaGFibGUnO1xuaW1wb3J0IFRhYmxlIGZyb20gJy4uL21vZGVscy90YWJsZSc7XG5pbXBvcnQgVmlldyBmcm9tICcuLi9tb2RlbHMvdmlldyc7XG5cbmNvbnN0IHt1fSA9IHdpbmRvdy5fX3JlcXVpcmVQcml2YXRlTW9kdWxlRnJvbUFpcnRhYmxlKCdjbGllbnRfc2VydmVyX3NoYXJlZC9odScpO1xuXG4vLyBUaGVzZSBoZWxwZXIgZnVuY3Rpb25zIHdlcmUgdGFrZW4gZnJvbVxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlbGF5L2Jsb2IvZTkxODEwMy9zcmMvY29udGFpbmVyL1JlbGF5Q29udGFpbmVyVXRpbHMuanNcbmZ1bmN0aW9uIGlzUmVhY3RDb21wb25lbnQoY29tcG9uZW50OiBtaXhlZCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIShcbiAgICAgICAgY29tcG9uZW50ICYmXG4gICAgICAgIHR5cGVvZiBjb21wb25lbnQucHJvdG90eXBlID09PSAnb2JqZWN0JyAmJlxuICAgICAgICBjb21wb25lbnQucHJvdG90eXBlICYmXG4gICAgICAgIGNvbXBvbmVudC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudFxuICAgICk7XG59XG5mdW5jdGlvbiBnZXRSZWFjdENvbXBvbmVudDxQcm9wczoge30+KFxuICAgIENvbXBvbmVudDogbWl4ZWQgfCBSZWFjdC5Db21wb25lbnRUeXBlPFByb3BzPixcbik6IFJlYWN0LkNvbXBvbmVudFR5cGU8UHJvcHM+IHwgbnVsbCB7XG4gICAgaWYgKGlzUmVhY3RDb21wb25lbnQoQ29tcG9uZW50KSkge1xuICAgICAgICAvLyBmbG93LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICAgIHJldHVybiBDb21wb25lbnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50TmFtZTxQcm9wczoge30+KENvbXBvbmVudDogUmVhY3QuQ29tcG9uZW50VHlwZTxQcm9wcz4pOiBzdHJpbmcge1xuICAgIGNvbnN0IENvbXBvbmVudENsYXNzID0gZ2V0UmVhY3RDb21wb25lbnQoQ29tcG9uZW50KTtcbiAgICBpZiAoQ29tcG9uZW50Q2xhc3MpIHtcbiAgICAgICAgcmV0dXJuIENvbXBvbmVudENsYXNzLmRpc3BsYXlOYW1lIHx8IENvbXBvbmVudENsYXNzLm5hbWUgfHwgJ0NsYXNzQ29tcG9uZW50JztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBDb21wb25lbnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gVGhpcyBpcyBhIHN0YXRlbGVzcyBmdW5jdGlvbmFsIGNvbXBvbmVudC5cbiAgICAgICAgcmV0dXJuIENvbXBvbmVudC5kaXNwbGF5TmFtZSB8fCBDb21wb25lbnQubmFtZSB8fCAnU3RhdGVsZXNzQ29tcG9uZW50JztcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJ1JlYWN0RWxlbWVudCc7XG4gICAgfVxufVxuXG4vLyBVc2luZyAnd2F0Y2gnIGFzIGEga2V5IGlzIGtpbmQgb2Ygc3RyYW5nZSBmcm9tIGFuIGludGVybmFsIHBlcnNwZWN0aXZlLCBidXQgaXNcbi8vIGFjdHVhbGx5IGEga2luZCBvZiBuaWNlIGRlY2xhcmF0aXZlIGZvcm1hdCBmb3Igd2hlbiB5b3UgYXJlIGNvbnN1bWluZyB0aGUgc2RrLFxuLy8gc28gd2UnbGwgdG9sZXJhdGUgdGhlIHdlaXJkbmVzcyBpbnRlcm5hbGx5LlxuZXhwb3J0IHR5cGUgV2F0Y2hEZXBlbmRlbmN5ID0ge1xuICAgIHdhdGNoOiA/V2F0Y2hhYmxlPGFueT4sIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZmxvd3R5cGUvbm8td2Vhay10eXBlc1xuICAgIGtleTogc3RyaW5nIHwgQXJyYXk8c3RyaW5nPixcbiAgICBjYWxsYmFjaz86IEZ1bmN0aW9uLFxufTtcbnR5cGUgV2F0Y2hDb25maWcgPSB7XG4gICAgd2F0Y2hhYmxlOiBXYXRjaGFibGU8YW55PiwgLy8gZXNsaW50LWRpc2FibGUtbGluZSBmbG93dHlwZS9uby13ZWFrLXR5cGVzXG4gICAga2V5OiBzdHJpbmcgfCBBcnJheTxzdHJpbmc+LFxuICAgIGNhbGxiYWNrOiBGdW5jdGlvbixcbiAgICBjb250ZXh0OiA/T2JqZWN0LFxufTtcblxudHlwZSBXcmFwcGVkV2F0Y2hDb25maWcgPSB7XG4gICAgd2F0Y2hDb25maWc6IFdhdGNoQ29uZmlnLFxuICAgIHdyYXBwZWRDYWxsYmFjazogRnVuY3Rpb24sXG59O1xuXG4vKipcbiAqIFJldHVybnMgYSBIT0MgY29tcG9uZW50IHRoYXQgd2lsbCB3YXRjaCBhbmQgdW53YXRjaCB0aGUgc3BlY2lmaWVkIHdhdGNoYWJsZSBvYmplY3RzLlxuICpcbiAqIENvbXBvbmVudCBjYW4gZWl0aGVyIGJlIGEgc3RhdGVmdWwgUmVhY3QgY29tcG9uZW50IGNsYXNzLCBvciBhIHN0YXRlbGVzcyBmdW5jdGlvbmFsXG4gKiBjb21wb25lbnQuXG4gKlxuICogVGhlIGdldERlcGVuZGVuY2llcyBmdW5jdGlvbiB3aWxsIGJlIGludm9rZWQgb24gY29tcG9uZW50RGlkTW91bnQsIHdoZW5ldmVyIHByb3BzXG4gKiBzaGFsbG93bHkgY2hhbmdlLCBhbmQgd2hlbmV2ZXIgb25lIG9mIHRoZSB3YXRjaGVzIHJldHVybmVkIGZyb20gdGhlIGdldERlcGVuZGVuY2llc1xuICogZnVuY3Rpb24gaXMgdHJpZ2dlcmVkLlxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQge1VJfSBmcm9tICdhaXJ0YWJsZS1ibG9jayc7XG4gKiBjb25zdCBNeUNvbXBvbmVudFdpdGhEYXRhID0gVUkuY3JlYXRlRGF0YUNvbnRhaW5lcihNeUNvbXBvbmVudCwgZ2V0RGVwZW5kZW5jaWVzKHByb3BzKSB7XG4gKiAgICAgLy8gVGhpcyBzaG91bGQgcmV0dXJuIGFuIGFycmF5IG9mIGRlcGVuZGVuY3kgb2JqZWN0czpcbiAqICAgICByZXR1cm4gW1xuICogICAgICAgICAvLyBXaWxsIGNhbGwgZm9yY2VVcGRhdGUgd2hlbiB0YWJsZSBuYW1lIGNoYW5nZXMuXG4gKiAgICAgICAgIHt3YXRjaDogcHJvcHMudGFibGUsIGtleTogJ25hbWUnfSxcbiAqXG4gKiAgICAgICAgIC8vIFdpbGwgY2FsbCB0aGlzLl9vbkZpZWxkc0NoYW5nZSB3aGVuIHRhYmxlIGZpZWxkcyBjaGFuZ2UuXG4gKiAgICAgICAgIHt3YXRjaDogcHJvcHMudGFibGUsIGtleTogJ2ZpZWxkcycsIGNhbGxiYWNrOiBNeUNvbXBvbmVudC5wcm90b3R5cGUuX29uRmllbGRzQ2hhbmdlfSxcbiAqICAgICBdO1xuICogfSk7XG4gKi9cbi8vXG4vLyBJTVBPUlRBTlQ6IFRoZSBwYXNzdGhydU1ldGhvZE5hbWVzIGFyZyBzaG91bGQgYmUgcmVzZXJ2ZWQgZm9yIGludGVybmFsIGJsb2NrcyBTREsgdXNlIG9ubHkuXG4vLyBUaGlzIGlzIGV4cGVyaW1lbnRhbCBhbmQgdmVyeSBzdWJqZWN0IHRvIGNoYW5nZS5cbmZ1bmN0aW9uIGNyZWF0ZURhdGFDb250YWluZXI8UHJvcHM6IHt9LCBDb21wb25lbnRUeXBlOiBSZWFjdC5Db21wb25lbnRUeXBlPFByb3BzPj4oXG4gICAgQ29tcG9uZW50OiBDb21wb25lbnRUeXBlLFxuICAgIGdldERlcGVuZGVuY2llczogKHByb3BzOiBQcm9wcykgPT4gQXJyYXk8P1dhdGNoRGVwZW5kZW5jeT4sXG4gICAgcGFzc3RocnVNZXRob2ROYW1lczogP0FycmF5PHN0cmluZz4sXG4pOiBDb21wb25lbnRUeXBlIHtcbiAgICBjb25zdCBDb21wb25lbnRDbGFzcyA9IGdldFJlYWN0Q29tcG9uZW50KENvbXBvbmVudCk7XG4gICAgY29uc3QgY29tcG9uZW50TmFtZSA9IGdldENvbXBvbmVudE5hbWUoQ29tcG9uZW50KTtcblxuICAgIGNsYXNzIERhdGFDb250YWluZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8UHJvcHM+IHtcbiAgICAgICAgc3RhdGljIGRpc3BsYXlOYW1lID0gYERhdGFDb250YWluZXIoJHtjb21wb25lbnROYW1lfSlgO1xuICAgICAgICBfd3JhcHBlZENvbXBvbmVudDogUmVhY3QuQ29tcG9uZW50PFByb3BzPiB8IG51bGwgPSBudWxsO1xuICAgICAgICBfd3JhcHBlZFdhdGNoQ29uZmlnczogQXJyYXk8V3JhcHBlZFdhdGNoQ29uZmlnPiB8IG51bGwgPSBudWxsO1xuICAgICAgICBfc2hvdWxkVXBkYXRlRGVwZW5kZW5jaWVzT25Db21wb25lbnREaWRVcGRhdGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgICAgICAvLyBOT1RFOiB3ZSB1c2UgdGhpcyBmbGFnIHRvIG1ha2Ugc3VyZSB0aGF0IHdlIG5ldmVyIGFkZCB3YXRjaGVzIGZvciBhblxuICAgICAgICAvLyB1bm1vdW50ZWQgY29tcG9uZW50LiBVc3VhbGx5LCB3ZSBzaG91bGRuJ3QgaGF2ZSB0byB3b3JyeSBhYm91dCB0aGlzLFxuICAgICAgICAvLyBidXQgaXQncyBwb3NzaWJsZSB0aGF0IGluIHJlc3BvbnNlIHRvIGFuIGV2ZW50IHRyaWdnZXIgdGhhdCB0aGlzIGFuZFxuICAgICAgICAvLyBhbm90aGVyIGNvbXBvbmVudCBhcmUgYm90aCBsaXN0ZW5pbmcgdG8sIHRoaXMgY29tcG9uZW50IGdldHMgdW5tb3VudGVkXG4gICAgICAgIC8vIGJlZm9yZSB3ZSBjYWxsIHRoZSBjYWxsYmFjayBmb3IgdGhpcyBjb21wb25lbnQuXG4gICAgICAgIF9kYXRhQ29udGFpbmVySXNNb3VudGVkOiBib29sZWFuO1xuICAgICAgICBfYm91bmRTZXRXcmFwcGVkQ29tcG9uZW50UmVmOiAoZWw6IFJlYWN0LkNvbXBvbmVudDxQcm9wcz4gfCBudWxsKSA9PiB2b2lkO1xuICAgICAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICAgICAgLy8gSWYgdGhlIHJlZiBjYWxsYmFjayBpcyBkZWZpbmVkIGFzIGFuIGlubGluZSBmdW5jdGlvbiwgaXQgd2lsbCBnZXQgY2FsbGVkIHR3aWNlIGR1cmluZyB1cGRhdGVzLFxuICAgICAgICAgICAgLy8gZmlyc3Qgd2l0aCBudWxsIGFuZCB0aGVuIGFnYWluIHdpdGggdGhlIERPTSBlbGVtZW50LiBUaGlzIGlzIGJlY2F1c2UgYSBuZXcgaW5zdGFuY2Ugb2ZcbiAgICAgICAgICAgIC8vIHRoZSBmdW5jdGlvbiBpcyBjcmVhdGVkIHdpdGggZWFjaCByZW5kZXIsIHNvIFJlYWN0IG5lZWRzIHRvIGNsZWFyIHRoZSBvbGQgcmVmIGFuZCBzZXQgdXAgdGhlIG5ldyBvbmUuXG5cbiAgICAgICAgICAgIC8vIFdlIHdhbnQgdG8gYXZvaWQgc2V0dGluZyBfd3JhcHBlZENvbXBvbmVudCB0byBudWxsIGR1cmluZyB1cGRhdGVzLCBzaW5jZSB0aGF0IHdpbGwgY2F1c2UgY3Jhc2hlc1xuICAgICAgICAgICAgLy8gd2l0aCBjdXN0b20gY2FsbGJhY2tzLCBzbyBpbnN0ZWFkIG9mIHVzaW5nIGFuIGlubGluZSByZWYgZnVuY3Rpb24sIHdlIHVzZSB0aGlzIHByZS1ib3VuZCBmdW5jdGlvbi5cbiAgICAgICAgICAgIHRoaXMuX2JvdW5kU2V0V3JhcHBlZENvbXBvbmVudFJlZiA9IHRoaXMuX3NldFdyYXBwZWRDb21wb25lbnRSZWYuYmluZCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgICAgIC8vIE5PVEU6IG1ha2Ugc3VyZSB0aGlzIGlzIHRoZSBmaXJzdCB0aGluZyB3ZSBkbyBoZXJlLCBzaW5jZSBhbGwgb2YgdGhlXG4gICAgICAgICAgICAvLyBmdW5jdGlvbnMgdGhhdCBkZWFsIHdpdGggd2F0Y2hlcyBjaGVjayB0aGlzIGZsYWcuXG4gICAgICAgICAgICB0aGlzLl9kYXRhQ29udGFpbmVySXNNb3VudGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgdGhpcy5fd2F0Y2hBbGwoKTtcbiAgICAgICAgfVxuICAgICAgICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgICAgICAgIHRoaXMuX3Vud2F0Y2hBbGwoKTtcblxuICAgICAgICAgICAgLy8gTk9URTogbWFrZSBzdXJlIHRoaXMgaXMgdGhlIGxhc3QgdGhpbmcgd2UgZG8gaGVyZSwgc2luY2UgYWxsIG9mIHRoZVxuICAgICAgICAgICAgLy8gZnVuY3Rpb25zIHRoYXQgZGVhbCB3aXRoIHdhdGNoZXMgY2hlY2sgdGhpcyBmbGFnLlxuICAgICAgICAgICAgLy8gaS5lLiB0aGUgX3Vud2F0Y2hBbGwgY2FsbCBhYm92ZSBjaGVja3MgdGhhdCB0aGUgY29tcG9uZW50IGlzIHN0aWxsXG4gICAgICAgICAgICAvLyBtb3VudGVkLlxuICAgICAgICAgICAgdGhpcy5fZGF0YUNvbnRhaW5lcklzTW91bnRlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIFVOU0FGRV9jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5ld1Byb3BzOiBPYmplY3QpIHtcbiAgICAgICAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZURlcGVuZGVuY2llcyA9ICF1LmlzT2JqZWN0U2hhbGxvd0VxdWFsKHRoaXMucHJvcHMsIG5ld1Byb3BzKTtcbiAgICAgICAgICAgIGlmIChzaG91bGRVcGRhdGVEZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zaG91bGRVcGRhdGVEZXBlbmRlbmNpZXNPbkNvbXBvbmVudERpZFVwZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29tcG9uZW50RGlkVXBkYXRlKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3Nob3VsZFVwZGF0ZURlcGVuZGVuY2llc09uQ29tcG9uZW50RGlkVXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVjb21wdXRlRGVwZW5kZW5jaWVzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2hvdWxkVXBkYXRlRGVwZW5kZW5jaWVzT25Db21wb25lbnREaWRVcGRhdGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBfc2V0V3JhcHBlZENvbXBvbmVudFJlZihlbDogUmVhY3QuQ29tcG9uZW50PFByb3BzPiB8IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuX3dyYXBwZWRDb21wb25lbnQgPSBlbDtcbiAgICAgICAgfVxuICAgICAgICBfYXJlV2F0Y2hDb25maWdzRXF1YWwoYTogV2F0Y2hDb25maWcsIGI6IFdhdGNoQ29uZmlnKTogYm9vbGVhbiB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgIGEud2F0Y2hhYmxlID09PSBiLndhdGNoYWJsZSAmJlxuICAgICAgICAgICAgICAgIGEuY2FsbGJhY2sgPT09IGIuY2FsbGJhY2sgJiZcbiAgICAgICAgICAgICAgICBhLmNvbnRleHQgPT09IGIuY29udGV4dCAmJlxuICAgICAgICAgICAgICAgIHUuaXNFcXVhbChhLmtleSwgYi5rZXkpXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIF93cmFwQ2FsbGJhY2soY29udGV4dDogP1JlYWN0LkNvbXBvbmVudDxQcm9wcz4sIHVud3JhcHBlZENhbGxiYWNrOiBGdW5jdGlvbik6IEZ1bmN0aW9uIHtcbiAgICAgICAgICAgIHJldHVybiAoLi4uY2FsbGJhY2tBcmd1bWVudHMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2RhdGFDb250YWluZXJJc01vdW50ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFJlZXZhbHVhdGUgb3VyIHdhdGNoZXMsIHNpbmNlIHdhdGNoZXMgbWF5IGNoYW5nZSBpbiByZXNwb25zZVxuICAgICAgICAgICAgICAgIC8vIHRvIHRoaXMgZXZlbnQgZmlyaW5nLlxuICAgICAgICAgICAgICAgIHRoaXMuX3JlY29tcHV0ZURlcGVuZGVuY2llcygpO1xuXG4gICAgICAgICAgICAgICAgdW53cmFwcGVkQ2FsbGJhY2suY2FsbChjb250ZXh0LCAuLi5jYWxsYmFja0FyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIF93cmFwV2F0Y2hDb25maWcod2F0Y2hDb25maWc6IFdhdGNoQ29uZmlnKTogV3JhcHBlZFdhdGNoQ29uZmlnIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgd2F0Y2hDb25maWcsXG4gICAgICAgICAgICAgICAgd3JhcHBlZENhbGxiYWNrOiB0aGlzLl93cmFwQ2FsbGJhY2sod2F0Y2hDb25maWcuY29udGV4dCwgd2F0Y2hDb25maWcuY2FsbGJhY2spLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBfZGlmZldhdGNoQ29uZmlncyhcbiAgICAgICAgICAgIG5ld1dhdGNoQ29uZmlnczogQXJyYXk8V2F0Y2hDb25maWc+LFxuICAgICAgICAgICAgb2xkV3JhcHBlZFdhdGNoQ29uZmlnczogQXJyYXk8V3JhcHBlZFdhdGNoQ29uZmlnPixcbiAgICAgICAgKToge1xuICAgICAgICAgICAgd3JhcHBlZFdhdGNoQ29uZmlnc1RvQWRkOiBBcnJheTxXcmFwcGVkV2F0Y2hDb25maWc+LFxuICAgICAgICAgICAgd3JhcHBlZFdhdGNoQ29uZmlnc1RvUmVtb3ZlOiBBcnJheTxXcmFwcGVkV2F0Y2hDb25maWc+LFxuICAgICAgICAgICAgcmVzdWx0aW5nV3JhcHBlZFdhdGNoQ29uZmlnczogQXJyYXk8V3JhcHBlZFdhdGNoQ29uZmlnPixcbiAgICAgICAgfSB7XG4gICAgICAgICAgICBjb25zdCB3cmFwcGVkV2F0Y2hDb25maWdzVG9BZGQgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IHdyYXBwZWRXYXRjaENvbmZpZ3NUb1JlbW92ZSA9IFtdO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0aW5nV3JhcHBlZFdhdGNoQ29uZmlncyA9IFtdO1xuXG4gICAgICAgICAgICAvLyBOT1RFOiB0aGlzIGFzc3VtZXMgdGhhdCB0aGUgb3JkZXIgb2YgdGhlIHdhdGNoIGNvbmZpZ3MgZG9lcyBub3QgY2hhbmdlLFxuICAgICAgICAgICAgLy8gc28gaXQgbG9vcHMgdGhyb3VnaCBhbmQgY2hlY2tzIGZvciBlcXVhbGl0eSBhdCBlYWNoIGluZGV4LiBUaGlzIGlzXG4gICAgICAgICAgICAvLyBzbyB0aGF0IHdlIGRvIG5vdCBoYXZlIHRvIGNoZWNrIGV2ZXJ5IHdhdGNoIGNvbmZpZyBpbiBuZXdXYXRjaENvbmZpZ3NcbiAgICAgICAgICAgIC8vIGFnYWluc3QgZXZlcnkgd2F0Y2ggY29uZmlnIGluIG9sZFdhdGNoQ29uZmlncywgd2hpY2ggd291bGQgYmUgTyhuXjIpLlxuICAgICAgICAgICAgLy8gV2UgbWF5IGVuZCB1cCB1bndhdGNoaW5nIGFuZCByZXdhdGNoaW5nIHNvbWUgdGhpbmdzIGlmIHRoZSBvcmRlciBjaGFuZ2VzLFxuICAgICAgICAgICAgLy8gYnV0IHRoYXQgaXMgYSB3b3J0aHdoaWxlIHRyYWRlb2ZmLlxuICAgICAgICAgICAgLy8gT25lIHVuZm9ydHVuYXRlIGNhc2UgaXMgdGhhdCBpZiBhIHdhdGNoIHN3aXRjaGVzIGZyb20gZmFsc2V5IHRvIG5vdCBmYWxzZXlcbiAgICAgICAgICAgIC8vIChvciB2aWNlIHZlcnNhKSwgdGhlIG9yZGVyIHdpbGwgY2hhbmdlIGFuZCB3ZSdsbCBlbmQgdXAgcmV3YXRjaGluZyBhIGJ1bmNoXG4gICAgICAgICAgICAvLyBvZiB0aGluZ3MgdGhhdCBkaWQgbm90IG5lZWQgdG8gY2hhbmdlLlxuICAgICAgICAgICAgLy8gVE9ETzogZml4IHRoZSBjYXNlIHdoZXJlIGEgd2F0Y2ggc3dpdGNoaW5nIGZyb20gZmFsc2V5IDwtPiBub3QgZmFsc2V5XG4gICAgICAgICAgICAvLyBtZXNzZXMgdXAgdGhlIGNvbnNpc3RlbnQgb3JkZXJpbmcgYXNzdW1wdGlvbi5cblxuICAgICAgICAgICAgY29uc3QgbWluTGVuZ3RoID0gTWF0aC5taW4obmV3V2F0Y2hDb25maWdzLmxlbmd0aCwgb2xkV3JhcHBlZFdhdGNoQ29uZmlncy5sZW5ndGgpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtaW5MZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1dhdGNoQ29uZmlnID0gbmV3V2F0Y2hDb25maWdzW2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9sZFdyYXBwZWRXYXRjaENvbmZpZyA9IG9sZFdyYXBwZWRXYXRjaENvbmZpZ3NbaV07XG5cbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICF0aGlzLl9hcmVXYXRjaENvbmZpZ3NFcXVhbChvbGRXcmFwcGVkV2F0Y2hDb25maWcud2F0Y2hDb25maWcsIG5ld1dhdGNoQ29uZmlnKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICB3cmFwcGVkV2F0Y2hDb25maWdzVG9SZW1vdmUucHVzaChvbGRXcmFwcGVkV2F0Y2hDb25maWcpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbmNlIHdlJ3JlIGFkZGluZyBhIGJyYW5kIG5ldyB3YXRjaCBjb25maWcsIHdlIG5lZWQgdG8gd3JhcCBpdC5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3V3JhcHBlZFdhdGNoQ29uZmlnID0gdGhpcy5fd3JhcFdhdGNoQ29uZmlnKG5ld1dhdGNoQ29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgd3JhcHBlZFdhdGNoQ29uZmlnc1RvQWRkLnB1c2gobmV3V3JhcHBlZFdhdGNoQ29uZmlnKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0aW5nV3JhcHBlZFdhdGNoQ29uZmlncy5wdXNoKG5ld1dyYXBwZWRXYXRjaENvbmZpZyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTm8gbmVlZCB0byB3cmFwIHRoaXMgd2F0Y2ggY29uZmlnLCBzaW5jZSBpdCdzIGFscmVhZHkgd3JhcHBlZC4gV2UncmVcbiAgICAgICAgICAgICAgICAgICAgLy8ganVzdCBrZWVwaW5nIGl0IGZyb20gdGhlIG9yaWdpbmFsIHdyYXBwZWQgd2F0Y2ggY29uZmlncy5cbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0aW5nV3JhcHBlZFdhdGNoQ29uZmlncy5wdXNoKG9sZFdyYXBwZWRXYXRjaENvbmZpZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBZGQgdGhlIHJlc3Qgb2YgdGhlIGxvbmdlciBhcnJheSAoaWYgYXBwbGljYWJsZSkuXG4gICAgICAgICAgICBpZiAobmV3V2F0Y2hDb25maWdzLmxlbmd0aCA+IG9sZFdyYXBwZWRXYXRjaENvbmZpZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgLy8gU2FtZSBhcyBhYm92ZS4gU2luY2Ugd2UncmUgYWRkaW5nIGJyYW5kIG5ldyB3YXRjaCBjb25maWdzLCB3ZSBuZWVkIHRvXG4gICAgICAgICAgICAgICAgLy8gd3JhcCB0aGVtIGhlcmUuXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3V3JhcHBlZFdhdGNoQ29uZmlncyA9IG5ld1dhdGNoQ29uZmlncy5zbGljZShtaW5MZW5ndGgpLm1hcCh3YXRjaENvbmZpZyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl93cmFwV2F0Y2hDb25maWcod2F0Y2hDb25maWcpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHdyYXBwZWRXYXRjaENvbmZpZ3NUb0FkZC5wdXNoKC4uLm5ld1dyYXBwZWRXYXRjaENvbmZpZ3MpO1xuXG4gICAgICAgICAgICAgICAgLy8gQWxzbyBhZGQgYW55IG5ldyBjb25maWdzIHRoYXQgd2UncmUgd2F0Y2hpbmcgdG8gdGhlIHJlc3VsdCBhcnJheS5cbiAgICAgICAgICAgICAgICByZXN1bHRpbmdXcmFwcGVkV2F0Y2hDb25maWdzLnB1c2goLi4ubmV3V3JhcHBlZFdhdGNoQ29uZmlncyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG9sZFdyYXBwZWRXYXRjaENvbmZpZ3MubGVuZ3RoID4gbmV3V2F0Y2hDb25maWdzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHdyYXBwZWRXYXRjaENvbmZpZ3NUb1JlbW92ZS5wdXNoKC4uLm9sZFdyYXBwZWRXYXRjaENvbmZpZ3Muc2xpY2UobWluTGVuZ3RoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgd3JhcHBlZFdhdGNoQ29uZmlnc1RvQWRkLFxuICAgICAgICAgICAgICAgIHdyYXBwZWRXYXRjaENvbmZpZ3NUb1JlbW92ZSxcbiAgICAgICAgICAgICAgICByZXN1bHRpbmdXcmFwcGVkV2F0Y2hDb25maWdzLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBfcmVjb21wdXRlRGVwZW5kZW5jaWVzKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9kYXRhQ29udGFpbmVySXNNb3VudGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBuZXdXYXRjaENvbmZpZ3MgPSB0aGlzLl9nZW5lcmF0ZVdhdGNoQ29uZmlncygpO1xuICAgICAgICAgICAgY29uc3Qgb2xkV3JhcHBlZFdhdGNoQ29uZmlncyA9IHRoaXMuX3dyYXBwZWRXYXRjaENvbmZpZ3MgfHwgW107XG4gICAgICAgICAgICBjb25zdCBkaWZmT2JqID0gdGhpcy5fZGlmZldhdGNoQ29uZmlncyhuZXdXYXRjaENvbmZpZ3MsIG9sZFdyYXBwZWRXYXRjaENvbmZpZ3MpO1xuXG4gICAgICAgICAgICB0aGlzLl9yZW1vdmVXYXRjaGVzRm9yV3JhcHBlZFdhdGNoQ29uZmlncyhkaWZmT2JqLndyYXBwZWRXYXRjaENvbmZpZ3NUb1JlbW92ZSk7XG4gICAgICAgICAgICB0aGlzLl9hZGRXYXRjaGVzRm9yV3JhcHBlZFdhdGNoQ29uZmlncyhkaWZmT2JqLndyYXBwZWRXYXRjaENvbmZpZ3NUb0FkZCk7XG5cbiAgICAgICAgICAgIC8vIE5PVEU6IFJhdGhlciB0aGFuIGp1c3Qgc2V0dGluZyB0aGlzIHRvIG5ld1dhdGNoQ29uZmlncywgd2Ugd2FudCB0b1xuICAgICAgICAgICAgLy8gdXNlIHRoZSByZXN1bHRpbmcgd2F0Y2ggY29uZmlncyByZXR1cm5lZCBpbiB0aGUgZGlmZk9iai4gVGhpcyBpcyBiZWNhdXNlXG4gICAgICAgICAgICAvLyBuZXcgd3JhcHBlZCBjYWxsYmFja3MgdGhhdCB3ZXJlIGNyZWF0ZWQgaW4gX2dlbmVyYXRlV2F0Y2hDb25maWdzIHdpbGxcbiAgICAgICAgICAgIC8vIG5vdCBiZSBlcXVhbCB0byB0aGUgY2FsbGJhY2tzIHRoYXQgd2UgYWN0dWFsbHkgdXNlZCB0byB3YXRjaCB0aGluZ3MuXG4gICAgICAgICAgICB0aGlzLl93cmFwcGVkV2F0Y2hDb25maWdzID0gZGlmZk9iai5yZXN1bHRpbmdXcmFwcGVkV2F0Y2hDb25maWdzO1xuICAgICAgICB9XG4gICAgICAgIF9nZW5lcmF0ZVdhdGNoQ29uZmlncygpOiBBcnJheTxXYXRjaENvbmZpZz4ge1xuICAgICAgICAgICAgY29uc3Qgd2F0Y2hDb25maWdzID0gW107XG4gICAgICAgICAgICBjb25zdCBkZXBlbmRlbmNpZXMgPSBnZXREZXBlbmRlbmNpZXModGhpcy5wcm9wcyk7XG4gICAgICAgICAgICAvLyBUT0RPKGthc3JhKTogZG8gcnVudGltZSBjaGVja3MgZm9yIHRoZSB2YWx1ZSBvZiBgZGVwZW5kZW5jaWVzYFxuICAgICAgICAgICAgLy8gdG8gbWFrZSBzdXJlIGl0IGNvbmZvcm1zIHdpdGggaXRzIGZsb3cgdHlwZS4gSWYgaXQgZG9lc24ndCxcbiAgICAgICAgICAgIC8vIHNob3cgYSBoZWxwZnVsIGVycm9yIG1lc3NhZ2UgdG8gdGhlIGJsb2NrIGRldmVsb3Blci5cbiAgICAgICAgICAgIGlmIChkZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGRlcGVuZGVuY3kgb2YgZGVwZW5kZW5jaWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHdhdGNoYWJsZSA9IGRlcGVuZGVuY3kgJiYgZGVwZW5kZW5jeS53YXRjaDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlcGVuZGVuY3kgJiYgd2F0Y2hhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7a2V5fSA9IGRlcGVuZGVuY3k7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2FsbGJhY2sgPSBkZXBlbmRlbmN5LmNhbGxiYWNrO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNvbnRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0ID0gdGhpcy5fd3JhcHBlZENvbXBvbmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgPSB0aGlzLl9pbnZva2VGb3JjZVVwZGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0ID0gdGhpczsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjb25zaXN0ZW50LXRoaXNcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHdhdGNoQ29uZmlnOiBXYXRjaENvbmZpZyA9IHt3YXRjaGFibGUsIGtleSwgY2FsbGJhY2ssIGNvbnRleHR9O1xuICAgICAgICAgICAgICAgICAgICAgICAgd2F0Y2hDb25maWdzLnB1c2god2F0Y2hDb25maWcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHdhdGNoQ29uZmlncztcbiAgICAgICAgfVxuICAgICAgICBfYWRkV2F0Y2hlc0ZvcldyYXBwZWRXYXRjaENvbmZpZ3Mod3JhcHBlZFdhdGNoQ29uZmlnc1RvQWRkOiBBcnJheTxXcmFwcGVkV2F0Y2hDb25maWc+KSB7XG4gICAgICAgICAgICBjb25zdCB2aWV3c1RvV2F0Y2hCeUlkOiB7XG4gICAgICAgICAgICAgICAgW3N0cmluZ106IHtcbiAgICAgICAgICAgICAgICAgICAgd2F0Y2hhYmxlOiBWaWV3LFxuICAgICAgICAgICAgICAgICAgICB3cmFwcGVkV2F0Y2hDb25maWdzOiBBcnJheTxXcmFwcGVkV2F0Y2hDb25maWc+LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9ID0ge307XG4gICAgICAgICAgICBjb25zdCB0YWJsZXNUb1dhdGNoQnlJZDoge1xuICAgICAgICAgICAgICAgIFtzdHJpbmddOiB7XG4gICAgICAgICAgICAgICAgICAgIHdhdGNoYWJsZTogVGFibGUsXG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZWRXYXRjaENvbmZpZ3M6IEFycmF5PFdyYXBwZWRXYXRjaENvbmZpZz4sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0gPSB7fTtcblxuICAgICAgICAgICAgZm9yIChjb25zdCB3cmFwcGVkV2F0Y2hDb25maWcgb2Ygd3JhcHBlZFdhdGNoQ29uZmlnc1RvQWRkKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qge3dhdGNoQ29uZmlnLCB3cmFwcGVkQ2FsbGJhY2t9ID0gd3JhcHBlZFdhdGNoQ29uZmlnO1xuICAgICAgICAgICAgICAgIGNvbnN0IHt3YXRjaGFibGUsIGtleSwgY29udGV4dH0gPSB3YXRjaENvbmZpZztcbiAgICAgICAgICAgICAgICAvLyBTZWUgaGFjayBiZWxvdyBmb3Igd2h5IHdlIHNwZWNpYWwgY2FzZSBWaWV3IGFuZCBUYWJsZS5cbiAgICAgICAgICAgICAgICBpZiAod2F0Y2hhYmxlIGluc3RhbmNlb2YgVmlldykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXZpZXdzVG9XYXRjaEJ5SWRbd2F0Y2hhYmxlLmlkXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmlld3NUb1dhdGNoQnlJZFt3YXRjaGFibGUuaWRdID0ge3dhdGNoYWJsZSwgd3JhcHBlZFdhdGNoQ29uZmlnczogW119O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZpZXdzVG9XYXRjaEJ5SWRbd2F0Y2hhYmxlLmlkXS53cmFwcGVkV2F0Y2hDb25maWdzLnB1c2god3JhcHBlZFdhdGNoQ29uZmlnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHdhdGNoYWJsZSBpbnN0YW5jZW9mIFRhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGFibGVzVG9XYXRjaEJ5SWRbd2F0Y2hhYmxlLmlkXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFibGVzVG9XYXRjaEJ5SWRbd2F0Y2hhYmxlLmlkXSA9IHt3YXRjaGFibGUsIHdyYXBwZWRXYXRjaENvbmZpZ3M6IFtdfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0YWJsZXNUb1dhdGNoQnlJZFt3YXRjaGFibGUuaWRdLndyYXBwZWRXYXRjaENvbmZpZ3MucHVzaCh3cmFwcGVkV2F0Y2hDb25maWcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdhdGNoYWJsZS53YXRjaChrZXksIHdyYXBwZWRDYWxsYmFjaywgY29udGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBIQUNLOiB3ZSB3YW50IHRvIGZldGNoIHZpZXcgZGF0YSAqYmVmb3JlKiBmZXRjaGluZyB0YWJsZSBkYXRhLlxuICAgICAgICAgICAgLy8gVGhpcyBtaW5pbWl6ZXMgdGhlIG51bWJlciBvZiBuZXR3b3JrIHJlcXVlc3RzOiBpZiB0aGUgcGFyZW50IHRhYmxlXG4gICAgICAgICAgICAvLyBmb3IgYSB2aWV3IGlzbid0IGFscmVhZHkgbG9hZGVkLCBsaXZlYXBwIHdpbGwgbG9hZCB0aGUgdGFibGUgd2l0aFxuICAgICAgICAgICAgLy8gdGhhdCB2aWV3J3MgZGF0YSBpbiBhIHNpbmdsZSByZXF1ZXN0LlxuICAgICAgICAgICAgLy8gVE9ETyhrYXNyYSk6IGltcHJvdmUgdGhpcyBieSBtb3ZpbmcgdGhpcyBsb2dpYyBpbnRvIGxpdmVhcHAgc29cbiAgICAgICAgICAgIC8vIGl0IGNhbiBiYXRjaCBtdWx0aXBsZSB2aWV3IGFuZCB0YWJsZSBsb2Fkcy5cbiAgICAgICAgICAgIGZvciAoY29uc3Qge3dhdGNoYWJsZSwgd3JhcHBlZFdhdGNoQ29uZmlnc30gb2YgdS52YWx1ZXModmlld3NUb1dhdGNoQnlJZCkpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHdyYXBwZWRXYXRjaENvbmZpZyBvZiB3cmFwcGVkV2F0Y2hDb25maWdzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHt3YXRjaENvbmZpZywgd3JhcHBlZENhbGxiYWNrfSA9IHdyYXBwZWRXYXRjaENvbmZpZztcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5OiBhbnkgPSB3YXRjaENvbmZpZy5rZXk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZmxvd3R5cGUvbm8td2Vhay10eXBlc1xuICAgICAgICAgICAgICAgICAgICB3YXRjaGFibGUud2F0Y2goa2V5LCB3cmFwcGVkQ2FsbGJhY2ssIHdhdGNoQ29uZmlnLmNvbnRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3Qge3dhdGNoYWJsZSwgd3JhcHBlZFdhdGNoQ29uZmlnc30gb2YgdS52YWx1ZXModGFibGVzVG9XYXRjaEJ5SWQpKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB3cmFwcGVkV2F0Y2hDb25maWcgb2Ygd3JhcHBlZFdhdGNoQ29uZmlncykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7d2F0Y2hDb25maWcsIHdyYXBwZWRDYWxsYmFja30gPSB3cmFwcGVkV2F0Y2hDb25maWc7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleTogYW55ID0gd2F0Y2hDb25maWcua2V5OyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGZsb3d0eXBlL25vLXdlYWstdHlwZXNcbiAgICAgICAgICAgICAgICAgICAgd2F0Y2hhYmxlLndhdGNoKGtleSwgd3JhcHBlZENhbGxiYWNrLCB3YXRjaENvbmZpZy5jb250ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgX3JlbW92ZVdhdGNoZXNGb3JXcmFwcGVkV2F0Y2hDb25maWdzKFxuICAgICAgICAgICAgd3JhcHBlZFdhdGNoQ29uZmlnc1RvUmVtb3ZlOiBBcnJheTxXcmFwcGVkV2F0Y2hDb25maWc+LFxuICAgICAgICApIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qge3dhdGNoQ29uZmlnLCB3cmFwcGVkQ2FsbGJhY2t9IG9mIHdyYXBwZWRXYXRjaENvbmZpZ3NUb1JlbW92ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHt3YXRjaGFibGUsIGtleSwgY29udGV4dH0gPSB3YXRjaENvbmZpZztcbiAgICAgICAgICAgICAgICB3YXRjaGFibGUudW53YXRjaChrZXksIHdyYXBwZWRDYWxsYmFjaywgY29udGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgX3dhdGNoQWxsKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9kYXRhQ29udGFpbmVySXNNb3VudGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBuZXdXYXRjaENvbmZpZ3MgPSB0aGlzLl9nZW5lcmF0ZVdhdGNoQ29uZmlncygpO1xuICAgICAgICAgICAgY29uc3QgbmV3V3JhcHBlZFdhdGNoQ29uZmlncyA9IG5ld1dhdGNoQ29uZmlncy5tYXAod2F0Y2hDb25maWcgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl93cmFwV2F0Y2hDb25maWcod2F0Y2hDb25maWcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9hZGRXYXRjaGVzRm9yV3JhcHBlZFdhdGNoQ29uZmlncyhuZXdXcmFwcGVkV2F0Y2hDb25maWdzKTtcbiAgICAgICAgICAgIHRoaXMuX3dyYXBwZWRXYXRjaENvbmZpZ3MgPSBuZXdXcmFwcGVkV2F0Y2hDb25maWdzO1xuICAgICAgICB9XG4gICAgICAgIF91bndhdGNoQWxsKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9kYXRhQ29udGFpbmVySXNNb3VudGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5fd3JhcHBlZFdhdGNoQ29uZmlncykge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZVdhdGNoZXNGb3JXcmFwcGVkV2F0Y2hDb25maWdzKHRoaXMuX3dyYXBwZWRXYXRjaENvbmZpZ3MpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3dyYXBwZWRXYXRjaENvbmZpZ3MgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIF9pbnZva2VGb3JjZVVwZGF0ZSgpIHtcbiAgICAgICAgICAgIC8vIENhbGwgZm9yY2VVcGRhdGUgd2l0aG91dCBhbnkgYXJncy5cbiAgICAgICAgICAgIC8vIFRPRE8oa2FzcmEpOiBzaG91bGQgdGhpcyBkZWJvdW5jZSwgaW4gY2FzZSB0aGVyZSBhcmUgbWFueSBldmVudHMgaW4gb25lIGZyYW1lP1xuICAgICAgICAgICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgIGlmIChDb21wb25lbnRDbGFzcykge1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIDxDb21wb25lbnRDbGFzc1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBpbmNvbXBhdGlibGUgd2l0aCB0aGUgZmxvdyBkZWZpbml0aW9uIGZvciB0aGUgUmVhY3QgMTYgY3JlYXRlUmVmIEFQSS5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZsb3ctZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZj17dGhpcy5fYm91bmRTZXRXcmFwcGVkQ29tcG9uZW50UmVmfVxuICAgICAgICAgICAgICAgICAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gU3RhdGVsZXNzIGZ1bmN0aW9uYWwgY29tcG9uZW50LlxuICAgICAgICAgICAgICAgIHJldHVybiA8Q29tcG9uZW50IHsuLi50aGlzLnByb3BzfSAvPjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwYXNzdGhydU1ldGhvZE5hbWVzKSB7XG4gICAgICAgIC8vIExldCdzIGF1Z21lbnQgdGhlIGRhdGEgY29udGFpbmVyJ3MgcHJvdG90eXBlIHRvIGhhdmUgbWV0aG9kcyB0aGF0IHBhc3MgdGhyb3VnaFxuICAgICAgICAvLyB0byB0aGUgd3JhcHBlZCBjb21wb25lbnQuXG4gICAgICAgIGZvciAoY29uc3QgcGFzc3RocnVNZXRob2ROYW1lIG9mIHBhc3N0aHJ1TWV0aG9kTmFtZXMpIHtcbiAgICAgICAgICAgIC8vIGZsb3ctZGlzYWJsZS1uZXh0LWxpbmVcbiAgICAgICAgICAgIERhdGFDb250YWluZXIucHJvdG90eXBlW3Bhc3N0aHJ1TWV0aG9kTmFtZV0gPSBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fd3JhcHBlZENvbXBvbmVudFtwYXNzdGhydU1ldGhvZE5hbWVdKGFyZ3MpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGZvciBkZXZlbG9wZXIgZWFzZSwgd2UgcmV0dXJuIHRoZSBleGFjdCB0eXBlIG9mIHRoZSB3cmFwcGVkIGNvbXBvbmVudCByYXRoZXJcbiAgICAvLyB0aGFuIGEgbmV3IGNvbXBvbmVudC4gdGhpcyBpcyBzbGlnaHRseSBpbmNvcnJlY3QgLSBhbnkgbWV0aG9kcyBub3QgbGlzdGVkIGluXG4gICAgLy8gcGFzc3RocnVNZXRob2ROYW1lcyB3b250IGJlIGF2YWlsYWJsZSwgYWx0aG91Z2ggZmxvdyB3aWxsIHRoaW5rIHRoZXkgZXhpc3QuXG4gICAgLy8gZmxvdy1kaXNhYmxlLW5leHQtbGluZVxuICAgIHJldHVybiBEYXRhQ29udGFpbmVyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVEYXRhQ29udGFpbmVyO1xuIl19