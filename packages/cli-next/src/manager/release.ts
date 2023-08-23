import {
    createTaskAsync,
    HandshakeRequest,
    resolveBuiltinModuleAsync,
    TaskProcess,
} from '../helpers/task';
import {System} from '../helpers/system';

import {ReleaseTaskAdapter, ReleaseTaskConsumerAdapter} from './release_adapter';
import {AppBundlerContext, resolveBundlerModuleAsync} from './bundler';

export interface ReleaseTaskProducer extends HandshakeRequest {}

export async function createReleaseTaskAsync(
    sys: System,
    bundlerContext: AppBundlerContext,
    producer: ReleaseTaskProducer,
): Promise<ReleaseTaskConsumerAdapter> {
    const bridgePath = await resolveBuiltinModuleAsync(sys, __dirname, 'release_bridge');
    const entryPath = await resolveBundlerModuleAsync(sys, bundlerContext);

    return new ReleaseTaskAdapter(
        await createTaskAsync(sys, producer, {
            process: TaskProcess.OUT_OF_PROCESS,
            bridgePath,
            entryPath,
        }),
    );
}
