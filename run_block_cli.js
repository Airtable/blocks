#!/usr/bin/env node
/* eslint-disable no-console */
'use strict';

const cliHelpers = require('./lib/helpers/cli_helpers');
const commandConfigs = require('./lib/commands/command_configs');

function registerCommandForConfig(yargs, commandConfig) {
    yargs.command(
        commandConfig.command,
        commandConfig.description,
        yargsInner => {
            if (commandConfig.argDescriptions) {
                for (const argName of Object.keys(commandConfig.argDescriptions)) {
                    const argConfig = commandConfig.argDescriptions[argName];
                    yargsInner.positional(argName, argConfig);
                }
            }
        },
    );
    if (commandConfig.options) {
        for (const optionName of Object.keys(commandConfig.options)) {
            const optionConfig = commandConfig.options[optionName];
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

const runBlocksCli = function runBlocksCli() {
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
};

runBlocksCli();
