import {useEffect, useState} from 'react';
import {useGlobalConfig, useBase} from '@airtable/blocks/ui';
import {base64EncodeUnicode, base64DecodeUnicode} from './base46unicode';
import {AllowedCacheFieldTypes, AllowedLocationFieldTypes} from './types';
import useGoogleMapsApiError from './useGoogleMapsApiError';
import getGoogleAuthFailure from './GoogleAuthFailure';
import hash from 'object-hash';

const ConfigKeys = {
    API_KEY: 'apiKey',
    API_KEY_ERROR: 'apiKeyError',
    CACHE_FIELD_ID: 'cacheFieldId',
    LOCATION_FIELD_ID: 'locationFieldId',
    SHOW_DEFAULT_UI: 'showDefaultUI',
    SHOW_ROAD_LABELS: 'showRoadLabels',
    TABLE_ID: 'tableId',
};

const isValidLocationField = field => AllowedLocationFieldTypes.includes(field.type);
const isValidCacheField = field => AllowedCacheFieldTypes.includes(field.type);

const encode = value => (value ? base64EncodeUnicode(JSON.stringify(value)) : '');
const decode = value => (value ? JSON.parse(base64DecodeUnicode(value)) : '');

class SettingsStore {
    /**
     * @param {import('@airtable/blocks/dist/types/src/models/base').default} base
     * @param {import('@airtable/blocks/dist/types/src/global_config').default} globalConfig
     */
    constructor(base, globalConfig, [localState, setLocalState]) {
        this.base = base;
        this.globalConfig = globalConfig;
        this.localState = localState;
        this.setLocalState = setLocalState;
        this.ephemeralCache = {};
    }

    get cache() {
        const ephemaralCacheKey = record => {
            const r = record.id;
            const c = this.cacheFieldId;
            return hash({r, c});
        };

        const get = record => {
            // First try getting a value directly from the cache field.
            // If there is no value there, check the ephemaral cache,
            // which is used as a fallback when the user doesn't have
            // permission to write the the cache field. This data is
            // lost when the extension is reloaded, but will prevent repeat
            // requests to the Geocode API.
            //
            const encoded =
                record.getCellValueAsString(this.cacheFieldId) ||
                this.ephemeralCache[ephemaralCacheKey(record)];

            if (!encoded) {
                return null;
            }
            try {
                return decode(encoded);
            } catch (error) {
                void error;
                return null;
            }
        };

        const setAsync = async (record, geocode) => {
            const payload = {
                [this.cacheFieldId]: encode(geocode),
            };
            if (this.table.hasPermissionToUpdateRecord(record, payload)) {
                await this.table.updateRecordAsync(record, payload);
            } else {
                // In cases where the user does not have sufficient permission
                // to write to the cache field, or the cache field has been locked,
                // store the encoded geocode in the ephemeral cache. This will
                // prevent unnecessary repeat requests to the Geocode API.
                this.ephemeralCache[ephemaralCacheKey(record)] = encode(geocode);
            }
        };

        return {decode, encode, get, setAsync};
    }

    get cacheFieldId() {
        return this.globalConfig.get(ConfigKeys.CACHE_FIELD_ID) || '';
    }

    get cacheField() {
        const {table} = this;
        return table ? table.getFieldByIdIfExists(this.cacheFieldId) : null;
    }

    set cacheField(field) {
        const fieldId = field ? field.id : null;
        if (this.globalConfig.hasPermissionToSet(ConfigKeys.CACHE_FIELD_ID, fieldId)) {
            this.globalConfig.setAsync(ConfigKeys.CACHE_FIELD_ID, fieldId);
        }
    }

    get fields() {
        return [this.cacheField, this.locationField];
    }

    get googleApiKey() {
        return this.globalConfig.get(ConfigKeys.API_KEY) || '';
    }

    set googleApiKey(value) {
        // Whenever the API Key is set, the error must be reset to null.
        const updates = [
            {path: [ConfigKeys.API_KEY], value},
            {path: [ConfigKeys.API_KEY_ERROR], value: null},
        ];
        if (this.globalConfig.hasPermissionToSetPaths(updates)) {
            this.globalConfig.setPathsAsync(updates);
        }
    }

    get googleApiKeyError() {
        return this.globalConfig.get(ConfigKeys.API_KEY_ERROR) || null;
    }

    set googleApiKeyError(value) {
        if (this.globalConfig.hasPermissionToSet(ConfigKeys.API_KEY_ERROR, value)) {
            this.globalConfig.setAsync(ConfigKeys.API_KEY_ERROR, value);
        }
    }

    get locationFieldId() {
        return this.globalConfig.get(ConfigKeys.LOCATION_FIELD_ID) || '';
    }

    get locationField() {
        const {table} = this;
        return table ? table.getFieldByIdIfExists(this.locationFieldId) : null;
    }

    get isAllowedToOverwriteNonCacheValues() {
        return this.localState.isAllowedToOverwriteNonCacheValues;
    }

    set isAllowedToOverwriteNonCacheValues(value) {
        this.setLocalState({...this.localState, isAllowedToOverwriteNonCacheValues: value});
    }

