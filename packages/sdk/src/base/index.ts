import './assert_run_context';

import warn, {__injectSdkIntoWarning} from '../shared/warning';
import getAirtableInterface from '../injected/airtable_interface';
import {BaseSdkMode} from '../sdk_mode';
import {__injectSdkIntoPerformRecordAction} from './perform_record_action';
import Sdk from './sdk';
import {__injectSdkIntoCreateAggregators} from './models/create_aggregators';
import {__injectSdkIntoInitializeBlock} from './ui/initialize_block';

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


/** @internal */
export function __reset() {
    __sdk = new Sdk(getAirtableInterface<BaseSdkMode>());

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

    __injectSdkIntoCreateAggregators(__sdk);
    __injectSdkIntoPerformRecordAction(__sdk);
    __injectSdkIntoInitializeBlock(__sdk);
    __injectSdkIntoWarning(__sdk);
}

__reset();
