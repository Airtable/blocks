"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

require("core-js/modules/es.array.iterator");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

/** */
class Watchable {
  static _isWatchableKey(key) {
    // Override to return whether `key` is a valid watchable key.
    return false;
  }

  constructor() {
    this._changeWatchersByKey = {};
  }
  /**
   * Start watching the given key or keys. The callback will be called when the
   * value changes. Every call to `watch` should have a matching call to `unwatch`.
   *
   * Will log a warning if the keys given are invalid.
   */


  watch(keys, callback, context) {
    if (!(0, _isArray.default)(keys)) {
      keys = [keys];
    }

    const validKeys = [];

    for (const key of keys) {
      if (this.constructor._isWatchableKey(key)) {
        validKeys.push(key);

        if (!this._changeWatchersByKey[key]) {
          this._changeWatchersByKey[key] = [];
        } // Rather than pushing onto this array, we initialize a new array.
        // This is necessary since watches can change as a result of an
        // event getting triggered. It would be bad if as we iterate over
        // our watchers, new watchers get pushed onto the array that we
        // are iterating over.
        // TODO(jb): as a perf optimization, we *could* push onto this array
        // as long as we are not in the middle of iterating over it.


        this._changeWatchersByKey[key] = [...this._changeWatchersByKey[key], {
          callback,
          context
        }];
      } else {
        console.warn(`Invalid key to watch for ${this.constructor._className}: ${key}`); // eslint-disable-line no-console
      }
    }

    return validKeys;
  }
  /**
   * Stop watching the given key or keys. Should be called with the same
   * arguments that were given to `watch`.
   *
   * Will log a warning if the keys given are invalid.
   */


  unwatch(keys, callback, context) {
    if (!(0, _isArray.default)(keys)) {
      keys = [keys];
    }

    const validKeys = [];

    for (const key of keys) {
      if (this.constructor._isWatchableKey(key)) {
        validKeys.push(key);
        const watchers = this._changeWatchersByKey[key];

        if (watchers) {
          const filteredWatchers = (0, _filter.default)(watchers).call(watchers, watcher => {
            return watcher.callback !== callback || watcher.context !== context;
          });

          if (filteredWatchers.length > 0) {
            this._changeWatchersByKey[key] = filteredWatchers;
          } else {
            delete this._changeWatchersByKey[key];
          }
        }
      } else {
        console.warn(`Invalid key to unwatch for ${this.constructor._className}: ${key}`); // eslint-disable-line no-console
      }
    }

    return validKeys;
  }

  _onChange(key, ...args) {
    const watchers = this._changeWatchersByKey[key];

    if (watchers) {
      for (const watcher of watchers) {
        watcher.callback.call(watcher.context, this, key, ...args);
      }
    }
  }

}

