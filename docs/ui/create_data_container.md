## createDataContainer

Returns a HOC component that will watch and unwatch the specified watchable objects.

Component can either be a stateful React component class, or a stateless functional component.

The getDependencies function will be invoked on componentDidMount, whenever props shallowly change,
and whenever one of the watches returned from the getDependencies function is triggered.

### Parameters

-   `Component` **ComponentType**
-   `getDependencies` **function (props: Props): [Array][1]&lt;WatchDependency?>**
-   `passthruMethodNames` **[Array][1]&lt;[string][2]>?**

### Examples

```javascript
import {UI} from 'airtable-block';
const MyComponentWithData = UI.createDataContainer(MyComponent, getDependencies(props) {
    // This should return an array of dependency objects:
    return [
        // Will call forceUpdate when table name changes.
        {watch: props.table, key: 'name'},

        // Will call this._onFieldsChange when table fields change.
        {watch: props.table, key: 'fields', callback: MyComponent.prototype._onFieldsChange},
    ];
});
```

Returns **ComponentType**

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
