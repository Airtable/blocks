import {useBase, useGlobalConfig} from '@airtable/blocks/ui';
import {validateFieldDefinitions} from './data';
import Specification from './Specification';
import {
    VALID,
    MISSING_TABLE,
    SELECTED_MISSING_TABLE,
    SELECTED_MISSING_VIEW,
    INVALID_SPEC_EMPTY,
    INVALID_SPEC_PARSE,
    INVALID_SPEC_UNDEFINED,
    INVALID_FIELD_NAME,
    CANNOT_SHOW_EDITOR_OR_CHART,
} from './constants';

export const ConfigKeys = {
    SPECIFICATIONS: 'specifications',
    TABLE_ID: 'tableId',
    VIEW_ID: 'viewId',
};

export const ConfigKeysLabels = {
    tableId: 'Table',
    viewId: 'View (optional)',
};

/**
 * Return settings from GlobalConfig with defaults, and converts them to Airtable objects.
 * @param {object} globalConfig
 * @param {Base} base - The base being used by the app in order to convert id's to objects
 * @returns {{
 *     hasPermissionToSet: true | false,
 *     specifications: {
 *         [table.id]: {
 *             spec: Vega Lite Configuration Object | null,
 *             viewId: string | null
 *         }
 *     }
 *
 *     // These are the currently selected Table and View
 *     table: Table | null,
 *     tableId: string,
 *     view: View | null,
 *     viewId: string,
 * }}
 */
function getSettings(globalConfig, base) {
    const specifications = globalConfig.get(ConfigKeys.SPECIFICATIONS) || {};
    const tableId = globalConfig.get(ConfigKeys.TABLE_ID);
    const table = tableId ? base.getTableByIdIfExists(tableId) : null;

    if (tableId && !specifications[tableId]) {
        const path = [ConfigKeys.SPECIFICATIONS, tableId];
        const value = {
            json: JSON.stringify(new Specification(table), null, 2),
            viewId: null,
        };

        // If this user has necessary permission, write the default
        // spec to globalConfig
        if (globalConfig.hasPermissionToSet()) {
            globalConfig.setPathsAsync([{path, value}]);
        }
        specifications[tableId] = value;
    }

    const viewId = tableId ? specifications[tableId].viewId : null;
    const view = table && viewId ? table.getViewByIdIfExists(viewId) : null;

    return {
        specifications,
        table,
        tableId,
        view,
        viewId,
    };
}

/**
 * Wraps the settings with validation information
 * @param {object} settings - The object returned by getSettings
 * @returns {{settings: *, isValid: boolean, message: string, code: uint8}}
 */
function getSettingsValidationResult(settings) {
    const {specifications, table, tableId, view, viewId} = settings;
    let code = VALID;
    let message = null;
    let errors = [];
    let specification = '{}';

    // If the table itself does not exist, for any reason,
    // then treat the current state as invalid
    if (table === null) {
        code = tableId ? MISSING_TABLE : SELECTED_MISSING_TABLE;
        message = tableId ? 'Selected table is missing. Please pick a table.' : 'Pick a table.';
    } else {
        // If a view has been selected, but the view does not exist,
        // then treat the current state as invalid
        if (viewId && view === null) {
            code = SELECTED_MISSING_VIEW;
            message = 'Selected view is missing. Please pick a view.';
        }

        if (specifications[tableId]) {
            const {json} = specifications[tableId];

            if (json === undefined) {
                code = INVALID_SPEC_UNDEFINED;
                message = 'Specification is invalid: will not parse undefined JSON.';
            } else {
                if (!json.trim()) {
                    code = INVALID_SPEC_EMPTY;
                    message = 'Specification is invalid: could not parse empty JSON.';
                }
            }

            // If the specific cases above haven't been hit, then
            // attempt to parse the JSON for more JSON-specific syntax
            // error feedback.
            if (!code) {
                try {
                    JSON.parse(json);
                } catch (error) {
                    code = INVALID_SPEC_PARSE;
                    message = `Specification is invalid: ${error.message}`;
                }
            }

            if (code === VALID) {
                const validationErrors = validateFieldDefinitions(table, JSON.parse(json));
                if (validationErrors && validationErrors.length) {
                    code = INVALID_FIELD_NAME;
                    errors.push(...validationErrors);
                }
            }
        }

        specification = tableId && specifications[tableId] ? specifications[tableId].json : '';
    }

    const isValid = !(CANNOT_SHOW_EDITOR_OR_CHART & code);

    if (message) {
        errors.push(message);
    }
    return {
        code,
        errors,
        isValid,
        message,
        settings: {
            specification,
            specifications,
            table,
            tableId,
            view,
            viewId,
        },
    };
}

/**
 * useSetSpecification      Returns a function that has the specification's
 *                          settings path in scope.
 *
 * @param {object} globalConfig
 * @param {string} tableId The id of the table that this specification is
 *                          associated with.
 * @return {Function}       A function to call with a specification JSON
 *                          string to store in globalConfig.
 */
function useSetSpecification(globalConfig, tableId) {
    const path = [ConfigKeys.SPECIFICATIONS, tableId, 'json'];
    /**
     * closure function
     * @param  {string} value A vega-lite specification JSON string
     * @return {undefined}    void
     */
    return value => {
        if (tableId && globalConfig.hasPermissionToSet()) {
            globalConfig.setPathsAsync([{path, value}]);
        }
    };
}

/**
 * A React hook to validate and access settings configured in SettingsForm.
 * @returns {{settings: *, isValid: boolean, message: string}|{settings: *, isValid: boolean}}
 */
export default function useSettings() {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const settings = getSettings(globalConfig, base);
    const validated = getSettingsValidationResult(settings);
    const setSpecification = useSetSpecification(globalConfig, validated.settings.tableId);
    const hasPermissionToSet = globalConfig.hasPermissionToSet();
    return {
        ...validated,
        hasPermissionToSet,
        setSpecification,
    };
}
