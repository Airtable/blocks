"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.modes = exports.ModeTypes = void 0;
const ModeTypes = {
  NONE: 'none',
  BY_SELECT_FIELD: 'bySelectField',
  BY_VIEW: 'byView'
};
exports.ModeTypes = ModeTypes;

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
const modes = {
  none: () => ({
    type: ModeTypes.NONE
  }),
  bySelectField: selectField => ({
    type: ModeTypes.BY_SELECT_FIELD,
    selectField
  }),
  byView: view => ({
    type: ModeTypes.BY_VIEW,
    view
  })
};
exports.modes = modes;