"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.entries");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.object.values");

require("core-js/modules/es.weak-map");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
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
exports.spawnUnknownSwitchCaseError = spawnUnknownSwitchCaseError;
exports.spawnAbstractMethodError = spawnAbstractMethodError;
exports.spawnError = spawnError;
exports.isObjectEmpty = isObjectEmpty;
exports.isNullOrUndefinedOrEmpty = isNullOrUndefinedOrEmpty;
exports.compact = compact;

/**
 * @private
 */
function cloneDeep(obj) {
  var jsonString = JSON.stringify(obj);

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

/**
 * @private
 */


function values(obj) {
  return Object.values(obj);
}
/**
 * @private
 */


function entries(obj) {
  // flow-disable-next-line
  return Object.entries(obj);
} // Result values are discarded and errors are thrown asynchronously.
// NOTE: this is different from the one in u: the function passed
// in must be fully bound with all of its arguments and will be immediately
// called (this does not return a function). This makes it work better with
// Flow: you get argument type checking by using `.bind`.

/**
 * @private
 */


function fireAndForgetPromise(fn) {
  fn().catch(err => {
    // Defer til later, so the error doesn't cause the promise to be rejected.
    setTimeout(() => {
      throw err;
    }, 0);
  });
}
/**
 * @private
 */


function has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
/**
 * @private
 */


var invertedEnumCache = new WeakMap();

function getInvertedEnumMemoized(enumObj) {
  var existingInvertedEnum = invertedEnumCache.get(enumObj);

  if (existingInvertedEnum) {
    // $FlowFixMe flow can't type WeakMap precisely enough to know that it's being used as this sort of cache
    return existingInvertedEnum;
  }

  var invertedEnum = {};

  for (var _i = 0, _Object$keys = Object.keys(enumObj); _i < _Object$keys.length; _i++) {
    var enumKey = _Object$keys[_i];
    var enumValue = enumObj[enumKey];
    invertedEnum[enumValue] = enumKey;
  }

  invertedEnumCache.set(enumObj, invertedEnum);
  return invertedEnum;
}
/**
 * @private
 */


function getEnumValueIfExists(enumObj, valueToCheck) {
  var invertedEnum = getInvertedEnumMemoized(enumObj);

  if (has(invertedEnum, valueToCheck) && invertedEnum[valueToCheck]) {
    var enumKey = invertedEnum[valueToCheck];
    return enumObj[enumKey];
  }

  return null;
}
/**
 * @private
 */


function assertEnumValue(enumObj, valueToCheck) {
  var enumValue = getEnumValueIfExists(enumObj, valueToCheck);

  if (!enumValue) {
    throw new Error("Unknown enum value ".concat(valueToCheck));
  }

  return enumValue;
}
/**
 * @private
 */


function isEnumValue(enumObj, valueToCheck) {
  return getEnumValueIfExists(enumObj, valueToCheck) !== null;
}
/**
 * @private
 */


function spawnUnknownSwitchCaseError(valueDescription, providedValue) {
  var providedValueString = providedValue !== null && providedValue !== undefined ? providedValue : 'null';
  return spawnError("Unknown value ".concat(String(providedValueString), " for ").concat(valueDescription), spawnUnknownSwitchCaseError);
}
/**
 * @private
 */


function spawnAbstractMethodError() {
  return spawnError('Abstract method', spawnAbstractMethodError);
} // If errorOriginFn is specified, all frames above and including the call to errorOriginFn
// will be omitted from the strack trace.

/**
 * @private
 */


function spawnError(errName, errorOriginFn) {
  var err = new Error(errName); // captureStackTrace is only available on v8. It captures the current stack trace
  // and sets the .stack property of the first argument. It will omit all frames above
  // and including "errorOriginFn", which is useful for hiding implementation details of our
  // error throwing helpers (e.g. assert and spawn variants).

  if (Error.captureStackTrace && errorOriginFn) {
    Error.captureStackTrace(err, errorOriginFn);
  }

  return err;
}
/**
 * @private
 */


function isObjectEmpty(obj) {
  for (var key in obj) {
    if (has(obj, key)) {
      return false;
    }
  }

  return true;
}
/**
 * @private
 */


function isNullOrUndefinedOrEmpty(value) {
  return value === null || value === undefined || (typeof value === 'string' || Array.isArray(value)) && value.length === 0 || typeof value === 'object' && isObjectEmpty(value);
}
/**
 * @private
 */


function compact(array) {
  var result = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      if (item !== null && item !== undefined) {
        result.push(item);
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

  return result;
}