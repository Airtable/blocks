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
    /**
     * @alias viewTypes.GRID
     * @memberof viewTypes
     */
    GRID = 'grid',
    /**
     * @alias viewTypes.FORM
     * @memberof viewTypes
     */
    FORM = 'form',
    /**
     * @alias viewTypes.CALENDAR
     * @memberof viewTypes
     */
    CALENDAR = 'calendar',
    /**
     * @alias viewTypes.GALLERY
     * @memberof viewTypes
     */
    GALLERY = 'gallery',
    /**
     * @alias viewTypes.KANBAN
     * @memberof viewTypes
     */
    KANBAN = 'kanban',
}

/** */
export type ViewType = ObjectValues<typeof ViewTypes>;

/** @hidden */
export type ViewFieldOrderData = {
    fieldIds: Array<FieldId>;
    visibleFieldCount: number;
};

/** @hidden */
export type ViewColorsByRecordIdData = ObjectMap<RecordId, Color | null | undefined>;

/** @hidden */
export type ViewData = {
    id: ViewId;
    name: string;
    type: ViewType;
    // visibleRecordIds will be absent until the block explicity loads the view's data.
    visibleRecordIds?: Array<RecordId>;
    // fieldOrder will be absent until the block explicity loads the view's data.
    fieldOrder?: ViewFieldOrderData;
    // colorsByRecordId will be absent until the block explicity loads the view's data.
    colorsByRecordId?: ViewColorsByRecordIdData;
};
