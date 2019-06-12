"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewTypes = void 0;

/**
 * An enum of Airtable's view types
 * @alias viewTypes
 * @example
 * import {viewTypes} from '@airtable/blocks/models';
 * const gridViews = myTable.views.filter(view => (
 *     view.type === viewTypes.GRID
 * ));
 */
var ViewTypes = Object.freeze({
  /**
   * @alias viewTypes.GRID
   * @memberof viewTypes
   */
  GRID: 'grid',

  /**
   * @alias viewTypes.FORM
   * @memberof viewTypes
   */
  FORM: 'form',

  /**
   * @alias viewTypes.CALENDAR
   * @memberof viewTypes
   */
  CALENDAR: 'calendar',

  /**
   * @alias viewTypes.GALLERY
   * @memberof viewTypes
   */
  GALLERY: 'gallery',

  /**
   * @alias viewTypes.KANBAN
   * @memberof viewTypes
   */
  KANBAN: 'kanban'
});
exports.ViewTypes = ViewTypes;