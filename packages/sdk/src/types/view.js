// @flow
import {type Color} from '../colors';
import {type FieldId} from './field';
import {type RecordId} from './record';

export type ViewId = string;

/**
 * An enum of Airtable's view types
 * @alias viewTypes
 * @example
 * import {viewTypes} from '@airtable/blocks/models';
 * const gridViews = myTable.views.filter(view => (
 *     view.type === viewTypes.GRID
 * ));
 */
export const ViewTypes = Object.freeze({
    /**
     * @alias viewTypes.GRID
     * @memberof viewTypes
     */
    GRID: ('grid': 'grid'),
    /**
     * @alias viewTypes.FORM
     * @memberof viewTypes
     */
    FORM: ('form': 'form'),
    /**
     * @alias viewTypes.CALENDAR
     * @memberof viewTypes
     */
    CALENDAR: ('calendar': 'calendar'),
    /**
     * @alias viewTypes.GALLERY
     * @memberof viewTypes
     */
    GALLERY: ('gallery': 'gallery'),
    /**
     * @alias viewTypes.KANBAN
     * @memberof viewTypes
     */
    KANBAN: ('kanban': 'kanban'),
});

export type ViewType = $Values<typeof ViewTypes>;

export type ViewFieldOrderData = {|
    fieldIds: Array<FieldId>,
    visibleFieldCount: number,
|};

export type ViewColorsByRecordIdData = {[RecordId]: ?Color};

export type ViewData = {|
    id: ViewId,
    name: string,
    type: ViewType,
    visibleRecordIds?: Array<RecordId>,
    fieldOrder?: ViewFieldOrderData,
    colorsByRecordId?: ViewColorsByRecordIdData,
|};
