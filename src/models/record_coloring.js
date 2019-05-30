// @flow
import type Field from './field';
import type View from './view';

export const ModeTypes = Object.freeze({
    NONE: ('none': 'none'),
    BY_SELECT_FIELD: ('bySelectField': 'bySelectField'),
    BY_VIEW: ('byView': 'byView'),
});

export type RecordColorModeType = $Values<typeof ModeTypes>;

export type RecordColorMode =
    | {|type: typeof ModeTypes.NONE|}
    | {|type: typeof ModeTypes.BY_SELECT_FIELD, selectField: Field|}
    | {|type: typeof ModeTypes.BY_VIEW, view: View|};

/**
 * create a record coloring mode object
 *
 * @example
 * import {models} from 'airtable-block';
 *
 * // no record coloring:
 * const recordColorMode = models.recordColoring.modes.none();
 * // color by select field:
 * const recordColorMode = models.recordColoring.modes.bySelectField(someSelectField);
 * // color from view:
 * const recordColorMode = models.recordColoring.modes.fromView(someView);
 *
 * // with a query result:
 * const queryResult = table.select({ recordColorMode });
 */
export const modes = {
    none: () => ({
        type: ModeTypes.NONE,
    }),
    bySelectField: (selectField: Field) => ({
        type: ModeTypes.BY_SELECT_FIELD,
        selectField,
    }),
    byView: (view: View) => ({
        type: ModeTypes.BY_VIEW,
        view,
    }),
};
