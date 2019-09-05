// @flow
/* eslint-disable no-console */
const EventEmitter = require('events');
const invariant = require('invariant');
const fs = require('fs');
const fsUtils = require('../fs_utils');
const path = require('path');
const {groupBy} = require('lodash');
const {BlockBuilderStatuses} = require('../types/block_builder_state_data_types');
const {RESULT_OK} = require('../types/result');

import type {BlockBuildType} from '../types/block_build_types';
import type {BlockBuilderStateData} from '../types/block_builder_state_data_types';
import type {Result} from '../types/result';
import type {ErrorWithCode, TranspileError} from '../types/error_codes';

const JobActions = Object.freeze({
    TRANSPILE_OR_UNLINK: ('transpileOrUnlink': 'transpileOrUnlink'),
    BUNDLE: ('bundle': 'bundle'),
});

type TranspileOrUnlinkBuildJob = {|
    action: typeof JobActions.TRANSPILE_OR_UNLINK,
    eventType: 'add' | 'addDir' | 'change' | 'unlink',
    fileOrDirPath: string,
    fsStatsIfExists: fs.Stats | null,
|};

type BundleBuildJob = {|
    action: typeof JobActions.BUNDLE,
|};

type BuildJob = TranspileOrUnlinkBuildJob | BundleBuildJob;

type TranspileOrCopyAsyncFn = (
    fileOrDirectoryPath: string,
    stats?: fs.Stats | null,
) => Promise<Result<string, TranspileError>>;
type GenerateFrontendBundleAsyncFn = () => Promise<Result<void, ErrorWithCode>>;
type QueueConsumerArgs = {|
    outputUserTranspiledDirPath: string,
    transpileOrCopyAsyncFn: TranspileOrCopyAsyncFn,
    generateFrontendBundleAsyncFn: GenerateFrontendBundleAsyncFn,
|};

const QUEUE_CONSUMER_LOOP_TIMER_DELAY_MS = 200;
const BUNDLE_JOB_TIMER_DELAY_MS = 200;

class BlockBuilderJobQueue extends EventEmitter {
    _buildTypeMode: BlockBuildType;
    _buildJobQueue: Array<BuildJob>;
    _blockBuilderStateData: BlockBuilderStateData;
    _transpileErrorByFilePath: Map<string, TranspileError>;
    _bundleErrorIfExists: ErrorWithCode | null;
    // The flow type for _buildJobQueueConsumerTimerIfExists should be node's native Timeout
    // class but flow type definitions are missing for the Timeout class.
    // - docs: https://nodejs.org/api/timers.html#timers_class_timeout)
    // - bug: https://github.com/facebook/flow/issues/3480
    _buildJobQueueConsumerTimerIfExists: Object | null;
    _didInitialBundleRunSuccessfully: boolean;

    constructor(buildTypeMode: BlockBuildType) {
        super();
        this._buildTypeMode = buildTypeMode;
        this._buildJobQueue = [];
        this._transpileErrorByFilePath = new Map();
        this._bundleErrorIfExists = null;
        this._blockBuilderStateData = {status: BlockBuilderStatuses.START};
        this._buildJobQueueConsumerTimerIfExists = null;
        this._didInitialBundleRunSuccessfully = false;
    }

    static JOB_ACTIONS = JobActions;

