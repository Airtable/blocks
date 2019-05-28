// @flow
import {type Color} from '../colors';
import {type FieldId} from './field';
import {type RecordId} from './record';

export type ViewId = string;

export const ViewTypes = Object.freeze({
    GRID: ('grid': 'grid'),
    FORM: ('form': 'form'),
    CALENDAR: ('calendar': 'calendar'),
    GALLERY: ('gallery': 'gallery'),
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
    // visibleRecordIds will be absent until the block explicity loads the view's data.
    visibleRecordIds?: Array<RecordId>,
    // fieldOrder will be absent until the block explicity loads the view's data.
    fieldOrder?: ViewFieldOrderData,
    // colorsByRecordId will be absent until the block explicity loads the view's data.
    colorsByRecordId?: ViewColorsByRecordIdData,
|};
