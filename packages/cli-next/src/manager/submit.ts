import {
    createTaskAsync,
    HandshakeRequest,
    resolveBuiltinModuleAsync,
    TaskProcess,
} from '../helpers/task';
import {System} from '../helpers/system';

import {SubmitTaskAdapter, SubmitTaskConsumerAdapter} from './submit_adapter';
import {AppBundlerContext, resolveBundlerModuleAsync} from './bundler';

export interface SubmitTaskProducer extends HandshakeRequest {}

export async function createSubmitTaskAsync(
    sys: System,
    bundlerContext: AppBundlerContext,
    producer: SubmitTaskProducer,
): Promise<SubmitTaskConsumerAdapter> {
    const bridgePath = await resolveBuiltinModuleAsync(sys, __dirname, 'submit_bridge');
    const entryPath = await resolveBundlerModuleAsync(sys, bundlerContext);

    return new SubmitTaskAdapter(
        await createTaskAsync(sys, producer, {
            process: TaskProcess.OUT_OF_PROCESS,
            bridgePath,
            entryPath,
        }),
    );
}