    get blockBuilderStateData(): BlockBuilderStateData {
        return this._blockBuilderStateData;
    }
    enqueue(job: BuildJob): void {
        this._buildJobQueue.push(job);
    }
    startQueueConsumerLoop(args: QueueConsumerArgs): void {
        if (this._buildJobQueueConsumerTimerIfExists === null) {
            this._buildJobQueueConsumerTimerIfExists = setTimeout(
                this._queueConsumerLoopAsync.bind(this, args),
                QUEUE_CONSUMER_LOOP_TIMER_DELAY_MS,
            );
        }
    }
    stopQueueConsumerLoop(): void {
        if (this._buildJobQueueConsumerTimerIfExists !== null) {
            clearTimeout(this._buildJobQueueConsumerTimerIfExists);
            this._buildJobQueueConsumerTimerIfExists = null;
        }
    }
    async _queueConsumerLoopAsync(args: QueueConsumerArgs): Promise<void> {
        const {transpileOrCopyAsyncFn, generateFrontendBundleAsyncFn} = args;

        if (this._buildJobQueue.length === 0) {
            this._buildJobQueueConsumerTimerIfExists = setTimeout(
                this._queueConsumerLoopAsync.bind(this, args),
                QUEUE_CONSUMER_LOOP_TIMER_DELAY_MS,
            );
            return;
        }
        // Copy all elements of the queue for processing, and clear out the queue.
        const currentQueueCopy = this._buildJobQueue.splice(0, this._buildJobQueue.length);

        const jobsByAction = groupBy(currentQueueCopy, job => job.action);
        const transpileOrUnlinkJobs: Array<TranspileOrUnlinkBuildJob> = ((jobsByAction[
            JobActions.TRANSPILE_OR_UNLINK
        ]: any): Array<TranspileOrUnlinkBuildJob>); // eslint-disable-line flowtype/no-weak-types

        if (transpileOrUnlinkJobs && transpileOrUnlinkJobs.length > 0) {
            if (this._blockBuilderStateData.status !== BlockBuilderStatuses.BUILDING) {
                let buildingResolve;
                const buildingPromise = new Promise((resolve, reject) => {
                    buildingResolve = resolve;
                });
                invariant(buildingResolve, 'buildingResolve');
                this._blockBuilderStateData = {
                    status: BlockBuilderStatuses.BUILDING,
                    promise: buildingPromise,
                    resolvePromise: buildingResolve,
                };
            }

            await this._processTranspileAndUnlinkJobsAsync(
                args.outputUserTranspiledDirPath,
                transpileOrUnlinkJobs,
                transpileOrCopyAsyncFn,
            );

            // After transpilation, always enqueue a `BUNDLE` job with a timer to help with reliably
            // resolving the `buildingPromise`. Reasons:
            // 1. We cannot reliably determine if transpilation was for backend or frontend files.
            // 2. Backend file changes do not trigger a `BUNDLE` job, whereas frontend file changes
            //    trigger a `BUNDLE` job. But because we cannot reliably detect if a backend or
            //    frontend file changed/transpiled, we need some mechanism for consistently
            //    resolving the `buildingPromise`.
            // 3. By always enqueuing a `BUNDLE` job after transpilation, we can handle the case for
            //    when only backend files changed because we can now resolve the `buildingPromise`
            //    if a `BUNDLE` job should be processed and this._blockBuilderStateData is currently
            //    in BUILDING state.
            // 4. By enqueuing after some timeout, we handle race conditions with watchify for
            //    frontend code changes; if the BUNDLE job enqueued by watchify executes first, then
            //    the `BUNDLE` job enqueued here will be de-duplicated or appropriately ignored
            //    because this._blockBuilderStateData will have transitioned to a "terminal" state
            //    of READY or ERROR, thus allowing the `shouldBundle` logic below to ignore
            //    the `BUNDLE`.
            // 5. This also guarantees that `browserify.bundle()` is successfully called at least
            //    once after initial startup.
            // NOTES:
            //  - If there were any transpilation errors, the `shouldBundle` logic below will
            //    correctly skip the `BUNDLE` job because we would've transitioned to the terminal
            //    ERROR state.
            //  - Any duplicate `BUNDLE` jobs that are enqueued in the same loop are de-duplicated.
            setTimeout(() => {
                this.enqueue({
                    action: BlockBuilderJobQueue.JOB_ACTIONS.BUNDLE,
                });
            }, BUNDLE_JOB_TIMER_DELAY_MS);
        }

        const bundleJobs = jobsByAction[JobActions.BUNDLE];
        const shouldBundle =
            bundleJobs &&
            bundleJobs.length > 0 &&
            this._blockBuilderStateData.status === BlockBuilderStatuses.BUILDING &&
            this._transpileErrorByFilePath.size === 0;
        if (shouldBundle) {
            const frontendBundleResult = await this._processFrontendBundleJobAsync(
                generateFrontendBundleAsyncFn,
            );
            this._bundleErrorIfExists = frontendBundleResult.err ? frontendBundleResult.err : null;
        }

        this._onBuildLoopComplete(shouldBundle);

        // Use recursive timeouts to loop with a very small delay (as opposed to on
        // QUEUE_CONSUMER_LOOP_TIMER_DELAY_MS delay) because we want the next loop to more
        // "immediately" process the queue for more items.
        // For example, in a typical `TRANSPILE_OR_UNLINK` -> `BUNDLE` cycle, the `BUNDLE` job will
        // actually be processed on a loop after the `TRANSPILE_OR_UNLINK`.
        this._buildJobQueueConsumerTimerIfExists = setTimeout(
            this._queueConsumerLoopAsync.bind(this, args),
            10,
        );
    }
    async _processTranspileAndUnlinkJobsAsync(
        outputUserTranspiledDirPath: string,
        transpileOrUnlinkJobs: Array<TranspileOrUnlinkBuildJob>,
        transpileOrCopyAsyncFn: TranspileOrCopyAsyncFn,
    ): Promise<void> {
        const jobsByFilePath = groupBy(transpileOrUnlinkJobs, job => job.fileOrDirPath);

        const filesToTranspilePromises: Array<Promise<Result<string, TranspileError>>> = [];
        const filesToUnlinkPromises: Array<Promise<void>> = [];
        for (const [fileOrDirPath, listOfBuildJobs] of Object.entries(jobsByFilePath)) {
            const listOfTranspileOrUnlinkBuildJobs = ((listOfBuildJobs: any): Array<TranspileOrUnlinkBuildJob>); // eslint-disable-line flowtype/no-weak-types
            const fsStats = listOfTranspileOrUnlinkBuildJobs[0].fsStatsIfExists;
            const chokidarEvents = listOfTranspileOrUnlinkBuildJobs.map(
                jobArgs => jobArgs.eventType,
            );
            const lastChokidarEvent = chokidarEvents[chokidarEvents.length - 1];

            switch (lastChokidarEvent) {
                case 'add':
                case 'addDir':
                case 'change':
                    filesToTranspilePromises.push(transpileOrCopyAsyncFn(fileOrDirPath, fsStats));
                    break;

                case 'unlink': {
                    // TODO(richsinn): Removing the file does not re-trigger a bundle. Investigate.
                    const filePathToUnlink = path.join(outputUserTranspiledDirPath, fileOrDirPath);
                    filesToUnlinkPromises.push(fsUtils.removeAsync(filePathToUnlink));
                    break;
                }

                default:
                    throw new Error(`unsupported chokidarEvent: ${lastChokidarEvent}`);
            }
        }

        const transpileResults = await Promise.all(filesToTranspilePromises);
        for (const transpileResult of transpileResults) {
            if (transpileResult.err) {
                this._transpileErrorByFilePath.set(
                    transpileResult.err.filePath,
                    transpileResult.err,
                );
            } else {
                this._transpileErrorByFilePath.delete(transpileResult.value);
            }
        }

        await Promise.all(filesToUnlinkPromises);
    }
    async _processFrontendBundleJobAsync(
        generateFrontendBundleAsyncFn: GenerateFrontendBundleAsyncFn,
    ): Promise<Result<void, ErrorWithCode>> {
        const result = await generateFrontendBundleAsyncFn();

        if (result.err) {
            return {err: result.err};
        }

        if (!this._didInitialBundleRunSuccessfully) {
            this._didInitialBundleRunSuccessfully = true;
            this.emit('initialBundleSuccessfullyCompleted');
        }

        return RESULT_OK;
    }
    /**
     * TODO(richsinn): Make this into a FSM-like implementation.
     */
    _onBuildLoopComplete(shouldBundle: boolean): void {
        const buildingResolve =
            this._blockBuilderStateData.status === BlockBuilderStatuses.BUILDING
                ? this._blockBuilderStateData.resolvePromise
                : () => {};

        if (this._bundleErrorIfExists !== null || this._transpileErrorByFilePath.size > 0) {
            this._blockBuilderStateData = {
                status: BlockBuilderStatuses.ERROR,
                bundleErr: this._bundleErrorIfExists,
                transpileErrs: [...this._transpileErrorByFilePath.values()],
            };
            this.emit('buildComplete');
            buildingResolve();
        } else if (shouldBundle) {
            this._blockBuilderStateData = {status: BlockBuilderStatuses.READY};
            this.emit('buildComplete');
            buildingResolve();
        } else {
            // no-op
        }
    }
}

module.exports = BlockBuilderJobQueue;
