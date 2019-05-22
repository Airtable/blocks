"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.promise");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _private_utils = _interopRequireDefault(require("../private_utils"));

var _abstract_model = _interopRequireDefault(require("./abstract_model"));

const {
  h
} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
/** Abstract superclass for all block SDK models that need to fetch async data. */


class AbstractModelWithAsyncData extends _abstract_model.default {
  static _shouldLoadDataForKey(key) {
    // Override to return whether watching the key should trigger the
    // data to be loaded for this model.
    return false;
  }

  constructor(baseData, modelId) {
    super(baseData, modelId);
    this._isDataLoaded = false;
    this._pendingDataLoadPromise = null;
    this._dataRetainCount = 0;
    this._unloadDataTimeoutId = null;
  }
  /**
   * Watching a key that needs to load data asynchronously will automatically
   * cause the data to be fetched. Once the data is available, the callback
   * will be called.
   */


  watch(keys, callback, context) {
    const validKeys = super.watch(keys, callback, context);

    for (const key of validKeys) {
      if (this.constructor._shouldLoadDataForKey(key)) {
        var _context;

        // Note: for simplicity, we will call loadData for every key that needs
        // needs data, relying on the retain count to unload once all keys have
        // been unwatched.
        _private_utils.default.fireAndForgetPromise((0, _bind.default)(_context = this.loadDataAsync).call(_context, this));
      }
    }

    return validKeys;
  }
  /**
   * Unwatching a key that needs to load data asynchronously will automatically
   * cause the data to be released. Once the data is available, the callback
   * will be called.
   */


  unwatch(keys, callback, context) {
    const validKeys = super.unwatch(keys, callback, context);

    for (const key of validKeys) {
      if (this.constructor._shouldLoadDataForKey(key)) {
        // We called loadDataAsync for every key that needs data so call
        // unloadData for every key to balance the retain count.
        this.unloadData();
      }
    }

    return validKeys;
  }
  /** */


  get isDataLoaded() {
    return this._isDataLoaded;
  }

  async _loadDataAsync() {
    // Override this to fetch the data.
    // It should return an array of watchable keys that changed
    // as a result of loading data.
    throw new Error('abstract method');
  }

  _unloadData() {
    // Override this to unload the data.
    throw new Error('abstract method');
  } // Override this method if your model is dependent on other models.
  // Do NOT load other models' data from _loadDataAsync, since it can lead to
  // unexpected behavior.
  // IMPORTANT: always call super.loadDataAsync() from your override.

  /**
   * Will cause all the async data to be fetched and retained. Every call to
   * `loadDataAsync` should have a matching call to `unloadData`.
   *
   * Returns a Promise that will resolve once the data is loaded.
   */


  async loadDataAsync() {
    if (this._unloadDataTimeoutId !== null) {
      // If we set a timeout to unload data, clear it since we are incrementing
      // the retain count and loading data.
      clearTimeout(this._unloadDataTimeoutId);
      this._unloadDataTimeoutId = null;
    } // We keep a count of how many things have loaded the data so we don't
    // actually unload the data until the retain count comes back down to zero.


    this._dataRetainCount++;

    if (this._isDataLoaded) {
      return;
    }

    if (!this._pendingDataLoadPromise) {
      this._pendingDataLoadPromise = this._loadDataAsync();

      this._pendingDataLoadPromise.then(changedKeys => {
        this._isDataLoaded = true;
        this._pendingDataLoadPromise = null;

        for (const key of changedKeys) {
          this._onChange(key);
        }
      });
    }

    await this._pendingDataLoadPromise;
  } // Override this method if your model is dependent on other models.
  // Do NOT unload other models' data from _unloadData, since it can lead to
  // unexpected behavior.
  // IMPORTANT: always call super.unloadData() from your override.

  /** */


  unloadData() {
    this._dataRetainCount--;

    if (this._dataRetainCount < 0) {
      console.warn(`Block ${this.constructor._className} data over-released`); // eslint-disable-line no-console

      this._dataRetainCount = 0;
    }

    if (this._dataRetainCount === 0) {
      // Don't unload immediately. Wait a while in case something else
      // requests the data, so we can avoid going back to liveapp or
      // the network.
      this._unloadDataTimeoutId = (0, _setTimeout2.default)(() => {
        h.assert(this._dataRetainCount === 0, 'Unload data timeout fired with non-zero retain count'); // Set _isDataLoaded to false before calling _unloadData in case
        // _unloadData reads from isDataLoaded.

        this._isDataLoaded = false;

        this._unloadData();
      }, AbstractModelWithAsyncData.__DATA_UNLOAD_DELAY_MS);
    }
  }

}

(0, _defineProperty2.default)(AbstractModelWithAsyncData, "__DATA_UNLOAD_DELAY_MS", 1000);
var _default = AbstractModelWithAsyncData;
exports.default = _default;