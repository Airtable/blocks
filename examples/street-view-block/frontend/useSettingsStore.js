import {useState} from 'react';
import {useGlobalConfig, useBase} from '@airtable/blocks/ui';

const ConfigKeys = {
    API_KEY: 'apiKey',
    CACHE_FIELD: 'cacheField',
    LOCATION_FIELD: 'locationField',
    SHOW_DEFAULT_UI: 'showDefaultUI',
    SHOW_ROAD_LABELS: 'showRoadLabels',
    TABLE: 'table',
};

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
    }

    get showSettings() {
        return this.localState.showSettings;
    }

    set showSettings(show) {
        this.setLocalState({...this.localState, showSettings: show});
    }

    get googleApiKey() {
        return this.globalConfig.get(ConfigKeys.API_KEY);
    }

    get googleMapURL() {
        return `https://maps.googleapis.com/maps/api/js?v=3.exp&key=${this.googleApiKey}`;
    }

    get tableId() {
        return String(this.globalConfig.get(ConfigKeys.TABLE) || '');
    }

    get table() {
        return this.base.getTableByIdIfExists(this.tableId);
    }

    get locationFieldId() {
        return String(this.globalConfig.get(ConfigKeys.LOCATION_FIELD) || '');
    }

    get locationField() {
        const {table} = this;
        return table ? table.getFieldByIdIfExists(this.locationFieldId) : null;
    }

    get isMinimallyConfigured() {
        return this.googleApiKey && this.table && this.locationField;
    }

    get cacheFieldId() {
        return String(this.globalConfig.get(ConfigKeys.CACHE_FIELD) || '');
    }

    get cacheField() {
        const {table} = this;
        return table ? table.getFieldByIdIfExists(this.cacheFieldId) : null;
    }

    get fieldIds() {
        return [this.locationFieldId, this.cacheFieldId].filter(Boolean);
    }

    get fields() {
        return [this.locationField, this.cacheField].filter(Boolean);
    }

    get showRoadLabels() {
        return this.globalConfig.get(ConfigKeys.SHOW_ROAD_LABELS) !== false;
    }

    set showRoadLabels(newValue) {
        this.globalConfig.setAsync(ConfigKeys.SHOW_ROAD_LABELS, newValue);
    }

    get showDefaultUI() {
        return this.globalConfig.get(ConfigKeys.SHOW_DEFAULT_UI) !== false;
    }

    set showDefaultUI(newValue) {
        this.globalConfig.setAsync(ConfigKeys.SHOW_DEFAULT_UI, newValue);
    }
}

const initialSettingsStoreLocalState = {showSettings: false};

const useSettingsStore = () => {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const localStateTuple = useState(initialSettingsStoreLocalState);
    return new SettingsStore(base, globalConfig, localStateTuple);
};

export default useSettingsStore;

export {useSettingsStore, SettingsStore, ConfigKeys};
