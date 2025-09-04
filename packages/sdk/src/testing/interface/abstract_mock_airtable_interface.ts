import {
    AppInterface,
    FieldTypeConfig,
    FieldTypeProviderCore,
    GlobalConfigHelpers,
} from '../../shared/types/airtable_interface_core';
import {
    AirtableInterface,
    SdkInitData,
    IdGenerator,
    BlockInstallationPageElementCustomPropertyForAirtableInterface,
} from '../../interface/types/airtable_interface';
import {FieldId, RecordId} from '../../shared/types/hyper_ids';
import {cloneDeep, ObjectMap} from '../../shared/private_utils';
import {spawnError} from '../../shared/error_utils';
import {ModelChange} from '../../shared/types/base_core';
import {FieldData} from '../../interface/types/field';
import {PermissionCheckResult} from '../../shared/types/mutations_core';
import {Mutation} from '../../interface/types/mutations';
const EventEmitter = require('events');

/** @internal */
const fieldTypeProvider: FieldTypeProviderCore = {
    isComputed(fieldData: FieldData): boolean {
        return false;
    },
    getConfig: (
        appInterface: AppInterface,
        fieldData: FieldData,
        fieldNamesById: ObjectMap<FieldId, string>,
    ) => {
        return {
            type: fieldData.type,
            options: fieldData.typeOptions,
        } as FieldTypeConfig;
    },
    convertStringToCellValue(appInterface: AppInterface, string: string, fieldData: FieldData) {
        return '';
    },
    convertCellValueToString(appInterface: AppInterface, cellValue: unknown, fieldData: FieldData) {
        return '';
    },
    getCellRendererData(
        appInterface: AppInterface,
        cellValue: unknown,
        fieldData: FieldData,
        shouldWrap: boolean,
    ) {
        return {cellValueHtml: `<pre>${JSON.stringify(cellValue)}</pre>`, attributes: {}};
    },
    validateCellValueForUpdate(
        appInterface: AppInterface,
        newCellValue: unknown,
        currentCellValue: unknown,
        fieldData: FieldData,
    ) {
        return {isValid: true};
    },
};

/** @internal */
const globalConfigHelpers: GlobalConfigHelpers = {
    validatePath(path, store) {
        return {isValid: true};
    },
    validateAndApplyUpdates(updates, store) {
        throw spawnError('validateAndApplyUpdates unimplemented');
    },
};

/** @internal */
const idGenerator: IdGenerator = {
    generateRecordId: () => 'recGeneratedMockId',
};

/**
 * An abstract base class with a common interface exposed to both Blocks SDK's
 * internal automated test suite and the blocks-testing public repo.
 *
 * @hidden
 */
export abstract class AbstractMockAirtableInterface extends EventEmitter
    implements AirtableInterface {
    sdkInitData!: SdkInitData;

    private _initData: SdkInitData;

    constructor(initData: SdkInitData) {
        super();
        this._initData = cloneDeep(initData);
        this.reset();
    }

    /**
     * Revert the mock interface to its initial state. This includes:
     *
     * - removing all event listeners
     * - restoring the database schema
     */
    reset() {
        this.removeAllListeners();
        this.sdkInitData = cloneDeep(this._initData);
    }

    get fieldTypeProvider() {
        return fieldTypeProvider;
    }

    get globalConfigHelpers() {
        return globalConfigHelpers;
    }

    get idGenerator() {
        return idGenerator;
    }

    assertAllowedSdkPackageVersion() {}

    applyMutationAsync(mutation: Mutation, opts?: {holdForMs?: number}): Promise<void> {
        return Promise.resolve();
    }

    checkPermissionsForMutation(mutation: Mutation): PermissionCheckResult {
        return {
            hasPermission: true,
        };
    }

    fetchForeignRecordsAsync(
        tableId: string,
        recordId: string,
        fieldId: string,
        filterString: string,
    ): Promise<{records: ReadonlyArray<{id: RecordId; name: string}>}> {
        return Promise.resolve({records: []});
    }

    setCustomPropertiesAsync(
        properties: Array<BlockInstallationPageElementCustomPropertyForAirtableInterface>,
    ): Promise<boolean> {
        return Promise.resolve(true);
    }

    subscribeToModelUpdates(fn: Function) {
        this.on('modelupdates', fn);
    }

    subscribeToGlobalConfigUpdates() {}

    triggerModelUpdates(changes: ReadonlyArray<ModelChange>) {
        this.emit('modelupdates', {changes});
    }

    triggerGlobalConfigUpdates() {}

    abstract expandRecord(tableId: string, recordId: string): void;
    abstract reloadFrame(): void;
    abstract trackEvent(): void;
    abstract trackExposure(): void;
    abstract sendStat(): void;
}
