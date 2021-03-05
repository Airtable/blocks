import {
    FieldId,
    PermissionCheckResult,
    RecordActionData,
    RecordId,
    TableId,
} from '@airtable/blocks/types';
import {
    AbstractMockAirtableInterface,
    BlockRunContextType,
    CursorData,
    Mutation,
    PartialViewData,
    RecordData,
    RequestJson,
    ResponseJson,
} from '@airtable/blocks/unstable_testing_utils';
import {TestMutation} from './test_mutations';
import {spawnError} from './error_utils';

const cannotSimulateErrorMessage =
    'Unable to simulate behavior' +
    '\n\n' +
    'Apps which retrieve model references using JavaScript `import` ' +
    'declarations cannot be tested. To resolve this, replace `import` ' +
    "declaration in your App's source code with corresponding React " +
    'Hooks. For instance, replace' +
    '\n\n' +
    '    import {base} from "@airtable/blocks";' +
    '\n\n' +
    'with' +
    '\n\n' +
    '    const base = useBase();';

/**
 * An implementation of the MockAirtableInterface designed to satisfy the SDK's
 * requirement for an instance at the moment of initial module evaluation. This
 * instance (like the SDK features it enables) is fundamentally untestable both
 * because the consumer cannot control its initial state and because it is
 * shared by every App created in the testing environment.
 *
 * For some features of the SDK, App developers can avoid reliance on the
 * VacantAirtableInterface by refactoring their code to use more testable
 * patterns. This instance informs test authors of such cases by immediately
 * throwing an error (intentionally discouraging its use).
 *
 * For other features of the SDK, the only way to use the feature is via an
 * untestable pattern. In these cases, App developers have no alternative but
 * to rely on the VacantAirtableInterface. This instance informs test authors
 * of such cases by issuing a warning (allowing App code to be partially
 * validated).
 *
 * @internal
 */
export default class VacantAirtableInterface extends AbstractMockAirtableInterface {
    constructor() {
        super({
            isDevelopmentMode: false,
            blockInstallationId: '',
            isFirstRun: false,
            isFullscreen: false,
            initialKvValuesByKey: {},
            runContext: {type: BlockRunContextType.DASHBOARD_APP},
            baseData: {
                id: '',
                name: '',
                activeTableId: '',
                tableOrder: [],
                tablesById: {},
                permissionLevel: 'create',
                currentUserId: '',
                enabledFeatureNames: [],
                collaboratorsById: {},
                activeCollaboratorIds: [],
                cursorData: null,
                billingPlanGrouping: 'pro',
                appInterface: {},
                isBlockDevelopmentRestrictionEnabled: false,
            },
            intentData: null,
        });
    }

    async applyMutationAsync(mutation: TestMutation, opts?: {holdForMs?: number}): Promise<void> {
        throw spawnError(cannotSimulateErrorMessage);
    }

    checkPermissionsForMutation(mutation: Mutation): PermissionCheckResult {
        throw spawnError(cannotSimulateErrorMessage);
    }

    get globalConfigHelpers(): never {
        throw spawnError(cannotSimulateErrorMessage);
    }

    expandRecord(tableId: string, recordId: string, recordIds: Array<string> | null) {
        throw spawnError(cannotSimulateErrorMessage);
    }

    get fieldTypeProvider(): never {
        throw spawnError(cannotSimulateErrorMessage);
    }

    async fetchAndSubscribeToCellValuesInFieldsAsync(
        tableId: TableId,
        fieldIds: Array<FieldId>,
    ): Promise<any> {
        throw spawnError(cannotSimulateErrorMessage);
    }

    async fetchAndSubscribeToCursorDataAsync(): Promise<CursorData> {
        throw spawnError(cannotSimulateErrorMessage);
    }

    async fetchAndSubscribeToTableDataAsync(
        tableId: string,
    ): Promise<{recordsById: {[recordId: string]: RecordData}}> {
        throw spawnError(cannotSimulateErrorMessage);
    }

    async fetchAndSubscribeToViewDataAsync(
        tableId: string,
        viewId: string,
    ): Promise<PartialViewData> {
        throw spawnError(cannotSimulateErrorMessage);
    }

    hasRecord(tableId: TableId, recordId: RecordId): boolean {
        throw spawnError(cannotSimulateErrorMessage);
    }

    get idGenerator(): never {
        throw spawnError(cannotSimulateErrorMessage);
    }

    setFullscreenMaxSize() {
        throw spawnError(cannotSimulateErrorMessage);
    }

    async performBackendFetchAsync(requestJson: RequestJson): Promise<ResponseJson> {
        throw spawnError(cannotSimulateErrorMessage);
    }

    async fetchDefaultCellValuesByFieldIdAsync(): Promise<{[key: string]: unknown}> {
        throw spawnError(cannotSimulateErrorMessage);
    }
    expandRecordList() {
        throw spawnError(cannotSimulateErrorMessage);
    }
    async expandRecordPickerAsync(): Promise<string | null> {
        throw spawnError(cannotSimulateErrorMessage);
    }

    /**
     * `reload` is made available to Apps through an undocumented binding
     * exported by the SDK's main entry point. That reference is associated
     * with the singleton instance of the `Sdk` class and therefore cannot be
     * controlled in the testing environment.
     */
    reloadFrame() {
        // eslint-disable-next-line no-console
        console.warn('Frame reloading cannot be simulated in the App testing environment.');
    }

    /**
     * An App can only retrieve a reference to the `SettingsButton` singleton
     * via a JavaScript `import` declaration. The SDK does not offer a testable
     * pattern for explicitly controlling the visibility of the settings button
     */
    setSettingsButtonVisibility() {
        // eslint-disable-next-line no-console
        console.warn('The Settings button cannot be simulated in the App testing environment.');
    }

    /**
     * `undoRedo` is made available to Apps through an undocumented binding
     * exported by the SDK's main entry point. That reference is associated
     * with the singleton instance of the `Sdk` class and therefore cannot be
     * controlled in the testing environment.
     */
    setUndoRedoMode() {
        // eslint-disable-next-line no-console
        console.warn('The `undoRedo` feature cannot be simulated in the App testing environment.');
    }

    enterFullscreen() {
        throw spawnError(cannotSimulateErrorMessage);
    }

    exitFullscreen() {
        throw spawnError(cannotSimulateErrorMessage);
    }

    async fetchAndSubscribeToPerformRecordActionAsync(): Promise<RecordActionData | null> {
        throw spawnError(cannotSimulateErrorMessage);
    }

    /**
     * `trackEvent` is made available to internal Apps through the
     * `unstable_private_utils` module. That reference is not associated with
     * any instance of the `Sdk` class.
     */
    trackEvent() {
        // eslint-disable-next-line no-console
        console.warn('Event tracking signals cannot be observed in the App testing environment.');
    }

    /**
     * `trackExposure` cannot be invoked by any Apps (neither those authored by
     * Airtable nor by other App developers). It should be implemented to
     * satisfy the AirtableInterface contract, but the implementation should
     * not throw (since it must be successful for Apps to function), nor should
     * it emit an event (since test authors have no need to track its usage).
     */
    trackExposure() {}

    /**
     * `blockStats` is made available to internal Apps through the
     * `unstable_private_utils` module. That reference is not associated with
     * any instance of the `Sdk` class.
     */
    sendStat() {
        // eslint-disable-next-line no-console
        console.warn(
            'Statistic tracking signals cannot be observed in the App testing environment.',
        );
    }
}
