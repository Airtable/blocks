// @flow
import type Field from './field';
import type View from './view';

/**
 * Record coloring configuration used with {@link RecordQueryResult}s.
 *
 * @namespace recordColoring
 */

/**
 * An enum of the different types of [recordColoring.modes](#recordcoloringmodes)
 *
 * @alias recordColoring.ModeTypes
 * @memberof recordColoring
 */
export const ModeTypes = Object.freeze({
    /**
     * @alias recordColoring.ModeTypes.NONE
     * @memberof recordColoring
     */
    NONE: ('none': 'none'),
    /**
     * @alias recordColoring.ModeTypes.BY_SELECT_FIELD
     * @memberof recordColoring
     */
    BY_SELECT_FIELD: ('bySelectField': 'bySelectField'),
    /**
     * @alias recordColoring.ModeTypes.BY_VIEW
     * @memberof recordColoring
     */
    BY_VIEW: ('byView': 'byView'),
});

export type RecordColorModeType = $Values<typeof ModeTypes>;

export type RecordColorMode =
    | {|type: typeof ModeTypes.NONE|}
    | {|type: typeof ModeTypes.BY_SELECT_FIELD, selectField: Field|}
    | {|type: typeof ModeTypes.BY_VIEW, view: View|};

/**
 * Record coloring config creators.
 *
 * @alias recordColoring.modes
 * @memberof recordColoring
 * @example
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
 */
export const modes = {
    /**
     * @alias recordColoring.modes.none
     * @memberof recordColoring
     * @returns {{type: recordColoring.ModeTypes.NONE}}
     */
    none: () => ({
        type: ModeTypes.NONE,
    }),
    /**
     * @alias recordColoring.modes.bySelectField
     * @memberof recordColoring
     * @param selectField
     * @returns {{type: recordColoring.ModeTypes.BY_SELECT_FIELD, selectField: Field}}
     */
    bySelectField: (selectField: Field) => ({
        type: ModeTypes.BY_SELECT_FIELD,
        selectField,
    }),
    /**
     * @alias recordColoring.modes.byView
     * @memberof recordColoring
     * @param view
     * @returns {{type: recordColoring.ModeTypes.BY_VIEW, view: View}}
     */
    byView: (view: View) => ({
        type: ModeTypes.BY_VIEW,
        view,
    }),
};
