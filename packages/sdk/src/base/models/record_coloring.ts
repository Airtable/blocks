/** @module @airtable/blocks/models: Record Coloring */ /** */
import {type ObjectValues} from '../../shared/private_utils';
import type Field from './field';
import type View from './view';

/**
 * An enum of the different types of {@link recordColoring.modes}
 *
 * @hidden
 * @alias recordColoring.ModeTypes
 */
export const ModeTypes = {
    /**
     * @alias recordColoring.ModeTypes.NONE
     */
    NONE: 'none' as const,
    /**
     * @alias recordColoring.ModeTypes.BY_SELECT_FIELD
     */
    BY_SELECT_FIELD: 'bySelectField' as const,
    /**
     * @alias recordColoring.ModeTypes.BY_VIEW
     */
    BY_VIEW: 'byView' as const,
};

/**
 * @hidden
 */
export type RecordColorModeType = ObjectValues<typeof ModeTypes>;

/** */
interface NoRecordColorMode {
    /** */
    type: typeof ModeTypes.NONE;
}

/** */
interface BySelectFieldRecordColorMode {
    /** */
    type: typeof ModeTypes.BY_SELECT_FIELD;
    /** */
    selectField: Field;
}

/** */
interface ByViewRecordColorMode {
    /** */
    type: typeof ModeTypes.BY_VIEW;
    /** */
    view: View;
}

/** */
export type RecordColorMode =
    | NoRecordColorMode
    | BySelectFieldRecordColorMode
    | ByViewRecordColorMode;

export const serialize = (mode: RecordColorMode) => {
    let result = mode.type;
    if (mode.type === ModeTypes.BY_SELECT_FIELD) {
        result += `-${mode.selectField.id}`;
    } else if (mode.type === ModeTypes.BY_VIEW) {
        result += `-${mode.view.id}`;
    }
    return result;
};

/**
 * Record coloring config creators.
 *
 * @alias recordColoring.modes
 * @example
 * ```js
 * import {recordColoring} from '@airtable/blocks/base/models';
 * import {useRecords} from '@airtable/blocks/base/ui';
 *
 * // no record coloring:
 * const recordColorMode = recordColoring.modes.none();
 * // color by select field:
 * const recordColorMode = recordColoring.modes.bySelectField(someSelectField);
 * // color from view:
 * const recordColorMode = recordColoring.modes.byView(someView);
 *
 * // with useRecords:
 * const queryResult = useRecords(table, { recordColorMode })
 *
 * // with a query result:
 * const queryResult = table.selectRecords({ recordColorMode });
 * ```
 */
export const modes = {
    /**
     * Returns a {@link RecordColorMode} that represents no record coloring.
     *
     * @alias recordColoring.modes.none
     */
    none(): NoRecordColorMode {
        return {
            type: ModeTypes.NONE,
        };
    },
    /**
     * Returns a {@link RecordColorMode} that colors records by the specified Select field.
     *
     * @alias recordColoring.modes.bySelectField
     * @param selectField
     */
    bySelectField(selectField: Field): BySelectFieldRecordColorMode {
        return {
            type: ModeTypes.BY_SELECT_FIELD,
            selectField,
        };
    },
    /**
     * Returns a {@link RecordColorMode} that colors records by the specified View.
     *
     * @alias recordColoring.modes.byView
     * @param view
     */
    byView(view: View): ByViewRecordColorMode {
        return {
            type: ModeTypes.BY_VIEW,
            view,
        };
    },
};
