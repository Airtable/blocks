/** @module @airtable/blocks/models: View */ /** */
import {ObjectMap} from '../private_utils';
import {Color} from '../colors';
import {FieldId} from './field';
import {RecordId} from './record';

/** */
export type ViewId = string;

/**
 * An enum of Airtable's view types
 *
 * @example
 * ```js
 * import {ViewType} from '@airtable/blocks/models';
 * const gridViews = myTable.views.filter(view => (
 *     view.type === ViewType.GRID
 * ));
 * ```
 */
export enum ViewType {
    /** */
    GRID = 'grid',
    /** */
    FORM = 'form',
    /** */
    CALENDAR = 'calendar',
    /** */
    GALLERY = 'gallery',
    /** */
    KANBAN = 'kanban',
    /** */
    BLOCK = 'block',
}

/** @hidden */
export interface ViewFieldOrderData {
    fieldIds: Array<FieldId>;
    visibleFieldCount: number;
}

/** @hidden */
export type ViewColorsByRecordIdData = ObjectMap<RecordId, Color | null | undefined>;

/**
 * Data provided by airtable for groups, only available on views or grouped queries
 *
 * @hidden
 */
export type GroupData =
    | {
          // This is only populated for the "leaf" nodes of a group tree.
          // Let the SDK roll up all recordId's for other group nodes
          visibleRecordIds: Array<RecordId>;
          // This is null if it's the last node aka "leaf node" of a group tree.
          groups: null;
      }
    | {
          // For non-leaf nodes this is always null, as it's rolled up
          visibleRecordIds: null;
          // Must be non-null for non-leaf nodes
          groups: Array<GroupData>;
      };

/**
 * GroupLevel provided by airtable - matches NormalizedGroupLevel
 *
 * @hidden
 */
export interface GroupLevelData {
    fieldId: FieldId;
    direction: 'asc' | 'desc';
}

/** @hidden */
export interface ViewData {
    id: ViewId;
    name: string;
    type: ViewType;
    isLocked: boolean;
    // visibleRecordIds will be absent until the block explicity loads the view's data.
    visibleRecordIds?: Array<RecordId>;
    // fieldOrder will be absent until the block explicity loads the view's data.
    fieldOrder?: ViewFieldOrderData;
    // colorsByRecordId will be absent until the block explicity loads the view's data.
    colorsByRecordId?: ViewColorsByRecordIdData;
    // groups will be absent until the block explicity loads the view's data (undefined).
    // groups will be null if groups data is disabled for your context/sdk
    groups?: Array<GroupData> | null;
    // groupLevels will be absent until the block explicity loads the view's data (undefined).
    // groupLevels will be null if groups data is disabled for your context/sdk
    groupLevels?: Array<GroupLevelData> | null;
}
