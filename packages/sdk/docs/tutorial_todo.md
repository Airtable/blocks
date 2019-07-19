# Guide: building a to-do list block

In this 3-part tutorial, you’ll learn how to build a block that shows a list of tasks from a table
and lets you click a checkbox to toggle whether the task is done or not. It’ll look something like
this:

![](/packages/sdk/docs/img/tutorial_todo_1.gif)

Here’s a breakdown of what we’ll cover in each part:

-   Part 1: show the list of tasks.
-   Part 2: allow the user to pick which table they want to show tasks from.
-   Part 3: remember the user’s choices for which table they want to show tasks from.

**We’ll assume you’ve already read [the setup guide](/packages/sdk/docs/setup.md).**

Let’s get started!

# Part 1

Copy [this base](https://airtable.com/shrKs6a2cQPEK5yzr), or go to an existing base. If you’re using
an existing base, make sure it has a table called “Tasks” — if it doesn’t, create one or rename one
of the existing tables.

Open the blocks panel, click “Add a block”, then click “Build a block”. Follow the onscreen
instructions to set up the block.

![](/packages/sdk/docs/img/tutorial_todo_2.gif)

Open `frontend/index.js` in your code editor and let’s start writing some code! It should look like
this:

```js
import {initializeBlock} from '@airtable/blocks/ui';
import React from 'react';

function TodoBlock() {
    // YOUR CODE GOES HERE
    return <div>Hello world 🚀</div>;
}

initializeBlock(() => <TodoBlock />);
```

As a first step, let’s make the block show the base name instead of “Hello world.” To get
information about the base that the block is running inside, we need the `base` object.

We can import it directly using `import {base} from '@airtable/blocks'`, but in this case it’s
better to use a [React hook](https://reactjs.org/docs/hooks-intro.html) to get the base object. By
using a hook, our component will automatically update when the relevant information changes. We’ll
use the `useBase` hook, which will cause the `TodoBlock` component to re-render whenever the base
name changes (it will also re-render when tables, fields, and views are created, updated, or deleted
and when the current user’s permission level changes).

Change `index.js` to look like this:

```diff
import {
    initializeBlock,
+   useBase,
} from '@airtable/blocks/ui';
import React from 'react';

function TodoBlock() {
+   const base = useBase();

    return (
-       <div>Hello world 🚀</div>
+       <div>{base.name}</div>
    );
}

initializeBlock(() => <TodoBlock />);
```

The block should show the base’s name and if you rename the base, the block should automatically
update to show the new name!

### Showing the number of records

Now we’ll change the block to show the number of records in the “Tasks” table instead of the base
name.

Change `index.js` to look like this:

```diff
import {
    initializeBlock,
    useBase,
+   useRecords,
} from '@airtable/blocks/ui';
import React from 'react';

function TodoBlock() {
    const base = useBase();
+   const table = base.getTableByName('Tasks');

+   const queryResult = table.selectRecords();
+   const records = useRecords(queryResult);

    return (
-       <div>{base.name}</div>
+       <div>Number of tasks: {records.length}</div>
    );
}

initializeBlock(() => <TodoBlock />);
```

Try creating and deleting records in the table! You should see the number of tasks in the block
update.

Let’s walk through the 4 lines that changed:

```js
const table = base.getTableByName('Tasks');
```

We’re asking the base to give us the Table object corresponding to the table called “Tasks”. The
block will crash if there isn’t a table called “Tasks”, and we’ll see how to deal with this later in
this tutorial. For now we’ll assume there will always be a table called “Tasks”.

Once we have the `Table` object, we can ask for its records by calling `selectRecords()`:

```js
const queryResult = table.selectRecords();
```

`table.selectRecords` returns a `QueryResult` object that represents a collection of records.

Then we use a new hook, called `useRecords`, to connect our `TodoBlock` component to the records
inside the `QueryResult`. Any time records are created, deleted, or updated in the table, our
component will automatically re-render:

```
const records = useRecords(queryResult);
```

`records` will be an array of `Record` objects. Since it’s an array, we can use `records.length` to
get the number of records in the QueryResult.

```js
return <div>Number of tasks: {records.length}</div>;
```

### Showing the name of the records

Let’s change the block to show the primary cell value of all the records, instead of just the count.

Change `index.js` to look like this:

```diff
import {
    initializeBlock,
    useBase,
    useRecords,
} from '@airtable/blocks/ui';
import React from 'react';

function TodoBlock() {
    const base = useBase();
    const table = base.getTableByName('Tasks');

    const queryResult = table.selectRecords();
    const records = useRecords(queryResult);

+   const tasks = records.map(record => {
+       return (
+           <div key={record.id}>
+               {record.primaryCellValueAsString || 'Unnamed record'}
+           </div>
+       );
+   });

    return (
-       <div>Number of tasks: {records.length}</div>
+       <div>{tasks}</div>
    );
}

initializeBlock(() => <TodoBlock />);
```

We’re mapping over the `Record` objects in the `records` array to create an array of `<div>`
elements, one `<div>` per record.

Since we’re rendering a list, we include a unique key for each element by using the record’s ID.
[Learn more about why React needs keys in lists of elements here.](https://reactjs.org/docs/lists-and-keys.html)

Inside each `<div>`, we render the primary cell value of the record. Instead of using
`record.primaryCellValue`, we use `record.primaryCellValueAsString` to automatically handle
converting cell values to string (for example, the table’s primary field might be a number field).

`record.primaryCellValueAsString` might be an empty string, in which case we want to show “Unnamed
record” in our list.

You should now see the primary cell value of the records in the table in your block, and if you edit
any of the names from outside the block, the block will automatically update to show the latest
names.

If you want to get the cell values from other fields, you can use `record.getCellValue()` or
`record.getCellValueAsString()`.

### Expanding records

Let’s make it so that clicking on a record’s name in the block expands the record to allow the user
to edit the record’s contents.

Before we do that, let’s refactor our block a little bit. It’ll make it easier to add functionality
and keep our code more readable if we create a separate `Task` component, instead of continuing to
add code to the top-level `TodoBlock` component:

```diff
import {
    initializeBlock,
    useBase,
    useRecords,
} from '@airtable/blocks/ui';
import React from 'react';

function TodoBlock() {
    const base = useBase();
    const table = base.getTableByName('Tasks');

    const queryResult = table.selectRecords();
    const records = useRecords(queryResult);

    const tasks = records.map(record => {
-       return (
-           <div key={record.id}>
-               {record.primaryCellValueAsString || 'Unnamed record'}
-           </div>
-       );
+       return <Task key={record.id} record={record} />;
    });

    return (
        <div>{tasks}</div>
    );
}

+function Task({record}) {
+    return (
+        <div>
+            {record.primaryCellValueAsString || 'Unnamed record'}
+        </div>
+    );
+}

initializeBlock(() => <TodoBlock />);
```

Our new Task component takes a prop called `record` and renders its name, or “Unnamed record” if its
name is blank.

Now we can change our `Task` component to expand the record when the user clicks on the record name.
We’ll do that by wrapping the record’s name in an `<a>` component with an `onClick` handler that
calls `expandRecord()`.

```diff
import {
    initializeBlock,
    useBase,
    useRecords,
+   expandRecord,
} from '@airtable/blocks/ui';
import React from 'react';

function TodoBlock() { /* No changes */ }

function Task({record}) {
    return (
        <div>
+           <a
+               onClick={() => {
+                   expandRecord(record);
+               }}
+           >
                {record.primaryCellValueAsString || 'Unnamed record'}
+           </a>
        </div>
    );
}

initializeBlock(() => <TodoBlock />);
```

Clicking on a record’s name in your block should expand it, allowing you to edit its name and other
fields.

### A little style

One last thing to do before we wrap up Part 1: let’s add some CSS styles to make our block look
polished! Feel free to tweak the below styles to customize your block.

```diff
function Task({record}) {
    return (
-       <div>
+       <div style={{fontSize: 18, padding: 12, borderBottom: '1px solid #ddd'}}>
            <a
+               style={{cursor: 'pointer'}}
                onClick={() => {
                    expandRecord(record);
                }}
            >
                {record.primaryCellValueAsString || 'Unnamed record'}
            </a>
        </div>
    );
}
```

Congratulations on finishing Part 1! You should have a block that looks like this:

![](/packages/sdk/docs/img/tutorial_todo_3.png)

## Part 2

The block we made in Part 1 has a pretty big limitation: it only works if the base has a table
called “Tasks.” Try renaming the table and you’ll see the block crash.

Let’s change the block to let the user pick which table they want to use to show their tasks!

### Don’t crash when there’s no table

First, we need to change `TodoBlock` to handle the case where there is no table selected. Instead of
crashing, we’ll change it to show a blank screen:

```diff
function TodoBlock() {
    const base = useBase();
-   const table = base.getTableByName('Tasks');
+   const table = base.getTableByNameIfExists('Tasks');

-   const queryResult = table.selectRecords();
+   const queryResult = table ? table.selectRecords() : null;
    const records = useRecords(queryResult);

-   const tasks = records.map(record => {
-       return <Task key={record.id} record={record} />;
-   });
+   const tasks = records ? records.map(record => {
+       return <Task key={record.id} record={record} />;
+   }) : null;

    return (
        <div>{tasks}</div>
    );
}
```

`base.getTableByName` will crash the block if there’s no table in the base with the specified name.
`base.getTableByNameIfExists` will return null instead of crashing if there’s no table with the
specified name.

Now that `table` might be null, we need to be careful when using it. We can’t call `selectRecords()`
on null, so we use a ternary expression to make `queryResult` also be `null` when there’s no table:

```js
const queryResult = table ? table.selectRecords() : null;
```

_Aside:_ the above line is equivalent to:

```js
let queryResult;
if (table) {
    queryResult = table.selectRecords();
} else {
    queryResult = null;
}
```

We prefer to use ternary expressions for these null checks because they help make the code more
concise, but you can write out `if` statements if you prefer!

When `queryResult` is null, `records` will also be null. So we use another ternary expression to
make sure we’re only calling `records.map` when `records` is not null. If `records` is null, we
won’t try rendering any `Task` components.

Now the block should work as before, but if you rename the “Tasks” table, the block should show a
blanks screen instead of crashing. Change the name of the table back to “Tasks” and the records
should appear again inside the block.

### Storing the selected table in state

Right now we’re hard-coding “Tasks” as the table name the block will use. To let the user specify
which table they want to use, we’ll store the table name in the `TodoBlock` component’s state with
[React’s built-in useState hook:](https://reactjs.org/docs/hooks-state.html)

```diff
import {
    initializeBlock,
    useBase,
    useRecords,
    expandRecord,
} from '@airtable/blocks/ui';
-import React from 'react';
+import React, {useState} from 'react';

function TodoBlock() {
    const base = useBase();

+   const [tableName, setTableName] = useState('Tasks');

-   const table = base.getTableByNameIfExists('Tasks');
+   const table = base.getTableByNameIfExists(tableName);

    const queryResult = table ? table.selectRecords() : null;
    const records = useRecords(queryResult);

    const tasks = records ? records.map(record => {
        return <Task key={record.id} record={record} />;
    }) : null;

    return (
        <div>{tasks}</div>
    );
}

function Task({record}) { /* No change */ }

initializeBlock(() => <TodoBlock />);
```

We’re still hard-coding “Tasks” as the initial table name, but if we call `setTableName` with the
name of another table, the block will switch to show records from that table. To make sure make sure
that works, we need to add some way for the user to pick a table. The Blocks SDK includes a
`TablePicker` component we can use!

```diff
import {
    initializeBlock,
    useBase,
    useRecords,
    expandRecord,
+   TablePicker,
} from '@airtable/blocks/ui';
import React, {useState} from 'react';

function TodoBlock() {
    const base = useBase();

    const [tableName, setTableName] = useState('Tasks');

    const table = base.getTableByNameIfExists(tableName);

    const queryResult = table ? table.selectRecords() : null;
    const records = useRecords(queryResult);

    const tasks = records ? records.map(record => {
        return <Task key={record.id} record={record} />;
    }) : null;

    return (
        <div>
+           <TablePicker
+               table={table}
+               onChange={newTable => {
+                   setTableName(newTable.name);
+               }}
+           />
            {tasks}
        </div>
    );
}

function Task({record}) { /* No change */ }

initializeBlock(() => <TodoBlock />);
```

Now there should be a dropdown that lets you pick between different tables in the base (create a new
table if you only have 1)!

![](/packages/sdk/docs/img/tutorial_todo_4.gif)

### Using table ID instead of table name

It’s definitely an improvement that the user can pick which table to use. But if anyone renames the
table, the block will stop showing the records until you pick the table again. We can avoid this by
using the table’s ID instead of its name. The table ID won’t change when the table gets renamed.

```diff
function TodoBlock() {
    const base = useBase();

-   const [tableName, setTableName] = useState('Tasks');
+   const [tableId, setTableId] = useState(null);

-   const table = base.getTableByNameIfExists(tableName);
+   const table = base.getTableByIdIfExists(tableId);

    const queryResult = table ? table.selectRecords() : null;
    const records = useRecords(queryResult);

    const tasks = records ? records.map(record => {
        return <Task key={record.id} record={record} />;
    }) : null;

    return (
        <div>
            <TablePicker
                table={table}
                onChange={newTable => {
-                   setTableName(newTable.name);
+                   setTableId(newTable.id);
                }}
            />
            {tasks}
        </div>
    );
}
```

Now try renaming the selected table. The block will continue to show records from that table!

## Part 3

The user can pick which table they want to show tasks from, but the block doesn’t remember their
choice. Every time they load the block, they start with an empty list until they pick the table. It
would be better if the block remembered the user’s choice!

### Storing configuration

Each block installation has a storage mechanism called `globalConfig` where you can store
configuration information. The contents of `globalConfig` will be synced in real-time to all logged
in users of that block installation. Because any base collaborator can read from it, you shouldn't
store sensitive data here.

Airtable's existing blocks, like _Page designer_ and _Chart_, make heavy use of global config, and
your blocks will likely do the same. For example, Airtable's Chart block lets you choose which kind
of chart you want to use (bar chart, pie chart, etc) and it stores the chart type in `globalConfig`.

Let’s change the block to store the selected table’s ID in `globalConfig` instead of the `TodoBlock`
component's state:

```diff
import {
    initializeBlock,
    useBase,
    useRecords,
+   useGlobalConfig,
    expandRecord,
    TablePicker,
} from '@airtable/blocks/ui';
import React from 'react';

function TodoBlock() {
    const base = useBase();

-   const [tableId, setTableId] = useState(null);
+   const globalConfig = useGlobalConfig();
+   const tableId = globalConfig.get('selectedTableId');

    const table = base.getTableByIdIfExists(tableId);

    const queryResult = table ? table.selectRecords() : null;
    const records = useRecords(queryResult);

    const tasks = records ? records.map(record => {
        return <Task key={record.id} record={record} />;
    }) : null;

    return (
        <div>
            <TablePicker
                table={table}
                onChange={newTable => {
-                   setTableId(newTable.id);
+                   globalConfig.set('selectedTableId', newTable.id);
                }}
            />
            {tasks}
        </div>
    );
}

function Task({record}) { /* No changes */ }

initializeBlock(() => <TodoBlock />);
```

Let’s walk through the lines that changed:

```js
const globalConfig = useGlobalConfig();
```

With the `useGlobalConfig` hook, we can have our `TodoBlock` component access data in `globalConfig`
and automatically re-render when any of that data changes.

```js
const tableId = globalConfig.get('selectedTableId');
```

Previously, the table ID was stored in the component state with the `useState` hook. Now we’re
storing it in `globalConfig`, so we get its value by calling `globalConfig.get()`. We’re choosing to
use “selectedTableId” as the key in globalConfig, but you could call it whatever you want—it just
has to match the key you pass to `globalConfig.set()` below.

```js
globalConfig.set('selectedTableId', newTable.id);
```

When the user picks a new table from the `TablePicker`, we use `globalConfig.set()` to update the
table ID that’s stored in `globalConfig`.

Values in `globalConfig` can be strings, numbers, booleans, null, arrays, and plain objects—anything
that can be encoded as JSON. This means we can’t store the table object directly in `globalConfig`,
so we store its ID instead, which is a string.

Now when you pick the table, it’ll be saved. If you reload the block installation, it’ll remember
the table you were using. Much better!

### Permissions

There’s a bug in the changes we just made. Read-only and comment-only collaborators aren’t allowed
to update globalConfig, so if they try changing the selected table our block will crash. You can try
this out by clicking “Simulate,” then choosing “Read” or “Comment” from the dropdown:

![](/packages/sdk/docs/img/tutorial_todo_5.gif)

We could fix this by disabling the `TablePicker` if the user doesn’t have permission to change
`globalConfig` by using `globalConfig.canSet()`.

But there’s an easier way! The `TablePicker` component has a sibling component called
`TablePickerSynced` which automatically reads and writes to `globalConfig` with the proper
permission checks. Let’s switch to that.

```diff
import {
    initializeBlock,
    useBase,
    useRecords,
    useGlobalConfig,
    expandRecord,
-   TablePicker,
+   TablePickerSynced,
} from '@airtable/blocks/ui';
import {globalConfig} from '@airtable/blocks';
import React, {useState} from 'react';

function TodoBlock() {
    const base = useBase();

    const globalConfig = useGlobalConfig();
    const tableId = globalConfig.get('selectedTableId');

    const table = base.getTableByIdIfExists(tableId);

    const queryResult = table ? table.selectRecords() : null;
    const records = useRecords(queryResult);

    const tasks = records ? records.map(record => {
        return <Task key={record.id} record={record} />;
    }) : null;

    return (
        <div>
-           <TablePicker
-               table={table}
-               onChange={newTable => {
-                   globalConfig.set('selectedTableId', newTable.id);
-               }}
-           />
+           <TablePickerSynced globalConfigKey="selectedTableId" />
            {tasks}
        </div>
    );
}

function Task({record}) { /* No change */ }

initializeBlock(() => <TodoBlock />);
```

Instead of passing a `table` and an `onChange` prop, we tell `TablePickerSynced` which key in
`globalConfig` it should read from and write to using the `globalConfigKey` prop.

Now if you try simulating a “Read” or “Comment” permission level, the table picker will become
disabled.

## The end!

We covered a lot of ground, kudos for making it to the end!

Here’s a quick recap of the parts of the SDK we used. You can click the links to read more in-depth
documentation about each one:

-   Part 1

    -   [useBase](/packages/sdk/docs/api.md#usebase) hook to get the
        [base](/packages/sdk/docs/api.md#base) object and subscribe to schema changes.
    -   [base.getTableByName()](/packages/sdk/docs/api.md#gettablebyname) to get a
        [table](/packages/sdk/docs/api.md#table) object.
    -   [table.selectRecords()](/packages/sdk/docs/api.md#selectrecords),
        [useRecords](/packages/sdk/docs/api.md#userecords) hook, and
        [record.primaryCellValueAsString](/packages/sdk/docs/api.md#primarycellvalueasstring) to
        read the records in a table.
    -   [expandRecord()](/packages/sdk/docs/api.md#expandrecord) to expand records in Airtable.

-   Part 2
    -   [base.getTableByNameIfExists()](/packages/sdk/docs/api.md#gettablebynameifexists) and
        [base.getTableByIdIfExists()](/packages/sdk/docs/api.md#gettablebyidifexists)
    -   [TablePicker](/packages/sdk/docs/api.md#tablepicker) component.
-   Part 3
    -   [globalConfig](/packages/sdk/docs/api.md#globalconfig) to store block configuration.
    -   [useGlobalConfig](/packages/sdk/docs/api.md#useglobalconfig) hook to watch changes to
        globalConfig.
    -   [TablePickerSynced](/packages/sdk/docs/api.md#tablepickersynced) component.

## Extra credit

### Only showing records from a view

Right now, our block shows all the records in our Tasks table. It might be more useful to have it
only show records from a specific
[view](https://support.airtable.com/hc/en-us/articles/202624989-Guide-to-views#whats_a_view). Then
we can filter the view to control which records we see in the block. For example, we could create a
filter to only show tasks that aren’t done yet.

It’s easy to switch from showing records in a table to showing records in a view:

```diff
import {
    initializeBlock,
    useBase,
    useRecords,
    useGlobalConfig,
    expandRecord,
    TablePickerSynced,
+   ViewPickerSynced,
} from '@airtable/blocks/ui';
import {globalConfig, models} from '@airtable/blocks';
import React, {useState} from 'react';

function getCheckboxField(table, fieldId) { /* No changes */}

function TodoBlock() {
    const base = useBase();

    const globalConfig = useGlobalConfig();
    const tableId = globalConfig.get('selectedTableId');
+   const viewId = globalConfig.get('selectedViewId');

    const table = base.getTableByIdIfExists(tableId);
+   const view = table ? table.getViewByIdIfExists(viewId) : null;

-   const queryResult = table ? table.selectRecords() : null;
+   const queryResult = view ? view.selectRecords() : null;
    const records = useRecords(queryResult);

    const tasks = records ? records.map(record => {
        return <Task key={record.id} record={record} />;
    }) : null;

    return (
        <div>
            <TablePickerSynced globalConfigKey="selectedTableId" />
+           <ViewPickerSynced table={table} globalConfigKey="selectedViewId" />
            {tasks}
        </div>
    );
}

function Task({record, doneField}) { /* No changes */ }

initializeBlock(() => <TodoBlock />);
```

Just like how we get the `Table` object by using `base.getTableByIdIfExists`, we get the `View`
object by using `table.getViewByIdIfExists`.

Just like the `Table` object, `View` has a `selectRecords()` method that returns a `QueryResult`.
When we use `view.selectRecords()`, the `QueryResult` will only contain the records that are visible
in that view.

That’s it! Try adding filters to the selected view. The records in the block will automatically get
filtered out.
