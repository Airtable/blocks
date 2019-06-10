"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.string.starts-with");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.WatchableRecordStoreKeys = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

require("regenerator-runtime/runtime");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _private_utils = require("../private_utils");

var _get_sdk = _interopRequireDefault(require("../get_sdk"));

var _abstract_model_with_async_data = _interopRequireDefault(require("./abstract_model_with_async_data"));

var _record = _interopRequireDefault(require("./record"));

var _view_data_store = _interopRequireDefault(require("./view_data_store"));

var WatchableRecordStoreKeys = Object.freeze({
  records: 'records',
  recordIds: 'recordIds',
  cellValues: 'cellValues'
});
exports.WatchableRecordStoreKeys = WatchableRecordStoreKeys;
var WatchableCellValuesInFieldKeyPrefix = 'cellValuesInField:';
var WatchableRecordIdsInViewKeyPrefix = 'recordIdsInView:';
var WatchableRecordColorsInViewKeyPrefix = 'recordColorsInView:'; // The string case is to accommodate prefix keys

/**
 * One RecordStore exists per table, and contains all the record data associated with that table.
 * Table itself is for schema information only, so isn't the appropriate place for this data.
 *
 * @private
 */
var RecordStore =
/*#__PURE__*/
function (_AbstractModelWithAsy) {
  (0, _inherits2.default)(RecordStore, _AbstractModelWithAsy);
  (0, _createClass2.default)(RecordStore, null, [{
    key: "_isWatchableKey",
    value: function _isWatchableKey(key) {
      return (0, _private_utils.isEnumValue)(WatchableRecordStoreKeys, key) || key.startsWith(WatchableCellValuesInFieldKeyPrefix) || key.startsWith(WatchableRecordIdsInViewKeyPrefix) || key.startsWith(WatchableRecordColorsInViewKeyPrefix);
    }
  }, {
    key: "_shouldLoadDataForKey",
    value: function _shouldLoadDataForKey(key) {
      // "Data" means *all* cell values in the table. If only watching records/recordIds,
      // we'll just load record metadata (id, createdTime, commentCount).
      // If only watching specific fields, we'll just load cell values in those
      // fields. Both of those scenarios are handled manually by this class,
      // instead of relying on AbstractModelWithAsyncData.
      return key === WatchableRecordStoreKeys.cellValues;
    }
  }]);

  function RecordStore(baseData, airtableInterface, tableId) {
    var _this;

    (0, _classCallCheck2.default)(this, RecordStore);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RecordStore).call(this, baseData, "".concat(tableId, "-RecordStore")));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_recordModelsById", {});
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_viewDataStoresByViewId", {});
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_areCellValuesLoadedByFieldId", {});
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_pendingCellValuesLoadPromiseByFieldId", {});
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_cellValuesRetainCountByFieldId", {});
    _this._airtableInterface = airtableInterface;
    _this.tableId = tableId; // A bit of a hack, but we use the primary field ID to load record
    // metadata (see _getFieldIdForCausingRecordMetadataToLoad). We copy the
    // ID here instead of calling this.primaryField.id since that would crash
    // when the table is getting unloaded after being deleted.

    _this._primaryFieldId = _this._data.primaryFieldId;
    return _this;
  }

  (0, _createClass2.default)(RecordStore, [{
    key: "getViewDataStore",
    value: function getViewDataStore(viewId) {
      if (this._viewDataStoresByViewId[viewId]) {
        return this._viewDataStoresByViewId[viewId];
      }

      (0, _invariant.default)(this._data.viewsById[viewId], 'view must exist');
      var viewDataStore = new _view_data_store.default(this._baseData, this, this._airtableInterface, viewId);
      this._viewDataStoresByViewId[viewId] = viewDataStore;
      return viewDataStore;
    }
  }, {
    key: "watch",
    value: function watch(keys, callback, context) {
      var validKeys = (0, _get2.default)((0, _getPrototypeOf2.default)(RecordStore.prototype), "watch", this).call(this, keys, callback, context);

      var fieldIdsToLoad = this._getFieldIdsToLoadFromWatchableKeys(validKeys);

      if (fieldIdsToLoad.length > 0) {
        (0, _private_utils.fireAndForgetPromise)(this.loadCellValuesInFieldIdsAsync.bind(this, fieldIdsToLoad));
      }

      return validKeys;
    }
  }, {
    key: "unwatch",
    value: function unwatch(keys, callback, context) {
      var validKeys = (0, _get2.default)((0, _getPrototypeOf2.default)(RecordStore.prototype), "unwatch", this).call(this, keys, callback, context);

      var fieldIdsToUnload = this._getFieldIdsToLoadFromWatchableKeys(validKeys);

      if (fieldIdsToUnload.length > 0) {
        this.unloadCellValuesInFieldIds(fieldIdsToUnload);
      }

      return validKeys;
    }
  }, {
    key: "_getFieldIdsToLoadFromWatchableKeys",
    value: function _getFieldIdsToLoadFromWatchableKeys(keys) {
      var fieldIdsToLoad = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          if (key.startsWith(WatchableCellValuesInFieldKeyPrefix)) {
            var fieldId = key.substring(WatchableCellValuesInFieldKeyPrefix.length);
            fieldIdsToLoad.push(fieldId);
          } else if (key === WatchableRecordStoreKeys.records || key === WatchableRecordStoreKeys.recordIds) {
            fieldIdsToLoad.push(this._getFieldIdForCausingRecordMetadataToLoad());
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

      return fieldIdsToLoad;
    }
  }, {
    key: "_onChangeIsDataLoaded",
    value: function _onChangeIsDataLoaded() {} // noop

    /**
     * The records in this table. The order is arbitrary since records are
     * only ordered in the context of a specific view.
     */

  }, {
    key: "getRecordByIdIfExists",
    value: function getRecordByIdIfExists(recordId) {
      var recordsById = this._data.recordsById;
      (0, _invariant.default)(recordsById, 'Record metadata is not loaded');
      (0, _invariant.default)(typeof recordId === 'string', 'getRecordById expects a string');

      if (!recordsById[recordId]) {
        return null;
      } else {
        if (this._recordModelsById[recordId]) {
          return this._recordModelsById[recordId];
        }

        var newRecord = new _record.default(this._baseData, this, (0, _get_sdk.default)().base.getTableById(this.tableId), recordId);
        this._recordModelsById[recordId] = newRecord;
        return newRecord;
      }
    }
    /**
     * Record metadata means record IDs, createdTime, and commentCount are loaded.
     * Record metadata must be loaded before creating, deleting, or updating records.
     */

  }, {
    key: "loadRecordMetadataAsync",
    value: function () {
      var _loadRecordMetadataAsync = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.loadCellValuesInFieldIdsAsync([this._getFieldIdForCausingRecordMetadataToLoad()]);

              case 2:
                return _context.abrupt("return", _context.sent);

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function loadRecordMetadataAsync() {
        return _loadRecordMetadataAsync.apply(this, arguments);
      }

      return loadRecordMetadataAsync;
    }()
  }, {
    key: "unloadRecordMetadata",
    value: function unloadRecordMetadata() {
      this.unloadCellValuesInFieldIds([this._getFieldIdForCausingRecordMetadataToLoad()]);
    }
  }, {
    key: "_getFieldIdForCausingRecordMetadataToLoad",
    value: function _getFieldIdForCausingRecordMetadataToLoad() {
      // As a shortcut, we'll load the primary field cell values to
      // cause record metadata (id, createdTime, commentCount) to be loaded
      // and subscribed to. In the future, we could add an explicit model
      // bridge to fetch and subscribe to row metadata.
      return this._primaryFieldId;
    }
  }, {
    key: "areCellValuesLoadedForFieldId",
    value: function areCellValuesLoadedForFieldId(fieldId) {
      return this.isDataLoaded || this._areCellValuesLoadedByFieldId[fieldId] || false;
    }
  }, {
    key: "loadCellValuesInFieldIdsAsync",
    value: function () {
      var _loadCellValuesInFieldIdsAsync2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(fieldIds) {
        var fieldIdsWhichAreNotAlreadyLoadedOrLoading, pendingLoadPromises, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _fieldId, pendingLoadPromise, loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise, _i, _fieldIdsWhichAreNotA, fieldId;

        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                fieldIdsWhichAreNotAlreadyLoadedOrLoading = [];
                pendingLoadPromises = [];
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context2.prev = 5;

                for (_iterator2 = fieldIds[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  _fieldId = _step2.value;

                  if (this._cellValuesRetainCountByFieldId[_fieldId] !== undefined) {
                    this._cellValuesRetainCountByFieldId[_fieldId]++;
                  } else {
                    this._cellValuesRetainCountByFieldId[_fieldId] = 1;
                  } // NOTE: we don't use this.areCellValuesLoadedForFieldId() here because
                  // that will return true if the cell values are loaded as a result
                  // of the entire table being loaded. In that scenario, we still
                  // want to separately load the cell values for the field so there
                  // is a separate subscription. Otherwise, when the table data unloads,
                  // the field data would unload as well. This can be improved by just
                  // subscribing to the field data without fetching it, since the cell
                  // values are already in the block frame.


                  if (!this._areCellValuesLoadedByFieldId[_fieldId]) {
                    pendingLoadPromise = this._pendingCellValuesLoadPromiseByFieldId[_fieldId];

                    if (pendingLoadPromise) {
                      pendingLoadPromises.push(pendingLoadPromise);
                    } else {
                      fieldIdsWhichAreNotAlreadyLoadedOrLoading.push(_fieldId);
                    }
                  }
                }

                _context2.next = 13;
                break;

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](5);
                _didIteratorError2 = true;
                _iteratorError2 = _context2.t0;

              case 13:
                _context2.prev = 13;
                _context2.prev = 14;

                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                  _iterator2.return();
                }

              case 16:
                _context2.prev = 16;

                if (!_didIteratorError2) {
                  _context2.next = 19;
                  break;
                }

                throw _iteratorError2;

              case 19:
                return _context2.finish(16);

              case 20:
                return _context2.finish(13);

              case 21:
                if (fieldIdsWhichAreNotAlreadyLoadedOrLoading.length > 0) {
                  // Could inline _loadCellValuesInFieldIdsAsync, but following the
                  // pattern from AbstractModelWithAsyncData where the public method
                  // is responsible for updating retain counts and the private method
                  // actually fetches data.
                  loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise = this._loadCellValuesInFieldIdsAsync(fieldIdsWhichAreNotAlreadyLoadedOrLoading);
                  pendingLoadPromises.push(loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise);

                  for (_i = 0, _fieldIdsWhichAreNotA = fieldIdsWhichAreNotAlreadyLoadedOrLoading; _i < _fieldIdsWhichAreNotA.length; _i++) {
                    fieldId = _fieldIdsWhichAreNotA[_i];
                    this._pendingCellValuesLoadPromiseByFieldId[fieldId] = loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise;
                  } // Doing `.then` instead of performing these actions directly in
                  // _loadCellValuesInFieldIdsAsync so this is similar to
                  // AbstractModelWithAsyncData. The idea is to refactor to avoid code
                  // duplication, so keeping them similar for now hopefully will make the
                  // refactor simpler.


                  loadFieldsWhichAreNotAlreadyLoadedOrLoadingPromise.then(changedKeys => {
                    for (var _i2 = 0, _fieldIdsWhichAreNotA2 = fieldIdsWhichAreNotAlreadyLoadedOrLoading; _i2 < _fieldIdsWhichAreNotA2.length; _i2++) {
                      var fieldId = _fieldIdsWhichAreNotA2[_i2];
                      this._areCellValuesLoadedByFieldId[fieldId] = true;
                      this._pendingCellValuesLoadPromiseByFieldId[fieldId] = undefined;
                    }

                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                      for (var _iterator3 = changedKeys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var key = _step3.value;

                        this._onChange(key);
                      }
                    } catch (err) {
                      _didIteratorError3 = true;
                      _iteratorError3 = err;
                    } finally {
                      try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                          _iterator3.return();
                        }
                      } finally {
                        if (_didIteratorError3) {
                          throw _iteratorError3;
                        }
                      }
                    }
                  });
                }

                _context2.next = 24;
                return Promise.all(pendingLoadPromises);

              case 24:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[5, 9, 13, 21], [14,, 16, 20]]);
      }));

      function loadCellValuesInFieldIdsAsync(_x) {
        return _loadCellValuesInFieldIdsAsync2.apply(this, arguments);
      }

      return loadCellValuesInFieldIdsAsync;
    }()
  }, {
    key: "_loadCellValuesInFieldIdsAsync",
    value: function () {
      var _loadCellValuesInFieldIdsAsync3 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee3(fieldIds) {
        var _ref, newRecordsById, existingRecordsById, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _step4$value, recordId, newRecordObj, existingRecordObj, existingCellValuesByFieldId, i, fieldId, changedKeys;

        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this._airtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync(this.tableId, fieldIds);

              case 2:
                _ref = _context3.sent;
                newRecordsById = _ref.recordsById;

                // Merge with existing data.
                if (!this._data.recordsById) {
                  this._data.recordsById = {};
                }

                existingRecordsById = this._data.recordsById;
                _iteratorNormalCompletion4 = true;
                _didIteratorError4 = false;
                _iteratorError4 = undefined;
                _context3.prev = 9;

                for (_iterator4 = (0, _private_utils.entries)(newRecordsById)[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                  _step4$value = (0, _slicedToArray2.default)(_step4.value, 2), recordId = _step4$value[0], newRecordObj = _step4$value[1];

                  if (!(0, _private_utils.has)(existingRecordsById, recordId)) {
                    existingRecordsById[recordId] = newRecordObj;
                  } else {
                    existingRecordObj = existingRecordsById[recordId]; // Metadata (createdTime, commentCount) should already be up to date,
                    // but just verify for sanity. If this doesn't catch anything, can
                    // remove it for perf.

                    (0, _invariant.default)(existingRecordObj.commentCount === newRecordObj.commentCount, 'comment count out of sync');
                    (0, _invariant.default)(existingRecordObj.createdTime === newRecordObj.createdTime, 'created time out of sync');

                    if (!existingRecordObj.cellValuesByFieldId) {
                      existingRecordObj.cellValuesByFieldId = {};
                    }

                    existingCellValuesByFieldId = existingRecordObj.cellValuesByFieldId;

                    for (i = 0; i < fieldIds.length; i++) {
                      fieldId = fieldIds[i];
                      existingCellValuesByFieldId[fieldId] = newRecordObj.cellValuesByFieldId ? newRecordObj.cellValuesByFieldId[fieldId] : undefined;
                    }
                  }
                }

                _context3.next = 17;
                break;

              case 13:
                _context3.prev = 13;
                _context3.t0 = _context3["catch"](9);
                _didIteratorError4 = true;
                _iteratorError4 = _context3.t0;

              case 17:
                _context3.prev = 17;
                _context3.prev = 18;

                if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                  _iterator4.return();
                }

              case 20:
                _context3.prev = 20;

                if (!_didIteratorError4) {
                  _context3.next = 23;
                  break;
                }

                throw _iteratorError4;

              case 23:
                return _context3.finish(20);

              case 24:
                return _context3.finish(17);

              case 25:
                changedKeys = fieldIds.map(fieldId => WatchableCellValuesInFieldKeyPrefix + fieldId); // Need to trigger onChange for records and recordIds since watching either
                // of those causes record metadata to be loaded (via _getFieldIdForCausingRecordMetadataToLoad)
                // and by convention we trigger a change event when data loads.

                changedKeys.push(WatchableRecordStoreKeys.records);
                changedKeys.push(WatchableRecordStoreKeys.recordIds); // Also trigger cellValues changes since the cell values in the fields
                // are now loaded.

                changedKeys.push(WatchableRecordStoreKeys.cellValues);
                return _context3.abrupt("return", changedKeys);

              case 30:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[9, 13, 17, 25], [18,, 20, 24]]);
      }));

      function _loadCellValuesInFieldIdsAsync(_x2) {
        return _loadCellValuesInFieldIdsAsync3.apply(this, arguments);
      }

      return _loadCellValuesInFieldIdsAsync;
    }()
  }, {
    key: "unloadCellValuesInFieldIds",
    value: function unloadCellValuesInFieldIds(fieldIds) {
      var fieldIdsWithZeroRetainCount = [];
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = fieldIds[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var fieldId = _step5.value;
          var fieldRetainCount = this._cellValuesRetainCountByFieldId[fieldId] || 0;
          fieldRetainCount--;

          if (fieldRetainCount < 0) {
            console.log('Field data over-released'); // eslint-disable-line no-console

            fieldRetainCount = 0;
          }

          this._cellValuesRetainCountByFieldId[fieldId] = fieldRetainCount;

          if (fieldRetainCount === 0) {
            fieldIdsWithZeroRetainCount.push(fieldId);
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      if (fieldIdsWithZeroRetainCount.length > 0) {
        // Don't unload immediately. Wait a while in case something else
        // requests the data, so we can avoid going back to liveapp or
        // the network.
        setTimeout(() => {
          // Make sure the retain count is still zero, since it may
          // have been incremented before the timeout fired.
          var fieldIdsToUnload = fieldIdsWithZeroRetainCount.filter(fieldId => {
            return this._cellValuesRetainCountByFieldId[fieldId] === 0;
          });

          if (fieldIdsToUnload.length > 0) {
            // Set _areCellValuesLoadedByFieldId to false before calling _unloadCellValuesInFieldIds
            // since _unloadCellValuesInFieldIds will check if *any* fields are still loaded.
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
              for (var _iterator6 = fieldIdsToUnload[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var fieldId = _step6.value;
                this._areCellValuesLoadedByFieldId[fieldId] = false;
              }
            } catch (err) {
              _didIteratorError6 = true;
              _iteratorError6 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
                  _iterator6.return();
                }
              } finally {
                if (_didIteratorError6) {
                  throw _iteratorError6;
                }
              }
            }

            this._unloadCellValuesInFieldIds(fieldIdsToUnload);
          }
        }, _abstract_model_with_async_data.default.__DATA_UNLOAD_DELAY_MS);
      }
    }
  }, {
    key: "_unloadCellValuesInFieldIds",
    value: function _unloadCellValuesInFieldIds(fieldIds) {
      this._airtableInterface.unsubscribeFromCellValuesInFields(this.tableId, fieldIds);

      this._afterUnloadDataOrUnloadCellValuesInFieldIds(fieldIds);
    }
  }, {
    key: "_loadDataAsync",
    value: function () {
      var _loadDataAsync2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee4() {
        var tableData, changedKeys, _i3, _Object$keys, fieldId;

        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this._airtableInterface.fetchAndSubscribeToTableDataAsync(this.tableId);

              case 2:
                tableData = _context4.sent;
                this._data.recordsById = tableData.recordsById;
                changedKeys = [WatchableRecordStoreKeys.records, WatchableRecordStoreKeys.recordIds, WatchableRecordStoreKeys.cellValues];

                for (_i3 = 0, _Object$keys = Object.keys(this._data.fieldsById); _i3 < _Object$keys.length; _i3++) {
                  fieldId = _Object$keys[_i3];
                  changedKeys.push(WatchableCellValuesInFieldKeyPrefix + fieldId);
                }

                return _context4.abrupt("return", changedKeys);

              case 7:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function _loadDataAsync() {
        return _loadDataAsync2.apply(this, arguments);
      }

      return _loadDataAsync;
    }()
  }, {
    key: "_unloadData",
    value: function _unloadData() {
      this._airtableInterface.unsubscribeFromTableData(this.tableId);

      this._afterUnloadDataOrUnloadCellValuesInFieldIds();
    }
  }, {
    key: "_afterUnloadDataOrUnloadCellValuesInFieldIds",
    value: function _afterUnloadDataOrUnloadCellValuesInFieldIds(unloadedFieldIds) {
      var areAnyFieldsLoaded = this.isDataLoaded || (0, _private_utils.values)(this._areCellValuesLoadedByFieldId).some(isLoaded => isLoaded);

      if (!this.isDeleted) {
        if (!areAnyFieldsLoaded) {
          this._data.recordsById = undefined;
        } else if (!this.isDataLoaded) {
          var fieldIdsToClear;

          if (unloadedFieldIds) {
            // Specific fields were unloaded, so clear out the cell values for those fields.
            fieldIdsToClear = unloadedFieldIds;
          } else {
            // The entire table was unloaded, but some individual fields are still loaded.
            // We need to clear out the cell values of every field that was unloaded.
            // This is kind of slow, but hopefully uncommon.
            var fieldIds = Object.keys(this._data.fieldsById);
            fieldIdsToClear = fieldIds.filter(fieldId => !this._areCellValuesLoadedByFieldId[fieldId]);
          }

          var recordsById = this._data.recordsById;
          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = (0, _private_utils.values)(recordsById || {})[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              var recordObj = _step7.value;

              for (var i = 0; i < fieldIdsToClear.length; i++) {
                var fieldId = fieldIdsToClear[i];

                if (recordObj.cellValuesByFieldId) {
                  recordObj.cellValuesByFieldId[fieldId] = undefined;
                }
              }
            }
          } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
                _iterator7.return();
              }
            } finally {
              if (_didIteratorError7) {
                throw _iteratorError7;
              }
            }
          }
        }
      }

      if (!areAnyFieldsLoaded) {
        this._recordModelsById = {};
      }
    }
  }, {
    key: "triggerOnChangeForDirtyPaths",
    value: function triggerOnChangeForDirtyPaths(dirtyPaths) {
      if (this.isRecordMetadataLoaded && dirtyPaths.recordsById) {
        // Since tables don't have a record order, need to detect if a record
        // was created or deleted and trigger onChange for records.
        var dirtyFieldIdsSet = {};
        var addedRecordIds = [];
        var removedRecordIds = [];
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
          for (var _iterator8 = (0, _private_utils.entries)(dirtyPaths.recordsById)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var _step8$value = (0, _slicedToArray2.default)(_step8.value, 2),
                recordId = _step8$value[0],
                dirtyRecordPaths = _step8$value[1];

            if (dirtyRecordPaths._isDirty) {
              // If the entire record is dirty, it was either created or deleted.
              (0, _invariant.default)(this._data.recordsById, 'No recordsById');

              if ((0, _private_utils.has)(this._data.recordsById, recordId)) {
                addedRecordIds.push(recordId);
              } else {
                removedRecordIds.push(recordId);
                var recordModel = this._recordModelsById[recordId];

                if (recordModel) {
                  // Remove the Record model if it was deleted.
                  delete this._recordModelsById[recordId];
                }
              }
            } else {
              var _recordModel = this._recordModelsById[recordId];

              if (_recordModel) {
                _recordModel.__triggerOnChangeForDirtyPaths(dirtyRecordPaths);
              }
            }

            var cellValuesByFieldId = dirtyRecordPaths.cellValuesByFieldId;

            if (cellValuesByFieldId) {
              for (var _i4 = 0, _Object$keys2 = Object.keys(cellValuesByFieldId); _i4 < _Object$keys2.length; _i4++) {
                var fieldId = _Object$keys2[_i4];
                dirtyFieldIdsSet[fieldId] = true;
              }
            }
          } // Now that we've composed our created/deleted record ids arrays, let's fire
          // the records onChange event if any records were created or deleted.

        } catch (err) {
          _didIteratorError8 = true;
          _iteratorError8 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
              _iterator8.return();
            }
          } finally {
            if (_didIteratorError8) {
              throw _iteratorError8;
            }
          }
        }

        if (addedRecordIds.length > 0 || removedRecordIds.length > 0) {
          this._onChange(WatchableRecordStoreKeys.records, {
            addedRecordIds,
            removedRecordIds
          });

          this._onChange(WatchableRecordStoreKeys.recordIds, {
            addedRecordIds,
            removedRecordIds
          });
        } // NOTE: this is an experimental (and somewhat messy) way to watch
        // for changes to cells in a table, as an alternative to implementing
        // full event bubbling. For now, it unblocks the things we want to
        // build, but we may replace it.
        // If we keep it, could be more efficient by not calling _onChange
        // if there are no subscribers.
        // TODO: don't trigger changes for fields that aren't supposed to be loaded
        // (in some cases, e.g. record created, liveapp will send cell values
        // that we're not subscribed to).


        var fieldIds = Object.freeze(Object.keys(dirtyFieldIdsSet));
        var recordIds = Object.freeze(Object.keys(dirtyPaths.recordsById));

        if (fieldIds.length > 0 && recordIds.length > 0) {
          this._onChange(WatchableRecordStoreKeys.cellValues, {
            recordIds,
            fieldIds
          });
        }

        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
          for (var _iterator9 = fieldIds[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
            var _fieldId2 = _step9.value;

            this._onChange(WatchableCellValuesInFieldKeyPrefix + _fieldId2, recordIds, _fieldId2);
          }
        } catch (err) {
          _didIteratorError9 = true;
          _iteratorError9 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
              _iterator9.return();
            }
          } finally {
            if (_didIteratorError9) {
              throw _iteratorError9;
            }
          }
        }
      }
    }
  }, {
    key: "_dataOrNullIfDeleted",
    get: function get() {
      return this._baseData.tablesById[this.tableId] || null;
    }
  }, {
    key: "records",
    get: function get() {
      var recordsById = this._data.recordsById;
      (0, _invariant.default)(recordsById, 'Record metadata is not loaded');
      var records = Object.keys(recordsById).map(recordId => {
        var record = this.getRecordByIdIfExists(recordId);
        (0, _invariant.default)(record, 'record');
        return record;
      });
      return records;
    }
    /**
     * The record IDs in this table. The order is arbitrary since records are
     * only ordered in the context of a specific view.
     */

  }, {
    key: "recordIds",
    get: function get() {
      var recordsById = this._data.recordsById;
      (0, _invariant.default)(recordsById, 'Record metadata is not loaded');
      return Object.keys(recordsById);
    }
  }, {
    key: "isRecordMetadataLoaded",
    get: function get() {
      return !!this._data.recordsById;
    }
  }]);
  return RecordStore;
}(_abstract_model_with_async_data.default);

(0, _defineProperty2.default)(RecordStore, "_className", 'RecordStore');
var _default = RecordStore;
exports.default = _default;