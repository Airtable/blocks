import getSdk from './get_sdk';
/** @hidden */
export function trackEvent(eventSchemaName: string, eventData: {[key: string]: unknown} = {}) {
    getSdk().__airtableInterface.trackEvent(eventSchemaName, eventData);
}
