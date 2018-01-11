// @flow
const {h, u} = require('client_server_shared/hu');
const React = require('client/blocks/sdk/ui/react');
const utils = require('client/blocks/sdk/utils');
const Watchable = require('client/blocks/sdk/watchable');
const Table = require('client/blocks/sdk/models/table');
const View = require('client/blocks/sdk/models/view');

// These helper functions were taken from
// https://github.com/facebook/relay/blob/e918103/src/container/RelayContainerUtils.js
function isReactComponent(component: mixed): boolean {
    return !!(
        component &&
        typeof component.prototype === 'object' &&
        component.prototype &&
        component.prototype.isReactComponent
    );
}
function getReactComponent(
    Component: ReactClass<any> // eslint-disable-line flowtype/no-weak-types
): ?ReactClass<any> { // eslint-disable-line flowtype/no-weak-types
    if (isReactComponent(Component)) {
        return (Component: any); // eslint-disable-line flowtype/no-weak-types
    } else {
        return null;
    }
}
function getComponentName(Component: ReactClass<mixed>): string {
    let name;
    const ComponentClass = getReactComponent(Component);
    if (ComponentClass) {
        name = ComponentClass.displayName || ComponentClass.name;
    } else if (typeof Component === 'function') {
        // This is a stateless functional component.
        name = Component.displayName || Component.name || 'StatelessComponent';
    } else {
        name = 'ReactElement';
    }
    return name;
}

// Using 'watch' as a key is kind of strange from an internal perspective, but is
// actually a kind of nice declarative format for when you are consuming the sdk,
// so we'll tolerate the weirdness internally.
export type WatchDependency = {watch: ?Watchable<any>, key: string | Array<string>, callback?: Function}; // eslint-disable-line flowtype/no-weak-types
type WatchConfig = {
    watchable: Watchable<any>, // eslint-disable-line flowtype/no-weak-types
    key: string | Array<string>,
    callback: Function,
    context: any, // eslint-disable-line flowtype/no-weak-types
};

