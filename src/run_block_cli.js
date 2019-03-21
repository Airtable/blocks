/* eslint-disable no-console */
const cliHelpers = require('./helpers/cli_helpers');
const commandConfigs = require('./commands/command_configs');

function registerCommandForConfig(yargs, commandConfig) {
    yargs.command(
        commandConfig.command,
        commandConfig.description,
        yargsInner => {
            if (commandConfig.positionalMap) {
                for (const positionalName of Object.keys(commandConfig.positionalMap)) {
                    const positionalConfig = commandConfig.positionalMap[positionalName];
                    yargsInner.positional(positionalName, positionalConfig);
                }
            }
        },
    );
    if (commandConfig.optionMap) {
        for (const optionName of Object.keys(commandConfig.optionMap)) {
            const optionConfig = commandConfig.optionMap[optionName];
            yargs.option(
                optionName,
                {
                    group: commandConfig.name,
                    ...optionConfig,
                },
            );
        }
    }
    yargs.example(commandConfig.example);
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
    yargs.help('help');
    return yargs;
}

function parseCommandNameFromConfig(config) {
    return config._[0] || '';
}

function getCommandConfig(config) {
    const command = parseCommandNameFromConfig(config);
    return commandConfigs[command];
}

function runBlockCli() {
    const yargs = setUpYargs();
    const config = yargs.argv;
    const commandConfig = getCommandConfig(config);
    if (commandConfig) {
        commandConfig.runCommandAsync(config)
            .catch(err => {
                cliHelpers.exitWithError(err.message);
            });
    } else {
        yargs.showHelp();
        cliHelpers.exitWithError('Please use a valid command');
    }
}

module.exports = runBlockCli;
