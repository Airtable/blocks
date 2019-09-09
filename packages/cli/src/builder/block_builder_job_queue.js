// @flow
/* eslint-disable no-console */
const EventEmitter = require('events');
const invariant = require('invariant');
const fs = require('fs');
const {groupBy} = require('lodash');
const {BlockBuilderStatuses} = require('../types/block_builder_state_data_types');
const {RESULT_OK} = require('../types/result');

import type {BlockBuildType} from '../types/block_build_types';
import type {BlockBuilderStateData} from '../types/block_builder_state_data_types';
import type {Result} from '../types/result';
import type {PromiseResolveFunction} from '../types/promise_types';
import type {ErrorWithCode, TranspileError} from '../types/error_codes';

const JobActions = Object.freeze({
    TRANSPILE_OR_UNLINK: ('transpileOrUnlink': 'transpileOrUnlink'),
    BUNDLE: ('bundle': 'bundle'),
});

type TranspileOrUnlinkBuildJob = {|
    eventType: 'add' | 'addDir' | 'change' | 'unlink',
    fileOrDirPath: string,
    fsStatsIfExists: fs.Stats | null,
|};

type TranspileOrCopyAsyncFn = (
    fileOrDirectoryPath: string,
    stats?: fs.Stats | null,
) => Promise<Result<string, TranspileError>>;
type UnlinkAsyncFn = (filePath: string) => Promise<void>;
type GenerateFrontendBundleAsyncFn = () => Promise<Result<void, ErrorWithCode>>;
type QueueConsumerArgs = {|
    outputUserTranspiledDirPath: string,
    transpileOrCopyAsyncFn: TranspileOrCopyAsyncFn,
    unlinkAsyncFn: UnlinkAsyncFn,
    generateFrontendBundleAsyncFn: GenerateFrontendBundleAsyncFn,
|};

const QUEUE_CONSUMER_LOOP_TIMER_DELAY_MS = 200;

class BlockBuilderJobQueue extends EventEmitter {
    _buildTypeMode: BlockBuildType;
    _transpileOrUnlinkBuildJobQueue: Array<TranspileOrUnlinkBuildJob>;
    _blockBuilderStateData: BlockBuilderStateData;
    _transpileErrorByFilePath: Map<string, TranspileError>;
    _bundleErrorIfExists: ErrorWithCode | null;
    // The flow type for _buildJobQueueConsumerTimerIfExists should be node's native Timeout
    // class but flow type definitions are missing for the Timeout class.
    // - docs: https://nodejs.org/api/timers.html#timers_class_timeout
    // - bug: https://github.com/facebook/flow/issues/3480
    _buildJobQueueConsumerTimerIfExists: Object | null;
    _didInitialBundleRunSuccessfully: boolean;

    constructor(buildTypeMode: BlockBuildType) {
        super();
        this._buildTypeMode = buildTypeMode;
        this._transpileOrUnlinkBuildJobQueue = [];
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
    enqueueTranspileOrUnlinkJob(job: TranspileOrUnlinkBuildJob): void {
        this._transpileOrUnlinkBuildJobQueue.push(job);
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
        const {transpileOrCopyAsyncFn, unlinkAsyncFn, generateFrontendBundleAsyncFn} = args;

        if (this._transpileOrUnlinkBuildJobQueue.length === 0) {
            this._buildJobQueueConsumerTimerIfExists = setTimeout(
                this._queueConsumerLoopAsync.bind(this, args),
                QUEUE_CONSUMER_LOOP_TIMER_DELAY_MS,
            );
            return;
        }
        // Copy all elements of the queue for processing, and clear out the queue.
        const transpileOrUnlinkJobs = this._transpileOrUnlinkBuildJobQueue.splice(
            0,
            this._transpileOrUnlinkBuildJobQueue.length,
        );

        this._transitionBlockBuilderState();

        await this._processTranspileAndUnlinkJobsAsync(
            args.outputUserTranspiledDirPath,
            transpileOrUnlinkJobs,
            transpileOrCopyAsyncFn,
            unlinkAsyncFn,
        );

        if (this._transpileErrorByFilePath.size === 0) {
            const frontendBundleResult = await this._processFrontendBundleJobAsync(
                generateFrontendBundleAsyncFn,
            );
            this._bundleErrorIfExists = frontendBundleResult.err ? frontendBundleResult.err : null;
        }

        this._transitionBlockBuilderState();

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
        unlinkAsyncFn: UnlinkAsyncFn,
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
                    filesToUnlinkPromises.push(unlinkAsyncFn(fileOrDirPath));
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
    _buildHasErrors(): boolean {
        return this._bundleErrorIfExists !== null || this._transpileErrorByFilePath.size > 0;
    }
    _transitionToBuildingState(): void {
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
    _transitionToReadyState(resolveBuildingPromise: PromiseResolveFunction<void>): void {
        if (this._buildHasErrors()) {
            // This should not happen, unless there's a programming error.
            throw new Error(`Incorrect transition to ${BlockBuilderStatuses.READY}! Errors exist!`);
        }

        this._blockBuilderStateData = {status: BlockBuilderStatuses.READY};
        resolveBuildingPromise();
    }
    _transitionToErrorState(resolveBuildingPromise: PromiseResolveFunction<void>): void {
        if (!this._buildHasErrors()) {
            // This should not happen, unless there's a programming error.
            throw new Error('Incorrect build state transition! Missing error attributes!');
        }
        this._blockBuilderStateData = {
            status: BlockBuilderStatuses.ERROR,
            bundleErr: this._bundleErrorIfExists,
            transpileErrs: [...this._transpileErrorByFilePath.values()],
        };
        resolveBuildingPromise();
    }
    _transitionBlockBuilderState(): void {
        const currentBlockBuilderStateData = this._blockBuilderStateData;
        switch (currentBlockBuilderStateData.status) {
            case BlockBuilderStatuses.START:
            case BlockBuilderStatuses.READY:
            case BlockBuilderStatuses.ERROR:
                this._transitionToBuildingState();
                break;

            case BlockBuilderStatuses.BUILDING:
                if (this._buildHasErrors()) {
                    this._transitionToErrorState(currentBlockBuilderStateData.resolvePromise);
                    this.emit('buildComplete');
                } else {
                    this._transitionToReadyState(currentBlockBuilderStateData.resolvePromise);
                }

                this.emit('buildComplete');
                break;

            default:
                throw new Error(
                    `Unknown ${(currentBlockBuilderStateData.status: empty)} value for BlockBuilderStatuses`,
                );
        }
    }
}

module.exports = BlockBuilderJobQueue;
