"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.concat");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _watchable = _interopRequireDefault(require("../watchable"));

/**
 * Abstract superclass for all models.
 */
class AbstractModel extends _watchable.default {
  static _isWatchableKey(key) {
    // Override to return whether `key` is a valid watchable key.
    return false;
  }

  constructor(baseData, modelId) {
    super();
    (0, _invariant.default)(typeof modelId === 'string', "".concat(this.constructor._className, " id should be a string"));
    this._baseData = baseData;
    this._id = modelId;
  }
  /** The ID for this model. */


  get id() {
    return this._id;
  }

  get _dataOrNullIfDeleted() {
    // Abstract, implement this.
    throw new Error('abstract method');
  }

  get _data() {
    var data = this._dataOrNullIfDeleted;

    if (data === null) {
      throw new Error(this._getErrorMessageForDeletion());
    }

    return data;
  }
  /**
   * True if the model has been deleted.
   *
   * In general, it's best to avoid keeping a reference to an object past the
   * current event loop, since it may be deleted and trying to access any data
   * of a deleted object (other than its ID) will throw. But if you keep a
   * reference, you can use `isDeleted` to check that it's safe to access the
   * model's data.
   */


  get isDeleted() {
    return this._dataOrNullIfDeleted === null;
  }

  get __baseData() {
    return this._baseData;
  }

  _getErrorMessageForDeletion() {
    return this.constructor._className + ' has been deleted';
  }

  toString() {
    return "[".concat(this.constructor._className, " ").concat(this.id, "]");
  }

}

(0, _defineProperty2.default)(AbstractModel, "_className", 'AbstractModel');
var _default = AbstractModel;
exports.default = _default;