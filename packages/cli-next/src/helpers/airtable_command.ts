import Command from '@oclif/command';
import chalk from 'chalk';

import {MessageName, VerboseMessage, Messages, MessageInfo} from './verbose_message';

import {createSystem, System} from './system';

export interface ConfigSystem {
    createSystem(): System;
}

export interface ConfigMessages {
    createMessages(): Messages;
}

export interface ConfigChalk {
    createChalk(): chalk.Chalk;
}

/**
 * Extend oclif Command slightly to match Airtable's async method and function
 * naming scheme and creating a point to get or initialize a System interface
 * for operations with the Host.
 */
export default abstract class AirtableCommand extends Command {
    system!: System;
    messages!: Messages;
    chalk = chalk as chalk.Chalk;

    /* eslint-disable airtable/no-missing-async-suffix */
    async init() {
        await this.initAsync();
    }

    async run() {
        await this.runAsync();
    }

    async catch(err: Error & {__userInfo?: {type: MessageName}}) {
        if (
            typeof err.__userInfo?.type === 'string' &&
            this.messages[err.__userInfo.type as MessageName]
        ) {
            err.message = this.chalk`${this.messages.renderMessage(err.__userInfo as MessageInfo)}`;
            // oclif will display the stack. UserErrors are produced not because
            // of an issue with code but with a configuration or value or
            // something else passed to the cli by the user. The stack is
            // unlikely to help the user.
            err.stack = err.message;
            // Passing a string to the first argument, this.error will create an
            // intermediate CliError and prefix the logged message with
            // `' › Error:'`. Passing an error with a stack will print the stack.
            this.error(err, {message: err.message, code: err.__userInfo.type, exit: 1});
        }
        throw err;
    }

    async finally(err: Error | undefined) {
        if (this.finallyAsync) {
            await this.finallyAsync(err);
        }
    }
    /* eslint-enable airtable/no-missing-async-suffix */

    async initAsync() {
        if (this.config && 'createSystem' in this.config) {
            this.system = (this.config as ConfigSystem).createSystem();
        } else {
            this.system = createSystem();
        }

        if (this.config && 'createMessages' in this.config) {
            this.messages = (this.config as ConfigMessages).createMessages();
        } else {
            this.messages = new VerboseMessage();
        }

        if (this.config && 'createChalk' in this.config) {
            this.chalk = (this.config as ConfigChalk).createChalk();
        }
    }

    abstract runAsync(): Promise<void>;

    async finallyAsync?(err: Error | undefined): Promise<void>;
}
