[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/models: Base](_airtable_blocks_models__base.md)

# External module: @airtable/blocks/models: Base

## Index

### Classes

-   [Base](_airtable_blocks_models__base.md#base)

### Interfaces

-   [CollaboratorData](_airtable_blocks_models__base.md#collaboratordata)

### Type aliases

-   [BaseId](_airtable_blocks_models__base.md#baseid)
-   [UserId](_airtable_blocks_models__base.md#userid)
-   [WatchableBaseKey](_airtable_blocks_models__base.md#watchablebasekey)

## Classes

### Base

• **Base**:

_Defined in
[src/models/base.ts:59](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/base.ts#L59)_

Model class representing a base.

**Example:**

```js
import {base} from '@airtable/blocks';

console.log('The name of your base is', base.name);
```

### activeCollaborators

• **activeCollaborators**:

_Defined in
[src/models/base.ts:133](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/base.ts#L133)_

The users who have access to this base.

**Example:**

```js
import {base} from '@airtable/blocks';
console.log(base.activeCollaborators[0].email);
```

### id

• **id**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[id](_airtable_blocks_models__abstract_models.md#id)_

_Defined in
[src/models/abstract_model.ts:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model.ts#L40)_

The ID for this model.

### isDeleted

• **isDeleted**:

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[isDeleted](_airtable_blocks_models__abstract_models.md#isdeleted)_

_Defined in
[src/models/abstract_model.ts:69](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model.ts#L69)_

`true` if the model has been deleted, and `false` otherwise.

In general, it's best to avoid keeping a reference to an object past the current event loop, since
it may be deleted and trying to access any data of a deleted object (other than its ID) will throw.
But if you keep a reference, you can use `isDeleted` to check that it's safe to access the model's
data.

### name

• **name**:

_Defined in
[src/models/base.ts:97](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/base.ts#L97)_

The name of the base.

**Example:**

```js
import {base} from '@airtable/blocks';
console.log('The name of your base is', base.name);
```

### tables

• **tables**:

_Defined in
[src/models/base.ts:109](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/base.ts#L109)_

The tables in this base. Can be watched to know when tables are created, deleted, or reordered in
the base.

**Example:**

```js
import {base} from '@airtable/blocks';
console.log(`You have ${base.tables.length} tables`);
```

### getCollaboratorById

▸ **getCollaboratorById**(`collaboratorId`: [UserId](_airtable_blocks_models__base.md#userid)):
_[CollaboratorData](_airtable_blocks_models__base.md#collaboratordata)_

_Defined in
[src/models/base.ts:153](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/base.ts#L153)_

**Parameters:**

| Name             | Type                                              | Description         |
| ---------------- | ------------------------------------------------- | ------------------- |
| `collaboratorId` | [UserId](_airtable_blocks_models__base.md#userid) | The ID of the user. |

**Returns:** _[CollaboratorData](_airtable_blocks_models__base.md#collaboratordata)_

The user matching the given ID. Throws if that user does not exist or does not have access to this
base. Use
[getCollaboratorByIdIfExists](_airtable_blocks_models__base.md#getcollaboratorbyidifexists) instead
if you are unsure whether a collaborator with the given ID exists and has access to this base.

### getCollaboratorByIdIfExists

▸ **getCollaboratorByIdIfExists**(`collaboratorId`:
[UserId](_airtable_blocks_models__base.md#userid)):
_[CollaboratorData](_airtable_blocks_models__base.md#collaboratordata) | null_

_Defined in
[src/models/base.ts:142](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/base.ts#L142)_

**Parameters:**

| Name             | Type                                              | Description         |
| ---------------- | ------------------------------------------------- | ------------------- |
| `collaboratorId` | [UserId](_airtable_blocks_models__base.md#userid) | The ID of the user. |

**Returns:** _[CollaboratorData](_airtable_blocks_models__base.md#collaboratordata) | null_

The user matching the given ID, or `null` if that user does not exist or does not have access to
this base.

### getTableById

▸ **getTableById**(`tableId`: string): _[Table](_airtable_blocks_models__table.md#table)_

_Defined in
[src/models/base.ts:208](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/base.ts#L208)_

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
[src/models/base.ts:188](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/base.ts#L188)_

**Parameters:**

| Name      | Type   | Description          |
| --------- | ------ | -------------------- |
| `tableId` | string | The ID of the table. |

**Returns:** _[Table](_airtable_blocks_models__table.md#table) | null_

The table matching the given ID, or `null` if that table does not exist in this base.

### getTableByName

▸ **getTableByName**(`tableName`: string): _[Table](_airtable_blocks_models__table.md#table)_

_Defined in
[src/models/base.ts:231](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/base.ts#L231)_

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
[src/models/base.ts:219](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/base.ts#L219)_

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
[src/models/abstract_model.ts:90](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/abstract_model.ts#L90)_

**Returns:** _string_

A string representation of the model for use in debugging.

### unwatch

▸ **unwatch**(`keys`: [WatchableBaseKey](_airtable_blocks_models__base.md#watchablebasekey) |
ReadonlyArray‹[WatchableBaseKey](_airtable_blocks_models__base.md#watchablebasekey)›, `callback`:
function, `context?`: FlowAnyObject | null):
_Array‹[WatchableBaseKey](_airtable_blocks_models__base.md#watchablebasekey)›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[unwatch](_airtable_blocks_models__abstract_models.md#unwatch)_

_Defined in
[src/watchable.ts:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/watchable.ts#L107)_

Unwatch keys watched with `.watch`.

Should be called with the same arguments given to `.watch`.

**Parameters:**

▪ **keys**: _[WatchableBaseKey](_airtable_blocks_models__base.md#watchablebasekey) |
ReadonlyArray‹[WatchableBaseKey](_airtable_blocks_models__base.md#watchablebasekey)›_

the keys to unwatch

▪ **callback**: _function_

the function passed to `.watch` for these keys

▸ (`model`: this, `key`: [WatchableBaseKey](_airtable_blocks_models__base.md#watchablebasekey),
...`args`: Array‹any›): _unknown_

**Parameters:**

| Name      | Type                                                                  |
| --------- | --------------------------------------------------------------------- |
| `model`   | this                                                                  |
| `key`     | [WatchableBaseKey](_airtable_blocks_models__base.md#watchablebasekey) |
| `...args` | Array‹any›                                                            |

▪`Optional` **context**: _FlowAnyObject | null_

the context that was passed to `.watch` for this `callback`

**Returns:** _Array‹[WatchableBaseKey](_airtable_blocks_models__base.md#watchablebasekey)›_

the array of keys that were unwatched

### watch

▸ **watch**(`keys`: [WatchableBaseKey](_airtable_blocks_models__base.md#watchablebasekey) |
ReadonlyArray‹[WatchableBaseKey](_airtable_blocks_models__base.md#watchablebasekey)›, `callback`:
function, `context?`: FlowAnyObject | null):
_Array‹[WatchableBaseKey](_airtable_blocks_models__base.md#watchablebasekey)›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[watch](_airtable_blocks_models__abstract_models.md#watch)_

_Defined in
[src/watchable.ts:61](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/watchable.ts#L61)_

Get notified of changes to the model.

Every call to `.watch` should have a matching call to `.unwatch`.

**Parameters:**

▪ **keys**: _[WatchableBaseKey](_airtable_blocks_models__base.md#watchablebasekey) |
ReadonlyArray‹[WatchableBaseKey](_airtable_blocks_models__base.md#watchablebasekey)›_

the keys to watch

▪ **callback**: _function_

a function to call when those keys change

▸ (`model`: this, `key`: [WatchableBaseKey](_airtable_blocks_models__base.md#watchablebasekey),
...`args`: Array‹any›): _unknown_

**Parameters:**

| Name      | Type                                                                  |
| --------- | --------------------------------------------------------------------- |
| `model`   | this                                                                  |
| `key`     | [WatchableBaseKey](_airtable_blocks_models__base.md#watchablebasekey) |
| `...args` | Array‹any›                                                            |

▪`Optional` **context**: _FlowAnyObject | null_

an optional context for `this` in `callback`.

**Returns:** _Array‹[WatchableBaseKey](_airtable_blocks_models__base.md#watchablebasekey)›_

the array of keys that were watched

## Interfaces

### CollaboratorData

• **CollaboratorData**:

_Defined in
[src/types/collaborator.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/types/collaborator.ts#L10)_

An object representing a collaborator. You should not create these objects from scratch, but should
instead grab them from base data.

### email

• **email**: _string_

_Defined in
[src/types/collaborator.ts:14](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/types/collaborator.ts#L14)_

The email address of the collaborator.

### id

• **id**: _[UserId](_airtable_blocks_models__base.md#userid)_

_Defined in
[src/types/collaborator.ts:12](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/types/collaborator.ts#L12)_

The user ID of the collaborator.

### `Optional` name

• **name**? : _undefined | string_

_Defined in
[src/types/collaborator.ts:16](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/types/collaborator.ts#L16)_

The name of the collaborator.

### `Optional` profilePicUrl

• **profilePicUrl**? : _undefined | string_

_Defined in
[src/types/collaborator.ts:18](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/types/collaborator.ts#L18)_

The URL of the collaborator's profile picture.

## Type aliases

### BaseId

Ƭ **BaseId**: _string_

_Defined in
[src/types/base.ts:10](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/types/base.ts#L10)_

---

### UserId

Ƭ **UserId**: _string_

_Defined in
[src/types/collaborator.ts:4](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/types/collaborator.ts#L4)_

---

### WatchableBaseKey

Ƭ **WatchableBaseKey**: _"name" | "tables" | "collaborators" | "schema"_

_Defined in
[src/models/base.ts:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/models/base.ts#L40)_

Any key in base that can be watched:

-   `name`: the name of the base
-   `tables`: the order of tables in the base
-   `collaborators`: all the collaborators in the base
-   `schema`: the base schema (essentially everything except for record data)
