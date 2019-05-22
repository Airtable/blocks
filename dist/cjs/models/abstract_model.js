"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _invariant = _interopRequireDefault(require("invariant"));

var _watchable = _interopRequireDefault(require("../watchable"));

/**
 * Abstract superclass for all models.
 */
class AbstractModel extends _watchable.default {
  static _isWatchableKey(key) {
    // Override to return whether `key` is a valid watchable key.
    return false;
  }

  constructor(baseData, modelId) {
    super();
    (0, _invariant.default)(typeof modelId === 'string', `${this.constructor._className} id should be a string`);
    this._baseData = baseData;
    this._id = modelId;
  }
  /** The ID for this model. */


  get id() {
    return this._id;
  }

  get _dataOrNullIfDeleted() {
    // Abstract, implement this.
    throw new Error('abstract method');
  }

  get _data() {
    const data = this._dataOrNullIfDeleted;

    if (data === null) {
      throw new Error(this._getErrorMessageForDeletion());
    }

    return data;
  }
  /**
   * True if the model has been deleted.
   *
   * In general, it's best to avoid keeping a reference to an object past the
   * current event loop, since it may be deleted and trying to access any data
   * of a deleted object (other than its ID) will throw. But if you keep a
   * reference, you can use `isDeleted` to check that it's safe to access the
   * model's data.
   */


  get isDeleted() {
    return this._dataOrNullIfDeleted === null;
  }

  get __baseData() {
    return this._baseData;
  }

  _getErrorMessageForDeletion() {
    return this.constructor._className + ' has been deleted';
  }

  toString() {
    return `[${this.constructor._className} ${this.id}]`;
  }

}

