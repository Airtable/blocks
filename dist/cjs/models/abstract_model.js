"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.concat");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _watchable = _interopRequireDefault(require("../watchable"));

/**
 * Abstract superclass for all models.
 */
var AbstractModel =
/*#__PURE__*/
function (_Watchable) {
  (0, _inherits2.default)(AbstractModel, _Watchable);
  (0, _createClass2.default)(AbstractModel, null, [{
    key: "_isWatchableKey",
    value: function _isWatchableKey(key) {
      // Override to return whether `key` is a valid watchable key.
      return false;
    }
  }]);

  function AbstractModel(baseData, modelId) {
    var _this;

    (0, _classCallCheck2.default)(this, AbstractModel);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(AbstractModel).call(this));
    (0, _invariant.default)(typeof modelId === 'string', "".concat(_this.constructor._className, " id should be a string"));
    _this._baseData = baseData;
    _this._id = modelId;
    return _this;
  }
  /** The ID for this model. */


  (0, _createClass2.default)(AbstractModel, [{
    key: "_getErrorMessageForDeletion",
    value: function _getErrorMessageForDeletion() {
      return this.constructor._className + ' has been deleted';
    }
  }, {
    key: "toString",
    value: function toString() {
      return "[".concat(this.constructor._className, " ").concat(this.id, "]");
    }
  }, {
    key: "id",
    get: function get() {
      return this._id;
    }
  }, {
    key: "_dataOrNullIfDeleted",
    get: function get() {
      // Abstract, implement this.
      throw new Error('abstract method');
    }
  }, {
    key: "_data",
    get: function get() {
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

  }, {
    key: "isDeleted",
    get: function get() {
      return this._dataOrNullIfDeleted === null;
    }
  }, {
    key: "__baseData",
    get: function get() {
      return this._baseData;
    }
  }]);
  return AbstractModel;
}(_watchable.default);

(0, _defineProperty2.default)(AbstractModel, "_className", 'AbstractModel');
var _default = AbstractModel;
exports.default = _default;