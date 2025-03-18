import {TableId, RecordId, ViewId} from '../../shared/types/hyper_ids';

/**
 * The data format used by {@link useRecordActionData} and {@link registerRecordActionDataCallback}
 * to represent a record action (for example, a click of a button with "Open block" action).
 * */
export interface RecordActionData {
    /** Id corresponding to the record the button was clicked from. */
    recordId: RecordId;
    /** Id corresponding to the view the button was clicked from. */
    viewId: ViewId;
    /** Id corresponding to the table containing the record with the button. */
    tableId: TableId;
}
/**
 * The signature of the callback provided to {@link registerRecordActionDataCallback}.
 *
 * Whenever a record action occurs, the callback will be called with {@link RecordActionData}
 * corresponding to the record (for example, the record that the button with "Open block" action
 * was clicked from).
 * */
export type RecordActionDataCallback = (data: RecordActionData) => void;
