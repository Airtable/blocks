## Field

**Extends AbstractModel**

Model class representing a field in a table.

### Parameters

-   `baseData` **BaseData**
-   `parentTable` **TableType**
-   `fieldId` **[string][1]**

### parentTable

Type: TableType

Returns **TableType**

### name

Type: [string][1]

Returns **[string][1]**

### type

Type: [string][1]

Returns **[string][1]**

### options

Type: ({} | null)

Returns **({} | null)**

### isComputed

Type: [boolean][2]

Returns **[boolean][2]**

### isPrimaryField

Every table has exactly one primary field. True if this field is its parent table's primary field.

Type: [boolean][2]

Returns **[boolean][2]**

### availableAggregators

Type: [Array][3]&lt;Aggregator>

Returns **[Array][3]&lt;Aggregator>**

### isAggregatorAvailable

#### Parameters

-   `aggregator` **(Aggregator | [string][1])**

Returns **[boolean][2]**

### convertStringToCellValue

Given a string, will attempt to parse it and return a valid cell value for the field's current
config.

#### Parameters

-   `string` **[string][1]**

Returns **any**

[1]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[3]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array
