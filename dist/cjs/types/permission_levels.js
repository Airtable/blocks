"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.PermissionLevels = void 0;
const PermissionLevels = {
  NONE: 'none',
  READ: 'read',
  COMMENT: 'comment',
  EDIT: 'edit',
  CREATE: 'create',
  OWNER: 'owner'
};
exports.PermissionLevels = PermissionLevels;