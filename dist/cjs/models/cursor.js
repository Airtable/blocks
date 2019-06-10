"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

require("regenerator-runtime/runtime");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _private_utils = require("../private_utils");

var _abstract_model_with_async_data = _interopRequireDefault(require("./abstract_model_with_async_data"));

var _record = _interopRequireDefault(require("./record"));

var WatchableCursorKeys = Object.freeze({
  selectedRecordIds: 'selectedRecordIds',
  activeTableId: 'activeTableId',
  activeViewId: 'activeViewId',
  isDataLoaded: 'isDataLoaded'
});

// NOTE: cursor is an AbstractModel because it includes loadable data.

/**
 * Contains information about the state of the user's current interactions in Airtable
 *
 * @example
 * import {cursor} from '@airtable/blocks';
 */
var Cursor =
/*#__PURE__*/
function (_AbstractModelWithAsy) {
  (0, _inherits2.default)(Cursor, _AbstractModelWithAsy);
  (0, _createClass2.default)(Cursor, null, [{
    key: "_isWatchableKey",
    value: function _isWatchableKey(key) {
      return (0, _private_utils.isEnumValue)(WatchableCursorKeys, key);
    }
  }, {
    key: "_shouldLoadDataForKey",
    value: function _shouldLoadDataForKey(key) {
      return true;
    }
  }]);

  function Cursor(baseData, airtableInterface) {
    var _this;

    (0, _classCallCheck2.default)(this, Cursor);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Cursor).call(this, baseData, 'cursor'));
    _this._airtableInterface = airtableInterface;
    var selectedRecordIdSet = baseData.cursorData ? baseData.cursorData.selectedRecordIdSet || null : null;
    var activeTableId = baseData.activeTableId;
    var activeViewId = activeTableId ? baseData.tablesById[activeTableId].activeViewId : null;
    _this._cursorData = {
      selectedRecordIdSet,
      activeTableId,
      activeViewId
    };
    Object.seal((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(Cursor, [{
    key: "_onChangeIsDataLoaded",
    value: function _onChangeIsDataLoaded() {
      this._onChange(WatchableCursorKeys.isDataLoaded);
    }
  }, {
    key: "_loadDataAsync",
    value: function () {
      var _loadDataAsync2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        var cursorData;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this._airtableInterface.fetchAndSubscribeToCursorDataAsync();

              case 2:
                cursorData = _context.sent;
                this._cursorData.selectedRecordIdSet = cursorData.selectedRecordIdSet;
                return _context.abrupt("return", [WatchableCursorKeys.selectedRecordIds]);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _loadDataAsync() {
        return _loadDataAsync2.apply(this, arguments);
      }

      return _loadDataAsync;
    }()
  }, {
    key: "_unloadData",
    value: function _unloadData() {
      this._airtableInterface.unsubscribeFromCursorData();

      this._cursorData.selectedRecordIdSet = null;
    }
  }, {
    key: "isRecordSelected",
    value: function isRecordSelected(recordOrRecordId) {
      var selectedRecordIdSet = this._data.selectedRecordIdSet;
      (0, _invariant.default)(selectedRecordIdSet, 'Cursor data is not loaded');
      var recordId;

      if (recordOrRecordId instanceof _record.default) {
        recordId = recordOrRecordId.id;
      } else {
        recordId = recordOrRecordId;
      }

      return !!selectedRecordIdSet[recordId];
    }
    /**
     * Returns the currently active table ID. Can return null when the active table has changed and
     * is not yet loaded.
     */

  }, {
    key: "__applyChangesWithoutTriggeringEvents",
    value: function __applyChangesWithoutTriggeringEvents(changes) {
      var changedKeys = {
        [WatchableCursorKeys.selectedRecordIds]: false,
        [WatchableCursorKeys.activeTableId]: false,
        [WatchableCursorKeys.activeViewId]: false
      };
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = changes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _step.value,
              path = _step$value.path,
              value = _step$value.value;

          if (path[0] === 'cursorData' && path[1] === 'selectedRecordIdSet') {
            (0, _invariant.default)(path.length === 2, 'cannot set within selectedRecordIdSet');
            this._cursorData.selectedRecordIdSet = value;
            changedKeys[WatchableCursorKeys.selectedRecordIds] = true;
          }

          if (path[0] === 'activeTableId') {
            (0, _invariant.default)(value === null || typeof value === 'string', 'activeTableId must be string or null');
            this._cursorData.activeTableId = value;
            changedKeys[WatchableCursorKeys.activeTableId] = true;

            if (value === null) {
              this._cursorData.activeViewId = null;
              changedKeys[WatchableCursorKeys.activeViewId] = true;
            }
          }

          if (path[0] === 'tablesById' && path[1] === this.activeTableId && path[2] === 'activeViewId') {
            (0, _invariant.default)(value === null || typeof value === 'string', 'activeTableId must be string or null');
            this._cursorData.activeViewId = value;
            changedKeys[WatchableCursorKeys.activeViewId] = true;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return changedKeys;
    }
  }, {
    key: "__triggerOnChangeForChangedKeys",
    value: function __triggerOnChangeForChangedKeys(changedKeys) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _private_utils.entries)(changedKeys)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _step2$value = (0, _slicedToArray2.default)(_step2.value, 2),
              key = _step2$value[0],
              didChange = _step2$value[1];

          if (didChange) {
            this._onChange(key);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: "_dataOrNullIfDeleted",
    get: function get() {
      return this._cursorData;
    }
  }, {
    key: "selectedRecordIds",
    get: function get() {
      var selectedRecordIdSet = this._data.selectedRecordIdSet;
      (0, _invariant.default)(selectedRecordIdSet, 'Cursor data is not loaded');
      var selectedRecordIds = Object.keys(selectedRecordIdSet);
      return selectedRecordIds;
    }
  }, {
    key: "activeTableId",
    get: function get() {
      return this._data.activeTableId;
    }
    /**
     * Returns the currently active view ID. This will always be a view belonging to
     * `activeTableId`. Returns `null` when the active view has changed and is not yet loaded.
     */

  }, {
    key: "activeViewId",
    get: function get() {
      return this._data.activeViewId;
    }
  }]);
  return Cursor;
}(_abstract_model_with_async_data.default);

(0, _defineProperty2.default)(Cursor, "_className", 'Cursor');
var _default = Cursor;
exports.default = _default;