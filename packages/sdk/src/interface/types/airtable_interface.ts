import {AirtableInterfaceCore, SdkInitDataCore} from '../../shared/types/airtable_interface_core';
import {InterfaceSdkMode} from '../../sdk_mode';

/** @hidden */
export interface SdkInitData extends SdkInitDataCore {}

/**
 * AirtableInterface is designed as the communication interface between the
 * Block SDK and Airtable. The mechanism through which we communicate with Airtable
 * depends on the context in which the block is running (i.e. frontend or backend),
 * but the interface should remain consistent.
 *
 * @hidden
 */
export interface AirtableInterface extends AirtableInterfaceCore<InterfaceSdkMode> {
    sdkInitData: SdkInitData;
}
