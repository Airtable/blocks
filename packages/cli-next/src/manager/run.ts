import {BuildState} from '../tasks/run';

import {
    createTaskAsync,
    HandshakeRequest,
    resolveBuiltinModuleAsync,
    TaskProcess,
} from '../helpers/task';
import {System} from '../helpers/system';
import {RunTaskAdapter, RunTaskConsumerAdapter} from './run_adapter';
import {AppBundlerContext, resolveBundlerModuleAsync} from './bundler';

export interface RunTaskProducer extends HandshakeRequest {
    emitBuildState(buildState: BuildState): void;
}

export async function createRunTaskAsync(
    sys: System,
    bundlerContext: AppBundlerContext,
    producer: RunTaskProducer,
): Promise<RunTaskConsumerAdapter> {
    const bridgePath = await resolveBuiltinModuleAsync(sys, __dirname, 'run_bridge');
    const entryPath = await resolveBundlerModuleAsync(sys, bundlerContext);

    return new RunTaskAdapter(
        await createTaskAsync(sys, producer, {
            process: TaskProcess.OUT_OF_PROCESS,
            bridgePath,
            entryPath,
        }),
    );
}
