import * as fs from 'fs';
import * as path from 'path';
import * as webpack from 'webpack';

type WebpackError = Pick<
    webpack.Compilation['errors'][number],
    'name' | 'message' | 'stack' | 'loc'
    // @ts-ignore TODO(richsinn#blocks_vuln_upgrade): We should fix these type definitions, but moving forward to unblock upgrade
> & {module: Pick<webpack.Compilation['errors'][number]['module'], 'nameForCondition'>};

type ParsedModuleNotFoundError = {
    fileContainingError: string;
    importPath: string;
    errorLocation: Location;
};

type Location = {
    start: SourcePosition;
    end: SourcePosition;
};

type SourcePosition = {
    line: number;
    column: number;
};

/**
 * Takes a webpack ModuleNotFoundError
 * (see https://github.com/webpack/webpack/blob/c1812948/lib/ModuleNotFoundError.js)
 * and returns a new error with a custom, user-friendly error message.
 */
export function decorateModuleNotFoundError(
    webpackError: WebpackError,
    appRootPath: string,
): Error | WebpackError {
    const parsedError = parseModuleNotFoundError(webpackError);
    if (!parsedError) {
        return webpackError;
    }

    const msg = `${webpackError.message}.\n❌ ${createFriendlyErrorMessageForModuleNotFound(
        parsedError,
        appRootPath,
    )}`;
    const err = new Error(msg);
    err.name = webpackError.name;

    if (Error.captureStackTrace) {
        Error.captureStackTrace(err, decorateModuleNotFoundError);
    }

    return err;
}

/**
 * This function relies on the interface of ModuleNotFoundError heavily. I expect/hope
 * we can rely on this interface since it is a public-facing error returned by webpack,
 * but it's also not really documented as part of the public API. Therefore, to be extra
 * cautious against changes to ModuleNotFoundError, the entire body of the function is
 * wrapped in a try/catch. That way if the API of ModuleNotFoundError changes in some
 * way that causes our parsing to no longer work (eg. module.nameForCondition() is
 * renamed or changes return type), the blocks cli will still work – it just won't be
 * able to return the custom, user-friendly error message.
 */
function parseModuleNotFoundError(webpackError: WebpackError): ParsedModuleNotFoundError | null {
    try {
        // @ts-ignore
        const fileContainingError = webpackError.module.nameForCondition();
        const importPathRegexMatch = webpackError.message.match(/Can't resolve ["|'](.+)["|'] in/);
        const importPath =
            importPathRegexMatch && importPathRegexMatch[1] ? importPathRegexMatch[1] : null;
        const errorLocation =
            // @ts-ignore
            'start' in webpackError.loc &&
            typeof webpackError.loc.start.line === 'number' &&
            typeof webpackError.loc.start.column === 'number' &&
            webpackError.loc.end &&
            typeof webpackError.loc.end.line === 'number' &&
            typeof webpackError.loc.end.column === 'number'
                ? {
                      start: {
                          line: webpackError.loc.start.line,
                          column: webpackError.loc.start.column,
                      },
                      end: {line: webpackError.loc.end.line, column: webpackError.loc.end.column},
                  }
                : null;

        if (
            typeof fileContainingError !== 'string' ||
            typeof importPath !== 'string' ||
            !errorLocation
        ) {
            return null;
        }

        return {
            fileContainingError,
            importPath,
            errorLocation,
        };
    } catch (e) {
        return null;
    }
}

function createFriendlyErrorMessageForModuleNotFound(
    error: ParsedModuleNotFoundError,
    appRootPath: string,
): string {
    const {fileContainingError, importPath, errorLocation} = error;
    const locationString = createLocationString(errorLocation);
    const isRelativeImport = importPath.startsWith('./');

    if (isRelativeImport) {
        return `Please check that the import path "${importPath}" is correct in "${fileContainingError}" at ${locationString}.`;
    }

    const yarnLockExists = fs.existsSync(path.join(appRootPath, 'yarn.lock'));
    const installDependenciesCommand = yarnLockExists ? 'yarn install' : 'npm install';
    return `Please check that the import path "${importPath}" is correct in "${fileContainingError}" at ${locationString} and run \`${installDependenciesCommand}\` in ${appRootPath} to install packages.`;
}

function createLocationString({start, end}: Location): string {
    let result = `line ${start.line} column ${start.column}`;

    if (end.line === start.line) {
        result += ` to ${end.column}`;
    } else {
        result += ` to line ${end.line} column ${end.column}`;
    }

    return result;
}