    get isCacheFieldSameAsLocationField() {
        return (
            this.cacheFieldId !== '' &&
            this.locationFieldId !== '' &&
            this.cacheFieldId === this.locationFieldId
        );
    }

    get isInvalidAPIKey() {
        return this.googleApiKeyError !== null;
    }

    get isInvalidCacheField() {
        return this.cacheField && !isValidCacheField(this.cacheField);
    }

    get isInvalidLocationField() {
        return this.locationField && !isValidLocationField(this.locationField);
    }

    get isMinimallyConfigured() {
        // This check ensures that these configurations actually map to something
        // meaningful. For example, if a locationFieldId is set, but the field
        // itself does not exist (deleted!), then the user must fix this in the
        // settings.
        return this.googleApiKey && this.table && this.locationField && this.cacheField;
    }

    get isMissingAPIKey() {
        return !this.googleApiKey;
    }

    get isMissingCacheField() {
        // See explanation in isMinimallyConfigured
        return !this.cacheField;
    }

    get isMissingLocationField() {
        // See explanation in isMinimallyConfigured
        return !this.locationField;
    }

    get isMissingTable() {
        return !this.table;
    }

    get showDefaultUI() {
        return this.globalConfig.get(ConfigKeys.SHOW_DEFAULT_UI) !== false;
    }

    set showDefaultUI(newValue) {
        this.globalConfig.setAsync(ConfigKeys.SHOW_DEFAULT_UI, newValue);
    }

    get showRoadLabels() {
        return this.globalConfig.get(ConfigKeys.SHOW_ROAD_LABELS) !== false;
    }

    set showRoadLabels(newValue) {
        this.globalConfig.setAsync(ConfigKeys.SHOW_ROAD_LABELS, newValue);
    }

    get showSettings() {
        return this.localState.showSettings;
    }

    set showSettings(show) {
        this.setLocalState({...this.localState, showSettings: show});
    }

    get tableId() {
        return this.globalConfig.get(ConfigKeys.TABLE_ID) || '';
    }

    get table() {
        return this.base.getTableByIdIfExists(this.tableId);
    }

    get validated() {
        const isValid = !(
            this.isMissingAPIKey ||
            this.isInvalidAPIKey ||
            this.isMissingTable ||
            this.isMissingLocationField ||
            this.isInvalidLocationField ||
            this.isMissingCacheField ||
            this.isInvalidCacheField ||
            this.isCacheFieldSameAsLocationField
        );

        let action = '';
        let errorKey = '';
        let reason = '';

        // The following conditions are written out in descending priority
        // order, ie. the last one is the most important/relevant

        if (this.isCacheFieldSameAsLocationField) {
            errorKey = 'cacheFieldId';
            action = 'Pick a different cache field.';
            reason = 'You may not use the same field for location and geocode cache.';
        }

        if (this.isMissingCacheField || this.isInvalidCacheField) {
            action =
                'Pick a field to store cached geocoding data. This field must not be used by other map or street view extensions.';
            errorKey = 'cacheFieldId';
            reason = this.isMissingCacheField
                ? 'The geocode cache field is missing.'
                : 'Cache field must be single line text or multiline text.';
        }

        if (this.isMissingLocationField || this.isInvalidLocationField) {
            action = 'Pick a field containing addresses or coordinates.';
            errorKey = 'locationFieldId';
            reason = this.isMissingLocationField
                ? 'Location field is missing.'
                : 'Location field type is not valid, field type must be text based.';
        }

        if (this.isMissingTable) {
            action = 'Pick a table containing a field that stores addresses or coordinates.';
            errorKey = 'table';
            reason = 'Table is missing.';
        }

        if (this.isInvalidAPIKey) {
            // ({action, reason} = getGoogleAuthFailure(this.localState.googleApiKeyError));
            ({action, reason} = getGoogleAuthFailure(this.googleApiKeyError));
            errorKey = 'apiKey';
        }

        if (this.isMissingAPIKey) {
            action = 'Enter a Google Maps API Key.';
            errorKey = 'apiKey';
            reason = 'Google Maps API Key is missing.';
        }

        //
        // 0 = present, no highlight
        // 1 = missing, highlight with orange
        // 2 = invalid, highlight with red
        //
        let severity = 0;
        if (
            this.isInvalidAPIKey ||
            this.isInvalidLocationField ||
            this.isInvalidCacheField ||
            this.isCacheFieldSameAsLocationField
        ) {
            severity = 2;
        }

        if (
            this.isMissingAPIKey ||
            this.isMissingTable ||
            this.isMissingLocationField ||
            this.isMissingCacheField
        ) {
            severity = 1;
        }

        return {
            isValid,
            action,
            errorKey,
            reason,
            severity,
        };
    }
}

const initialSettingsStoreLocalState = {
    showSettings: false,
    isAllowedToOverwriteNonCacheValues: false,
};

const useSettingsStore = () => {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const settings = new SettingsStore(
        base,
        globalConfig,
        useState(initialSettingsStoreLocalState),
    );
    const googleApiKeyError = useGoogleMapsApiError();
    useEffect(() => {
        if (googleApiKeyError) {
            settings.googleApiKeyError = googleApiKeyError;
        }
    });

    return settings;
};

export default useSettingsStore;

export {useSettingsStore, SettingsStore, ConfigKeys};
