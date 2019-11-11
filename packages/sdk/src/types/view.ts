/** @module @airtable/blocks/models: View */ /** */
import {ObjectValues, ObjectMap} from '../private_utils';
import {Color} from '../colors';
import {FieldId} from './field';
import {RecordId} from './record';

/** */
export type ViewId = string;

/**
 * An enum of Airtable's view types
 *
 * @alias viewTypes
 * @example
 * ```js
 * import {viewTypes} from '@airtable/blocks/models';
 * const gridViews = myTable.views.filter(view => (
 *     view.type === viewTypes.GRID
 * ));
 * ```
 */
export enum ViewTypes {
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
}

/** */
export type ViewType = ObjectValues<typeof ViewTypes>;

/** @hidden */
export interface ViewFieldOrderData {
    fieldIds: Array<FieldId>;
    visibleFieldCount: number;
}

/** @hidden */
export type ViewColorsByRecordIdData = ObjectMap<RecordId, Color | null | undefined>;

/** @hidden */
export interface ViewData {
    id: ViewId;
    name: string;
    type: ViewType;
    visibleRecordIds?: Array<RecordId>;
    fieldOrder?: ViewFieldOrderData;
    colorsByRecordId?: ViewColorsByRecordIdData;
}
