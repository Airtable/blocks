[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/models: Session](_airtable_blocks_models__session.md)

# External module: @airtable/blocks/models: Session

## Index

### Classes

-   [Session](_airtable_blocks_models__session.md#session)

## Classes

### Session

• **Session**:

_Defined in
[src/models/session.ts:40](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/session.ts#L40)_

Model class representing the current user's session.

**`example`**

```js
import {session} from '@airtable/blocks';

if (session.currentUser !== null) {
    console.log("The current user's name is", session.currentUser.name);
} else {
    console.log('This block is being viewed in a public share');
}
```

### currentUser

• **currentUser**:

_Defined in
[src/models/session.ts:120](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/session.ts#L120)_

**`function`**

**`returns`** The current user, or `null` if the block is running in a publicly shared base.

**`example`**

```js
import {session} from '@airtable/blocks';
if (session.currentUser) {
    console.log(session.currentUser.id);
    console.log(session.currentUser.email);
    console.log(session.currentUser.name);
}
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

### toString

▸ **toString**(): _string_

_Inherited from
[AbstractModel](_airtable_blocks_models__abstract_models.md#abstractmodel).[toString](_airtable_blocks_models__abstract_models.md#tostring)_

_Defined in
[src/models/abstract_model.ts:94](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/models/abstract_model.ts#L94)_

**Returns:** _string_

A string representation of the model for use in debugging.

### unwatch

▸ **unwatch**(`keys`: WatchableSessionKey | ReadonlyArray‹WatchableSessionKey›, `callback`: Object,
`context?`: FlowAnyObject | null): _Array‹WatchableSessionKey›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[unwatch](_airtable_blocks_models__abstract_models.md#unwatch)_

_Defined in
[src/watchable.ts:107](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/watchable.ts#L107)_

Unwatch keys watched with `.watch`.

Should be called with the same arguments given to `.watch`.

**Parameters:**

| Name       | Type                                                          | Description                                    |
| ---------- | ------------------------------------------------------------- | ---------------------------------------------- |
| `keys`     | WatchableSessionKey &#124; ReadonlyArray‹WatchableSessionKey› | the keys to unwatch                            |
| `callback` | Object                                                        | the function passed to `.watch` for these keys |
| `context?` | FlowAnyObject &#124; null                                     | -                                              |

**Returns:** _Array‹WatchableSessionKey›_

the array of keys that were unwatched

### watch

▸ **watch**(`keys`: WatchableSessionKey | ReadonlyArray‹WatchableSessionKey›, `callback`: Object,
`context?`: FlowAnyObject | null): _Array‹WatchableSessionKey›_

_Inherited from
[Watchable](_airtable_blocks_models__abstract_models.md#watchable).[watch](_airtable_blocks_models__abstract_models.md#watch)_

_Defined in
[src/watchable.ts:61](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.34/packages/sdk/src/watchable.ts#L61)_

Get notified of changes to the model.

Every call to `.watch` should have a matching call to `.unwatch`.

**Parameters:**

| Name       | Type                                                          | Description                               |
| ---------- | ------------------------------------------------------------- | ----------------------------------------- |
| `keys`     | WatchableSessionKey &#124; ReadonlyArray‹WatchableSessionKey› | the keys to watch                         |
| `callback` | Object                                                        | a function to call when those keys change |
| `context?` | FlowAnyObject &#124; null                                     | -                                         |

**Returns:** _Array‹WatchableSessionKey›_

the array of keys that were watched
