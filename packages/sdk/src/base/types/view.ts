/** @module @airtable/blocks/models: View */ /** */
import {type ObjectMap} from '../../shared/private_utils';
import {type Color} from '../../shared/colors';
import {type FieldId, type RecordId, type ViewId} from '../../shared/types/hyper_ids';

/**
 * An enum of Airtable's view types
 *
 * @example
 * ```js
 * import {ViewType} from '@airtable/blocks/base/models';
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
    colorsByRecordId?: ViewColorsByRecordIdData | null;
    groups?: Array<GroupData> | null;
    groupLevels?: Array<GroupLevelData> | null;
}
