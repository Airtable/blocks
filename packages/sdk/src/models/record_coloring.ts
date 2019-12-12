/** @module @airtable/blocks/models: Record Coloring */ /** */
import {ObjectValues} from '../private_utils';
import Field from './field';
import View from './view';

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

/**
 * Record coloring config creators.
 *
 * @alias recordColoring.modes
 * @example
 * ```js
 * import {recordColoring} from '@airtable/blocks/models';
 *
 * // no record coloring:
 * const recordColorMode = recordColoring.modes.none();
 * // color by select field:
 * const recordColorMode = recordColoring.modes.bySelectField(someSelectField);
 * // color from view:
 * const recordColorMode = recordColoring.modes.byView(someView);
 *
 * // with a query result:
 * const queryResult = table.selectRecords({ recordColorMode });
 * ```
 */
export const modes = {
    /**
     * @alias recordColoring.modes.none
     * @returns a record coloring mode
     */
    none(): NoRecordColorMode {
        return {
            type: ModeTypes.NONE,
        };
    },
    /**
     * @alias recordColoring.modes.bySelectField
     * @param selectField
     * @returns a record coloring mode
     */
    bySelectField(selectField: Field): BySelectFieldRecordColorMode {
        return {
            type: ModeTypes.BY_SELECT_FIELD,
            selectField,
        };
    },
    /**
     * @alias recordColoring.modes.byView
     * @param view
     * @returns a record coloring mode
     */
    byView(view: View): ByViewRecordColorMode {
        return {
            type: ModeTypes.BY_VIEW,
            view,
        };
    },
};
