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
import {SubmitFindDependenciesOptions, SubmitFoundDependencies, SubmitTaskConsumer} from './submit';

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
    SubmitFindDependenciesOptions,
    SubmitFoundDependencies,
    SubmitTaskConsumer,
};

export interface BundlerTaskConsumer
    extends ReleaseTaskConsumer,
        RunTaskConsumer,
        SubmitTaskConsumer {}