(0, _defineProperty2.default)(Watchable, "_className", 'Watchable');
var _default = Watchable;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy93YXRjaGFibGUuanMiXSwibmFtZXMiOlsiV2F0Y2hhYmxlIiwiX2lzV2F0Y2hhYmxlS2V5Iiwia2V5IiwiY29uc3RydWN0b3IiLCJfY2hhbmdlV2F0Y2hlcnNCeUtleSIsIndhdGNoIiwia2V5cyIsImNhbGxiYWNrIiwiY29udGV4dCIsInZhbGlkS2V5cyIsInB1c2giLCJjb25zb2xlIiwid2FybiIsIl9jbGFzc05hbWUiLCJ1bndhdGNoIiwid2F0Y2hlcnMiLCJmaWx0ZXJlZFdhdGNoZXJzIiwid2F0Y2hlciIsImxlbmd0aCIsIl9vbkNoYW5nZSIsImFyZ3MiLCJjYWxsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBO0FBQ0EsTUFBTUEsU0FBTixDQUFzQztBQUVsQyxTQUFPQyxlQUFQLENBQXVCQyxHQUF2QixFQUE2QztBQUN6QztBQUNBLFdBQU8sS0FBUDtBQUNIOztBQUVEQyxFQUFBQSxXQUFXLEdBQUc7QUFDVixTQUFLQyxvQkFBTCxHQUE0QixFQUE1QjtBQUNIO0FBQ0Q7Ozs7Ozs7O0FBTUFDLEVBQUFBLEtBQUssQ0FDREMsSUFEQyxFQUVEQyxRQUZDLEVBR0RDLE9BSEMsRUFJa0I7QUFDbkIsUUFBSSxDQUFDLHNCQUFjRixJQUFkLENBQUwsRUFBMEI7QUFDdEJBLE1BQUFBLElBQUksR0FBRyxDQUFDQSxJQUFELENBQVA7QUFDSDs7QUFFRCxVQUFNRyxTQUFTLEdBQUcsRUFBbEI7O0FBQ0EsU0FBSyxNQUFNUCxHQUFYLElBQWtCSSxJQUFsQixFQUF3QjtBQUNwQixVQUFJLEtBQUtILFdBQUwsQ0FBaUJGLGVBQWpCLENBQWlDQyxHQUFqQyxDQUFKLEVBQTJDO0FBQ3ZDTyxRQUFBQSxTQUFTLENBQUNDLElBQVYsQ0FBZVIsR0FBZjs7QUFDQSxZQUFJLENBQUMsS0FBS0Usb0JBQUwsQ0FBMEJGLEdBQTFCLENBQUwsRUFBcUM7QUFDakMsZUFBS0Usb0JBQUwsQ0FBMEJGLEdBQTFCLElBQWlDLEVBQWpDO0FBQ0gsU0FKc0MsQ0FLdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLGFBQUtFLG9CQUFMLENBQTBCRixHQUExQixJQUFpQyxDQUM3QixHQUFHLEtBQUtFLG9CQUFMLENBQTBCRixHQUExQixDQUQwQixFQUU3QjtBQUFDSyxVQUFBQSxRQUFEO0FBQVdDLFVBQUFBO0FBQVgsU0FGNkIsQ0FBakM7QUFJSCxPQWhCRCxNQWdCTztBQUNIRyxRQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYyw0QkFBMkIsS0FBS1QsV0FBTCxDQUFpQlUsVUFBVyxLQUFJWCxHQUFJLEVBQTdFLEVBREcsQ0FDOEU7QUFDcEY7QUFDSjs7QUFFRCxXQUFPTyxTQUFQO0FBQ0g7QUFDRDs7Ozs7Ozs7QUFNQUssRUFBQUEsT0FBTyxDQUNIUixJQURHLEVBRUhDLFFBRkcsRUFHSEMsT0FIRyxFQUlnQjtBQUNuQixRQUFJLENBQUMsc0JBQWNGLElBQWQsQ0FBTCxFQUEwQjtBQUN0QkEsTUFBQUEsSUFBSSxHQUFHLENBQUNBLElBQUQsQ0FBUDtBQUNIOztBQUVELFVBQU1HLFNBQVMsR0FBRyxFQUFsQjs7QUFDQSxTQUFLLE1BQU1QLEdBQVgsSUFBa0JJLElBQWxCLEVBQXdCO0FBQ3BCLFVBQUksS0FBS0gsV0FBTCxDQUFpQkYsZUFBakIsQ0FBaUNDLEdBQWpDLENBQUosRUFBMkM7QUFDdkNPLFFBQUFBLFNBQVMsQ0FBQ0MsSUFBVixDQUFlUixHQUFmO0FBQ0EsY0FBTWEsUUFBUSxHQUFHLEtBQUtYLG9CQUFMLENBQTBCRixHQUExQixDQUFqQjs7QUFDQSxZQUFJYSxRQUFKLEVBQWM7QUFDVixnQkFBTUMsZ0JBQWdCLEdBQUcscUJBQUFELFFBQVEsTUFBUixDQUFBQSxRQUFRLEVBQVFFLE9BQU8sSUFBSTtBQUNoRCxtQkFBT0EsT0FBTyxDQUFDVixRQUFSLEtBQXFCQSxRQUFyQixJQUFpQ1UsT0FBTyxDQUFDVCxPQUFSLEtBQW9CQSxPQUE1RDtBQUNILFdBRmdDLENBQWpDOztBQUdBLGNBQUlRLGdCQUFnQixDQUFDRSxNQUFqQixHQUEwQixDQUE5QixFQUFpQztBQUM3QixpQkFBS2Qsb0JBQUwsQ0FBMEJGLEdBQTFCLElBQWlDYyxnQkFBakM7QUFDSCxXQUZELE1BRU87QUFDSCxtQkFBTyxLQUFLWixvQkFBTCxDQUEwQkYsR0FBMUIsQ0FBUDtBQUNIO0FBQ0o7QUFDSixPQWJELE1BYU87QUFDSFMsUUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWMsOEJBQTZCLEtBQUtULFdBQUwsQ0FBaUJVLFVBQVcsS0FBSVgsR0FBSSxFQUEvRSxFQURHLENBQ2dGO0FBQ3RGO0FBQ0o7O0FBRUQsV0FBT08sU0FBUDtBQUNIOztBQUNEVSxFQUFBQSxTQUFTLENBQUNqQixHQUFELEVBQW9CLEdBQUdrQixJQUF2QixFQUEyQztBQUNoRCxVQUFNTCxRQUFRLEdBQUcsS0FBS1gsb0JBQUwsQ0FBMEJGLEdBQTFCLENBQWpCOztBQUNBLFFBQUlhLFFBQUosRUFBYztBQUNWLFdBQUssTUFBTUUsT0FBWCxJQUFzQkYsUUFBdEIsRUFBZ0M7QUFDNUJFLFFBQUFBLE9BQU8sQ0FBQ1YsUUFBUixDQUFpQmMsSUFBakIsQ0FBc0JKLE9BQU8sQ0FBQ1QsT0FBOUIsRUFBdUMsSUFBdkMsRUFBNkNOLEdBQTdDLEVBQWtELEdBQUdrQixJQUFyRDtBQUNIO0FBQ0o7QUFDSjs7QUE5RmlDOzs4QkFBaENwQixTLGdCQUNrQixXO2VBZ0dUQSxTIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuLyoqICovXG5jbGFzcyBXYXRjaGFibGU8V2F0Y2hhYmxlS2V5OiBzdHJpbmc+IHtcbiAgICBzdGF0aWMgX2NsYXNzTmFtZSA9ICdXYXRjaGFibGUnO1xuICAgIHN0YXRpYyBfaXNXYXRjaGFibGVLZXkoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgLy8gT3ZlcnJpZGUgdG8gcmV0dXJuIHdoZXRoZXIgYGtleWAgaXMgYSB2YWxpZCB3YXRjaGFibGUga2V5LlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIF9jaGFuZ2VXYXRjaGVyc0J5S2V5OiB7W3N0cmluZ106IEFycmF5PHtjYWxsYmFjazogRnVuY3Rpb24sIGNvbnRleHQ6ID9PYmplY3R9Pn07XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX2NoYW5nZVdhdGNoZXJzQnlLZXkgPSB7fTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3RhcnQgd2F0Y2hpbmcgdGhlIGdpdmVuIGtleSBvciBrZXlzLiBUaGUgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGVcbiAgICAgKiB2YWx1ZSBjaGFuZ2VzLiBFdmVyeSBjYWxsIHRvIGB3YXRjaGAgc2hvdWxkIGhhdmUgYSBtYXRjaGluZyBjYWxsIHRvIGB1bndhdGNoYC5cbiAgICAgKlxuICAgICAqIFdpbGwgbG9nIGEgd2FybmluZyBpZiB0aGUga2V5cyBnaXZlbiBhcmUgaW52YWxpZC5cbiAgICAgKi9cbiAgICB3YXRjaChcbiAgICAgICAga2V5czogV2F0Y2hhYmxlS2V5IHwgQXJyYXk8V2F0Y2hhYmxlS2V5PixcbiAgICAgICAgY2FsbGJhY2s6IEZ1bmN0aW9uLFxuICAgICAgICBjb250ZXh0PzogP09iamVjdCxcbiAgICApOiBBcnJheTxXYXRjaGFibGVLZXk+IHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGtleXMpKSB7XG4gICAgICAgICAgICBrZXlzID0gW2tleXNdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdmFsaWRLZXlzID0gW107XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnN0cnVjdG9yLl9pc1dhdGNoYWJsZUtleShrZXkpKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRLZXlzLnB1c2goa2V5KTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2NoYW5nZVdhdGNoZXJzQnlLZXlba2V5XSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VXYXRjaGVyc0J5S2V5W2tleV0gPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gUmF0aGVyIHRoYW4gcHVzaGluZyBvbnRvIHRoaXMgYXJyYXksIHdlIGluaXRpYWxpemUgYSBuZXcgYXJyYXkuXG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBuZWNlc3Nhcnkgc2luY2Ugd2F0Y2hlcyBjYW4gY2hhbmdlIGFzIGEgcmVzdWx0IG9mIGFuXG4gICAgICAgICAgICAgICAgLy8gZXZlbnQgZ2V0dGluZyB0cmlnZ2VyZWQuIEl0IHdvdWxkIGJlIGJhZCBpZiBhcyB3ZSBpdGVyYXRlIG92ZXJcbiAgICAgICAgICAgICAgICAvLyBvdXIgd2F0Y2hlcnMsIG5ldyB3YXRjaGVycyBnZXQgcHVzaGVkIG9udG8gdGhlIGFycmF5IHRoYXQgd2VcbiAgICAgICAgICAgICAgICAvLyBhcmUgaXRlcmF0aW5nIG92ZXIuXG4gICAgICAgICAgICAgICAgLy8gVE9ETyhqYik6IGFzIGEgcGVyZiBvcHRpbWl6YXRpb24sIHdlICpjb3VsZCogcHVzaCBvbnRvIHRoaXMgYXJyYXlcbiAgICAgICAgICAgICAgICAvLyBhcyBsb25nIGFzIHdlIGFyZSBub3QgaW4gdGhlIG1pZGRsZSBvZiBpdGVyYXRpbmcgb3ZlciBpdC5cbiAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VXYXRjaGVyc0J5S2V5W2tleV0gPSBbXG4gICAgICAgICAgICAgICAgICAgIC4uLnRoaXMuX2NoYW5nZVdhdGNoZXJzQnlLZXlba2V5XSxcbiAgICAgICAgICAgICAgICAgICAge2NhbGxiYWNrLCBjb250ZXh0fSxcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYEludmFsaWQga2V5IHRvIHdhdGNoIGZvciAke3RoaXMuY29uc3RydWN0b3IuX2NsYXNzTmFtZX06ICR7a2V5fWApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWxpZEtleXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN0b3Agd2F0Y2hpbmcgdGhlIGdpdmVuIGtleSBvciBrZXlzLiBTaG91bGQgYmUgY2FsbGVkIHdpdGggdGhlIHNhbWVcbiAgICAgKiBhcmd1bWVudHMgdGhhdCB3ZXJlIGdpdmVuIHRvIGB3YXRjaGAuXG4gICAgICpcbiAgICAgKiBXaWxsIGxvZyBhIHdhcm5pbmcgaWYgdGhlIGtleXMgZ2l2ZW4gYXJlIGludmFsaWQuXG4gICAgICovXG4gICAgdW53YXRjaChcbiAgICAgICAga2V5czogV2F0Y2hhYmxlS2V5IHwgQXJyYXk8V2F0Y2hhYmxlS2V5PixcbiAgICAgICAgY2FsbGJhY2s6IEZ1bmN0aW9uLFxuICAgICAgICBjb250ZXh0PzogP09iamVjdCxcbiAgICApOiBBcnJheTxXYXRjaGFibGVLZXk+IHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGtleXMpKSB7XG4gICAgICAgICAgICBrZXlzID0gW2tleXNdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdmFsaWRLZXlzID0gW107XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnN0cnVjdG9yLl9pc1dhdGNoYWJsZUtleShrZXkpKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRLZXlzLnB1c2goa2V5KTtcbiAgICAgICAgICAgICAgICBjb25zdCB3YXRjaGVycyA9IHRoaXMuX2NoYW5nZVdhdGNoZXJzQnlLZXlba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAod2F0Y2hlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsdGVyZWRXYXRjaGVycyA9IHdhdGNoZXJzLmZpbHRlcih3YXRjaGVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB3YXRjaGVyLmNhbGxiYWNrICE9PSBjYWxsYmFjayB8fCB3YXRjaGVyLmNvbnRleHQgIT09IGNvbnRleHQ7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsdGVyZWRXYXRjaGVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VXYXRjaGVyc0J5S2V5W2tleV0gPSBmaWx0ZXJlZFdhdGNoZXJzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2NoYW5nZVdhdGNoZXJzQnlLZXlba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGBJbnZhbGlkIGtleSB0byB1bndhdGNoIGZvciAke3RoaXMuY29uc3RydWN0b3IuX2NsYXNzTmFtZX06ICR7a2V5fWApOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWxpZEtleXM7XG4gICAgfVxuICAgIF9vbkNoYW5nZShrZXk6IFdhdGNoYWJsZUtleSwgLi4uYXJnczogQXJyYXk8bWl4ZWQ+KSB7XG4gICAgICAgIGNvbnN0IHdhdGNoZXJzID0gdGhpcy5fY2hhbmdlV2F0Y2hlcnNCeUtleVtrZXldO1xuICAgICAgICBpZiAod2F0Y2hlcnMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgd2F0Y2hlciBvZiB3YXRjaGVycykge1xuICAgICAgICAgICAgICAgIHdhdGNoZXIuY2FsbGJhY2suY2FsbCh3YXRjaGVyLmNvbnRleHQsIHRoaXMsIGtleSwgLi4uYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFdhdGNoYWJsZTtcbiJdfQ==