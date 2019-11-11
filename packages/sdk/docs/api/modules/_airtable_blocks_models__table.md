[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/models: Table](_airtable_blocks_models__table.md)

# External module: @airtable/blocks/models: Table

## Index

### Classes

-   [Table](_airtable_blocks_models__table.md#table)

### Type aliases

-   [TableId](_airtable_blocks_models__table.md#tableid)
-   [WatchableTableKey](_airtable_blocks_models__table.md#watchabletablekey)

## Classes

### Table

• **Table**:

_Defined in
[src/models/table.ts:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L40)_

Model class representing a table. Every [Base](_airtable_blocks_models__base.md#base) has one or
more tables.

### fields

• **fields**:

_Defined in
[src/models/table.ts:153](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L153)_

The fields in this table. The order is arbitrary, since fields are only ordered in the context of a
specific view.

Can be watched to know when fields are created or deleted.

**Example:**

```js
console.log(`This table has ${myTable.fields.length} fields`);
```

### id

• **id**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[id](_airtable_blocks_models__abstract_models.md#id)_

_Defined in
[src/models/abstract_model.ts:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/abstract_model.ts#L40)_

The ID for this model.

### isDeleted

• **isDeleted**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[isDeleted](_airtable_blocks_models__abstract_models.md#isdeleted)_

_Defined in
[src/models/abstract_model.ts:69](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/abstract_model.ts#L69)_

`true` if the model has been deleted, and `false` otherwise.

In general, it's best to avoid keeping a reference to an object past the current event loop, since
it may be deleted and trying to access any data of a deleted object (other than its ID) will throw.
But if you keep a reference, you can use `isDeleted` to check that it's safe to access the model's
data.

### name

• **name**:

_Defined in
[src/models/table.ts:113](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L113)_

The name of the table. Can be watched.

**Example:**

```js
console.log(myTable.name);
// => 'Table 1'
```

### primaryField

• **primaryField**:

_Defined in
[src/models/table.ts:138](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L138)_

The table's primary field. Every table has exactly one primary field. The primary field of a table
will not change.

**Example:**

```js
console.log(myTable.primaryField.name);
// => 'Name'
```

### url

• **url**:

_Defined in
[src/models/table.ts:125](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L125)_

The URL for the table. You can visit this URL in the browser to be taken to the table in the
Airtable UI.

**Example:**

```js
console.log(myTable.url);
// => 'https://airtable.com/tblxxxxxxxxxxxxxx'
```

### views

• **views**:

_Defined in
[src/models/table.ts:253](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L253)_

The views in this table. Can be watched to know when views are created, deleted, or reordered.

**Example:**

```js
console.log(`This table has ${myTable.views.length} views`);
```

### checkPermissionsForCreateRecord

▸ **checkPermissionsForCreateRecord**(`fields?`:
ObjectMap‹[FieldId](_airtable_blocks_models__field.md#fieldid) | string, unknown | void›):
_[PermissionCheckResult](_airtable_blocks__mutations.md#permissioncheckresult)_

_Defined in
[src/models/table.ts:1114](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L1114)_

Checks whether the current user has permission to create the specified record.

Accepts partial input, in the same format as
[createRecordAsync](_airtable_blocks_models__table.md#createrecordasync). The more information
provided, the more accurate the permissions check will be.

**Example:**

```js
// Check if user can create a specific record, when you already know what fields/cell values
// will be set for the record.
const createRecordCheckResult = table.checkPermissionsForCreateRecord({
    'Project Name': 'Advertising campaign',
    Budget: 100,
});
if (!createRecordCheckResult.hasPermission) {
    alert(createRecordCheckResult.reasonDisplayString);
}

// Like createRecordAsync, you can use either field names or field IDs.
const createRecordCheckResultWithFieldIds = table.checkPermissionsForCreateRecord({
    [projectNameField.id]: 'Cat video',
    [budgetField.id]: 200,
});

// Check if user could potentially create a record.
// Use when you don't know the specific fields/cell values yet (for example, to show or hide
// UI controls that let you start creating a record.)
const createUnknownRecordCheckResult = table.checkPermissionsForCreateRecord();
```

**Parameters:**

| Name      | Type                                                                                               | Description                                                     |
| --------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `fields?` | ObjectMap‹[FieldId](_airtable_blocks_models__field.md#fieldid) &#124; string, unknown &#124; void› | object mapping `FieldId` or field name to value for that field. |

**Returns:** _[PermissionCheckResult](_airtable_blocks__mutations.md#permissioncheckresult)_

PermissionCheckResult `{hasPermission: true}` if the current user can create the specified record,
`{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used
to display an error message to the user.

### checkPermissionsForCreateRecords

▸ **checkPermissionsForCreateRecords**(`records?`: ReadonlyArray‹object›):
_[PermissionCheckResult](_airtable_blocks__mutations.md#permissioncheckresult)_

_Defined in
[src/models/table.ts:1262](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L1262)_

Checks whether the current user has permission to create the specified records.

Accepts partial input, in the same format as
[createRecordsAsync](_airtable_blocks_models__table.md#createrecordsasync). The more information
provided, the more accurate the permissions check will be.

**Example:**

```js
// Check if user can create specific records, when you already know what fields/cell values
// will be set for the records.
const createRecordsCheckResult = table.checkPermissionsForCreateRecords([
    // Like createRecordsAsync, fields can be specified by name or ID
    {
        'Project Name': 'Advertising campaign',
        Budget: 100,
    },
    {
        [projectNameField.id]: 'Cat video',
        [budgetField.id]: 200,
    },
    {},
]);
if (!createRecordsCheckResult.hasPermission) {
    alert(createRecordsCheckResult.reasonDisplayString);
}

// Check if user could potentially create records.
// Use when you don't know the specific fields/cell values yet (for example, to show or hide
// UI controls that let you start creating records.)
// Equivalent to table.checkPermissionsForCreateRecord()
const createUnknownRecordCheckResult = table.checkPermissionsForCreateRecords();
```

**Parameters:**

| Name       | Type                  | Description                                                               |
| ---------- | --------------------- | ------------------------------------------------------------------------- |
| `records?` | ReadonlyArray‹object› | Array of objects mapping `FieldId` or field name to value for that field. |

**Returns:** _[PermissionCheckResult](_airtable_blocks__mutations.md#permissioncheckresult)_

PermissionCheckResult `{hasPermission: true}` if the current user can create the specified records,
`{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used
to display an error message to the user.

### checkPermissionsForDeleteRecord

▸ **checkPermissionsForDeleteRecord**(`recordOrRecordId?`:
[Record](_airtable_blocks_models__record.md#record) |
[RecordId](_airtable_blocks_models__record.md#recordid)):
_[PermissionCheckResult](_airtable_blocks__mutations.md#permissioncheckresult)_

_Defined in
[src/models/table.ts:890](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L890)_

Checks whether the current user has permission to delete the specified record.

Accepts optional input, in the same format as
[deleteRecordAsync](_airtable_blocks_models__table.md#deleterecordasync). The more information
provided, the more accurate the permissions check will be.

**Example:**

```js
// Check if user can delete a specific record
const deleteRecordCheckResult = table.checkPermissionsForDeleteRecord(record);
if (!deleteRecordCheckResult.hasPermission) {
    alert(deleteRecordCheckResult.reasonDisplayString);
}

// Check if user could potentially delete a record.
// Use when you don't know the specific record you want to delete yet (for example, to show
// or hide UI controls that let you select a record to delete.)
const deleteUnknownRecordCheckResult = table.checkPermissionsForDeleteRecord();
```

**Parameters:**

| Name                | Type                                                                                                               | Description              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------ |
| `recordOrRecordId?` | [Record](_airtable_blocks_models__record.md#record) &#124; [RecordId](_airtable_blocks_models__record.md#recordid) | the record to be deleted |

**Returns:** _[PermissionCheckResult](_airtable_blocks__mutations.md#permissioncheckresult)_

PermissionCheckResult `{hasPermission: true}` if the current user can delete the specified record,
`{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used
to display an error message to the user.

### checkPermissionsForDeleteRecords

▸ **checkPermissionsForDeleteRecords**(`recordsOrRecordIds?`:
ReadonlyArray‹[Record](_airtable_blocks_models__record.md#record) |
[RecordId](_airtable_blocks_models__record.md#recordid)›):
_[PermissionCheckResult](_airtable_blocks__mutations.md#permissioncheckresult)_

_Defined in
[src/models/table.ts:993](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L993)_

Checks whether the current user has permission to delete the specified records.

Accepts optional input, in the same format as
[deleteRecordsAsync](_airtable_blocks_models__table.md#deleterecordsasync). The more information
provided, the more accurate the permissions check will be.

**Example:**

```js
// Check if user can delete specific records
const deleteRecordsCheckResult = table.checkPermissionsForDeleteRecords([record1, record2]);
if (!deleteRecordsCheckResult.hasPermission) {
    alert(deleteRecordsCheckResult.reasonDisplayString);
}

// Check if user could potentially delete records.
// Use when you don't know the specific records you want to delete yet (for example, to show
// or hide UI controls that let you select records to delete.)
// Equivalent to table.hasPermissionToDeleteRecord()
const deleteUnknownRecordsCheckResult = table.checkPermissionsForDeleteRecords();
```

**Parameters:**

| Name                  | Type                                                                                                                              | Description               |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `recordsOrRecordIds?` | ReadonlyArray‹[Record](_airtable_blocks_models__record.md#record) &#124; [RecordId](_airtable_blocks_models__record.md#recordid)› | the records to be deleted |

**Returns:** _[PermissionCheckResult](_airtable_blocks__mutations.md#permissioncheckresult)_

PermissionCheckResult `{hasPermission: true}` if the current user can delete the specified records,
`{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used
to display an error message to the user.

### checkPermissionsForUpdateRecord

▸ **checkPermissionsForUpdateRecord**(`recordOrRecordId?`:
[Record](_airtable_blocks_models__record.md#record) |
[RecordId](_airtable_blocks_models__record.md#recordid), `fields?`:
ObjectMap‹[FieldId](_airtable_blocks_models__field.md#fieldid) | string, unknown | void›):
_[PermissionCheckResult](_airtable_blocks__mutations.md#permissioncheckresult)_

_Defined in
[src/models/table.ts:547](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L547)_

Checks whether the current user has permission to perform the given record update.

Accepts partial input, in the same format as
[updateRecordAsync](_airtable_blocks_models__table.md#updaterecordasync). The more information
provided, the more accurate the permissions check will be.

**Example:**

```js
// Check if user can update specific fields for a specific record.
const updateRecordCheckResult = table.checkPermissionsForUpdateRecord(record, {
    'Post Title': 'How to make: orange-mango pound cake',
    'Publication Date': '2020-01-01',
});
if (!updateRecordCheckResult.hasPermission) {
    alert(updateRecordCheckResult.reasonDisplayString);
}

// Like updateRecordAsync, you can use either field names or field IDs.
const updateRecordCheckResultWithFieldIds = table.checkPermissionsForUpdateRecord(record, {
    [postTitleField.id]: 'Cake decorating tips & tricks',
    [publicationDateField.id]: '2020-02-02',
});

// Check if user could update a given record, when you don't know the specific fields that
// will be updated yet. (for example, to check whether you should allow a user to select
// a certain record to update)
const updateUnknownFieldsCheckResult = table.checkPermissionsForUpdateRecord(record);

// Check if user could update specific fields, when you don't know the specific record that
// will be updated yet. (for example, if the field is selected by the user and you want to
// check if your block can write to it)
const updateUnknownRecordCheckResult = table.checkPermissionsForUpdateRecord(undefined, {
    'My field name': 'updated value',
    // You can use undefined if you know you're going to update a field, but don't know
    // the new cell value yet.
    'Another field name': undefined,
});

// Check if user could perform updates within the table, without knowing the specific record
// or fields that will be updated yet. (for example, to render your block in "read only"
// mode)
const updateUnknownRecordAndFieldsCheckResult = table.checkPermissionsForUpdateRecord();
```

**Parameters:**

| Name                | Type                                                                                                               | Description                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `recordOrRecordId?` | [Record](_airtable_blocks_models__record.md#record) &#124; [RecordId](_airtable_blocks_models__record.md#recordid) | the record to update                                                                                               |
| `fields?`           | ObjectMap‹[FieldId](_airtable_blocks_models__field.md#fieldid) &#124; string, unknown &#124; void›                 | cell values to update in that record, specified as object mapping `FieldId` or field name to value for that field. |

**Returns:** _[PermissionCheckResult](_airtable_blocks__mutations.md#permissioncheckresult)_

PermissionCheckResult `{hasPermission: true}` if the current user can update the specified record,
`{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used
to display an error message to the user.

### checkPermissionsForUpdateRecords

▸ **checkPermissionsForUpdateRecords**(`records?`: ReadonlyArray‹object›):
_[PermissionCheckResult](_airtable_blocks__mutations.md#permissioncheckresult)_

_Defined in
[src/models/table.ts:752](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L752)_

Checks whether the current user has permission to perform the given record updates.

Accepts partial input, in the same format as
[updateRecordsAsync](_airtable_blocks_models__table.md#updaterecordsasync). The more information
provided, the more accurate the permissions check will be.

**Example:**

```js
const recordsToUpdate = [
    {
        // Validating a complete record update
        id: record1.id,
        fields: {
            'Post Title': 'How to make: orange-mango pound cake',
            'Publication Date': '2020-01-01',
        },
    },
    {
        // Like updateRecordsAsync, fields can be specified by name or ID
        id: record2.id,
        fields: {
            [postTitleField.id]: 'Cake decorating tips & tricks',
            [publicationDateField.id]: '2020-02-02',
        },
    },
    {
        // Validating an update to a specific record, not knowing what fields will be updated
        id: record3.id,
    },
    {
        // Validating an update to specific cell values, not knowing what record will be updated
        fields: {
            'My field name': 'updated value for unknown record',
            // You can use undefined if you know you're going to update a field, but don't know
            // the new cell value yet.
            'Another field name': undefined,
        },
    },
];

const updateRecordsCheckResult = table.checkPermissionsForUpdateRecords(recordsToUpdate);
if (!updateRecordsCheckResult.hasPermission) {
    alert(updateRecordsCheckResult.reasonDisplayString);
}

// Check if user could potentially update records.
// Equivalent to table.checkPermissionsForUpdateRecord()
const updateUnknownRecordAndFieldsCheckResult = table.checkPermissionsForUpdateRecords();
```

**Parameters:**

| Name       | Type                  | Description                                                                                                                                                 |
| ---------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `records?` | ReadonlyArray‹object› | Array of objects containing recordId and fields/cellValues to update for that record (specified as an object mapping `FieldId` or field name to cell value) |

**Returns:** _[PermissionCheckResult](_airtable_blocks__mutations.md#permissioncheckresult)_

PermissionCheckResult `{hasPermission: true}` if the current user can update the specified records,
`{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used
to display an error message to the user.

### createRecordAsync

▸ **createRecordAsync**(`fields`: ObjectMap‹[FieldId](_airtable_blocks_models__field.md#fieldid) |
string, unknown›): _Promise‹[RecordId](_airtable_blocks_models__record.md#recordid)›_

_Defined in
[src/models/table.ts:1077](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L1077)_

Creates a new record with the specified cell values.

Throws an error if the user does not have permission to create the given records, or if invalid
input is provided (eg. invalid cell values).

This action is asynchronous: `await` the returned promise if you wish to wait for the new record to
be persisted to Airtable servers. Updates are applied optimistically locally, so your changes will
be reflected in your block before the promise resolves.

**Example:**

```js
function createNewRecord(recordFields) {
    if (table.hasPermissionToCreateRecord(recordFields)) {
        table.createRecordAsync(recordFields);
    }
    // You can now access the new record in your block (eg `table.selectRecords()`) but it is
    // still being saved to Airtable servers (eg. other users may not be able to see it yet.)
}

async function createNewRecordAsync(recordFields) {
    if (table.hasPermissionToCreateRecord(recordFields)) {
        const newRecordId = await table.createRecordAsync(recordFields);
    }
    // New record has been saved to Airtable servers.
    alert(`new record with ID ${newRecordId} has been created`);
}

// Fields can be specified by name or ID
createNewRecord({
    'Project Name': 'Advertising campaign',
    Budget: 100,
});
createNewRecord({
    [projectNameField.id]: 'Cat video',
    [budgetField.id]: 200,
});
```

**Parameters:**

| Name     | Type                                                                                   | Default | Description                                                     |
| -------- | -------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------- |
| `fields` | ObjectMap‹[FieldId](_airtable_blocks_models__field.md#fieldid) &#124; string, unknown› | {}      | object mapping `FieldId` or field name to value for that field. |

**Returns:** _Promise‹[RecordId](_airtable_blocks_models__record.md#recordid)›_

A promise that will resolve to the RecordId of the new record, once the new record is persisted to
Airtable.

### createRecordsAsync

▸ **createRecordsAsync**(`records`:
ReadonlyArray‹ObjectMap‹[FieldId](_airtable_blocks_models__field.md#fieldid) | string, unknown››):
_Promise‹Array‹[RecordId](_airtable_blocks_models__record.md#recordid)››_

_Defined in
[src/models/table.ts:1211](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L1211)_

Creates new records with the specified cell values.

Throws an error if the user does not have permission to create the given records, or if invalid
input is provided (eg. invalid cell values).

You may only create up to 50 records in one call to `createRecordsAsync`. See
[Writing changes to records](/packages/sdk/docs/guide_writes.md) for more information about write
limits.

This action is asynchronous: `await` the returned promise if you wish to wait for the new record to
be persisted to Airtable servers. Updates are applied optimistically locally, so your changes will
be reflected in your block before the promise resolves.

**Example:**

```js
const recordDefs = [
    // Fields can be specified by name or ID
    {
        'Project Name': 'Advertising campaign',
        Budget: 100,
    },
    {
        [projectNameField.id]: 'Cat video',
        [budgetField.id]: 200,
    },
    // Specifying no fields will create a new record with no cell values set
    {},
];

function createNewRecords() {
    if (table.hasPermissionToCreateRecords(recordDefs)) {
        table.createRecordsAsync(recordDefs);
    }
    // You can now access the new records in your block (eg `table.selectRecords()`) but they
    // are still being saved to Airtable servers (eg. other users may not be able to see them
    // yet.)
}

async function createNewRecordsAsync() {
    if (table.hasPermissionToCreateRecords(recordDefs)) {
        const newRecordIds = await table.createRecordsAsync(recordDefs);
    }
    // New records have been saved to Airtable servers.
    alert(`new records with IDs ${newRecordIds} have been created`);
}
```

**Parameters:**

| Name      | Type                                                                                                  | Description                                                               |
| --------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `records` | ReadonlyArray‹ObjectMap‹[FieldId](_airtable_blocks_models__field.md#fieldid) &#124; string, unknown›› | Array of objects mapping `FieldId` or field name to value for that field. |

**Returns:** _Promise‹Array‹[RecordId](_airtable_blocks_models__record.md#recordid)››_

A promise that will resolve to array of RecordIds of the new records, once the new records are
persisted to Airtable.

### deleteRecordAsync

▸ **deleteRecordAsync**(`recordOrRecordId`: [Record](_airtable_blocks_models__record.md#record) |
[RecordId](_airtable_blocks_models__record.md#recordid)): _Promise‹void›_

_Defined in
[src/models/table.ts:865](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L865)_

Delete the given record.

Throws an error if the user does not have permission to delete the given record.

This action is asynchronous: `await` the returned promise if you wish to wait for the delete to be
persisted to Airtable servers. Updates are applied optimistically locally, so your changes will be
reflected in your block before the promise resolves.

**Example:**

```js
function deleteRecord(record) {
    if (table.hasPermissionToDeleteRecord(record)) {
        table.deleteRecordAsync(record);
    }
    // The record is now deleted within your block (eg will not be returned in
    // `table.selectRecords`) but it is still being saved to Airtable servers (eg. it may
    // not look deleted to other users yet)
}

async function deleteRecordAsync(record) {
    if (table.hasPermissionToDeleteRecord(record)) {
        await table.deleteRecordAsync(record);
    }
    // Record deletion has been saved to Airtable servers.
    alert('record has been deleted');
}
```

**Parameters:**

| Name               | Type                                                                                                               | Description              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------ |
| `recordOrRecordId` | [Record](_airtable_blocks_models__record.md#record) &#124; [RecordId](_airtable_blocks_models__record.md#recordid) | the record to be deleted |

**Returns:** _Promise‹void›_

A promise that will resolve once the delete is persisted to Airtable.

### deleteRecordsAsync

▸ **deleteRecordsAsync**(`recordsOrRecordIds`:
ReadonlyArray‹[Record](_airtable_blocks_models__record.md#record) |
[RecordId](_airtable_blocks_models__record.md#recordid)›): _Promise‹void›_

_Defined in
[src/models/table.ts:959](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L959)_

Delete the given records.

Throws an error if the user does not have permission to delete the given records.

You may only delete up to 50 records in one call to `deleteRecordsAsync`. See
[Writing changes to records](/packages/sdk/docs/guide_writes.md) for more information about write
limits.

This action is asynchronous: `await` the returned promise if you wish to wait for the delete to be
persisted to Airtable servers. Updates are applied optimistically locally, so your changes will be
reflected in your block before the promise resolves.

**Example:**

```js
function deleteRecords(records) {
    if (table.hasPermissionToDeleteRecords(records)) {
        table.deleteRecordsAsync(records);
    }
    // The records are now deleted within your block (eg will not be returned in
    // `table.selectRecords()`) but are still being saved to Airtable servers (eg. they
    // may not look deleted to other users yet)
}

async function deleteRecordsAsync(records) {
    if (table.hasPermissionToDeleteRecords(records)) {
        await table.deleteRecordsAsync(records);
    }
    // Record deletions have been saved to Airtable servers.
    alert('records have been deleted');
}
```

**Parameters:**

| Name                 | Type                                                                                                                              | Description                    |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `recordsOrRecordIds` | ReadonlyArray‹[Record](_airtable_blocks_models__record.md#record) &#124; [RecordId](_airtable_blocks_models__record.md#recordid)› | Array of Records and RecordIds |

**Returns:** _Promise‹void›_

A promise that will resolve once the deletes are persisted to Airtable.

### getFieldById

▸ **getFieldById**(`fieldId`: [FieldId](_airtable_blocks_models__field.md#fieldid)):
_[Field](_airtable_blocks_models__field.md#field)_

_Defined in
[src/models/table.ts:199](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L199)_

**Example:**

```js
const fieldId = 'fldxxxxxxxxxxxxxx';
const field = myTable.getFieldById(fieldId);
console.log(field.name);
// => 'Name'
```

**Parameters:**

| Name      | Type                                                 | Description          |
| --------- | ---------------------------------------------------- | -------------------- |
| `fieldId` | [FieldId](_airtable_blocks_models__field.md#fieldid) | The ID of the field. |

**Returns:** _[Field](_airtable_blocks_models__field.md#field)_

The field matching the given ID. Throws if that field does not exist in this table. Use
[getFieldByIdIfExists](_airtable_blocks_models__table.md#getfieldbyidifexists) instead if you are
unsure whether a field exists with the given ID.

### getFieldByIdIfExists

▸ **getFieldByIdIfExists**(`fieldId`: [FieldId](_airtable_blocks_models__field.md#fieldid)):
_[Field](_airtable_blocks_models__field.md#field) | null_

_Defined in
[src/models/table.ts:178](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L178)_

**Example:**

```js
const fieldId = 'fldxxxxxxxxxxxxxx';
const field = myTable.getFieldByIdIfExists(fieldId);
if (field !== null) {
    console.log(field.name);
} else {
    console.log('No field exists with that ID');
}
```

**Parameters:**

| Name      | Type                                                 | Description          |
| --------- | ---------------------------------------------------- | -------------------- |
| `fieldId` | [FieldId](_airtable_blocks_models__field.md#fieldid) | The ID of the field. |

**Returns:** _[Field](_airtable_blocks_models__field.md#field) | null_

The field matching the given ID, or `null` if that field does not exist in this table.

### getFieldByName

▸ **getFieldByName**(`fieldName`: string): _[Field](_airtable_blocks_models__field.md#field)_

_Defined in
[src/models/table.ts:237](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L237)_

**Example:**

```js
const field = myTable.getFieldByName('Name');
console.log(field.id);
// => 'fldxxxxxxxxxxxxxx'
```

**Parameters:**

| Name        | Type   | Description                               |
| ----------- | ------ | ----------------------------------------- |
| `fieldName` | string | The name of the field you're looking for. |

**Returns:** _[Field](_airtable_blocks_models__field.md#field)_

The field matching the given name. Throws if no field exists with that name in this table. Use
[getFieldByNameIfExists](_airtable_blocks_models__table.md#getfieldbynameifexists) instead if you
are unsure whether a field exists with the given name.

### getFieldByNameIfExists

▸ **getFieldByNameIfExists**(`fieldName`: string): _[Field](_airtable_blocks_models__field.md#field)
| null_

_Defined in
[src/models/table.ts:219](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L219)_

**Example:**

```js
const field = myTable.getFieldByNameIfExists('Name');
if (field !== null) {
    console.log(field.id);
} else {
    console.log('No field exists with that name');
}
```

**Parameters:**

| Name        | Type   | Description                               |
| ----------- | ------ | ----------------------------------------- |
| `fieldName` | string | The name of the field you're looking for. |

**Returns:** _[Field](_airtable_blocks_models__field.md#field) | null_

The field matching the given name, or `null` if no field exists with that name in this table.

### getFirstViewOfType

▸ **getFirstViewOfType**(`allowedViewTypes`:
Array‹[ViewType](_airtable_blocks_models__view.md#viewtype)› |
[ViewType](_airtable_blocks_models__view.md#viewtype), `preferredViewOrViewId?`:
[View](_airtable_blocks_models__view.md#view) | [ViewId](_airtable_blocks_models__view.md#viewid) |
null): _[View](_airtable_blocks_models__view.md#view) | null_

_Defined in
[src/models/table.ts:402](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L402)_

Returns the first view in the table where the type is one of `allowedViewTypes`.

**Example:**

```js
import {viewTypes} from '@airtable/blocks/models';
const firstCalendarView = myTable.getFirstViewOfType(viewTypes.CALENDAR);
if (firstCalendarView !== null) {
    console.log(firstCalendarView.name);
} else {
    console.log('No calendar views exist in the table');
}
```

**Parameters:**

| Name                     | Type                                                                                                                      | Description                                                                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `allowedViewTypes`       | Array‹[ViewType](_airtable_blocks_models__view.md#viewtype)› &#124; [ViewType](_airtable_blocks_models__view.md#viewtype) | An array of view types or a single view type to match against.                                                                                         |
| `preferredViewOrViewId?` | [View](_airtable_blocks_models__view.md#view) &#124; [ViewId](_airtable_blocks_models__view.md#viewid) &#124; null        | If a view or view ID is supplied and that view exists & has the correct type, that view will be returned before checking the other views in the table. |

**Returns:** _[View](_airtable_blocks_models__view.md#view) | null_

The first view where the type is one of `allowedViewTypes` or `null` if no such view exists in the
table.

### getViewById

▸ **getViewById**(`viewId`: [ViewId](_airtable_blocks_models__view.md#viewid)):
_[View](_airtable_blocks_models__view.md#view)_

_Defined in
[src/models/table.ts:302](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L302)_

**Example:**

```js
const viewId = 'viwxxxxxxxxxxxxxx';
const view = myTable.getViewById(viewId);
console.log(view.name);
// => 'Grid view'
```

**Parameters:**

| Name     | Type                                              | Description         |
| -------- | ------------------------------------------------- | ------------------- |
| `viewId` | [ViewId](_airtable_blocks_models__view.md#viewid) | The ID of the view. |

**Returns:** _[View](_airtable_blocks_models__view.md#view)_

The view matching the given ID. Throws if that view does not exist in this table. Use
[getViewByIdIfExists](_airtable_blocks_models__table.md#getviewbyidifexists) instead if you are
unsure whether a view exists with the given ID.

### getViewByIdIfExists

▸ **getViewByIdIfExists**(`viewId`: [ViewId](_airtable_blocks_models__view.md#viewid)):
_[View](_airtable_blocks_models__view.md#view) | null_

_Defined in
[src/models/table.ts:276](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L276)_

**Example:**

```js
const viewId = 'viwxxxxxxxxxxxxxx';
const view = myTable.getViewByIdIfExists(viewId);
if (view !== null) {
    console.log(view.name);
} else {
    console.log('No view exists with that ID');
}
```

**Parameters:**

| Name     | Type                                              | Description         |
| -------- | ------------------------------------------------- | ------------------- |
| `viewId` | [ViewId](_airtable_blocks_models__view.md#viewid) | The ID of the view. |

**Returns:** _[View](_airtable_blocks_models__view.md#view) | null_

The view matching the given ID, or `null` if that view does not exist in this table.

### getViewByName

▸ **getViewByName**(`viewName`: string): _[View](_airtable_blocks_models__view.md#view)_

_Defined in
[src/models/table.ts:340](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L340)_

**Example:**

```js
const view = myTable.getViewByName('Name');
console.log(view.id);
// => 'viwxxxxxxxxxxxxxx'
```

**Parameters:**

| Name       | Type   | Description                              |
| ---------- | ------ | ---------------------------------------- |
| `viewName` | string | The name of the view you're looking for. |

**Returns:** _[View](_airtable_blocks_models__view.md#view)_

The view matching the given name. Throws if no view exists with that name in this table. Use
[getViewByNameIfExists](_airtable_blocks_models__table.md#getviewbynameifexists) instead if you are
unsure whether a view exists with the given name.

### getViewByNameIfExists

▸ **getViewByNameIfExists**(`viewName`: string): _[View](_airtable_blocks_models__view.md#view) |
null_

_Defined in
[src/models/table.ts:322](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L322)_

**Example:**

```js
const view = myTable.getViewByNameIfExists('Name');
if (view !== null) {
    console.log(view.id);
} else {
    console.log('No view exists with that name');
}
```

**Parameters:**

| Name       | Type   | Description                              |
| ---------- | ------ | ---------------------------------------- |
| `viewName` | string | The name of the view you're looking for. |

**Returns:** _[View](_airtable_blocks_models__view.md#view) | null_

The view matching the given name, or `null` if no view exists with that name in this table.

### hasPermissionToCreateRecord

▸ **hasPermissionToCreateRecord**(`fields?`:
ObjectMap‹[FieldId](_airtable_blocks_models__field.md#fieldid) | string, unknown | void›): _boolean_

_Defined in
[src/models/table.ts:1157](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L1157)_

An alias for `checkPermissionsForCreateRecord(fields).hasPermission`.

Checks whether the current user has permission to create the specified record.

Accepts partial input, in the same format as
[createRecordAsync](_airtable_blocks_models__table.md#createrecordasync). The more information
provided, the more accurate the permissions check will be.

**Example:**

```js
// Check if user can create a specific record, when you already know what fields/cell values
// will be set for the record.
const canCreateRecord = table.hasPermissionToCreateRecord({
    'Project Name': 'Advertising campaign',
    Budget: 100,
});
if (!canCreateRecord) {
    alert('not allowed!');
}

// Like createRecordAsync, you can use either field names or field IDs.
const canCreateRecordWithFieldIds = table.hasPermissionToCreateRecord({
    [projectNameField.id]: 'Cat video',
    [budgetField.id]: 200,
});

// Check if user could potentially create a record.
// Use when you don't know the specific fields/cell values yet (for example, to show or hide
// UI controls that let you start creating a record.)
const canCreateUnknownRecord = table.hasPermissionToCreateRecord();
```

**Parameters:**

| Name      | Type                                                                                               | Description                                                     |
| --------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `fields?` | ObjectMap‹[FieldId](_airtable_blocks_models__field.md#fieldid) &#124; string, unknown &#124; void› | object mapping `FieldId` or field name to value for that field. |

**Returns:** _boolean_

boolean Whether the current user can create the specified record.

### hasPermissionToCreateRecords

▸ **hasPermissionToCreateRecords**(`records?`: ReadonlyArray‹object›): _boolean_

_Defined in
[src/models/table.ts:1317](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L1317)_

An alias for `checkPermissionsForCreateRecords(records).hasPermission`.

Checks whether the current user has permission to create the specified records.

Accepts partial input, in the same format as
[createRecordsAsync](_airtable_blocks_models__table.md#createrecordsasync). The more information
provided, the more accurate the permissions check will be.

**Example:**

```js
// Check if user can create specific records, when you already know what fields/cell values
// will be set for the records.
const canCreateRecords = table.hasPermissionToCreateRecords([
    // Like createRecordsAsync, fields can be specified by name or ID
    {
        'Project Name': 'Advertising campaign',
        Budget: 100,
    },
    {
        [projectNameField.id]: 'Cat video',
        [budgetField.id]: 200,
    },
    {},
]);
if (!canCreateRecords) {
    alert('not allowed');
}

// Check if user could potentially create records.
// Use when you don't know the specific fields/cell values yet (for example, to show or hide
// UI controls that let you start creating records.)
// Equivalent to table.hasPermissionToCreateRecord()
const canCreateUnknownRecords = table.hasPermissionToCreateRecords();
```

**Parameters:**

| Name       | Type                  | Description                                                               |
| ---------- | --------------------- | ------------------------------------------------------------------------- |
| `records?` | ReadonlyArray‹object› | Array of objects mapping `FieldId` or field name to value for that field. |

**Returns:** _boolean_

boolean Whether the current user can create the specified records.

### hasPermissionToDeleteRecord

▸ **hasPermissionToDeleteRecord**(`recordOrRecordId?`:
[Record](_airtable_blocks_models__record.md#record) |
[RecordId](_airtable_blocks_models__record.md#recordid)): _boolean_

_Defined in
[src/models/table.ts:919](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L919)_

An alias for `checkPermissionsForDeleteRecord(recordOrRecordId).hasPermission`.

Checks whether the current user has permission to delete the specified record.

Accepts optional input, in the same format as
[deleteRecordAsync](_airtable_blocks_models__table.md#deleterecordasync). The more information
provided, the more accurate the permissions check will be.

**Example:**

```js
// Check if user can delete a specific record
const canDeleteRecord = table.hasPermissionToDeleteRecord(record);
if (!canDeleteRecord) {
    alert('not allowed');
}

// Check if user could potentially delete a record.
// Use when you don't know the specific record you want to delete yet (for example, to show
// or hide UI controls that let you select a record to delete.)
const canDeleteUnknownRecord = table.hasPermissionToDeleteRecord();
```

**Parameters:**

| Name                | Type                                                                                                               | Description              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------ |
| `recordOrRecordId?` | [Record](_airtable_blocks_models__record.md#record) &#124; [RecordId](_airtable_blocks_models__record.md#recordid) | the record to be deleted |

**Returns:** _boolean_

boolean Whether the current user can delete the specified record.

### hasPermissionToDeleteRecords

▸ **hasPermissionToDeleteRecords**(`recordsOrRecordIds?`:
ReadonlyArray‹[Record](_airtable_blocks_models__record.md#record) |
[RecordId](_airtable_blocks_models__record.md#recordid)›): _boolean_

_Defined in
[src/models/table.ts:1031](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L1031)_

An alias for `checkPermissionsForDeleteRecords(recordsOrRecordIds).hasPermission`.

Checks whether the current user has permission to delete the specified records.

Accepts optional input, in the same format as
[deleteRecordsAsync](_airtable_blocks_models__table.md#deleterecordsasync). The more information
provided, the more accurate the permissions check will be.

**Example:**

```js
// Check if user can delete specific records
const canDeleteRecords = table.hasPermissionToDeleteRecords([record1, record2]);
if (!canDeleteRecords) {
    alert('not allowed!');
}

// Check if user could potentially delete records.
// Use when you don't know the specific records you want to delete yet (for example, to show
// or hide UI controls that let you select records to delete.)
// Equivalent to table.hasPermissionToDeleteRecord()
const canDeleteUnknownRecords = table.hasPermissionToDeleteRecords();
```

**Parameters:**

| Name                  | Type                                                                                                                              | Description               |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `recordsOrRecordIds?` | ReadonlyArray‹[Record](_airtable_blocks_models__record.md#record) &#124; [RecordId](_airtable_blocks_models__record.md#recordid)› | the records to be deleted |

**Returns:** _boolean_

boolean Whether the current user can delete the specified records.

### hasPermissionToUpdateRecord

▸ **hasPermissionToUpdateRecord**(`recordOrRecordId?`:
[Record](_airtable_blocks_models__record.md#record) |
[RecordId](_airtable_blocks_models__record.md#recordid), `fields?`:
ObjectMap‹[FieldId](_airtable_blocks_models__field.md#fieldid) | string, unknown | void›): _boolean_

_Defined in
[src/models/table.ts:612](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L612)_

An alias for `checkPermissionsForUpdateRecord(recordOrRecordId, fields).hasPermission`.

Checks whether the current user has permission to perform the given record update.

Accepts partial input, in the same format as
[updateRecordAsync](_airtable_blocks_models__table.md#updaterecordasync). The more information
provided, the more accurate the permissions check will be.

**Example:**

```js
// Check if user can update specific fields for a specific record.
const canUpdateRecord = table.hasPermissionToUpdateRecord(record, {
    'Post Title': 'How to make: orange-mango pound cake',
    'Publication Date': '2020-01-01',
});
if (!canUpdateRecord) {
    alert('not allowed!');
}

// Like updateRecordAsync, you can use either field names or field IDs.
const canUpdateRecordWithFieldIds = table.hasPermissionToUpdateRecord(record, {
    [postTitleField.id]: 'Cake decorating tips & tricks',
    [publicationDateField.id]: '2020-02-02',
});

// Check if user could update a given record, when you don't know the specific fields that
// will be updated yet. (for example, to check whether you should allow a user to select
// a certain record to update)
const canUpdateUnknownFields = table.hasPermissionToUpdateRecord(record);

// Check if user could update specific fields, when you don't know the specific record that
// will be updated yet. (for example, if the field is selected by the user and you want to
// check if your block can write to it)
const canUpdateUnknownRecord = table.hasPermissionToUpdateRecord(undefined, {
    'My field name': 'updated value',
    // You can use undefined if you know you're going to update a field, but don't know
    // the new cell value yet.
    'Another field name': undefined,
});

// Check if user could perform updates within the table, without knowing the specific record
// or fields that will be updated yet. (for example, to render your block in "read only"
// mode)
const canUpdateUnknownRecordAndFields = table.hasPermissionToUpdateRecord();
```

**Parameters:**

| Name                | Type                                                                                                               | Description                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `recordOrRecordId?` | [Record](_airtable_blocks_models__record.md#record) &#124; [RecordId](_airtable_blocks_models__record.md#recordid) | the record to update                                                                                               |
| `fields?`           | ObjectMap‹[FieldId](_airtable_blocks_models__field.md#fieldid) &#124; string, unknown &#124; void›                 | cell values to update in that record, specified as object mapping `FieldId` or field name to value for that field. |

**Returns:** _boolean_

boolean Whether the user can update the specified record.

### hasPermissionToUpdateRecords

▸ **hasPermissionToUpdateRecords**(`records?`: ReadonlyArray‹object›): _boolean_

_Defined in
[src/models/table.ts:825](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L825)_

An alias for `checkPermissionsForUpdateRecords(records).hasPermission`.

Checks whether the current user has permission to perform the given record updates.

Accepts partial input, in the same format as
[updateRecordsAsync](_airtable_blocks_models__table.md#updaterecordsasync). The more information
provided, the more accurate the permissions check will be.

**Example:**

```js
const recordsToUpdate = [
    {
        // Validating a complete record update
        id: record1.id,
        fields: {
            'Post Title': 'How to make: orange-mango pound cake',
            'Publication Date': '2020-01-01',
        },
    },
    {
        // Like updateRecordsAsync, fields can be specified by name or ID
        id: record2.id,
        fields: {
            [postTitleField.id]: 'Cake decorating tips & tricks',
            [publicationDateField.id]: '2020-02-02',
        },
    },
    {
        // Validating an update to a specific record, not knowing what fields will be updated
        id: record3.id,
    },
    {
        // Validating an update to specific cell values, not knowing what record will be updated
        fields: {
            'My field name': 'updated value for unknown record',
            // You can use undefined if you know you're going to update a field, but don't know
            // the new cell value yet.
            'Another field name': undefined,
        },
    },
];

const canUpdateRecords = table.hasPermissionToUpdateRecords(recordsToUpdate);
if (!canUpdateRecords) {
    alert('not allowed');
}

// Check if user could potentially update records.
// Equivalent to table.hasPermissionToUpdateRecord()
const canUpdateUnknownRecordsAndFields = table.hasPermissionToUpdateRecords();
```

**Parameters:**

| Name       | Type                  | Description                                                                                                                                                 |
| ---------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `records?` | ReadonlyArray‹object› | Array of objects containing recordId and fields/cellValues to update for that record (specified as an object mapping `FieldId` or field name to cell value) |

**Returns:** _boolean_

boolean Whether the current user can update the specified records.

### selectRecords

▸ **selectRecords**(`opts?`:
[RecordQueryResultOpts](_airtable_blocks_models__recordqueryresult.md#recordqueryresultopts)):
_[TableOrViewQueryResult](_airtable_blocks_models__recordqueryresult.md#tableorviewqueryresult)_

_Defined in
[src/models/table.ts:376](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L376)_

Select records from the table. Returns a query result. See
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult) for more.

**Example:**

```js
import {UI} from '@airtable/blocks';
import React from 'react';

function TodoList() {
    const base = UI.useBase();
    const table = base.getTableByName('Tasks');

    const queryResult = table.selectRecords();
    const records = UI.useRecords(queryResult);

    return (
        <ul>
            {records.map(record => (
                <li key={record.id}>{record.primaryCellValueAsString || 'Unnamed record'}</li>
            ))}
        </ul>
    );
}
```

**Parameters:**

| Name    | Type                                                                                         | Description                                      |
| ------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `opts?` | [RecordQueryResultOpts](_airtable_blocks_models__recordqueryresult.md#recordqueryresultopts) | Options for the query, such as sorts and fields. |

**Returns:**
_[TableOrViewQueryResult](_airtable_blocks_models__recordqueryresult.md#tableorviewqueryresult)_

A query result.

### toString

▸ **toString**(): _string_

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[toString](_airtable_blocks_models__abstract_models.md#tostring)_

_Defined in
[src/models/abstract_model.ts:90](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/abstract_model.ts#L90)_

**Returns:** _string_

A string representation of the model for use in debugging.

### unwatch

▸ **unwatch**(`keys`: [WatchableTableKey](_airtable_blocks_models__table.md#watchabletablekey) |
ReadonlyArray‹[WatchableTableKey](_airtable_blocks_models__table.md#watchabletablekey)›, `callback`:
Object, `context?`: FlowAnyObject | null):
_Array‹[WatchableTableKey](_airtable_blocks_models__table.md#watchabletablekey)›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[unwatch](_airtable_blocks_models__abstract_models.md#unwatch)_

_Defined in
[src/watchable.ts:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/watchable.ts#L107)_

Unwatch keys watched with `.watch`.

Should be called with the same arguments given to `.watch`.

**Parameters:**

| Name       | Type                                                                                                                                                                    | Description                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `keys`     | [WatchableTableKey](_airtable_blocks_models__table.md#watchabletablekey) &#124; ReadonlyArray‹[WatchableTableKey](_airtable_blocks_models__table.md#watchabletablekey)› | the keys to unwatch                                         |
| `callback` | Object                                                                                                                                                                  | the function passed to `.watch` for these keys              |
| `context?` | FlowAnyObject &#124; null                                                                                                                                               | the context that was passed to `.watch` for this `callback` |

**Returns:** _Array‹[WatchableTableKey](_airtable_blocks_models__table.md#watchabletablekey)›_

the array of keys that were unwatched

### updateRecordAsync

▸ **updateRecordAsync**(`recordOrRecordId`: [Record](_airtable_blocks_models__record.md#record) |
[RecordId](_airtable_blocks_models__record.md#recordid), `fields`:
ObjectMap‹[FieldId](_airtable_blocks_models__field.md#fieldid) | string, unknown›): _Promise‹void›_

_Defined in
[src/models/table.ts:486](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L486)_

Updates cell values for a record.

Throws an error if the user does not have permission to update the given cell values in the record,
or if invalid input is provided (eg. invalid cell values).

This action is asynchronous: `await` the returned promise if you wish to wait for the updated cell
values to be persisted to Airtable servers. Updates are applied optimistically locally, so your
changes will be reflected in your block before the promise resolves.

**Example:**

```js
function updateRecord(record, recordFields) {
    if (table.hasPermissionToUpdateRecord(record, recordFields)) {
        table.updateRecordAsync(record, recordFields);
    }
    // The updated values will now show in your block (eg in `table.selectRecords()` result)
    // but are still being saved to Airtable servers (eg. other users may not be able to see
    // them yet.)
}

async function updateRecordAsync(record, recordFields) {
    if (table.hasPermissionToUpdateRecord(record, recordFields)) {
        await table.updateRecordAsync(record, recordFields);
    }
    // New record has been saved to Airtable servers.
    alert(`record with ID ${record.id} has been updated`);
}

// Fields can be specified by name or ID
updateRecord(record1, {
    'Post Title': 'How to make: orange-mango pound cake',
    'Publication Date': '2020-01-01',
});
updateRecord(record2, {
    [postTitleField.id]: 'Cake decorating tips & tricks',
    [publicationDateField.id]: '2020-02-02',
});
```

**Parameters:**

| Name               | Type                                                                                                               | Description                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `recordOrRecordId` | [Record](_airtable_blocks_models__record.md#record) &#124; [RecordId](_airtable_blocks_models__record.md#recordid) | the record to update                                                                                               |
| `fields`           | ObjectMap‹[FieldId](_airtable_blocks_models__field.md#fieldid) &#124; string, unknown›                             | cell values to update in that record, specified as object mapping `FieldId` or field name to value for that field. |

**Returns:** _Promise‹void›_

A promise that will resolve to the RecordId of the new record, once the new record is persisted to
Airtable.

### updateRecordsAsync

▸ **updateRecordsAsync**(`records`: ReadonlyArray‹object›): _Promise‹void›_

_Defined in
[src/models/table.ts:681](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L681)_

Updates cell values for records.

Throws an error if the user does not have permission to update the given cell values in the records,
or if invalid input is provided (eg. invalid cell values).

You may only update up to 50 records in one call to `updateRecordsAsync`. See
[Writing changes to records](/packages/sdk/docs/guide_writes.md) for more information about write
limits.

This action is asynchronous: `await` the returned promise if you wish to wait for the updates to be
persisted to Airtable servers. Updates are applied optimistically locally, so your changes will be
reflected in your block before the promise resolves.

**Example:**

```js
const recordsToUpdate = [
    // Fields can be specified by name or ID
    {
        id: record1.id,
        fields: {
            'Post Title': 'How to make: orange-mango pound cake',
            'Publication Date': '2020-01-01',
        },
    },
    {
        id: record2.id,
        fields: {
            // Sets the cell values to be empty.
            'Post Title': '',
            'Publication Date': '',
        },
    },
    {
        id: record3.id,
        fields: {
            [postTitleField.id]: 'Cake decorating tips & tricks',
            [publicationDateField.id]: '2020-02-02',
        },
    },
];

function updateRecords() {
    if (table.hasPermissionToUpdateRecords(recordsToUpdate)) {
        table.updateRecordsAsync(recordsToUpdate);
    }
    // The records are now updated within your block (eg will be reflected in
    // `table.selectRecords()`) but are still being saved to Airtable servers (eg. they
    // may not be updated for other users yet)
}

async function updateRecordsAsync() {
    if (table.hasPermissionToUpdateRecords(recordsToUpdate)) {
        await table.updateRecordsAsync(recordsToUpdate);
    }
    // Record updates have been saved to Airtable servers.
    alert('records have been updated');
}
```

**Parameters:**

| Name      | Type                  | Description                                                                                                                                                 |
| --------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `records` | ReadonlyArray‹object› | Array of objects containing recordId and fields/cellValues to update for that record (specified as an object mapping `FieldId` or field name to cell value) |

**Returns:** _Promise‹void›_

A promise that will resolve once the updates are persisted to Airtable.

### watch

▸ **watch**(`keys`: [WatchableTableKey](_airtable_blocks_models__table.md#watchabletablekey) |
ReadonlyArray‹[WatchableTableKey](_airtable_blocks_models__table.md#watchabletablekey)›, `callback`:
Object, `context?`: FlowAnyObject | null):
_Array‹[WatchableTableKey](_airtable_blocks_models__table.md#watchabletablekey)›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[watch](_airtable_blocks_models__abstract_models.md#watch)_

_Defined in
[src/watchable.ts:61](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/watchable.ts#L61)_

Get notified of changes to the model.

Every call to `.watch` should have a matching call to `.unwatch`.

**Parameters:**

| Name       | Type                                                                                                                                                                    | Description                                   |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `keys`     | [WatchableTableKey](_airtable_blocks_models__table.md#watchabletablekey) &#124; ReadonlyArray‹[WatchableTableKey](_airtable_blocks_models__table.md#watchabletablekey)› | the keys to watch                             |
| `callback` | Object                                                                                                                                                                  | a function to call when those keys change     |
| `context?` | FlowAnyObject &#124; null                                                                                                                                               | an optional context for `this` in `callback`. |

**Returns:** _Array‹[WatchableTableKey](_airtable_blocks_models__table.md#watchabletablekey)›_

the array of keys that were watched

## Type aliases

### TableId

Ƭ **TableId**: _string_

_Defined in
[src/types/table.ts:8](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/types/table.ts#L8)_

---

### WatchableTableKey

Ƭ **WatchableTableKey**: _"name" | "views" | "fields"_

_Defined in
[src/models/table.ts:35](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/models/table.ts#L35)_

A key in [Table](_airtable_blocks_models__table.md#table) that can be watched.

-   `name`
-   `views`
-   `fields`
