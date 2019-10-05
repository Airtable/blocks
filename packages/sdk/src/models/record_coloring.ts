/** @module @airtable/blocks/models: Record Coloring */ /** */
import {ObjectValues} from '../private_utils';
import Field from './field';
import View from './view';

/**
 * Record coloring configuration used with {@link RecordQueryResult}s.
 *
 * @namespace recordColoring
 */

/**
 * An enum of the different types of {@link recordColoring.modes}
 *
 * @alias recordColoring.ModeTypes
 * @memberof recordColoring
 */
export const ModeTypes = Object.freeze({
    /**
     * @alias recordColoring.ModeTypes.NONE
     * @memberof recordColoring
     */
    NONE: 'none' as const,
    /**
     * @alias recordColoring.ModeTypes.BY_SELECT_FIELD
     * @memberof recordColoring
     */
    BY_SELECT_FIELD: 'bySelectField' as const,
    /**
     * @alias recordColoring.ModeTypes.BY_VIEW
     * @memberof recordColoring
     */
    BY_VIEW: 'byView' as const,
});

export type RecordColorModeType = ObjectValues<typeof ModeTypes>;

export type RecordColorMode =
    | {type: typeof ModeTypes.NONE}
    | {type: typeof ModeTypes.BY_SELECT_FIELD; selectField: Field}
    | {type: typeof ModeTypes.BY_VIEW; view: View};

/**
 * Record coloring config creators.
 *
 * @alias recordColoring.modes
 * @memberof recordColoring
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
     * @memberof recordColoring
     * @returns {{type: recordColoring.ModeTypes.NONE}} a record coloring mode
     */
    none: () => ({
        type: ModeTypes.NONE,
    }),
    /**
     * @alias recordColoring.modes.bySelectField
     * @memberof recordColoring
     * @param selectField
     * @returns {{type: recordColoring.ModeTypes.BY_SELECT_FIELD, selectField: Field}} a record coloring mode
     */
    bySelectField: (selectField: Field) => ({
        type: ModeTypes.BY_SELECT_FIELD,
        selectField,
    }),
    /**
     * @alias recordColoring.modes.byView
     * @memberof recordColoring
     * @param view
     * @returns {{type: recordColoring.ModeTypes.BY_VIEW, view: View}} a record coloring mode
     */
    byView: (view: View) => ({
        type: ModeTypes.BY_VIEW,
        view,
    }),
};
