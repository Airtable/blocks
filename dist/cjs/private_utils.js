"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

class PrivateUtils {
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

  isEnumValue(enumObj, valueToCheck) {
    for (const value of (0, _values.default)(_context3 = this).call(_context3, enumObj)) {
      var _context3;

      if (value === valueToCheck) {
        return true;
      }
    }

    return false;
  }

}

var _default = new PrivateUtils();

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcml2YXRlX3V0aWxzLmpzIl0sIm5hbWVzIjpbIlByaXZhdGVVdGlscyIsImNsb25lRGVlcCIsIm9iaiIsImpzb25TdHJpbmciLCJ1bmRlZmluZWQiLCJKU09OIiwicGFyc2UiLCJ2YWx1ZXMiLCJrZXkiLCJlbnRyaWVzIiwiZmlyZUFuZEZvcmdldFByb21pc2UiLCJmbiIsImNhdGNoIiwiZXJyIiwiaXNFbnVtVmFsdWUiLCJlbnVtT2JqIiwidmFsdWVUb0NoZWNrIiwidmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLE1BQU1BLFlBQU4sQ0FBbUI7QUFDZkMsRUFBQUEsU0FBUyxDQUFXQyxHQUFYLEVBQXNCO0FBQzNCLFVBQU1DLFVBQVUsR0FBRyx3QkFBZUQsR0FBZixDQUFuQjs7QUFDQSxRQUFJQyxVQUFVLEtBQUtDLFNBQW5CLEVBQThCO0FBQzFCLGFBQU9GLEdBQVA7QUFDSDs7QUFDRCxXQUFPRyxJQUFJLENBQUNDLEtBQUwsQ0FBV0gsVUFBWCxDQUFQO0FBQ0g7O0FBQ0RJLEVBQUFBLE1BQU0sQ0FBSUwsR0FBSixFQUFrQztBQUFBOztBQUNwQyxXQUFPLGdEQUFZQSxHQUFaLGtCQUFxQk0sR0FBRyxJQUFJTixHQUFHLENBQUNNLEdBQUQsQ0FBL0IsQ0FBUDtBQUNIOztBQUNEQyxFQUFBQSxPQUFPLENBQUlQLEdBQUosRUFBNEM7QUFBQTs7QUFDL0MsV0FBTyxpREFBWUEsR0FBWixtQkFBcUJNLEdBQUcsSUFBSSxDQUFDQSxHQUFELEVBQU1OLEdBQUcsQ0FBQ00sR0FBRCxDQUFULENBQTVCLENBQVA7QUFDSCxHQWJjLENBY2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0FFLEVBQUFBLG9CQUFvQixDQUFDQyxFQUFELEVBQWU7QUFDL0JBLElBQUFBLEVBQUUsR0FBR0MsS0FBTCxDQUFXQyxHQUFHLElBQUk7QUFDZDtBQUNBLGdDQUFXLE1BQU07QUFDYixjQUFNQSxHQUFOO0FBQ0gsT0FGRCxFQUVHLENBRkg7QUFHSCxLQUxEO0FBTUg7O0FBQ0RDLEVBQUFBLFdBQVcsQ0FBQ0MsT0FBRCxFQUE4QkMsWUFBOUIsRUFBNkQ7QUFDcEUsU0FBSyxNQUFNQyxLQUFYLElBQW9CLHVEQUFZRixPQUFaLENBQXBCLEVBQTBDO0FBQUE7O0FBQ3RDLFVBQUlFLEtBQUssS0FBS0QsWUFBZCxFQUE0QjtBQUN4QixlQUFPLElBQVA7QUFDSDtBQUNKOztBQUNELFdBQU8sS0FBUDtBQUNIOztBQWxDYzs7ZUFxQ0osSUFBSWhCLFlBQUosRSIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5jbGFzcyBQcml2YXRlVXRpbHMge1xuICAgIGNsb25lRGVlcDxUOiBtaXhlZD4ob2JqOiBUKTogVCB7XG4gICAgICAgIGNvbnN0IGpzb25TdHJpbmcgPSBKU09OLnN0cmluZ2lmeShvYmopO1xuICAgICAgICBpZiAoanNvblN0cmluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGpzb25TdHJpbmcpO1xuICAgIH1cbiAgICB2YWx1ZXM8Vj4ob2JqOiB7W3N0cmluZ106IFZ9KTogQXJyYXk8Vj4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5tYXAoa2V5ID0+IG9ialtrZXldKTtcbiAgICB9XG4gICAgZW50cmllczxWPihvYmo6IHtbc3RyaW5nXTogVn0pOiBBcnJheTxbc3RyaW5nLCBWXT4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5tYXAoa2V5ID0+IFtrZXksIG9ialtrZXldXSk7XG4gICAgfVxuICAgIC8vIFJlc3VsdCB2YWx1ZXMgYXJlIGRpc2NhcmRlZCBhbmQgZXJyb3JzIGFyZSB0aHJvd24gYXN5bmNocm9ub3VzbHkuXG4gICAgLy8gTk9URTogdGhpcyBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgb25lIGluIHU6IHRoZSBmdW5jdGlvbiBwYXNzZWRcbiAgICAvLyBpbiBtdXN0IGJlIGZ1bGx5IGJvdW5kIHdpdGggYWxsIG9mIGl0cyBhcmd1bWVudHMgYW5kIHdpbGwgYmUgaW1tZWRpYXRlbHlcbiAgICAvLyBjYWxsZWQgKHRoaXMgZG9lcyBub3QgcmV0dXJuIGEgZnVuY3Rpb24pLiBUaGlzIG1ha2VzIGl0IHdvcmsgYmV0dGVyIHdpdGhcbiAgICAvLyBGbG93OiB5b3UgZ2V0IGFyZ3VtZW50IHR5cGUgY2hlY2tpbmcgYnkgdXNpbmcgYC5iaW5kYC5cbiAgICBmaXJlQW5kRm9yZ2V0UHJvbWlzZShmbjogRnVuY3Rpb24pIHtcbiAgICAgICAgZm4oKS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgLy8gRGVmZXIgdGlsIGxhdGVyLCBzbyB0aGUgZXJyb3IgZG9lc24ndCBjYXVzZSB0aGUgcHJvbWlzZSB0byBiZSByZWplY3RlZC5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH0sIDApO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaXNFbnVtVmFsdWUoZW51bU9iajoge1tzdHJpbmddOiBzdHJpbmd9LCB2YWx1ZVRvQ2hlY2s6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIHRoaXMudmFsdWVzKGVudW1PYmopKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHZhbHVlVG9DaGVjaykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBQcml2YXRlVXRpbHMoKTtcbiJdfQ==