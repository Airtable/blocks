import BaseBlockSdk from './base/sdk';
import {BaseData as BaseDataForBaseSdkMode} from './base/types/base';
import {TableData as TableDataForBaseSdkMode} from './base/types/table';
import BaseForBaseSdkMode from './base/models/base';
import BaseForInterfaceSdkMode from './interface/models/base';
import FieldForBaseSdkMode from './base/models/field';
import {InterfaceBlockSdk} from './interface/sdk';
import {BaseDataCore} from './shared/types/base_core';
import {TableDataCore} from './shared/types/table_core';
import {FieldCore} from './shared/models/field_core';
import {RecordCore} from './shared/models/record_core';
import TableForBaseSdkMode from './base/models/table';
import TableForInterfaceSdkMode from './interface/models/table';
import RecordForBaseSdkMode from './base/models/record';
import {
    AirtableInterface as AirtableInterfaceForBaseSdkMode,
    SdkInitData as SdkInitDataForBaseSdkMode,
} from './base/types/airtable_interface';
import {
    AirtableInterface as AirtableInterfaceForInterfaceSdkMode,
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
    SdkT: BaseBlockSdk;
    SdkInitDataT: SdkInitDataForBaseSdkMode;
    AirtableInterfaceT: AirtableInterfaceForBaseSdkMode;
    SessionT: SesssionForBaseSdkMode;
    MutationsModelT: MutationsForBaseSdkMode;
    MutationT: MutationForBaseSdkMode;
    PartialMutationT: PartialMutationForBaseSdkMode;

    BaseDataT: BaseDataForBaseSdkMode;
    TableDataT: TableDataForBaseSdkMode;

    BaseT: BaseForBaseSdkMode;
    TableT: TableForBaseSdkMode;
    FieldT: FieldForBaseSdkMode;
    RecordT: RecordForBaseSdkMode;
}

/** @hidden */
export interface InterfaceSdkMode {
    mode: 'interface';
    SdkT: InterfaceBlockSdk;
    SdkInitDataT: SdkInitDataForInterfaceSdkMode;
    AirtableInterfaceT: AirtableInterfaceForInterfaceSdkMode;
    SessionT: SessionForInterfaceSdkMode;
    MutationsModelT: MutationsForInterfaceSdkMode;
    // TODO change to MutationForInterfaceSdkMode once implemented
    MutationT: MutationCore;
    // TODO change to PartialMutationForInterfaceSdkMode once implemented
    PartialMutationT: PartialMutationCore;

    // TODO change to BaseDataForInterfaceSdkMode once implemented
    BaseDataT: BaseDataCore<TableDataCore>;
    // TODO change to TableDataForInterfaceSdkMode once implemented
    TableDataT: TableDataCore;

    BaseT: BaseForInterfaceSdkMode;
    TableT: TableForInterfaceSdkMode;
    // TODO change to FieldForInterfaceSdkMode once implemented
    FieldT: FieldCore<this>;
    // TODO change to RecordForInterfaceSdkMode once implemented
    RecordT: RecordCore<this>;
}

/** @hidden */
export type SdkMode = BaseSdkMode | InterfaceSdkMode;
