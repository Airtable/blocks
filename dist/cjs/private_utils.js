"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

require("core-js/modules/web.dom-collections.iterator");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.cloneDeep = cloneDeep;
exports.values = values;
exports.entries = entries;
exports.fireAndForgetPromise = fireAndForgetPromise;
exports.has = has;
exports.getEnumValueIfExists = getEnumValueIfExists;
exports.assertEnumValue = assertEnumValue;
exports.isEnumValue = isEnumValue;

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _weakMap = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/weak-map"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _entries = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/entries"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

function cloneDeep(obj) {
  var jsonString = (0, _stringify.default)(obj);

  if (jsonString === undefined) {
    return obj;
  }

  return JSON.parse(jsonString);
} // flow has a stricter definition for Object.values and Object.entries that return mixed in place
// of the actual values. This is because for non-exact objects, that's the only sound definition.
// You can call Object.values with a value typed as {x: number} that actually looks like
// {x: number, y: string}, for example. Returning mixed isn't particularly useful though, so we
// provide these unsound wrappers instead.
// TODO: consider renaming these with unsound_ prefixes.


function values(obj) {
  // flow-disable-next-line
  return (0, _values.default)(obj);
}

function entries(obj) {
  // flow-disable-next-line
  return (0, _entries.default)(obj);
} // Result values are discarded and errors are thrown asynchronously.
// NOTE: this is different from the one in u: the function passed
// in must be fully bound with all of its arguments and will be immediately
// called (this does not return a function). This makes it work better with
// Flow: you get argument type checking by using `.bind`.


function fireAndForgetPromise(fn) {
  fn().catch(function (err) {
    // Defer til later, so the error doesn't cause the promise to be rejected.
    (0, _setTimeout2.default)(function () {
      throw err;
    }, 0);
  });
}

function has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

var invertedEnumCache = new _weakMap.default();

function getInvertedEnumMemoized(enumObj) {
  var existingInvertedEnum = invertedEnumCache.get(enumObj);

  if (existingInvertedEnum) {
    // flow-disable-next-line flow can't type WeakMap precisely enough to know that it's being used as this sort of cache
    return existingInvertedEnum;
  }

  var invertedEnum = {};

  for (var _i = 0, _Object$keys = (0, _keys.default)(enumObj); _i < _Object$keys.length; _i++) {
    var enumKey = _Object$keys[_i];
    var enumValue = enumObj[enumKey];
    invertedEnum[enumValue] = enumKey;
  }

  invertedEnumCache.set(enumObj, invertedEnum);
  return invertedEnum;
}

function getEnumValueIfExists(enumObj, valueToCheck) {
  var invertedEnum = getInvertedEnumMemoized(enumObj);

  if (has(invertedEnum, valueToCheck) && invertedEnum[valueToCheck]) {
    var enumKey = invertedEnum[valueToCheck];
    return enumObj[enumKey];
  }

  return null;
}

function assertEnumValue(enumObj, valueToCheck) {
  var enumValue = getEnumValueIfExists(enumObj, valueToCheck);

  if (!enumValue) {
    throw new Error("Unknown enum value ".concat(valueToCheck));
  }

  return enumValue;
}

function isEnumValue(enumObj, valueToCheck) {
  return getEnumValueIfExists(enumObj, valueToCheck) !== null;
}