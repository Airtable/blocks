import type BaseBlockSdk from './base/sdk';
import {
    type BaseData as BaseDataForBaseSdkMode,
    type BasePermissionData as BasePermissionDataForBaseSdkMode,
} from './base/types/base';
import {type TableData as TableDataForBaseSdkMode} from './base/types/table';
import {type FieldData as FieldDataForBaseSdkMode} from './base/types/field';
import {type RecordData as RecordDataForBaseSdkMode} from './base/types/record';
import {
    type BaseData as BaseDataForInterfaceSdkMode,
    type BasePermissionData as BasePermissionDataForInterfaceSdkMode,
} from './interface/types/base';
import {type TableData as TableDataForInterfaceSdkMode} from './interface/types/table';
import {type FieldData as FieldDataForInterfaceSdkMode} from './interface/types/field';
import {type RecordData as RecordDataForInterfaceSdkMode} from './interface/types/record';
import type BaseForBaseSdkMode from './base/models/base';
import {type Base as BaseForInterfaceSdkMode} from './interface/models/base';
import type FieldForBaseSdkMode from './base/models/field';
import {type InterfaceBlockSdk} from './interface/sdk';
import type TableForBaseSdkMode from './base/models/table';
import {type Table as TableForInterfaceSdkMode} from './interface/models/table';
import {type Field as FieldForInterfaceSdkMode} from './interface/models/field';
import {type Record as RecordForInterfaceSdkMode} from './interface/models/record';
import type RecordForBaseSdkMode from './base/models/record';
import type RecordStoreForBaseSdkMode from './base/models/record_store';
import {type RecordStore as RecordStoreForInterfaceSdkMode} from './interface/models/record_store';
import {
    type AirtableInterface as AirtableInterfaceForBaseSdkMode,
    type BlockRunContext as BlockRunContextForBaseSdkMode,
    type SdkInitData as SdkInitDataForBaseSdkMode,
} from './base/types/airtable_interface';
import {
    type AirtableInterface as AirtableInterfaceForInterfaceSdkMode,
    type BlockRunContext as BlockRunContextForInterfaceSdkMode,
    type SdkInitData as SdkInitDataForInterfaceSdkMode,
} from './interface/types/airtable_interface';
import type MutationsForBaseSdkMode from './base/models/mutations';
import {type Mutations as MutationsForInterfaceSdkMode} from './interface/models/mutations';
import {
    type Mutation as MutationForBaseSdkMode,
    type PartialMutation as PartialMutationForBaseSdkMode,
} from './base/types/mutations';
import {
    type Mutation as MutationForInterfaceSdkMode,
    type PartialMutation as PartialMutationForInterfaceSdkMode,
} from './interface/types/mutations';
import type SesssionForBaseSdkMode from './base/models/session';
import {type Session as SessionForInterfaceSdkMode} from './interface/models/session';

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
