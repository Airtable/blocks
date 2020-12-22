import Command from '@oclif/command';

import {createSystem, System} from './system';

interface ConfigSystem {
    createSystem(): System;
}

/**
 * Extend oclif Command slightly to match Airtable's async method and function
 * naming scheme and creating a point to get or initialize a System interface
 * for operations with the Host.
 */
export default abstract class AirtableCommand extends Command {
    system!: System;

    /* eslint-disable airtable/no-missing-async-suffix */
    async init() {
        await this.initAsync();
    }

    async run() {
        await this.runAsync();
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
    }

    abstract runAsync(): Promise<void>;

    async finallyAsync?(err: Error | undefined): Promise<void>;
}
