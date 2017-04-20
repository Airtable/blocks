// @flow
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
type Dependency = {watch: ?Watchable<any>, key: string | Array<string>, callback?: Function}; // eslint-disable-line flowtype/no-weak-types
type WatchConfig = {
    watchable: Watchable<any>, // eslint-disable-line flowtype/no-weak-types
    key: string | Array<string>,
    callback: Function,
    context: any, // eslint-disable-line flowtype/no-weak-types
};

// Returns a HOC component that will watch and unwatch the specified watchable objects.
// Usage:
//    const FooWithData = createDataContainer(Foo, getDependencies(props) {
//        // This should return an array of dependency objects:
//        return [
//            // Will call forceUpdate when table name changes.
//            {watch: props.table, key: 'name'},
//
//            // Will call this._onFieldsChange when table fields change.
//            {watch: props.table, key: 'fields', callback: Foo.prototype._onFieldsChange},
//        ];
//    });
//
// Foo can either be a stateful React component class, or a stateless functional
// component.
//
// The getDependencies function will be invoked on componentDidMount and
// whenever props shallowly change.
function createDataContainer<Props>(Component: ReactClass<Props>, getDependencies: (props: Props) => Array<?Dependency>): ReactClass<{}> {
    const ComponentClass = getReactComponent(Component);
    const componentName = getComponentName(Component);

    class DataContainer extends React.Component {
        static displayName = `DataContainer(${componentName})`;
        _wrappedComponent: ?React$Component<any, Props, any>; // eslint-disable-line flowtype/no-weak-types
        _watchConfigs: ?Array<WatchConfig>;
        componentDidMount() {
            this._watchAll();
            this._shouldUpdateDependenciesOnComponentDidUpdate = false;
        }
        componentWillReceiveProps(newProps: Object) {
            const shouldUpdateDependencies = !utils.isObjectShallowEqual(this.props, newProps);
            if (shouldUpdateDependencies) {
                this._unwatchAll();
                this._shouldUpdateDependenciesOnComponentDidUpdate = true;
            }
        }
        componentDidUpdate() {
            if (this._shouldUpdateDependenciesOnComponentDidUpdate) {
                this._watchAll();
                this._shouldUpdateDependenciesOnComponentDidUpdate = false;
            }
        }
        componentWillUnmount() {
            this._unwatchAll();
        }
        _watchAll() {
            const newWatchConfigs = [];
            const dependencies = getDependencies(this.props);
            const viewsToWatchById: {[key: string]: {
                watchable: View,
                watchConfigs: Array<WatchConfig>,
            }} = {};
            const tablesToWatchById: {[key: string]: {
                watchable: Table,
                watchConfigs: Array<WatchConfig>,
            }} = {};
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
                        newWatchConfigs.push(watchConfig);

                        // See hack below for why we special case View and Table.
                        if (watchable instanceof View) {
                            if (!viewsToWatchById[watchable.id]) {
                                viewsToWatchById[watchable.id] = {watchable, watchConfigs: []};
                            }
                            viewsToWatchById[watchable.id].watchConfigs.push(watchConfig);
                        } else if (watchable instanceof Table) {
                            if (!tablesToWatchById[watchable.id]) {
                                tablesToWatchById[watchable.id] = {watchable, watchConfigs: []};
                            }
                            tablesToWatchById[watchable.id].watchConfigs.push(watchConfig);
                        } else {
                            watchable.watch(key, callback, context);
                        }
                    }
                }
            }
            this._watchConfigs = newWatchConfigs;

            // HACK: we want to fetch view data *before* fetching table data.
            // This minimizes the number of network requests: if the parent table
            // for a view isn't already loaded, liveapp will load the table with
            // that view's data in a single request.
            // TODO(kasra): improve this by moving this logic into liveapp so
            // it can batch multiple view and table loads.
            for (const {watchable, watchConfigs} of utils.iterateValues(viewsToWatchById)) {
                for (const watchConfig of watchConfigs) {
                    const key: any = watchConfig.key; // eslint-disable-line flowtype/no-weak-types
                    watchable.watch(key, watchConfig.callback, watchConfig.context);
                }
            }
            for (const {watchable, watchConfigs} of utils.iterateValues(tablesToWatchById)) {
                for (const watchConfig of watchConfigs) {
                    const key: any = watchConfig.key; // eslint-disable-line flowtype/no-weak-types
                    watchable.watch(key, watchConfig.callback, watchConfig.context);
                }
            }
        }
        _unwatchAll() {
            if (this._watchConfigs) {
                for (const {watchable, key, callback, context} of this._watchConfigs) {
                    watchable.unwatch(key, callback, context);
                }
                this._watchConfigs = null;
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

    return DataContainer;
}

module.exports = createDataContainer;
