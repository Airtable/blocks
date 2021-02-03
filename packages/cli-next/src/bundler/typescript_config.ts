import {spawnError} from '../helpers/error_utils';
import {Result} from '../helpers/result';
import {System} from '../helpers/system';
import {findAppDirectoryAsync} from '../helpers/system_config';
import {mkdirpAsync, unlinkIfExistsAsync} from '../helpers/system_extra';
import {APP_ROOT_TEMPORARY_DIR} from '../settings';
import {TypeScriptCompilerOptions, TypeScriptConfigFile} from './webpack_config';

export async function findTypescriptConfigFileAsync(
    sys: System,
    workingdir: string = sys.process.cwd(),
): Promise<Result<string>> {
    try {
        const appRootPath = await findAppDirectoryAsync(sys, workingdir);
        const appRootNames = await sys.fs.readdirAsync(appRootPath);
        if (appRootNames.includes('tsconfig.json')) {
            return {value: sys.path.join(appRootPath, 'tsconfig.json')};
        }
        return {err: spawnError('tsconfig.json not found in app root')};
    } catch (err) {
        return {err};
    }
}

/**
 * Return options for a typescript compiler as the command line tool would
 * see in a json file. The typescript.CompilerOptions type is not what ts-loader
 * is expecting.
 */
export function createCompilerOptions(): object {
    return {
        target: 'es2017',

        module: 'es2015',
        sourceMap: true,
        allowSyntheticDefaultImports: true,
        jsx: 'react',
    };
}

export async function createTypescriptAssetConfigAsync(
    sys: System,
    workingdir: string = sys.process.cwd(),
): Promise<TypeScriptCompilerOptions | TypeScriptConfigFile> {
    const workingdirTmp = sys.path.join(workingdir, APP_ROOT_TEMPORARY_DIR);
    const tmpTsConfigPath = sys.path.join(workingdirTmp, 'tsconfig.json');
    const configFilePathResult = await findTypescriptConfigFileAsync(sys, workingdir);
    if (configFilePathResult.value) {
        await unlinkIfExistsAsync(sys, tmpTsConfigPath);
        return {
            assetType: 'typescript',
            configFile: configFilePathResult.value,
        };
    } else {
        const tmpTsConfig = {exclude: ['node_modules'], include: ['..']};
        await mkdirpAsync(sys, workingdirTmp);
        await sys.fs.writeFileAsync(tmpTsConfigPath, JSON.stringify(tmpTsConfig, null, '  '));
        return {
            assetType: 'typescript',
            compilerOptions: createCompilerOptions(),
            configFile: tmpTsConfigPath,
        };
    }
}
