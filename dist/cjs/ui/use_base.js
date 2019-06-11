"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useBase;

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _base = _interopRequireDefault(require("../models/base"));

var _use_watchable = _interopRequireDefault(require("./use_watchable"));

/**
 * A hook for connecting a React component to your Base's schema. This returns a {@link Base}
 * instance and will re-render your component whenever the base's schema changes. That means any
 * change to your base like tables being added or removed, fields getting renamed, etc. It excludes
 * any change to the actual records in the base.
 *
 * useBase should meet most of your needs for working with Base schema. If you need more granular
 * control of when your component updates or want to do anything other than re-render, the lower
 * level {@link useWatchable} hook might help.
 *
 * @returns Base
 * @example
 * import {useBase} from '@airtable/blocks/ui';
 *
 * // renders a list of tables and automatically updates
 * function TableList() {
 *      const base = useBase();
 *
 *      const tables = base.tables.map(table => {
 *          return <li key={table.id}>{table.name}</li>;
 *      });
 *
 *      return <ul>{tables}</ul>;
 * }
 */
function useBase() {
  var base = (0, _get_sdk.default)().base;
  (0, _use_watchable.default)(base, ['__schema']);
  return base;
}