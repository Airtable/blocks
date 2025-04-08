import BaseBlockSdk from './base/sdk';
import {BaseData as BaseDataForBaseSdkMode} from './base/types/base';
import {TableData as TableDataForBaseSdkMode} from './base/types/table';
import {RecordData as RecordDataForBaseSdkMode} from './base/types/record';
import {BaseData as BaseDataForInterfaceSdkMode} from './interface/types/base';
import {TableData as TableDataForInterfaceSdkMode} from './interface/types/table';
import {RecordData as RecordDataForInterfaceSdkMode} from './interface/types/record';
import BaseForBaseSdkMode from './base/models/base';
import BaseForInterfaceSdkMode from './interface/models/base';
import FieldForBaseSdkMode from './base/models/field';
import {InterfaceBlockSdk} from './interface/sdk';
import TableForBaseSdkMode from './base/models/table';
import TableForInterfaceSdkMode from './interface/models/table';
import FieldForInterfaceSdkMode from './interface/models/field';
import RecordForInterfaceSdkMode from './interface/models/record';
import RecordForBaseSdkMode from './base/models/record';
import RecordStoreForBaseSdkMode from './base/models/record_store';
import RecordStoreForInterfaceSdkMode from './interface/models/record_store';
import {
    AirtableInterface as AirtableInterfaceForBaseSdkMode,
    BlockRunContext as BlockRunContextForBaseSdkMode,
    SdkInitData as SdkInitDataForBaseSdkMode,
} from './base/types/airtable_interface';
import {
    AirtableInterface as AirtableInterfaceForInterfaceSdkMode,
    BlockRunContext as BlockRunContextForInterfaceSdkMode,
    SdkInitData as SdkInitDataForInterfaceSdkMode,
} from './interface/types/airtable_interface';
import MutationsForBaseSdkMode from './base/models/mutations';
import MutationsForInterfaceSdkMode from './interface/models/mutations';
import {
    Mutation as MutationForBaseSdkMode,
    PartialMutation as PartialMutationForBaseSdkMode,
} from './base/types/mutations';
import {MutationCore, PartialMutationCore} from './shared/types/mutations_core';
import SesssionForBaseSdkMode from './base/models/session';
import SessionForInterfaceSdkMode from './interface/models/session';

/** @hidden */
export interface BaseSdkMode {
    mode: 'base';
    runContextT: BlockRunContextForBaseSdkMode;
    SdkT: BaseBlockSdk;
    SdkInitDataT: SdkInitDataForBaseSdkMode;
    AirtableInterfaceT: AirtableInterfaceForBaseSdkMode;
    SessionT: SesssionForBaseSdkMode;
    MutationsModelT: MutationsForBaseSdkMode;
    MutationT: MutationForBaseSdkMode;
    PartialMutationT: PartialMutationForBaseSdkMode;

    BaseDataT: BaseDataForBaseSdkMode;
    TableDataT: TableDataForBaseSdkMode;
    RecordDataT: RecordDataForBaseSdkMode;

    BaseT: BaseForBaseSdkMode;
    TableT: TableForBaseSdkMode;
    FieldT: FieldForBaseSdkMode;
    RecordT: RecordForBaseSdkMode;
    /** @internal */
    RecordStoreT: RecordStoreForBaseSdkMode;
}

/** @hidden */
export interface InterfaceSdkMode {
    mode: 'interface';
    runContextT: BlockRunContextForInterfaceSdkMode;
    SdkT: InterfaceBlockSdk;
    SdkInitDataT: SdkInitDataForInterfaceSdkMode;
    AirtableInterfaceT: AirtableInterfaceForInterfaceSdkMode;
    SessionT: SessionForInterfaceSdkMode;
    MutationsModelT: MutationsForInterfaceSdkMode;
    // TODO change to MutationForInterfaceSdkMode once implemented
    MutationT: MutationCore;
    // TODO change to PartialMutationForInterfaceSdkMode once implemented
    PartialMutationT: PartialMutationCore;

    BaseDataT: BaseDataForInterfaceSdkMode;
    TableDataT: TableDataForInterfaceSdkMode;
    RecordDataT: RecordDataForInterfaceSdkMode;

    BaseT: BaseForInterfaceSdkMode;
    TableT: TableForInterfaceSdkMode;
    FieldT: FieldForInterfaceSdkMode;
    RecordT: RecordForInterfaceSdkMode;
    /** @internal */
    RecordStoreT: RecordStoreForInterfaceSdkMode;
}

/** @hidden */
export type SdkMode = BaseSdkMode | InterfaceSdkMode;
