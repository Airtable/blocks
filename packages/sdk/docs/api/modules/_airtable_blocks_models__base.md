[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/models: Base](_airtable_blocks_models__base.md)

# External module: @airtable/blocks/models: Base

## Index

### Classes

-   [Base](_airtable_blocks_models__base.md#base)

## Classes

### Base

• **Base**:

_Defined in
[src/models/base.ts:63](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/base.ts#L63)_

Model class representing a base.

**`example`**

```js
import {base} from '@airtable/blocks';

console.log('The name of your base is', base.name);
```

### activeCollaborators

• **activeCollaborators**:

_Defined in
[src/models/base.ts:183](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/base.ts#L183)_

**`function`**

**`returns`** The users who have access to this base.

**`example`**

```js
import {base} from '@airtable/blocks';
console.log(base.activeCollaborators[0].email);
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
[src/models/base.ts:147](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/base.ts#L147)_

**`function`**

**`returns`** The name of the base.

**`example`**

```js
import {base} from '@airtable/blocks';
console.log('The name of your base is', base.name);
```

### tables

• **tables**:

_Defined in
[src/models/base.ts:159](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/base.ts#L159)_

**`function`**

**`returns`** The tables in this base. Can be watched to know when tables are created, deleted, or
reordered in the base.

**`example`**

```js
import {base} from '@airtable/blocks';
console.log(`You have ${base.tables.length} tables`);
```

### getCollaboratorById

▸ **getCollaboratorById**(`collaboratorId`: UserId): _CollaboratorData_

_Defined in
[src/models/base.ts:226](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/base.ts#L226)_

**Parameters:**

| Name             | Type   | Description         |
| ---------------- | ------ | ------------------- |
| `collaboratorId` | UserId | The ID of the user. |

**Returns:** _CollaboratorData_

The user matching the given ID. Throws if that user does not exist or does not have access to this
base. Use
[getCollaboratorByIdIfExists](_airtable_blocks_models__base.md#getcollaboratorbyidifexists) instead
if you are unsure whether a collaborator with the given ID exists and has access to this base.

### getCollaboratorByIdIfExists

▸ **getCollaboratorByIdIfExists**(`collaboratorId`: UserId): _CollaboratorData | null_

_Defined in
[src/models/base.ts:208](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/base.ts#L208)_

**Parameters:**

| Name             | Type   | Description         |
| ---------------- | ------ | ------------------- |
| `collaboratorId` | UserId | The ID of the user. |

**Returns:** _CollaboratorData | null_

The user matching the given ID, or `null` if that user does not exist or does not have access to
this base.

### getTableById

▸ **getTableById**(`tableId`: string): _[Table](_airtable_blocks_models__table.md#table)_

_Defined in
[src/models/base.ts:293](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/base.ts#L293)_

**Parameters:**

| Name      | Type   | Description          |
| --------- | ------ | -------------------- |
| `tableId` | string | The ID of the table. |

**Returns:** _[Table](_airtable_blocks_models__table.md#table)_

The table matching the given ID. Throws if that table does not exist in this base. Use
[getTableByIdIfExists](_airtable_blocks_models__base.md#gettablebyidifexists) instead if you are
unsure whether a table exists with the given ID.

### getTableByIdIfExists

▸ **getTableByIdIfExists**(`tableId`: string): _[Table](_airtable_blocks_models__table.md#table) |
null_

_Defined in
[src/models/base.ts:273](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/base.ts#L273)_

**Parameters:**

| Name      | Type   | Description          |
| --------- | ------ | -------------------- |
| `tableId` | string | The ID of the table. |

**Returns:** _[Table](_airtable_blocks_models__table.md#table) | null_

The table matching the given ID, or `null` if that table does not exist in this base.

### getTableByName

▸ **getTableByName**(`tableName`: string): _[Table](_airtable_blocks_models__table.md#table)_

_Defined in
[src/models/base.ts:316](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/base.ts#L316)_

**Parameters:**

| Name        | Type   | Description                               |
| ----------- | ------ | ----------------------------------------- |
| `tableName` | string | The name of the table you're looking for. |

**Returns:** _[Table](_airtable_blocks_models__table.md#table)_

The table matching the given name. Throws if no table exists with that name in this base. Use
[getTableByNameIfExists](_airtable_blocks_models__base.md#gettablebynameifexists) instead if you are
unsure whether a table exists with the given name.

### getTableByNameIfExists

▸ **getTableByNameIfExists**(`tableName`: string): _[Table](_airtable_blocks_models__table.md#table)
| null_

_Defined in
[src/models/base.ts:304](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/base.ts#L304)_

**Parameters:**

| Name        | Type   | Description                               |
| ----------- | ------ | ----------------------------------------- |
| `tableName` | string | The name of the table you're looking for. |

**Returns:** _[Table](_airtable_blocks_models__table.md#table) | null_

The table matching the given name, or `null` if no table exists with that name in this base.

### toString

▸ **toString**(): _string_

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[toString](_airtable_blocks_models__abstract_models.md#tostring)_

_Defined in
[src/models/abstract_model.ts:94](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/abstract_model.ts#L94)_

**Returns:** _string_

A string representation of the model for use in debugging.

### unwatch

▸ **unwatch**(`keys`: WatchableBaseKey | ReadonlyArray‹WatchableBaseKey›, `callback`: Object,
`context?`: FlowAnyObject | null): _Array‹WatchableBaseKey›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[unwatch](_airtable_blocks_models__abstract_models.md#unwatch)_

_Defined in
[src/watchable.ts:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/watchable.ts#L107)_

Unwatch keys watched with `.watch`.

Should be called with the same arguments given to `.watch`.

**Parameters:**

| Name       | Type                                                    | Description                                    |
| ---------- | ------------------------------------------------------- | ---------------------------------------------- |
| `keys`     | WatchableBaseKey &#124; ReadonlyArray‹WatchableBaseKey› | the keys to unwatch                            |
| `callback` | Object                                                  | the function passed to `.watch` for these keys |
| `context?` | FlowAnyObject &#124; null                               | -                                              |

**Returns:** _Array‹WatchableBaseKey›_

the array of keys that were unwatched

### watch

▸ **watch**(`keys`: WatchableBaseKey | ReadonlyArray‹WatchableBaseKey›, `callback`: Object,
`context?`: FlowAnyObject | null): _Array‹WatchableBaseKey›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[watch](_airtable_blocks_models__abstract_models.md#watch)_

_Defined in
[src/watchable.ts:61](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/watchable.ts#L61)_

Get notified of changes to the model.

Every call to `.watch` should have a matching call to `.unwatch`.

**Parameters:**

| Name       | Type                                                    | Description                               |
| ---------- | ------------------------------------------------------- | ----------------------------------------- |
| `keys`     | WatchableBaseKey &#124; ReadonlyArray‹WatchableBaseKey› | the keys to watch                         |
| `callback` | Object                                                  | a function to call when those keys change |
| `context?` | FlowAnyObject &#124; null                               | -                                         |

**Returns:** _Array‹WatchableBaseKey›_

the array of keys that were watched
