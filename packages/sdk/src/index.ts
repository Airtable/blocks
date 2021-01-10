import {__injectSdkIntoPerformRecordAction} from './perform_record_action';
import warn, {__injectSdkIntoWarning} from './warning';
import getAirtableInterface from './injected/airtable_interface';
import Sdk from './sdk';
import {__injectSdkIntoCreateAggregators} from './models/create_aggregators';
import {__injectSdkIntoExpandRecordPickerAsync} from './ui/expand_record_picker_async';
import {__injectSdkIntoInitializeBlock} from './ui/initialize_block';
import {__injectSdkIntoInitializeView} from './ui/initialize_view';

/** @internal */
export let __sdk: Sdk;
export let base: Sdk['base'];
export let globalConfig: Sdk['globalConfig'];
export let installationId: Sdk['installationId'];
export let reload: Sdk['reload'];
export let runInfo: Sdk['runInfo'];
export let settingsButton: Sdk['settingsButton'];
export let undoRedo: Sdk['undoRedo'];
export let viewport: Sdk['viewport'];
export let unstable_fetchAsync: Sdk['unstable_fetchAsync'];

// The `cursor` binding is declared on the following line solely as a signal to
// the TypeScript compiler. The exported value is actually controlled by the
// subsequent CommonJS module property descriptor.
export let cursor: Sdk['cursor'];
Object.defineProperty(module.exports, 'cursor', {
    enumerable: true,
    get() {
        warn(
            '`import {cursor} from "@airtable/blocks"` is deprecated. Use `import {useCursor} from "@airtable/blocks/ui"` instead.',
        );

        return __sdk.cursor;
    },
});

// The `session` binding is declared on the following line solely as a signal
// to the TypeScript compiler. The exported value is actually controlled by the
// subsequent CommonJS module property descriptor.
export let session: Sdk['session'];
Object.defineProperty(module.exports, 'session', {
    enumerable: true,
    get() {
        warn(
            '`import {session} from "@airtable/blocks"` is deprecated. Use `import {useSession} from "@airtable/blocks/ui"` instead.',
        );

        return __sdk.session;
    },
});

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
        globalConfig,
        installationId,
        reload,
        runInfo,
        settingsButton,
        undoRedo,
        viewport,
        unstable_fetchAsync,
    } = __sdk);

    // The following injections are necessary to allow the referenced modules
    // to be imported directly by consumer code while also avoiding cycles in
    // the module dependency graph.
    __injectSdkIntoCreateAggregators(__sdk);
    __injectSdkIntoPerformRecordAction(__sdk);
    __injectSdkIntoExpandRecordPickerAsync(__sdk);
    __injectSdkIntoInitializeBlock(__sdk);
    __injectSdkIntoInitializeView(__sdk);
    __injectSdkIntoWarning(__sdk);
}

__reset();
