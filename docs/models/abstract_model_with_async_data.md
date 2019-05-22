## AbstractModelWithAsyncData

**Extends AbstractModel**

Abstract superclass for all block SDK models that need to fetch async data.

### Parameters

-   `baseData` **BaseData**
-   `modelId` **[string][1]**

### watch

Watching a key that needs to load data asynchronously will automatically cause the data to be
fetched. Once the data is available, the callback will be called.

#### Parameters

-   `keys` **(WatchableKey | [Array][2]&lt;WatchableKey>)**
-   `callback` **[Function][3]**
-   `context` **[Object][4]??**

Returns **[Array][2]&lt;WatchableKey>**

### unwatch

Unwatching a key that needs to load data asynchronously will automatically cause the data to be
released. Once the data is available, the callback will be called.

#### Parameters

-   `keys` **(WatchableKey | [Array][2]&lt;WatchableKey>)**
-   `callback` **[Function][3]**
-   `context` **[Object][4]??**

Returns **[Array][2]&lt;WatchableKey>**

### isDataLoaded

Type: [boolean][5]

Returns **[boolean][5]**

### loadDataAsync

Will cause all the async data to be fetched and retained. Every call to `loadDataAsync` should have
a matching call to `unloadData`.

Returns a Promise that will resolve once the data is loaded.

### unloadData

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function
[4]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object
[5]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
