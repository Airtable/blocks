"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

class ObjectPool {
  constructor(config) {
    (0, _defineProperty2.default)(this, "_objectsByKey", {});
    this._getKeyFromObject = config.getKeyFromObject;
    this._getKeyFromObjectOptions = config.getKeyFromObjectOptions;
    this._canObjectBeReusedForOptions = config.canObjectBeReusedForOptions;
  }

  registerObjectForReuse(object) {
    const objectKey = this._getKeyFromObject(object);

    const pooledObjects = this._objectsByKey[objectKey];

    if (pooledObjects) {
      pooledObjects.push(object);
    } else {
      this._objectsByKey[objectKey] = [object];
    }
  }

  unregisterObjectForReuse(object) {
    const objectKey = this._getKeyFromObject(object);

    const pooledObjects = this._objectsByKey[objectKey];
    (0, _invariant.default)(pooledObjects, 'pooledObjects');
    const index = (0, _indexOf.default)(pooledObjects).call(pooledObjects, object);
    (0, _invariant.default)(index !== -1, 'object not registered');
    (0, _splice.default)(pooledObjects).call(pooledObjects, index, 1);

    if (pooledObjects.length === 0) {
      // `delete` causes de-opts, which slows down subsequent reads,
      // so set to undefined instead (unverified that this is actually faster).
      this._objectsByKey[objectKey] = undefined;
    }
  }

  getObjectForReuse(objectOptions) {
    const key = this._getKeyFromObjectOptions(objectOptions);

    const pooledObjects = this._objectsByKey[key];

    if (pooledObjects) {
      // We expect that there won't be too many QueryResults for a given
      // model, so iterating over them should be okay. If this assumption
      // ends up being wrong, we can hash the opts or something.
      for (const object of pooledObjects) {
        if (this._canObjectBeReusedForOptions(object, objectOptions)) {
          return object;
        }
      }
    }

    return null;
  }

}

var _default = ObjectPool;
exports.default = _default;