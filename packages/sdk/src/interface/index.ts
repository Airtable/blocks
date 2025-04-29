import {__injectSdkIntoWarning} from '../shared/warning';
import getAirtableInterface from '../injected/airtable_interface';
import {InterfaceSdkMode} from '../sdk_mode';
import {InterfaceBlockSdk} from './sdk';
import {__injectSdkIntoInitializeBlock} from './ui/initialize_block';

/** @internal */
export let __sdk: InterfaceBlockSdk;
export let base: InterfaceBlockSdk['base'];
export let globalConfig: InterfaceBlockSdk['globalConfig'];
export let installationId: InterfaceBlockSdk['installationId'];
export let reload: InterfaceBlockSdk['reload'];
export let runInfo: InterfaceBlockSdk['runInfo'];

/** @internal */
export function __reset() {
    __sdk = new InterfaceBlockSdk(getAirtableInterface<InterfaceSdkMode>());

    ({base, globalConfig, installationId, reload, runInfo} = __sdk);

    __injectSdkIntoInitializeBlock(__sdk);
    __injectSdkIntoWarning(__sdk);
}

__reset();