type WrappedWatchConfig = {
    watchConfig: WatchConfig,
    wrappedCallback: Function,
};

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
function createDataContainer<Props>(Component: ReactClass<Props>, getDependencies: (props: Props) => Array<?WatchDependency>, passthruMethodNames: ?Array<string>): ReactClass<{}> {
    const ComponentClass = getReactComponent(Component);
    const componentName = getComponentName(Component);

    type ComponentWithProps = React$Component<any, Props, any>; // eslint-disable-line flowtype/no-weak-types

    class DataContainer extends React.Component {
        static displayName = `DataContainer(${componentName})`;
        _wrappedComponent: ?ComponentWithProps;
        _wrappedWatchConfigs: ?Array<WrappedWatchConfig>;

        // NOTE: we use this flag to make sure that we never add watches for an
        // unmounted component. Usually, we shouldn't have to worry about this,
        // but it's possible that in response to an event trigger that this and
        // another component are both listening to, this component gets unmounted
        // before we call the callback for this component.
        _dataContainerIsMounted: boolean;
        componentDidMount() {
            // NOTE: make sure this is the first thing we do here, since all of the
            // functions that deal with watches check this flag.
            this._dataContainerIsMounted = true;

            this._watchAll();
            this._shouldUpdateDependenciesOnComponentDidUpdate = false;
        }
        componentWillUnmount() {
            this._unwatchAll();

            // NOTE: make sure this is the last thing we do here, since all of the
            // functions that deal with watches check this flag.
            // i.e. the _unwatchAll call above checks that the component is still
            // mounted.
            this._dataContainerIsMounted = false;
        }
        componentWillReceiveProps(newProps: Object) {
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
        _areWatchConfigsEqual(a: WatchConfig, b: WatchConfig): boolean {
            return a.watchable === b.watchable &&
                a.callback === b.callback &&
                a.context === b.context &&
                u.isEqual(a.key, b.key);
        }
        _wrapCallback(context: ?ComponentWithProps, unwrappedCallback: Function): Function {
            return (...callbackArguments) => {
                if (!this._dataContainerIsMounted) {
                    return;
                }

                // Reevaluate our watches, since watches may change in response
                // to this event firing.
                this._recomputeDependencies();

                unwrappedCallback.call(context, ...callbackArguments);
            };
        }
        _wrapWatchConfig(watchConfig: WatchConfig): WrappedWatchConfig {
            return {
                watchConfig,
                wrappedCallback: this._wrapCallback(watchConfig.context, watchConfig.callback),
            };
        }
        _diffWatchConfigs(newWatchConfigs: Array<WatchConfig>, oldWrappedWatchConfigs: Array<WrappedWatchConfig>): {
            wrappedWatchConfigsToAdd: Array<WrappedWatchConfig>,
            wrappedWatchConfigsToRemove: Array<WrappedWatchConfig>,
            resultingWrappedWatchConfigs: Array<WrappedWatchConfig>,
        } {
            const wrappedWatchConfigsToAdd = [];
            const wrappedWatchConfigsToRemove = [];
            const resultingWrappedWatchConfigs = [];

            // NOTE: this assumes that the order of the watch configs does not change,
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
                    wrappedWatchConfigsToRemove.push(oldWrappedWatchConfig);

                    // Since we're adding a brand new watch config, we need to wrap it.
                    const newWrappedWatchConfig = this._wrapWatchConfig(newWatchConfig);
                    wrappedWatchConfigsToAdd.push(newWrappedWatchConfig);
                    resultingWrappedWatchConfigs.push(newWrappedWatchConfig);
                } else {
                    // No need to wrap this watch config, since it's already wrapped. We're
                    // just keeping it from the original wrapped watch configs.
                    resultingWrappedWatchConfigs.push(oldWrappedWatchConfig);
                }
            }

            // Add the rest of the longer array (if applicable).
            if (newWatchConfigs.length > oldWrappedWatchConfigs.length) {
                // Same as above. Since we're adding brand new watch configs, we need to
                // wrap them here.
                const newWrappedWatchConfigs = newWatchConfigs.slice(minLength).map(watchConfig => {
                    return this._wrapWatchConfig(watchConfig);
                });
                wrappedWatchConfigsToAdd.push(...newWrappedWatchConfigs);

                // Also add any new configs that we're watching to the result array.
                resultingWrappedWatchConfigs.push(...newWrappedWatchConfigs);
            } else if (oldWrappedWatchConfigs.length > newWatchConfigs.length) {
                wrappedWatchConfigsToRemove.push(...oldWrappedWatchConfigs.slice(minLength));
            }

            return {
                wrappedWatchConfigsToAdd,
                wrappedWatchConfigsToRemove,
                resultingWrappedWatchConfigs,
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
            this._addWatchesForWrappedWatchConfigs(diffObj.wrappedWatchConfigsToAdd);

            // NOTE: Rather than just setting this to newWatchConfigs, we want to
            // use the resulting watch configs returned in the diffObj. This is because
            // new wrapped callbacks that were created in _generateWatchConfigs will
            // not be equal to the callbacks that we actually used to watch things.
            this._wrappedWatchConfigs = diffObj.resultingWrappedWatchConfigs;
        }
        _generateWatchConfigs(): Array<WatchConfig> {
            const watchConfigs = [];
            const dependencies = getDependencies(this.props);
            // TODO(kasra): do runtime checks for the value of `dependencies`
            // to make sure it comforms with its flow type. If it doesn't,
            // show a helpful error message to the block developer.
            if (dependencies) {
                for (const dependency of dependencies) {
                    const watchable = dependency && dependency.watch;
                    if (dependency && watchable) {
                        const {key} = dependency;
                        let callback = dependency.callback;
                        let context;
                        if (callback) {
                            context = this._wrappedComponent;
                        } else {
                            callback = this._invokeForceUpdate;
                            context = this; // eslint-disable-line consistent-this
                        }
                        const watchConfig: WatchConfig = {watchable, key, callback, context};
                        watchConfigs.push(watchConfig);
                    }
                }
            }
            return watchConfigs;
        }
        _addWatchesForWrappedWatchConfigs(wrappedWatchConfigsToAdd: Array<WrappedWatchConfig>) {
            const viewsToWatchById: {[string]: {
                watchable: View,
                wrappedWatchConfigs: Array<WrappedWatchConfig>,
            }} = {};
            const tablesToWatchById: {[string]: {
                watchable: Table,
                wrappedWatchConfigs: Array<WrappedWatchConfig>,
            }} = {};

            for (const wrappedWatchConfig of wrappedWatchConfigsToAdd) {
                const {watchConfig, wrappedCallback} = wrappedWatchConfig;
                const {watchable, key, context} = watchConfig;
                // See hack below for why we special case View and Table.
                if (watchable instanceof View) {
                    if (!viewsToWatchById[watchable.id]) {
                        viewsToWatchById[watchable.id] = {watchable, wrappedWatchConfigs: []};
                    }
                    viewsToWatchById[watchable.id].wrappedWatchConfigs.push(wrappedWatchConfig);
                } else if (watchable instanceof Table) {
                    if (!tablesToWatchById[watchable.id]) {
                        tablesToWatchById[watchable.id] = {watchable, wrappedWatchConfigs: []};
                    }
                    tablesToWatchById[watchable.id].wrappedWatchConfigs.push(wrappedWatchConfig);
                } else {
                    watchable.watch(key, wrappedCallback, context);
                }
            }

            // HACK: we want to fetch view data *before* fetching table data.
            // This minimizes the number of network requests: if the parent table
            // for a view isn't already loaded, liveapp will load the table with
            // that view's data in a single request.
            // TODO(kasra): improve this by moving this logic into liveapp so
            // it can batch multiple view and table loads.
            for (const {watchable, wrappedWatchConfigs} of utils.iterateValues(viewsToWatchById)) {
                for (const wrappedWatchConfig of wrappedWatchConfigs) {
                    const {watchConfig, wrappedCallback} = wrappedWatchConfig;
                    const key: any = watchConfig.key; // eslint-disable-line flowtype/no-weak-types
                    watchable.watch(key, wrappedCallback, watchConfig.context);
                }
            }
            for (const {watchable, wrappedWatchConfigs} of utils.iterateValues(tablesToWatchById)) {
                for (const wrappedWatchConfig of wrappedWatchConfigs) {
                    const {watchConfig, wrappedCallback} = wrappedWatchConfig;
                    const key: any = watchConfig.key; // eslint-disable-line flowtype/no-weak-types
                    watchable.watch(key, wrappedCallback, watchConfig.context);
                }
            }
        }
        _removeWatchesForWrappedWatchConfigs(wrappedWatchConfigsToRemove: Array<WrappedWatchConfig>) {
            for (const {watchConfig, wrappedCallback} of wrappedWatchConfigsToRemove) {
                const {watchable, key, context} = watchConfig;
                watchable.unwatch(key, wrappedCallback, context);
            }
        }
        _watchAll() {
            if (!this._dataContainerIsMounted) {
                return;
            }

            const newWatchConfigs = this._generateWatchConfigs();
            const newWrappedWatchConfigs = newWatchConfigs.map(watchConfig => {
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
                return (
                    <ComponentClass
                        ref={el => this._wrappedComponent = el}
                        {...this.props}
                    />
                );
            } else {
                // Stateless functional component.
                return <Component {...this.props} />;
            }
        }
    }

    if (passthruMethodNames) {
        // Let's augment the data container's prototype to have methods that pass through
        // to the wrapped component.
        for (const passthruMethodName of passthruMethodNames) {
            DataContainer.prototype[passthruMethodName] = function(...args) {
                this._wrappedComponent[passthruMethodName](args);
            };
        }
    }

    return DataContainer;
}

module.exports = createDataContainer;
