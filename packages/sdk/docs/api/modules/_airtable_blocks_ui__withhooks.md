[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: withHooks](_airtable_blocks_ui__withhooks.md)

# External module: @airtable/blocks/ui: withHooks

## Index

### Functions

-   [withHooks](_airtable_blocks_ui__withhooks.md#withhooks)

## Functions

### withHooks

▸ **withHooks**<**InjectedProps**, **Props**, **Instance**>(`Component`: object & object |
RefForwardingComponent‹Instance, Props› | FunctionComponent‹Props›, `getAdditionalPropsToInject`:
function): _RefForwardingComponent‹Instance, Omit‹Props, keyof InjectedProps› &
RefAttributes‹Instance››_

_Defined in
[src/ui/with_hooks.tsx:94](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.36/packages/sdk/src/ui/with_hooks.tsx#L94)_

A higher-order component for working with React hooks in class-based components. It takes a React
component and wraps it, injecting values from hooks as additional props. `withHooks` uses
[`React.forwardRef`](https://reactjs.org/docs/forwarding-refs.html) to make sure that you can use
refs with your wrapped component in exactly the same way you would if you weren't using `withHooks`.

If you need an reference to the actual component instance, you can return a `ref` prop.

**Example:**

```js
import React from 'react';
import {useRecords, withHooks} from '@airtable/blocks/ui';

// RecordList takes a list of records and renders it
class RecordList extends React.Component {
    render() {
        const records = this.props.records.map(record => {
            return <li key={record.id}>{record.primaryCellValueAsString}</li>;
        });

        return <ul>{records}</ul>;
    }
}

// using withHooks, we wrap up RecordList. It takes a queryResult prop, and injects a records
// prop from useRecords
const WrappedRecordList = withHooks(RecordList, ({queryResult}) => {
    const records = useRecords(queryResult);

    const instanceRef = React.useRef();
    useEffect(() => {
        console.log('RecordList instance:', instanceRef.current);
    });

    return {
        records: records,
        ref: instanceRef,
    };
});

// when we use WrappedRecordList, we only need to pass in queryResult:
<WrappedRecordList queryResult={someQueryResult} />;
```

**Example:**

```js
import React from 'react';
import {Record, QueryResult} from '@airtable/blocks/models';
import {withHooks, useRecords} from '@airtable/blocks/ui';
// with typescript, things are a little more complex: we need to provide some type annotations to
// indicate which props are injected:

type RequiredProps = {
     queryResult: QueryResult,
};

type InjectedProps = {
     records: Array<Record>,
};

type RecordListProps = RequiredProps & InjectedProps;

class RecordList extends React.Component<RecordListProps> {
     // implementation is the same as the example above
}

// you need to annotate the call to withHooks. This takes three type args:
//   - The injected props
//   - The full resulting props passed to the element
//   - the instance type (what you get out of a ref) of the resulting component
const WrappedRecordList = withHooks<InjectedProps, RecordListProps, RecordList>(
     RecordList,
     ({queryResult}) => {
         const records = useRecords(queryResult);
         return {
             records
         };
     },
);

// when using a ref to the component, you can't refer to it as WrappedRecordList like a normal
// class component. Instead, you need to wrap it in React.ElementRef:
const ref: React.ElementRef<typeof WrappedRecordList> = getTheRefSomehow();
```

**Type parameters:**

▪ **InjectedProps**

▪ **Props**: _InjectedProps_

▪ **Instance**

**Parameters:**

▪ **Component**: _object & object | RefForwardingComponent‹Instance, Props› |
FunctionComponent‹Props›_

The React component you want to inject hooks into.

▪ **getAdditionalPropsToInject**: _function_

A function that takes props and returns more props to be injected into the wrapped component.

▸ (`props`: Omit‹Props, keyof InjectedProps›): _InjectedProps & object_

**Parameters:**

| Name    | Type                             |
| ------- | -------------------------------- |
| `props` | Omit‹Props, keyof InjectedProps› |

**Returns:** _RefForwardingComponent‹Instance, Omit‹Props, keyof InjectedProps› &
RefAttributes‹Instance››_

The wrapped React component.
