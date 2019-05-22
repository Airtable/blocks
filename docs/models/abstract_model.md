## AbstractModel

**Extends Watchable**

Abstract superclass for all models.

### Parameters

-   `baseData` **BaseData**
-   `modelId` **[string][1]**

### id

The ID for this model.

Type: [string][1]

Returns **[string][1]**

### isDeleted

True if the model has been deleted.

In general, it's best to avoid keeping a reference to an object past the current event loop, since
it may be deleted and trying to access any data of a deleted object (other than its ID) will throw.
But if you keep a reference, you can use `isDeleted` to check that it's safe to access the model's
data.

Type: [boolean][2]

Returns **[boolean][2]**

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
