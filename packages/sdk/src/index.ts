import {__injectSdkIntoPerformRecordAction} from './perform_record_action';
import warn, {__injectSdkIntoWarning} from './warning';
import getAirtableInterface from './injected/airtable_interface';
import Sdk from './sdk';
import {__injectSdkIntoCreateAggregators} from './models/create_aggregators';
import {__injectSdkIntoExpandRecordPickerAsync} from './ui/expand_record_picker_async';
import {__injectSdkIntoInitializeBlock} from './ui/initialize_block';

/** @internal */
export let __sdk: Sdk;
export let base: Sdk['base'];
export let cursor: Sdk['cursor'];
export let globalConfig: Sdk['globalConfig'];
export let installationId: Sdk['installationId'];
export let performRecordAction: Sdk['performRecordAction'];
export let reload: Sdk['reload'];
export let runInfo: Sdk['runInfo'];
export let session: Sdk['session'];
export let settingsButton: Sdk['settingsButton'];
export let undoRedo: Sdk['undoRedo'];
export let viewport: Sdk['viewport'];

Object.defineProperty(module.exports, 'UI', {
    enumerable: true,
    get() {
        warn(
            '`import {UI} from "@airtable/blocks"` is deprecated. Use `import * as UI from "@airtable/blocks/ui/ui"` instead.',
        );

        return require('./ui/ui');
    },
});

Object.defineProperty(module.exports, 'models', {
    enumerable: true,
    get() {
        warn(
            '`import {models} from "@airtable/blocks"` is deprecated. Use `import * as models from "@airtable/blocks/models/models"` instead.',
        );

        return require('./models/models');
    },
});

/** @internal */
export function __reset() {
    __sdk = new Sdk(getAirtableInterface());

    ({
        base,
        cursor,
        globalConfig,
        installationId,
        performRecordAction,
        reload,
        runInfo,
        session,
        settingsButton,
        undoRedo,
        viewport,
    } = __sdk);

    __injectSdkIntoCreateAggregators(__sdk);
    __injectSdkIntoPerformRecordAction(__sdk);
    __injectSdkIntoExpandRecordPickerAsync(__sdk);
    __injectSdkIntoInitializeBlock(__sdk);
    __injectSdkIntoWarning(__sdk);
}

__reset();
