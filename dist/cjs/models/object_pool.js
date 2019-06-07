"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.find");

require("core-js/modules/es.array.find-index");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.splice");

require("core-js/modules/es.object.to-string");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var WEAK_RETAIN_TIME_MS = 10000;

var ObjectPool =
/*#__PURE__*/
function () {
  function ObjectPool(config) {
    (0, _classCallCheck2.default)(this, ObjectPool);
    (0, _defineProperty2.default)(this, "_objectsByKey", {});
    (0, _defineProperty2.default)(this, "_weakObjectsByKey", {});
    this._getKeyFromObject = config.getKeyFromObject;
    this._getKeyFromObjectOptions = config.getKeyFromObjectOptions;
    this._canObjectBeReusedForOptions = config.canObjectBeReusedForOptions;
  } // we have two different ways we can register an object for reuse - weak and strong. This one,
  // strong, will make sure that the object is kept in the pool until it is explicitly removed.


  (0, _createClass2.default)(ObjectPool, [{
    key: "registerObjectForReuseStrong",
    value: function registerObjectForReuseStrong(object) {
      this._unregisterObjectForReuseWeakIfExists(object);

      var objectKey = this._getKeyFromObject(object);

      var pooledObjects = this._objectsByKey[objectKey];

      if (pooledObjects) {
        pooledObjects.push(object);
      } else {
        this._objectsByKey[objectKey] = [object];
      }
    }
  }, {
    key: "unregisterObjectForReuseStrong",
    value: function unregisterObjectForReuseStrong(object) {
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
    } // we have two different ways we can register an object for reuse - weak and strong. This one,
    // weak, will automatically unregister the object after a few seconds go by without it being
    // used.

  }, {
    key: "registerObjectForReuseWeak",
    value: function registerObjectForReuseWeak(object) {
      var objectKey = this._getKeyFromObject(object);

      var pooledObjects = this._weakObjectsByKey[objectKey];
      var toStore = {
        object,
        timeoutId: setTimeout(() => this.unregisterObjectForReuseWeak(object), WEAK_RETAIN_TIME_MS)
      };

      if (pooledObjects) {
        pooledObjects.push(toStore);
      } else {
        this._weakObjectsByKey[objectKey] = [toStore];
      }
    }
  }, {
    key: "unregisterObjectForReuseWeak",
    value: function unregisterObjectForReuseWeak(object) {
      var didExist = this._unregisterObjectForReuseWeakIfExists(object);

      if (!didExist) {
        throw new Error('Object was not registered for reuse');
      }
    }
  }, {
    key: "_unregisterObjectForReuseWeakIfExists",
    value: function _unregisterObjectForReuseWeakIfExists(object) {
      var objectKey = this._getKeyFromObject(object);

      var pooledObjects = this._weakObjectsByKey[objectKey];

      if (!pooledObjects) {
        return false;
      }

      var index = pooledObjects.findIndex(stored => stored.object === object);

      if (index === -1) {
        return false;
      }

      var stored = pooledObjects[index];
      clearTimeout(stored.timeoutId);
      pooledObjects.splice(index, 1);

      if (pooledObjects.length === 0) {
        // `delete` causes de-opts, which slows down subsequent reads,
        // so set to undefined instead (unverified that this is actually faster).
        this._objectsByKey[objectKey] = undefined;
      }

      return true;
    }
  }, {
    key: "_getObjectForReuseStrong",
    value: function _getObjectForReuseStrong(objectOptions) {
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
  }, {
    key: "_getObjectForReuseWeak",
    value: function _getObjectForReuseWeak(objectOptions) {
      var key = this._getKeyFromObjectOptions(objectOptions);

      var pooledObjects = this._weakObjectsByKey[key];

      if (!pooledObjects) {
        return null;
      }

      var stored = pooledObjects.find((_ref) => {
        var object = _ref.object;
        return this._canObjectBeReusedForOptions(object, objectOptions);
      });

      if (!stored) {
        return null;
      }

      var object = stored.object,
          timeoutId = stored.timeoutId; // reset the timer on this object if it's reused

      clearTimeout(timeoutId);
      stored.timeoutId = setTimeout(() => this.unregisterObjectForReuseWeak(object), WEAK_RETAIN_TIME_MS);
      return object;
    }
  }, {
    key: "getObjectForReuse",
    value: function getObjectForReuse(objectOptions) {
      var strongObject = this._getObjectForReuseStrong(objectOptions);

      if (strongObject) {
        return strongObject;
      }

      return this._getObjectForReuseWeak(objectOptions);
    }
  }]);
  return ObjectPool;
}();

var _default = ObjectPool;
exports.default = _default;