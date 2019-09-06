// @flow
import type {PromiseResolveFunction} from './promise_types';
import type {ErrorWithCode, TranspileError} from './error_codes';

const BlockBuilderStatuses = Object.freeze({
    START: ('start': 'start'),
    BUILDING: ('building': 'building'),
    READY: ('ready': 'ready'),
    ERROR: ('error': 'error'),
});

type BlockBuilderStateStart = {|
    status: typeof BlockBuilderStatuses.START,
|};

type BlockBuilderStateBuilding = {
    status: typeof BlockBuilderStatuses.BUILDING,
    promise: Promise<void>,
    resolvePromise: PromiseResolveFunction<void>,
};

type BlockBuilderStateReady = {|status: typeof BlockBuilderStatuses.READY|};

type BlockBuilderStateError = {
    status: typeof BlockBuilderStatuses.ERROR,
    transpileErrs?: Array<TranspileError>,
    bundleErr?: ErrorWithCode | null,
};

export type BlockBuilderStateData =
    | BlockBuilderStateStart
    | BlockBuilderStateBuilding
    | BlockBuilderStateReady
    | BlockBuilderStateError;

module.exports = {
    BlockBuilderStatuses,
};
