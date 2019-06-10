"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modes = exports.ModeTypes = void 0;

/** @namespace recordColoring */

/**
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
/**
 * @alias recordColoring.RecordColorModeType
 * @memberof recordColoring
 */

exports.ModeTypes = ModeTypes;

/**
 * create a record coloring mode object
 *
 * @alias recordColoring.modes
 * @memberof recordColoring
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
 * const queryResult = table.selectRecords({ recordColorMode });
 */
var modes = {
  /**
   * @alias recordColoring.modes.none
   * @memberof recordColoring
   */
  none: () => ({
    type: ModeTypes.NONE
  }),

  /**
   * @alias recordColoring.modes.bySelectField
   * @memberof recordColoring
   * @param selectField
   */
  bySelectField: selectField => ({
    type: ModeTypes.BY_SELECT_FIELD,
    selectField
  }),

  /**
   * @alias recordColoring.modes.byView
   * @memberof recordColoring
   * @param view
   */
  byView: view => ({
    type: ModeTypes.BY_VIEW,
    view
  })
};
exports.modes = modes;