"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.splice");

require("core-js/modules/es.object.to-string");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

class ObjectPool {
  constructor(config) {
    (0, _defineProperty2.default)(this, "_objectsByKey", {});
    this._getKeyFromObject = config.getKeyFromObject;
    this._getKeyFromObjectOptions = config.getKeyFromObjectOptions;
    this._canObjectBeReusedForOptions = config.canObjectBeReusedForOptions;
  }

  registerObjectForReuse(object) {
    var objectKey = this._getKeyFromObject(object);

    var pooledObjects = this._objectsByKey[objectKey];

    if (pooledObjects) {
      pooledObjects.push(object);
    } else {
      this._objectsByKey[objectKey] = [object];
    }
  }

  unregisterObjectForReuse(object) {
    var objectKey = this._getKeyFromObject(object);

    var pooledObjects = this._objectsByKey[objectKey];
    (0, _invariant.default)(pooledObjects, 'pooledObjects');
    var index = pooledObjects.indexOf(object);
    (0, _invariant.default)(index !== -1, 'object not registered');
    pooledObjects.splice(index, 1);

    if (pooledObjects.length === 0) {
      // `delete` causes de-opts, which slows down subsequent reads,
      // so set to undefined instead (unverified that this is actually faster).
      this._objectsByKey[objectKey] = undefined;
    }
  }

  getObjectForReuse(objectOptions) {
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
        for (var _iterator = pooledObjects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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

}

var _default = ObjectPool;
exports.default = _default;