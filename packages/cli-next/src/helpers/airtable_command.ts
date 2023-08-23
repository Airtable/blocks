import Command from '@oclif/command';
import chalk from 'chalk';

import {VerboseMessage, Messages, MessageInfo} from './verbose_message';

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

    errorMessage<Message extends MessageInfo>(
        message: Message,
        options?: Parameters<Command['error']>[1],
    ) {
        return this.error(this.messages.renderMessage(message), options);
    }

    logMessage<Message extends MessageInfo>(message: Message) {
        return this.log(this.messages.renderMessage(message));
    }

    warnMessage<Message extends MessageInfo>(message: Message) {
        return this.warn(this.messages.renderMessage(message));
    }

    /* eslint-disable airtable/no-missing-async-suffix */
    async init() {
        await this.initAsync();
    }

    async run() {
        await this.runAsync();
    }

    async catch(err: Error) {
        return await this.catchAsync(err);
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

        if (this.config && 'createChalk' in this.config) {
            this.chalk = (this.config as ConfigChalk).createChalk();
        }

        if (this.config && 'createMessages' in this.config) {
            this.messages = (this.config as ConfigMessages).createMessages();
        } else {
            this.messages = new VerboseMessage({chalk: this.chalk});
        }
    }

    abstract runAsync(): Promise<void>;

    async catchAsync(err: Error): Promise<void> {
        if (this.messages.supportsError(err)) {
            err.message = this.messages.renderError(err);
            err.stack = err.message;
            this.error(err, {message: err.message, code: err.__userInfo.type, exit: 1});
        }
        throw err;
    }

    async finallyAsync?(err: Error | undefined): Promise<void>;
}
