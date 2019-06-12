"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modes = exports.ModeTypes = void 0;

/**
 * Record coloring configuration used with {@link QueryResult}s.
 *
 * @namespace recordColoring
 */

/**
 * An enum of the different types of {@link recordColoring.modes}
 *
 * @alias recordColoring.ModeTypes
 * @memberof recordColoring
 */
var ModeTypes = Object.freeze({
  /**
   * @alias recordColoring.ModeTypes.NONE
   * @memberof recordColoring
   */
  NONE: 'none',

  /**
   * @alias recordColoring.ModeTypes.BY_SELECT_FIELD
   * @memberof recordColoring
   */
  BY_SELECT_FIELD: 'bySelectField',

  /**
   * @alias recordColoring.ModeTypes.BY_VIEW
   * @memberof recordColoring
   */
  BY_VIEW: 'byView'
});
exports.ModeTypes = ModeTypes;

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
 * const recordColorMode = recordColoring.modes.fromView(someView);
 *
 * // with a query result:
 * const queryResult = table.selectRecords({ recordColorMode });
 */
var modes = {
  /**
   * @alias recordColoring.modes.none
   * @memberof recordColoring
   * @returns `{type: recordColoring.ModeTypes.NONE}`
   */
  none: () => ({
    type: ModeTypes.NONE
  }),

  /**
   * @alias recordColoring.modes.bySelectField
   * @memberof recordColoring
   * @param selectField
   * @returns `{type: recordColoring.ModeTypes.BY_SELECT_FIELD, selectField: Field}`
   */
  bySelectField: selectField => ({
    type: ModeTypes.BY_SELECT_FIELD,
    selectField
  }),

  /**
   * @alias recordColoring.modes.byView
   * @memberof recordColoring
   * @param view
   * @returns `{type: recordColoring.ModeTypes.BY_VIEW, view: View}`
   */
  byView: view => ({
    type: ModeTypes.BY_VIEW,
    view
  })
};
exports.modes = modes;