(0, _defineProperty2.default)(AbstractModel, "_className", 'AbstractModel');
var _default = AbstractModel;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2RlbHMvYWJzdHJhY3RfbW9kZWwuanMiXSwibmFtZXMiOlsiQWJzdHJhY3RNb2RlbCIsIldhdGNoYWJsZSIsIl9pc1dhdGNoYWJsZUtleSIsImtleSIsImNvbnN0cnVjdG9yIiwiYmFzZURhdGEiLCJtb2RlbElkIiwiX2NsYXNzTmFtZSIsIl9iYXNlRGF0YSIsIl9pZCIsImlkIiwiX2RhdGFPck51bGxJZkRlbGV0ZWQiLCJFcnJvciIsIl9kYXRhIiwiZGF0YSIsIl9nZXRFcnJvck1lc3NhZ2VGb3JEZWxldGlvbiIsImlzRGVsZXRlZCIsIl9fYmFzZURhdGEiLCJ0b1N0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7QUFFQTs7QUFFQTs7O0FBR0EsTUFBTUEsYUFBTixTQUE0REMsa0JBQTVELENBQW9GO0FBRWhGLFNBQU9DLGVBQVAsQ0FBdUJDLEdBQXZCLEVBQTZDO0FBQ3pDO0FBQ0EsV0FBTyxLQUFQO0FBQ0g7O0FBR0RDLEVBQUFBLFdBQVcsQ0FBQ0MsUUFBRCxFQUFxQkMsT0FBckIsRUFBc0M7QUFDN0M7QUFFQSw0QkFDSSxPQUFPQSxPQUFQLEtBQW1CLFFBRHZCLEVBRUssR0FBRSxLQUFLRixXQUFMLENBQWlCRyxVQUFXLHdCQUZuQztBQUtBLFNBQUtDLFNBQUwsR0FBaUJILFFBQWpCO0FBQ0EsU0FBS0ksR0FBTCxHQUFXSCxPQUFYO0FBQ0g7QUFDRDs7O0FBQ0EsTUFBSUksRUFBSixHQUFpQjtBQUNiLFdBQU8sS0FBS0QsR0FBWjtBQUNIOztBQUNELE1BQUlFLG9CQUFKLEdBQTRDO0FBQ3hDO0FBQ0EsVUFBTSxJQUFJQyxLQUFKLENBQVUsaUJBQVYsQ0FBTjtBQUNIOztBQUNELE1BQUlDLEtBQUosR0FBc0I7QUFDbEIsVUFBTUMsSUFBSSxHQUFHLEtBQUtILG9CQUFsQjs7QUFDQSxRQUFJRyxJQUFJLEtBQUssSUFBYixFQUFtQjtBQUNmLFlBQU0sSUFBSUYsS0FBSixDQUFVLEtBQUtHLDJCQUFMLEVBQVYsQ0FBTjtBQUNIOztBQUNELFdBQU9ELElBQVA7QUFDSDtBQUNEOzs7Ozs7Ozs7OztBQVNBLE1BQUlFLFNBQUosR0FBeUI7QUFDckIsV0FBTyxLQUFLTCxvQkFBTCxLQUE4QixJQUFyQztBQUNIOztBQUNELE1BQUlNLFVBQUosR0FBMkI7QUFDdkIsV0FBTyxLQUFLVCxTQUFaO0FBQ0g7O0FBQ0RPLEVBQUFBLDJCQUEyQixHQUFXO0FBQ2xDLFdBQU8sS0FBS1gsV0FBTCxDQUFpQkcsVUFBakIsR0FBOEIsbUJBQXJDO0FBQ0g7O0FBQ0RXLEVBQUFBLFFBQVEsR0FBVztBQUNmLFdBQVEsSUFBRyxLQUFLZCxXQUFMLENBQWlCRyxVQUFXLElBQUcsS0FBS0csRUFBRyxHQUFsRDtBQUNIOztBQXREK0U7OzhCQUE5RVYsYSxnQkFDa0IsZTtlQXdEVEEsYSIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCBpbnZhcmlhbnQgZnJvbSAnaW52YXJpYW50JztcbmltcG9ydCB7dHlwZSBCYXNlRGF0YX0gZnJvbSAnLi4vdHlwZXMvYmFzZSc7XG5pbXBvcnQgV2F0Y2hhYmxlIGZyb20gJy4uL3dhdGNoYWJsZSc7XG5cbi8qKlxuICogQWJzdHJhY3Qgc3VwZXJjbGFzcyBmb3IgYWxsIG1vZGVscy5cbiAqL1xuY2xhc3MgQWJzdHJhY3RNb2RlbDxEYXRhVHlwZSwgV2F0Y2hhYmxlS2V5OiBzdHJpbmc+IGV4dGVuZHMgV2F0Y2hhYmxlPFdhdGNoYWJsZUtleT4ge1xuICAgIHN0YXRpYyBfY2xhc3NOYW1lID0gJ0Fic3RyYWN0TW9kZWwnO1xuICAgIHN0YXRpYyBfaXNXYXRjaGFibGVLZXkoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgLy8gT3ZlcnJpZGUgdG8gcmV0dXJuIHdoZXRoZXIgYGtleWAgaXMgYSB2YWxpZCB3YXRjaGFibGUga2V5LlxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIF9iYXNlRGF0YTogQmFzZURhdGE7XG4gICAgX2lkOiBzdHJpbmc7XG4gICAgY29uc3RydWN0b3IoYmFzZURhdGE6IEJhc2VEYXRhLCBtb2RlbElkOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICBpbnZhcmlhbnQoXG4gICAgICAgICAgICB0eXBlb2YgbW9kZWxJZCA9PT0gJ3N0cmluZycsXG4gICAgICAgICAgICBgJHt0aGlzLmNvbnN0cnVjdG9yLl9jbGFzc05hbWV9IGlkIHNob3VsZCBiZSBhIHN0cmluZ2AsXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5fYmFzZURhdGEgPSBiYXNlRGF0YTtcbiAgICAgICAgdGhpcy5faWQgPSBtb2RlbElkO1xuICAgIH1cbiAgICAvKiogVGhlIElEIGZvciB0aGlzIG1vZGVsLiAqL1xuICAgIGdldCBpZCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5faWQ7XG4gICAgfVxuICAgIGdldCBfZGF0YU9yTnVsbElmRGVsZXRlZCgpOiBEYXRhVHlwZSB8IG51bGwge1xuICAgICAgICAvLyBBYnN0cmFjdCwgaW1wbGVtZW50IHRoaXMuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignYWJzdHJhY3QgbWV0aG9kJyk7XG4gICAgfVxuICAgIGdldCBfZGF0YSgpOiBEYXRhVHlwZSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLl9kYXRhT3JOdWxsSWZEZWxldGVkO1xuICAgICAgICBpZiAoZGF0YSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHRoaXMuX2dldEVycm9yTWVzc2FnZUZvckRlbGV0aW9uKCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUcnVlIGlmIHRoZSBtb2RlbCBoYXMgYmVlbiBkZWxldGVkLlxuICAgICAqXG4gICAgICogSW4gZ2VuZXJhbCwgaXQncyBiZXN0IHRvIGF2b2lkIGtlZXBpbmcgYSByZWZlcmVuY2UgdG8gYW4gb2JqZWN0IHBhc3QgdGhlXG4gICAgICogY3VycmVudCBldmVudCBsb29wLCBzaW5jZSBpdCBtYXkgYmUgZGVsZXRlZCBhbmQgdHJ5aW5nIHRvIGFjY2VzcyBhbnkgZGF0YVxuICAgICAqIG9mIGEgZGVsZXRlZCBvYmplY3QgKG90aGVyIHRoYW4gaXRzIElEKSB3aWxsIHRocm93LiBCdXQgaWYgeW91IGtlZXAgYVxuICAgICAqIHJlZmVyZW5jZSwgeW91IGNhbiB1c2UgYGlzRGVsZXRlZGAgdG8gY2hlY2sgdGhhdCBpdCdzIHNhZmUgdG8gYWNjZXNzIHRoZVxuICAgICAqIG1vZGVsJ3MgZGF0YS5cbiAgICAgKi9cbiAgICBnZXQgaXNEZWxldGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YU9yTnVsbElmRGVsZXRlZCA9PT0gbnVsbDtcbiAgICB9XG4gICAgZ2V0IF9fYmFzZURhdGEoKTogQmFzZURhdGEge1xuICAgICAgICByZXR1cm4gdGhpcy5fYmFzZURhdGE7XG4gICAgfVxuICAgIF9nZXRFcnJvck1lc3NhZ2VGb3JEZWxldGlvbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5fY2xhc3NOYW1lICsgJyBoYXMgYmVlbiBkZWxldGVkJztcbiAgICB9XG4gICAgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGBbJHt0aGlzLmNvbnN0cnVjdG9yLl9jbGFzc05hbWV9ICR7dGhpcy5pZH1dYDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFic3RyYWN0TW9kZWw7XG4iXX0=