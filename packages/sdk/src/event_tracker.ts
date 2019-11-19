import airtableInterface from './injected/airtable_interface';

/** @hidden */
export function trackEvent(eventSchemaName: string, eventData: {[key: string]: unknown} = {}) {
    airtableInterface.trackEvent(eventSchemaName, eventData);
}
