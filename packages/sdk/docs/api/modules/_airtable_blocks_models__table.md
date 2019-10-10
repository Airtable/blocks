[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/models: Table](_airtable_blocks_models__table.md)

# External module: @airtable/blocks/models: Table

## Index

### Classes

-   [Table](_airtable_blocks_models__table.md#table)

## Classes

### Table

• **Table**:

_Defined in
[src/models/table.ts:34](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L34)_

Model class representing a table. Every [Base](_airtable_blocks_models__base.md#base) has one or
more tables.

### fields

• **fields**:

_Defined in
[src/models/table.ts:214](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L214)_

**`function`**

**`returns`** The fields in this table. The order is arbitrary, since fields are only ordered in the
context of a specific view.

Can be watched to know when fields are created or deleted.

**`example`**

```js
console.log(`This table has ${myTable.fields.length} fields`);
```

### id

• **id**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[id](_airtable_blocks_models__abstract_models.md#id)_

_Defined in
[src/models/abstract_model.ts:41](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/abstract_model.ts#L41)_

**`function`**

**`returns`** The ID for this model.

### isDeleted

• **isDeleted**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[isDeleted](_airtable_blocks_models__abstract_models.md#isdeleted)_

_Defined in
[src/models/abstract_model.ts:73](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/abstract_model.ts#L73)_

A boolean denoting whether the model has been deleted.

In general, it's best to avoid keeping a reference to an object past the current event loop, since
it may be deleted and trying to access any data of a deleted object (other than its ID) will throw.
But if you keep a reference, you can use `isDeleted` to check that it's safe to access the model's
data.

**`function`**

**`returns`** `true` if the model has been deleted, and `false` otherwise.

### name

• **name**:

_Defined in
[src/models/table.ts:174](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L174)_

**`function`**

**`returns`** The name of the table. Can be watched.

**`example`**

```js
console.log(myTable.name);
// => 'Table 1'
```

### primaryField

• **primaryField**:

_Defined in
[src/models/table.ts:199](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L199)_

**`function`**

**`returns`** The table's primary field. Every table has exactly one primary field. The primary
field of a table will not change.

**`example`**

```js
console.log(myTable.primaryField.name);
// => 'Name'
```

### url

• **url**:

_Defined in
[src/models/table.ts:186](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L186)_

**`function`**

**`returns`** The URL for the table. You can visit this URL in the browser to be taken to the table
in the Airtable UI.

**`example`**

```js
console.log(myTable.url);
// => 'https://airtable.com/tblxxxxxxxxxxxxxx'
```

### views

• **views**:

_Defined in
[src/models/table.ts:314](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L314)_

**`function`**

**`returns`** The views in this table. Can be watched to know when views are created, deleted, or
reordered.

**`example`**

```js
console.log(`This table has ${myTable.views.length} views`);
```

### checkPermissionsForCreateRecord

▸ **checkPermissionsForCreateRecord**(`fields?`: ObjectMap‹FieldId | string, unknown | void›):
_PermissionCheckResult_

_Defined in
[src/models/table.ts:1175](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L1175)_

Checks whether the current user has permission to create the specified record.

Accepts partial input, in the same format as
[createRecordAsync](_airtable_blocks_models__table.md#createrecordasync). The more information
provided, the more accurate the permissions check will be.

**`example`**

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

| Name      | Type                                                  |
| --------- | ----------------------------------------------------- |
| `fields?` | ObjectMap‹FieldId &#124; string, unknown &#124; void› |

**Returns:** _PermissionCheckResult_

PermissionCheckResult `{hasPermission: true}` if the current user can create the specified record,
`{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used
to display an error message to the user.

### checkPermissionsForCreateRecords

▸ **checkPermissionsForCreateRecords**(`records?`: ReadonlyArray‹object›): _PermissionCheckResult_

_Defined in
[src/models/table.ts:1323](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L1323)_

Checks whether the current user has permission to create the specified records.

Accepts partial input, in the same format as
[createRecordsAsync](_airtable_blocks_models__table.md#createrecordsasync). The more information
provided, the more accurate the permissions check will be.

**`example`**

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

| Name       | Type                  |
| ---------- | --------------------- |
| `records?` | ReadonlyArray‹object› |

**Returns:** _PermissionCheckResult_

PermissionCheckResult `{hasPermission: true}` if the current user can create the specified records,
`{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used
to display an error message to the user.

### checkPermissionsForDeleteRecord

▸ **checkPermissionsForDeleteRecord**(`recordOrRecordId?`:
[Record](_airtable_blocks_models__record.md#record) | RecordId): _PermissionCheckResult_

_Defined in
[src/models/table.ts:951](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L951)_

Checks whether the current user has permission to delete the specified record.

Accepts optional input, in the same format as
[deleteRecordAsync](_airtable_blocks_models__table.md#deleterecordasync). The more information
provided, the more accurate the permissions check will be.

**`example`**

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

| Name                | Type                                                                |
| ------------------- | ------------------------------------------------------------------- |
| `recordOrRecordId?` | [Record](_airtable_blocks_models__record.md#record) &#124; RecordId |

**Returns:** _PermissionCheckResult_

PermissionCheckResult `{hasPermission: true}` if the current user can delete the specified record,
`{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used
to display an error message to the user.

### checkPermissionsForDeleteRecords

▸ **checkPermissionsForDeleteRecords**(`recordsOrRecordIds?`:
ReadonlyArray‹[Record](_airtable_blocks_models__record.md#record) | RecordId›):
_PermissionCheckResult_

_Defined in
[src/models/table.ts:1054](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L1054)_

Checks whether the current user has permission to delete the specified records.

Accepts optional input, in the same format as
[deleteRecordsAsync](_airtable_blocks_models__table.md#deleterecordsasync). The more information
provided, the more accurate the permissions check will be.

**`example`**

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

| Name                  | Type                                                                               |
| --------------------- | ---------------------------------------------------------------------------------- |
| `recordsOrRecordIds?` | ReadonlyArray‹[Record](_airtable_blocks_models__record.md#record) &#124; RecordId› |

**Returns:** _PermissionCheckResult_

PermissionCheckResult `{hasPermission: true}` if the current user can delete the specified records,
`{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used
to display an error message to the user.

### checkPermissionsForUpdateRecord

▸ **checkPermissionsForUpdateRecord**(`recordOrRecordId?`:
[Record](_airtable_blocks_models__record.md#record) | RecordId, `fields?`: ObjectMap‹FieldId |
string, unknown | void›): _PermissionCheckResult_

_Defined in
[src/models/table.ts:608](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L608)_

Checks whether the current user has permission to perform the given record update.

Accepts partial input, in the same format as
[updateRecordAsync](_airtable_blocks_models__table.md#updaterecordasync). The more information
provided, the more accurate the permissions check will be.

**`example`**

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

| Name                | Type                                                                |
| ------------------- | ------------------------------------------------------------------- |
| `recordOrRecordId?` | [Record](_airtable_blocks_models__record.md#record) &#124; RecordId |
| `fields?`           | ObjectMap‹FieldId &#124; string, unknown &#124; void›               |

**Returns:** _PermissionCheckResult_

PermissionCheckResult `{hasPermission: true}` if the current user can update the specified record,
`{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used
to display an error message to the user.

### checkPermissionsForUpdateRecords

▸ **checkPermissionsForUpdateRecords**(`records?`: ReadonlyArray‹object›): _PermissionCheckResult_

_Defined in
[src/models/table.ts:813](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L813)_

Checks whether the current user has permission to perform the given record updates.

Accepts partial input, in the same format as
[updateRecordsAsync](_airtable_blocks_models__table.md#updaterecordsasync). The more information
provided, the more accurate the permissions check will be.

**`example`**

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

| Name       | Type                  |
| ---------- | --------------------- |
| `records?` | ReadonlyArray‹object› |

**Returns:** _PermissionCheckResult_

PermissionCheckResult `{hasPermission: true}` if the current user can update the specified records,
`{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be used
to display an error message to the user.

### createRecordAsync

▸ **createRecordAsync**(`fields`: ObjectMap‹FieldId | string, unknown›): _Promise‹RecordId›_

_Defined in
[src/models/table.ts:1138](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L1138)_

Creates a new record with the specified cell values.

Throws an error if the user does not have permission to create the given records, or if invalid
input is provided (eg. invalid cell values).

This action is asynchronous: `await` the returned promise if you wish to wait for the new record to
be persisted to Airtable servers. Updates are applied optimistically locally, so your changes will
be reflected in your block before the promise resolves.

**`example`**

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

| Name     | Type                                      | Default | Description                                                     |
| -------- | ----------------------------------------- | ------- | --------------------------------------------------------------- |
| `fields` | ObjectMap‹FieldId &#124; string, unknown› | {}      | object mapping `FieldId` or field name to value for that field. |

**Returns:** _Promise‹RecordId›_

A promise that will resolve to the RecordId of the new record, once the new record is persisted to
Airtable.

### createRecordsAsync

▸ **createRecordsAsync**(`records`: ReadonlyArray‹ObjectMap‹FieldId | string, unknown››):
_Promise‹Array‹RecordId››_

_Defined in
[src/models/table.ts:1272](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L1272)_

Creates new records with the specified cell values.

Throws an error if the user does not have permission to create the given records, or if invalid
input is provided (eg. invalid cell values).

You may only create up to 50 records in one call to `createRecordsAsync`. See
[Writing changes to records](/packages/sdk/docs/guide_writes.md) for more information about write
limits.

This action is asynchronous: `await` the returned promise if you wish to wait for the new record to
be persisted to Airtable servers. Updates are applied optimistically locally, so your changes will
be reflected in your block before the promise resolves.

**`example`**

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

| Name      | Type                                                     | Description                                                               |
| --------- | -------------------------------------------------------- | ------------------------------------------------------------------------- |
| `records` | ReadonlyArray‹ObjectMap‹FieldId &#124; string, unknown›› | Array of objects mapping `FieldId` or field name to value for that field. |

**Returns:** _Promise‹Array‹RecordId››_

A promise that will resolve to array of RecordIds of the new records, once the new records are
persisted to Airtable.

### deleteRecordAsync

▸ **deleteRecordAsync**(`recordOrRecordId`: [Record](_airtable_blocks_models__record.md#record) |
RecordId): _Promise‹void›_

_Defined in
[src/models/table.ts:926](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L926)_

Delete the given record.

Throws an error if the user does not have permission to delete the given record.

This action is asynchronous: `await` the returned promise if you wish to wait for the delete to be
persisted to Airtable servers. Updates are applied optimistically locally, so your changes will be
reflected in your block before the promise resolves.

**`example`**

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

| Name               | Type                                                                | Description              |
| ------------------ | ------------------------------------------------------------------- | ------------------------ |
| `recordOrRecordId` | [Record](_airtable_blocks_models__record.md#record) &#124; RecordId | the record to be deleted |

**Returns:** _Promise‹void›_

A promise that will resolve once the delete is persisted to Airtable.

### deleteRecordsAsync

▸ **deleteRecordsAsync**(`recordsOrRecordIds`:
ReadonlyArray‹[Record](_airtable_blocks_models__record.md#record) | RecordId›): _Promise‹void›_

_Defined in
[src/models/table.ts:1020](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L1020)_

Delete the given records.

Throws an error if the user does not have permission to delete the given records.

You may only delete up to 50 records in one call to `deleteRecordsAsync`. See
[Writing changes to records](/packages/sdk/docs/guide_writes.md) for more information about write
limits.

This action is asynchronous: `await` the returned promise if you wish to wait for the delete to be
persisted to Airtable servers. Updates are applied optimistically locally, so your changes will be
reflected in your block before the promise resolves.

**`example`**

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

| Name                 | Type                                                                               | Description                    |
| -------------------- | ---------------------------------------------------------------------------------- | ------------------------------ |
| `recordsOrRecordIds` | ReadonlyArray‹[Record](_airtable_blocks_models__record.md#record) &#124; RecordId› | Array of Records and RecordIds |

**Returns:** _Promise‹void›_

A promise that will resolve once the deletes are persisted to Airtable.

### getFieldById

▸ **getFieldById**(`fieldId`: FieldId): _[Field](_airtable_blocks_models__field.md#field)_

_Defined in
[src/models/table.ts:260](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L260)_

**`example`**

```js
const fieldId = 'fldxxxxxxxxxxxxxx';
const field = myTable.getFieldById(fieldId);
console.log(field.name);
// => 'Name'
```

**Parameters:**

| Name      | Type    | Description          |
| --------- | ------- | -------------------- |
| `fieldId` | FieldId | The ID of the field. |

**Returns:** _[Field](_airtable_blocks_models__field.md#field)_

The field matching the given ID. Throws if that field does not exist in this table. Use
[getFieldByIdIfExists](_airtable_blocks_models__table.md#getfieldbyidifexists) instead if you are
unsure whether a field exists with the given ID.

### getFieldByIdIfExists

▸ **getFieldByIdIfExists**(`fieldId`: FieldId): _[Field](_airtable_blocks_models__field.md#field) |
null_

_Defined in
[src/models/table.ts:239](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L239)_

**`example`**

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

| Name      | Type    | Description          |
| --------- | ------- | -------------------- |
| `fieldId` | FieldId | The ID of the field. |

**Returns:** _[Field](_airtable_blocks_models__field.md#field) | null_

The field matching the given ID, or `null` if that field does not exist in this table.

### getFieldByName

▸ **getFieldByName**(`fieldName`: string): _[Field](_airtable_blocks_models__field.md#field)_

_Defined in
[src/models/table.ts:298](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L298)_

**`example`**

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
[src/models/table.ts:280](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L280)_

**`example`**

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

▸ **getFirstViewOfType**(`allowedViewTypes`: Array‹ViewType› | ViewType, `preferredViewOrViewId?`:
[View](_airtable_blocks_models__view.md#view) | ViewId | null):
_[View](_airtable_blocks_models__view.md#view) | null_

_Defined in
[src/models/table.ts:463](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L463)_

Returns the first view in the table where the type is one of `allowedViewTypes`.

**`example`**

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

| Name                     | Type                                                                    | Description                                                                                                                                            |
| ------------------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `allowedViewTypes`       | Array‹ViewType› &#124; ViewType                                         | An array of view types or a single view type to match against.                                                                                         |
| `preferredViewOrViewId?` | [View](_airtable_blocks_models__view.md#view) &#124; ViewId &#124; null | If a view or view ID is supplied and that view exists & has the correct type, that view will be returned before checking the other views in the table. |

**Returns:** _[View](_airtable_blocks_models__view.md#view) | null_

The first view where the type is one of `allowedViewTypes` or `null` if no such view exists in the
table.

### getViewById

▸ **getViewById**(`viewId`: ViewId): _[View](_airtable_blocks_models__view.md#view)_

_Defined in
[src/models/table.ts:363](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L363)_

**`example`**

```js
const viewId = 'viwxxxxxxxxxxxxxx';
const view = myTable.getViewById(viewId);
console.log(view.name);
// => 'Grid view'
```

**Parameters:**

| Name     | Type   | Description         |
| -------- | ------ | ------------------- |
| `viewId` | ViewId | The ID of the view. |

**Returns:** _[View](_airtable_blocks_models__view.md#view)_

The view matching the given ID. Throws if that view does not exist in this table. Use
[getViewByIdIfExists](_airtable_blocks_models__table.md#getviewbyidifexists) instead if you are
unsure whether a view exists with the given ID.

### getViewByIdIfExists

▸ **getViewByIdIfExists**(`viewId`: ViewId): _[View](_airtable_blocks_models__view.md#view) | null_

_Defined in
[src/models/table.ts:337](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L337)_

**`example`**

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

| Name     | Type   | Description         |
| -------- | ------ | ------------------- |
| `viewId` | ViewId | The ID of the view. |

**Returns:** _[View](_airtable_blocks_models__view.md#view) | null_

The view matching the given ID, or `null` if that view does not exist in this table.

### getViewByName

▸ **getViewByName**(`viewName`: string): _[View](_airtable_blocks_models__view.md#view)_

_Defined in
[src/models/table.ts:401](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L401)_

**`example`**

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
[src/models/table.ts:383](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L383)_

**`example`**

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

▸ **hasPermissionToCreateRecord**(`fields?`: ObjectMap‹FieldId | string, unknown | void›): _boolean_

_Defined in
[src/models/table.ts:1218](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L1218)_

An alias for `checkPermissionsForCreateRecord(fields).hasPermission`.

Checks whether the current user has permission to create the specified record.

Accepts partial input, in the same format as
[createRecordAsync](_airtable_blocks_models__table.md#createrecordasync). The more information
provided, the more accurate the permissions check will be.

**`example`**

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

| Name      | Type                                                  |
| --------- | ----------------------------------------------------- |
| `fields?` | ObjectMap‹FieldId &#124; string, unknown &#124; void› |

**Returns:** _boolean_

boolean Whether the current user can create the specified record.

### hasPermissionToCreateRecords

▸ **hasPermissionToCreateRecords**(`records?`: ReadonlyArray‹object›): _boolean_

_Defined in
[src/models/table.ts:1378](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L1378)_

An alias for `checkPermissionsForCreateRecords(records).hasPermission`.

Checks whether the current user has permission to create the specified records.

Accepts partial input, in the same format as
[createRecordsAsync](_airtable_blocks_models__table.md#createrecordsasync). The more information
provided, the more accurate the permissions check will be.

**`example`**

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

| Name       | Type                  |
| ---------- | --------------------- |
| `records?` | ReadonlyArray‹object› |

**Returns:** _boolean_

boolean Whether the current user can create the specified records.

### hasPermissionToDeleteRecord

▸ **hasPermissionToDeleteRecord**(`recordOrRecordId?`:
[Record](_airtable_blocks_models__record.md#record) | RecordId): _boolean_

_Defined in
[src/models/table.ts:980](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L980)_

An alias for `checkPermissionsForDeleteRecord(recordOrRecordId).hasPermission`.

Checks whether the current user has permission to delete the specified record.

Accepts optional input, in the same format as
[deleteRecordAsync](_airtable_blocks_models__table.md#deleterecordasync). The more information
provided, the more accurate the permissions check will be.

**`example`**

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

| Name                | Type                                                                |
| ------------------- | ------------------------------------------------------------------- |
| `recordOrRecordId?` | [Record](_airtable_blocks_models__record.md#record) &#124; RecordId |

**Returns:** _boolean_

boolean Whether the current user can delete the specified record.

### hasPermissionToDeleteRecords

▸ **hasPermissionToDeleteRecords**(`recordsOrRecordIds?`:
ReadonlyArray‹[Record](_airtable_blocks_models__record.md#record) | RecordId›): _boolean_

_Defined in
[src/models/table.ts:1092](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L1092)_

An alias for `checkPermissionsForDeleteRecords(recordsOrRecordIds).hasPermission`.

Checks whether the current user has permission to delete the specified records.

Accepts optional input, in the same format as
[deleteRecordsAsync](_airtable_blocks_models__table.md#deleterecordsasync). The more information
provided, the more accurate the permissions check will be.

**`example`**

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

| Name                  | Type                                                                               |
| --------------------- | ---------------------------------------------------------------------------------- |
| `recordsOrRecordIds?` | ReadonlyArray‹[Record](_airtable_blocks_models__record.md#record) &#124; RecordId› |

**Returns:** _boolean_

boolean Whether the current user can delete the specified records.

### hasPermissionToUpdateRecord

▸ **hasPermissionToUpdateRecord**(`recordOrRecordId?`:
[Record](_airtable_blocks_models__record.md#record) | RecordId, `fields?`: ObjectMap‹FieldId |
string, unknown | void›): _boolean_

_Defined in
[src/models/table.ts:673](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L673)_

An alias for `checkPermissionsForUpdateRecord(recordOrRecordId, fields).hasPermission`.

Checks whether the current user has permission to perform the given record update.

Accepts partial input, in the same format as
[updateRecordAsync](_airtable_blocks_models__table.md#updaterecordasync). The more information
provided, the more accurate the permissions check will be.

**`example`**

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

| Name                | Type                                                                |
| ------------------- | ------------------------------------------------------------------- |
| `recordOrRecordId?` | [Record](_airtable_blocks_models__record.md#record) &#124; RecordId |
| `fields?`           | ObjectMap‹FieldId &#124; string, unknown &#124; void›               |

**Returns:** _boolean_

boolean Whether the user can update the specified record.

### hasPermissionToUpdateRecords

▸ **hasPermissionToUpdateRecords**(`records?`: ReadonlyArray‹object›): _boolean_

_Defined in
[src/models/table.ts:886](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L886)_

An alias for `checkPermissionsForUpdateRecords(records).hasPermission`.

Checks whether the current user has permission to perform the given record updates.

Accepts partial input, in the same format as
[updateRecordsAsync](_airtable_blocks_models__table.md#updaterecordsasync). The more information
provided, the more accurate the permissions check will be.

**`example`**

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

| Name       | Type                  |
| ---------- | --------------------- |
| `records?` | ReadonlyArray‹object› |

**Returns:** _boolean_

boolean Whether the current user can update the specified records.

### selectRecords

▸ **selectRecords**(`opts?`: RecordQueryResultOpts):
_[TableOrViewQueryResult](_airtable_blocks_models__recordqueryresult.md#tableorviewqueryresult)_

_Defined in
[src/models/table.ts:437](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L437)_

Select records from the table. Returns a query result. See
[RecordQueryResult](_airtable_blocks_models__recordqueryresult.md#recordqueryresult) for more.

**`example`**

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

| Name    | Type                  |
| ------- | --------------------- |
| `opts?` | RecordQueryResultOpts |

**Returns:**
_[TableOrViewQueryResult](_airtable_blocks_models__recordqueryresult.md#tableorviewqueryresult)_

A query result.

### toString

▸ **toString**(): _string_

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[toString](_airtable_blocks_models__abstract_models.md#tostring)_

_Defined in
[src/models/abstract_model.ts:94](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/abstract_model.ts#L94)_

**Returns:** _string_

A string representation of the model for use in debugging.

### unwatch

▸ **unwatch**(`keys`: WatchableTableKey | ReadonlyArray‹WatchableTableKey›, `callback`: Object,
`context?`: FlowAnyObject | null): _Array‹WatchableTableKey›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[unwatch](_airtable_blocks_models__abstract_models.md#unwatch)_

_Defined in
[src/watchable.ts:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/watchable.ts#L107)_

Unwatch keys watched with `.watch`.

Should be called with the same arguments given to `.watch`.

**Parameters:**

| Name       | Type                                                      | Description                                    |
| ---------- | --------------------------------------------------------- | ---------------------------------------------- |
| `keys`     | WatchableTableKey &#124; ReadonlyArray‹WatchableTableKey› | the keys to unwatch                            |
| `callback` | Object                                                    | the function passed to `.watch` for these keys |
| `context?` | FlowAnyObject &#124; null                                 | -                                              |

**Returns:** _Array‹WatchableTableKey›_

the array of keys that were unwatched

### updateRecordAsync

▸ **updateRecordAsync**(`recordOrRecordId`: [Record](_airtable_blocks_models__record.md#record) |
RecordId, `fields`: ObjectMap‹FieldId | string, unknown›): _Promise‹void›_

_Defined in
[src/models/table.ts:547](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L547)_

Updates cell values for a record.

Throws an error if the user does not have permission to update the given cell values in the record,
or if invalid input is provided (eg. invalid cell values).

This action is asynchronous: `await` the returned promise if you wish to wait for the updated cell
values to be persisted to Airtable servers. Updates are applied optimistically locally, so your
changes will be reflected in your block before the promise resolves.

**`example`**

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

| Name               | Type                                                                | Description                                                                                                        |
| ------------------ | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `recordOrRecordId` | [Record](_airtable_blocks_models__record.md#record) &#124; RecordId | the record to update                                                                                               |
| `fields`           | ObjectMap‹FieldId &#124; string, unknown›                           | cell values to update in that record, specified as object mapping `FieldId` or field name to value for that field. |

**Returns:** _Promise‹void›_

A promise that will resolve to the RecordId of the new record, once the new record is persisted to
Airtable.

### updateRecordsAsync

▸ **updateRecordsAsync**(`records`: ReadonlyArray‹object›): _Promise‹void›_

_Defined in
[src/models/table.ts:742](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/table.ts#L742)_

Updates cell values for records.

Throws an error if the user does not have permission to update the given cell values in the records,
or if invalid input is provided (eg. invalid cell values).

You may only update up to 50 records in one call to `updateRecordsAsync`. See
[Writing changes to records](/packages/sdk/docs/guide_writes.md) for more information about write
limits.

This action is asynchronous: `await` the returned promise if you wish to wait for the updates to be
persisted to Airtable servers. Updates are applied optimistically locally, so your changes will be
reflected in your block before the promise resolves.

**`example`**

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

| Name      | Type                  |
| --------- | --------------------- |
| `records` | ReadonlyArray‹object› |

**Returns:** _Promise‹void›_

A promise that will resolve once the updates are persisted to Airtable.

### watch

▸ **watch**(`keys`: WatchableTableKey | ReadonlyArray‹WatchableTableKey›, `callback`: Object,
`context?`: FlowAnyObject | null): _Array‹WatchableTableKey›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[watch](_airtable_blocks_models__abstract_models.md#watch)_

_Defined in
[src/watchable.ts:61](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/watchable.ts#L61)_

Get notified of changes to the model.

Every call to `.watch` should have a matching call to `.unwatch`.

**Parameters:**

| Name       | Type                                                      | Description                               |
| ---------- | --------------------------------------------------------- | ----------------------------------------- |
| `keys`     | WatchableTableKey &#124; ReadonlyArray‹WatchableTableKey› | the keys to watch                         |
| `callback` | Object                                                    | a function to call when those keys change |
| `context?` | FlowAnyObject &#124; null                                 | -                                         |

**Returns:** _Array‹WatchableTableKey›_

the array of keys that were watched
