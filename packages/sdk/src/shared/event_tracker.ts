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
    SUCCESS = 'SUCCESS',
    IGNORED = 'IGNORED',
    SETTINGS_INVALID = 'SETTINGS_INVALID',
    TABLE_MISMATCH = 'TABLE_MISMATCH',
}
