// @flow
const Base = require('client/blocks/sdk/models/base');
const Table = require('client/blocks/sdk/models/table');
const Field = require('client/blocks/sdk/models/field');
const View = require('client/blocks/sdk/models/view');
const Record = require('client/blocks/sdk/models/record');
const aggregators = require('client/blocks/sdk/models/aggregators');
const ApiFieldTypes = require('client_server_shared/column_types/api_field_types');
const ApiViewTypes = require('client_server_shared/view_types/api_view_types');
const permissions = require('client_server_shared/permissions');

const models = Object.freeze({
    Base,
    Table,
    Field,
    View,
    Record,
    aggregators,
    fieldTypes: ApiFieldTypes,
    viewTypes: ApiViewTypes,
    permissionLevels: permissions.API_LEVELS,
});

module.exports = models;
