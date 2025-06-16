import BaseBlockSdk from './base/sdk';
import {
    BaseData as BaseDataForBaseSdkMode,
    BasePermissionData as BasePermissionDataForBaseSdkMode,
} from './base/types/base';
import {TableData as TableDataForBaseSdkMode} from './base/types/table';
import {FieldData as FieldDataForBaseSdkMode} from './base/types/field';
import {RecordData as RecordDataForBaseSdkMode} from './base/types/record';
import {
    BaseData as BaseDataForInterfaceSdkMode,
    BasePermissionData as BasePermissionDataForInterfaceSdkMode,
} from './interface/types/base';
import {TableData as TableDataForInterfaceSdkMode} from './interface/types/table';
import {FieldData as FieldDataForInterfaceSdkMode} from './interface/types/field';
import {RecordData as RecordDataForInterfaceSdkMode} from './interface/types/record';
import BaseForBaseSdkMode from './base/models/base';
import {Base as BaseForInterfaceSdkMode} from './interface/models/base';
import FieldForBaseSdkMode from './base/models/field';
import {InterfaceBlockSdk} from './interface/sdk';
import TableForBaseSdkMode from './base/models/table';
import {Table as TableForInterfaceSdkMode} from './interface/models/table';
import {Field as FieldForInterfaceSdkMode} from './interface/models/field';
import {Record as RecordForInterfaceSdkMode} from './interface/models/record';
import RecordForBaseSdkMode from './base/models/record';
import RecordStoreForBaseSdkMode from './base/models/record_store';
import {RecordStore as RecordStoreForInterfaceSdkMode} from './interface/models/record_store';
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
import {Mutations as MutationsForInterfaceSdkMode} from './interface/models/mutations';
import {
    Mutation as MutationForBaseSdkMode,
    PartialMutation as PartialMutationForBaseSdkMode,
} from './base/types/mutations';
import {
    Mutation as MutationForInterfaceSdkMode,
    PartialMutation as PartialMutationForInterfaceSdkMode,
} from './interface/types/mutations';
import SesssionForBaseSdkMode from './base/models/session';
import {Session as SessionForInterfaceSdkMode} from './interface/models/session';

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
    FieldDataT: FieldDataForBaseSdkMode;
    RecordDataT: RecordDataForBaseSdkMode;

    BasePermissionDataT: BasePermissionDataForBaseSdkMode;

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
    MutationT: MutationForInterfaceSdkMode;
    PartialMutationT: PartialMutationForInterfaceSdkMode;

    BaseDataT: BaseDataForInterfaceSdkMode;
    TableDataT: TableDataForInterfaceSdkMode;
    FieldDataT: FieldDataForInterfaceSdkMode;
    RecordDataT: RecordDataForInterfaceSdkMode;

    BasePermissionDataT: BasePermissionDataForInterfaceSdkMode;

    BaseT: BaseForInterfaceSdkMode;
    TableT: TableForInterfaceSdkMode;
    FieldT: FieldForInterfaceSdkMode;
    RecordT: RecordForInterfaceSdkMode;
    /** @internal */
    RecordStoreT: RecordStoreForInterfaceSdkMode;
}

/** @hidden */
export type SdkMode = BaseSdkMode | InterfaceSdkMode;
