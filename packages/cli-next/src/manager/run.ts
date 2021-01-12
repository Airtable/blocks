import {RunTaskConsumer, RunTaskProducer} from '../tasks/run';
import {findExtensionAsync} from '../helpers/system_extra';
import {System} from '../helpers/system';

function interop(module: any) {
    return module.default || Object.values(module)[0] || module;
}

export async function createRunTaskAsync(
    sys: System,
    manager: RunTaskProducer = {},
): Promise<RunTaskConsumer> {
    const entryBase = sys.path.join(__dirname, 'run_entry');
    const entryPath = await findExtensionAsync(sys, entryBase, ['.ts', '.js']);

    return await interop(require(entryPath))(sys, manager);
}
