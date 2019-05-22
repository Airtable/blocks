"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var ObjectPool =
/*#__PURE__*/
function () {
  function ObjectPool(config) {
    (0, _classCallCheck2.default)(this, ObjectPool);
    (0, _defineProperty2.default)(this, "_objectsByKey", {});
    this._getKeyFromObject = config.getKeyFromObject;
    this._getKeyFromObjectOptions = config.getKeyFromObjectOptions;
    this._canObjectBeReusedForOptions = config.canObjectBeReusedForOptions;
  }

  (0, _createClass2.default)(ObjectPool, [{
    key: "registerObjectForReuse",
    value: function registerObjectForReuse(object) {
      var objectKey = this._getKeyFromObject(object);

      var pooledObjects = this._objectsByKey[objectKey];

      if (pooledObjects) {
        pooledObjects.push(object);
      } else {
        this._objectsByKey[objectKey] = [object];
      }
    }
  }, {
    key: "unregisterObjectForReuse",
    value: function unregisterObjectForReuse(object) {
      var objectKey = this._getKeyFromObject(object);

      var pooledObjects = this._objectsByKey[objectKey];
      (0, _invariant.default)(pooledObjects, 'pooledObjects');
      var index = (0, _indexOf.default)(pooledObjects).call(pooledObjects, object);
      (0, _invariant.default)(index !== -1, 'object not registered');
      (0, _splice.default)(pooledObjects).call(pooledObjects, index, 1);

      if (pooledObjects.length === 0) {
        // `delete` causes de-opts, which slows down subsequent reads,
        // so set to undefined instead (unverified that this is actually faster).
        this._objectsByKey[objectKey] = undefined;
      }
    }
  }, {
    key: "getObjectForReuse",
    value: function getObjectForReuse(objectOptions) {
      var key = this._getKeyFromObjectOptions(objectOptions);

      var pooledObjects = this._objectsByKey[key];

      if (pooledObjects) {
        // We expect that there won't be too many QueryResults for a given
        // model, so iterating over them should be okay. If this assumption
        // ends up being wrong, we can hash the opts or something.
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator2.default)(pooledObjects), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var object = _step.value;

            if (this._canObjectBeReusedForOptions(object, objectOptions)) {
              return object;
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
      }

      return null;
    }
  }]);
  return ObjectPool;
}();

var _default = ObjectPool;
exports.default = _default;