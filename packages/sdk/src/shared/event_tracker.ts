import getAirtableInterface from '../injected/airtable_interface';
/** @hidden */
export function trackEvent(eventSchemaName: string, eventData: {[key: string]: unknown} = {}) {
    getAirtableInterface().trackEvent(eventSchemaName, eventData);
}

/**
 * Used for logging blockInstallation.performRecordAction event
 * Mirrored from hyperbase block_installation_record_action_status.tsx
 *
 * @hidden
 * */
export enum RecordActionStatus {
    // The record was successfully opened.
    SUCCESS = 'SUCCESS',
    // The request was ignored, due to the block being in a state where it isn't ready to handle events
    // e.g. setup, settings
    // Note: in the future, we may handle events from some of these states or show the user an error
    // message.
    IGNORED = 'IGNORED',
    // Due to invalid settings, it wasn't possible to handle the event.
    // Unlike IGNORED, we show the user an error message.
    SETTINGS_INVALID = 'SETTINGS_INVALID',
    // The block was opened from a table different to the one the block is configured to use.
    // Unlike IGNORED, we show the user an error message.
    TABLE_MISMATCH = 'TABLE_MISMATCH',
}
