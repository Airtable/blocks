/**
 * This module implements a workaround for the following bug expressed by the
 * `prompt` method of the third-party `cli-ux` module:
 *
 * > Floods output if terminal lacks capabilities
 * > https://github.com/jdxcode/password-prompt/issues/19
 *
 * This module exports all other methods, allowing it to completely replace
 * `cli-ux`.
 *
 * In order to reduce the likelihood that future code mistakenly relies on the
 * original faulty implementation, this project's static analysis tooling has
 * been configured to reject code which imports the `cli-ux` module directly.
 * That restriction is lifted for the following `import` declaration and
 * `export` declaration so this module can extend the original functionality as
 * described above.
 */
// eslint-disable-next-line no-restricted-imports
import _cli from 'cli-ux';
// eslint-disable-next-line no-restricted-imports
export {config, ActionBase, Config, ExitError, IPromptOptions, Table} from 'cli-ux';

type PromptOptions = Parameters<typeof _cli.prompt>[1];

const promptOptionsOverride: PromptOptions = {
    type: 'normal',
};

function prompt(message: string, options?: PromptOptions) {
    return _cli.prompt(message, {
        ...options,
        ...(process.stdin.isTTY ? null : promptOptionsOverride),
    });
}

export const cli = {..._cli, prompt};
export const ux = cli;

export default cli;
