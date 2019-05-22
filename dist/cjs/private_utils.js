"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

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

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var PrivateUtils =
/*#__PURE__*/
function () {
  function PrivateUtils() {
    (0, _classCallCheck2.default)(this, PrivateUtils);
    (0, _defineProperty2.default)(this, "_invertedEnumCache", new _weakMap.default());
  }

  (0, _createClass2.default)(PrivateUtils, [{
    key: "cloneDeep",
    value: function cloneDeep(obj) {
      var jsonString = (0, _stringify.default)(obj);

      if (jsonString === undefined) {
        return obj;
      }

      return JSON.parse(jsonString);
    }
  }, {
    key: "values",
    value: function values(obj) {
      var _context;

      return (0, _map.default)(_context = (0, _keys.default)(obj)).call(_context, function (key) {
        return obj[key];
      });
    }
  }, {
    key: "entries",
    value: function entries(obj) {
      var _context2;

      return (0, _map.default)(_context2 = (0, _keys.default)(obj)).call(_context2, function (key) {
        return [key, obj[key]];
      });
    } // Result values are discarded and errors are thrown asynchronously.
    // NOTE: this is different from the one in u: the function passed
    // in must be fully bound with all of its arguments and will be immediately
    // called (this does not return a function). This makes it work better with
    // Flow: you get argument type checking by using `.bind`.

  }, {
    key: "fireAndForgetPromise",
    value: function fireAndForgetPromise(fn) {
      fn().catch(function (err) {
        // Defer til later, so the error doesn't cause the promise to be rejected.
        (0, _setTimeout2.default)(function () {
          throw err;
        }, 0);
      });
    }
  }, {
    key: "has",
    value: function has(obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
    }
  }, {
    key: "_getInvertedEnumMemoized",
    value: function _getInvertedEnumMemoized(enumObj) {
      var existingInvertedEnum = this._invertedEnumCache.get(enumObj);

      if (existingInvertedEnum) {
        // flow-disable-next-line flow can't type WeakMap precisely enough to know that it's being used as this sort of cache
        return existingInvertedEnum;
      }

      var invertedEnum = {};

      for (var _i = 0, _Object$keys2 = (0, _keys.default)(enumObj); _i < _Object$keys2.length; _i++) {
        var enumKey = _Object$keys2[_i];
        var enumValue = enumObj[enumKey];
        invertedEnum[enumValue] = enumKey;
      }

      this._invertedEnumCache.set(enumObj, invertedEnum);

      return invertedEnum;
    }
  }, {
    key: "getEnumValueIfExists",
    value: function getEnumValueIfExists(enumObj, valueToCheck) {
      var invertedEnum = this._getInvertedEnumMemoized(enumObj);

      if (this.has(invertedEnum, valueToCheck) && invertedEnum[valueToCheck]) {
        var enumKey = invertedEnum[valueToCheck];
        return enumObj[enumKey];
      }

      return null;
    }
  }, {
    key: "assertEnumValue",
    value: function assertEnumValue(enumObj, valueToCheck) {
      var enumValue = this.getEnumValueIfExists(enumObj, valueToCheck);

      if (!enumValue) {
        throw new Error("Unknown enum value ".concat(valueToCheck));
      }

      return enumValue;
    }
  }, {
    key: "isEnumValue",
    value: function isEnumValue(enumObj, valueToCheck) {
      return this.getEnumValueIfExists(enumObj, valueToCheck) !== null;
    }
  }]);
  return PrivateUtils;
}();

var _default = new PrivateUtils();

exports.default = _default;