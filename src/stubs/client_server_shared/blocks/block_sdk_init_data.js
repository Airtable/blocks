// @flow
import type {ObjectId, ApplicationId, UserId, TableId, ViewId, ColumnId as FieldId, RowId as RecordId, BlockInstallationId} from 'client_server_shared/hyper_id';
import type {AppBlanket} from 'client_server_shared/types/app_json/app_blanket';
import type {Color} from 'client_server_shared/types/view_config/color_config_obj';
import type {ViewType} from 'client_server_shared/view_types/view_types';
import type {PermissionLevel} from 'client_server_shared/permissions/permission_levels';
import type {ColumnType} from 'client_server_shared/column_types/column_types';
import type {BlockKvValue} from 'client_server_shared/blocks/block_kv_helpers';

export type CursorDataForBlocks = {
    selectedRecordIdSet: {[RecordId]: boolean},
};

export type RecordDataForBlocks = {
    id: RecordId,
    // cellValuesByFieldId comes directly from liveapp (as cellValuesByColumnId),
    // which is stored sparsely. So it will be undefined when the row has no cell values.
    cellValuesByFieldId: ?{[string]: mixed},
    commentCount: number,
    createdTime: string,
};

export type FieldDataForBlocks = {|
    id: FieldId,
    name: string,
    type: ColumnType,
    typeOptions: ?Object,
|};

export type ViewFieldOrderForBlocks = {|
    fieldIds: Array<FieldId>,
    visibleFieldCount: number,
|};

export type ViewColorsByRecordIdForBlocks = {[RecordId]: Color | void};

export type ViewDataForBlocks = {|
    id: ViewId,
    name: string,
    type: ViewType,
    // visibleRecordIds will be absent until the block explicity loads the view's data.
    visibleRecordIds?: Array<string>,
    // fieldOrder will be absent until the block explicity loads the view's data.
    fieldOrder?: ViewFieldOrderForBlocks,
    // colorsByRecordId will be absent until the block explicity loads the view's data.
    colorsByRecordId?: ViewColorsByRecordIdForBlocks,
|};

export type TableDataForBlocks = {|
    id: TableId,
    name: string,
    primaryFieldId: string,
    fieldsById: {[string]: FieldDataForBlocks},
    activeViewId: string | null,
    viewOrder: Array<string>,
    viewsById: {[string]: ViewDataForBlocks},
    // recordsById will be absent until the block explicity loads the table's data.
    recordsById?: {[string]: RecordDataForBlocks},
|};

type CollaboratorStatus = 'former' | 'invited' | 'current';

/** */
export type Collaborator = {
    id: UserId,
    email: string,
    name?: string,
    profilePicUrl?: string,
    status: CollaboratorStatus,
};

export type BaseDataForBlocks = {|
    id: ApplicationId,
    name: string,
    tableOrder: Array<TableId>,
    activeTableId: TableId | null,
    permissionLevel: PermissionLevel,
    tablesById: {[TableId]: TableDataForBlocks},
    // NOTE: in rare cases where a base hasn't been loaded since 2016, AppBlanket may be null
    // However, it should never be read from in that scenario since (as of Sep 2017)
    // it's only used for collaborator fields which were introduced alongside AppBlanket
    appBlanket: AppBlanket,
    sortTiebreakerKey: ObjectId | null,
    // currentUserId will be null for backend block requests and publicly shared bases.
    currentUserId: UserId | null,
    enabledFeatureNames: Array<string>,

    // this will be exposed through a separate model, but stored
    // on base data for convenience.
    // cursorData will be null if it has not been subscribed to.
    cursorData: CursorDataForBlocks | null,
|};

export type BlockSdkInitData = {|
    initialKvValuesByKey: {[string]: BlockKvValue},
    isDevelopmentMode: boolean,
    baseData: BaseDataForBlocks,
    blockInstallationId: BlockInstallationId,

    // NOTE: these don't really make much sense in backend blocks.
    // TODO: figure out what to do with them.
    isFullscreen: boolean,
    isFirstRun: boolean,
|};
