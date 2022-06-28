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
          visibleRecordIds: Array<RecordId>;
          groups: null;
      }
    | {
          visibleRecordIds: null;
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
    isLockedView: boolean;
    visibleRecordIds?: Array<RecordId>;
    fieldOrder?: ViewFieldOrderData;
    colorsByRecordId?: ViewColorsByRecordIdData;
    groups?: Array<GroupData> | null;
    groupLevels?: Array<GroupLevelData> | null;
}
