## Base

**Extends AbstractModel**

Model class representing a base.

### Parameters

-   `baseData` **BaseData**
-   `airtableInterface` **AirtableInterface**

### Examples

```javascript
import {base} from 'airtable-blocks';
```

### name

The name of the base.

Type: [string][1]

Returns **[string][1]**

### currentUser

The current user, or `null` if the block is running in a publicly shared base.

Type: (CollaboratorData | null)

Returns **(CollaboratorData | null)**

### permissionLevel

The current user's permission level.

The value of this should not be consumed and will be deprecated. To know whether a user can perform
an action, use the more specific `can` method.

Can be watched to know when the user's permission level changes. Usually, you'll want to watch this
in your root component and re-render your whole block when the permission level changes.

Type: [string][1]

#### Examples

```javascript
if (globalConfig.canSet('foo')) {
    globalConfig.set('foo', 'bar');
}
```

```javascript
if (record.canSetCellValue('Name', 'Chair')) {
    record.setCellValue('Name', 'Chair');
}
```

Returns **[string][1]**

### tables

The tables in this base. Can be watched to know when tables are created, deleted, or reordered in
the base.

Type: [Array][2]&lt;Table>

Returns **[Array][2]&lt;Table>**

### activeCollaborators

The users who have access to this base.

Type: [Array][2]&lt;CollaboratorData>

Returns **[Array][2]&lt;CollaboratorData>**

### getCollaboratorByIdIfExists

Returns the user matching the given ID, or `null` if that user does not exist or does not have
access to this base.

#### Parameters

-   `collaboratorId` **[string][1]**

Returns **(CollaboratorData | null)**

### getCollaboratorById

Returns the user matching the given ID, or throws if that user does not exist or does not have
access to this base.

#### Parameters

-   `collaboratorId` **[string][1]**

Returns **CollaboratorData**

### getTableByIdIfExists

Returns the table matching the given ID, or `null` if that table does not exist in this base.

#### Parameters

-   `tableId` **[string][1]**

Returns **(Table | null)**

### getTableById

Returns the table matching the given ID, or throws if that table does not exist in this base.

#### Parameters

-   `tableId` **[string][1]**

Returns **Table**

### getTableByNameIfExists

Returns the table matching the given name, or `null` if no table exists with that name in this base.

#### Parameters

-   `tableName` **[string][1]**

Returns **(Table | null)**

### getTableByName

Returns the table matching the given name, or throws if no table exists with that name in this base.

#### Parameters

-   `tableName` **[string][1]**

Returns **Table**

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
