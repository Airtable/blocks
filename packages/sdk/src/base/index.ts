import './assert_run_context';

import {__injectSdkIntoWarning} from '../shared/warning';
import getAirtableInterface from '../injected/airtable_interface';
import {type BaseSdkMode} from '../sdk_mode';
import {__injectSdkIntoPerformRecordAction} from './perform_record_action';
import Sdk from './sdk';
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

    __injectSdkIntoPerformRecordAction(__sdk);
    __injectSdkIntoInitializeBlock(__sdk);
    __injectSdkIntoWarning(__sdk);
}

__reset();
