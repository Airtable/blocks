import {ReleaseBundleOptions, ReleaseTaskConsumer} from './release';
import {
    BuildState,
    RunDevServerOptions,
    BuildStateBuilding,
    BuildStateBuilt,
    BuildStateError,
    BuildStateStart,
    BuildStatus,
    RunDevServerMethods,
    RunTaskConsumer,
} from './run';

export {
    ReleaseBundleOptions,
    ReleaseTaskConsumer,
    BuildState,
    RunDevServerOptions,
    BuildStateBuilding,
    BuildStateBuilt,
    BuildStateError,
    BuildStateStart,
    BuildStatus,
    RunDevServerMethods,
    RunTaskConsumer,
};

export interface BundlerTaskConsumer extends RunTaskConsumer, ReleaseTaskConsumer {}
