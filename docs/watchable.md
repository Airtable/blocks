## Watchable

### watch

Start watching the given key or keys. The callback will be called when the value changes. Every call
to `watch` should have a matching call to `unwatch`.

Will log a warning if the keys given are invalid.

#### Parameters

-   `keys` **(WatchableKey | [Array][1]&lt;WatchableKey>)**
-   `callback` **[Function][2]**
-   `context` **[Object][3]??**

Returns **[Array][1]&lt;WatchableKey>**

### unwatch

Stop watching the given key or keys. Should be called with the same arguments that were given to
`watch`.

Will log a warning if the keys given are invalid.

#### Parameters

-   `keys` **(WatchableKey | [Array][1]&lt;WatchableKey>)**
-   `callback` **[Function][2]**
-   `context` **[Object][3]??**

Returns **[Array][1]&lt;WatchableKey>**

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function
[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object
