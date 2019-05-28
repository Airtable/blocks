// @flow
import type FieldModel from './field';
import type ViewModel from './view';

export const ModeTypes = Object.freeze({
    NONE: ('none': 'none'),
    BY_SELECT_FIELD: ('bySelectField': 'bySelectField'),
    BY_VIEW: ('byView': 'byView'),
});

export type RecordColorModeType = $Values<typeof ModeTypes>;

export type RecordColorMode =
    | {|type: typeof ModeTypes.NONE|}
    | {|type: typeof ModeTypes.BY_SELECT_FIELD, selectField: FieldModel|}
    | {|type: typeof ModeTypes.BY_VIEW, view: ViewModel|};

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
    bySelectField: (selectField: FieldModel) => ({
        type: ModeTypes.BY_SELECT_FIELD,
        selectField,
    }),
    byView: (view: ViewModel) => ({
        type: ModeTypes.BY_VIEW,
        view,
    }),
};
