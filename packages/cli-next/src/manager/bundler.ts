import {AppBundlerConfig} from '../helpers/config_app';
import {System} from '../helpers/system';
import {resolveBuiltinModuleAsync} from '../helpers/task';

export interface AppBundlerContext {
    module?: AppBundlerConfig['module'];

    workingdir: string;
}

export async function resolveBundlerModuleAsync(sys: System, bundlerContext?: AppBundlerContext) {
    const builtinTaskPath = await resolveBuiltinModuleAsync(
        sys,
        __dirname,
        '..',
        'bundler',
        'bundler',
    );

    let entryPath = builtinTaskPath;
    if (bundlerContext?.module && bundlerContext?.module !== 'builtin') {
        entryPath = require.resolve(bundlerContext.module, {paths: [bundlerContext.workingdir]});
    }

    return entryPath;
}
