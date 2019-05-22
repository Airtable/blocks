"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _weakMap = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/weak-map"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

class PrivateUtils {
  constructor() {
    (0, _defineProperty2.default)(this, "_invertedEnumCache", new _weakMap.default());
  }

  cloneDeep(obj) {
    const jsonString = (0, _stringify.default)(obj);

    if (jsonString === undefined) {
      return obj;
    }

    return JSON.parse(jsonString);
  }

  values(obj) {
    var _context;

    return (0, _map.default)(_context = (0, _keys.default)(obj)).call(_context, key => obj[key]);
  }

  entries(obj) {
    var _context2;

    return (0, _map.default)(_context2 = (0, _keys.default)(obj)).call(_context2, key => [key, obj[key]]);
  } // Result values are discarded and errors are thrown asynchronously.
  // NOTE: this is different from the one in u: the function passed
  // in must be fully bound with all of its arguments and will be immediately
  // called (this does not return a function). This makes it work better with
  // Flow: you get argument type checking by using `.bind`.


  fireAndForgetPromise(fn) {
    fn().catch(err => {
      // Defer til later, so the error doesn't cause the promise to be rejected.
      (0, _setTimeout2.default)(() => {
        throw err;
      }, 0);
    });
  }

  has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  _getInvertedEnumMemoized(enumObj) {
    const existingInvertedEnum = this._invertedEnumCache.get(enumObj);

    if (existingInvertedEnum) {
      // flow-disable-next-line flow can't type WeakMap precisely enough to know that it's being used as this sort of cache
      return existingInvertedEnum;
    }

    const invertedEnum = {};

    for (const enumKey of (0, _keys.default)(enumObj)) {
      const enumValue = enumObj[enumKey];
      invertedEnum[enumValue] = enumKey;
    }

    this._invertedEnumCache.set(enumObj, invertedEnum);

    return invertedEnum;
  }

  getEnumValueIfExists(enumObj, valueToCheck) {
    const invertedEnum = this._getInvertedEnumMemoized(enumObj);

    if (this.has(invertedEnum, valueToCheck) && invertedEnum[valueToCheck]) {
      const enumKey = invertedEnum[valueToCheck];
      return enumObj[enumKey];
    }

    return null;
  }

  assertEnumValue(enumObj, valueToCheck) {
    const enumValue = this.getEnumValueIfExists(enumObj, valueToCheck);

    if (!enumValue) {
      throw new Error(`Unknown enum value ${valueToCheck}`);
    }

    return enumValue;
  }

  isEnumValue(enumObj, valueToCheck) {
    return this.getEnumValueIfExists(enumObj, valueToCheck) !== null;
  }

}

var _default = new PrivateUtils();

exports.default = _default;