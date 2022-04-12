const path = require('path');
const updateNotifier = require('update-notifier');
const getBlocksCliProjectRootPath = require('./helpers/get_blocks_cli_project_root_path');
const cliHelpers = require('./helpers/cli_helpers');
const commandConfigs = require('./commands/command_configs');
// flow-disable-next-line
const packageJson = require(path.join(getBlocksCliProjectRootPath(), 'package.json'));

function registerCommandForConfig(yargs, commandConfig) {
    yargs.command(commandConfig.command, commandConfig.description, yargsInner => {
        if (commandConfig.positionalMap) {
            for (const positionalName of Object.keys(commandConfig.positionalMap)) {
                const positionalConfig = commandConfig.positionalMap[positionalName];
                yargsInner.positional(positionalName, positionalConfig);
            }
        }
        if (commandConfig.optionMap) {
            for (const optionName of Object.keys(commandConfig.optionMap)) {
                const optionConfig = commandConfig.optionMap[optionName];
                yargsInner.option(optionName, {
                    group: commandConfig.name,
                    ...optionConfig,
                });
            }
        }

        return yargsInner;
    });

    const isCommandShown = commandConfig.description !== false;
    if (isCommandShown) {
        yargs.example(commandConfig.example);
    }
}

function registerCommands(yargs) {
    for (const commandName of Object.keys(commandConfigs)) {
        const commandConfig = commandConfigs[commandName];
        registerCommandForConfig(yargs, commandConfig);
    }
}

function setUpYargs() {
    const yargs = require('yargs');
    yargs.usage('Usage: block <command> [options]');
    registerCommands(yargs);
    // NOTE: Passing `null` to `wrap()` will specify no column limit (no right-align). Doing this
    // better formats the column output in the help menu
    // https://github.com/yargs/yargs/blob/088ce6b53f813a30dbfd58107b6a4cb8dc5d0c53/docs/api.md#wrapcolumns
    yargs.help('help').wrap(null);
    return yargs;
}

function parseCommandNameFromConfig(config) {
    return config._[0] || '';
}

function getCommandConfig(config) {
    const command = parseCommandNameFromConfig(config);
    return commandConfigs[command];
}

function ensureCleanExit() {
    process.addListener('SIGINT', () => process.exit(0));
    process.addListener('SIGTERM', () => process.exit(1));
}

async function runBlockCliAsync() {
    ensureCleanExit();
    updateNotifier({
        pkg: packageJson,
        // Still notify if this is invoked as part of an NPM script, e.g. in
        // case the developer is using the CLI as part of a `watch` command.
        shouldNotifyInNpmScript: true,
    }).notify({isGlobal: true});

    const yargs = setUpYargs();
    const config = yargs.argv;
    const commandConfig = getCommandConfig(config);
    if (commandConfig) {
        commandConfig.runCommandAsync(config).catch(err => {
            cliHelpers.exitWithError(err.message);
        });
    } else {
        yargs.showHelp();
        cliHelpers.exitWithError('Please use a valid command');
    }
}

module.exports = runBlockCliAsync;
