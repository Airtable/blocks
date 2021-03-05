# Introduction to writing automated tests for Airtable Apps

Support for automated testing is currently under development, considered unstable, and intended for
internal Airtable use only.

## Implementation status

Not all operations are currently supported. In the course of writing tests, authors may find that
the App under test does not function as intended when induced to perform these operations. Authors
may request support from the SDK maintainers or implement the functionality they need as part of
their work (this document includes guidance on extending the testing API in a subsequent section).

The following table describes the implementation status of each operation.

| operation                 | internal support   | testing API        |
| ------------------------- | ------------------ | ------------------ |
| Table - create            |                    | partial [1]        |
| Table - update            |                    |
| Table - destroy           |                    |
| Field - create            |                    | partial [1]        |
| Field - update            |                    |
| Field - destroy           |                    |
| View - create             |                    |
| View - update             |                    |
| View - destroy            |                    |
| Global Config - update    |                    | n/a [2]            |
| Cursor Data - update      |                    |
| Session Data - update     |                    |
| User permissions - update | :heavy_check_mark: | :heavy_check_mark: |
| click settings button     |                    |
| toggle full screen        |                    |
| expand record             |                    | n/a [2]            |
| Record - create           | partial [3]        | n/a [2]            |
| Record - update           | :heavy_check_mark: | n/a [2]            |
| Record - destroy          | :heavy_check_mark: | n/a [2]            |

-   [1] While the SDK's public API nominally supports these operations, its capabilities are
    severely restricted. They should be complemented by a more powerful testing API.
-   [2] These operations can be initiated using the SDK's public API.
-   [3] Unsupported operations: creating records for tables which have not yet been loaded,
    [creating records with data for fields which have not yet beean loaded](https://github.com/Hyperbase/blocks-sdk/blob/a77fa4b959f512a041e987ee0bfe3fafb7db8b59/packages/sdk/src/models/mutations.ts#L583),
    and creating records in specific views

## Key concepts

**Test fixture data** is a representation of the state of an Airtable Base, including descriptions
of Tables, Views, Fields, and Records. It is written by test authors and in terms of
JSON-serializable values.
[The App Test Fixtures Airtable App](https://airtable.com/marketplace/blk5qI32GYyYb1Rbm/test-fixture-generator)
allows developers to generate this data from the state of an authentic Base.

**`TestDriver`** is the JavaScript interface for creating and manipulating a simulated Airtable Apps
environment. It implements methods for performing operations which are not available in the SDK. In
lieu of formal API documentation, please review the formatted comments maintained within the
`TestDriver` source code.

**`AirtableInterface`** is the layer of the SDK which mediates between the models and the backend.
In production environments, it operates via asynchronous message passing with the App's parent web
browser frame. In testing environments, no transmission occurs, but the `AirtableInterface` behaves
as though it is receiving relevant messages in order to simulate production behavior.

**Mutations** are instructions which describe changes to the Base. Mutations travel through the
`AirtableInterface`, which sends them to the backend in production environments only.

## Writing tests

As of January 2021, Airtable Apps must be written using the React framework. These instructions take
the presence of React for granted.

Every test file must import TestDriver through the `@airtable/blocks-testing` module to ensure that
the environment is correctly instrumented for automation.

Each test will typically perform the following steps:

1.  Create a TestDriver instance, providing valid fixture data:

    ```js
    const testDriver = new TestDriver({
        /* fixture data here */
    });
    ```

2.  Create an instance of the App under test by rendering the App's Component as a child of the
    `TestDriver#Container` Component.

    ```js
    render(
        <testDriver.Container>
            <MyApp />
        </testDriver.Container>,
    );
    ```

3.  Provide some input to the App. This may be in the form of a simulated user interaction (e.g. via
    [the `@testing-library/user-event` library](https://www.npmjs.com/package/@testing-library/user-event))

    ```js
    // Simulate a user choosing the "Gruyere" option from the table labed
    // "Cheeses".
    const input = screen.getByLabelText('Cheeses');
    const option = screen.getByText('Gruyere');
    userEvent.selectOptions(input, [option]);
    ```

    ...or a simulated backend behavior (e.g. via
    [the Blocks SDK](https://airtable.com/developers/apps) or the `TestDriver` API).

    ```js
    // Invoking `createTableAsync` in a test script simulates the condition
    // where the Airtable backend reports that a table has been created by
    // another viewer of the Base.
    await testDriver.base.createTableAsync('a new table', [
        {name: 'address', type: FieldType.EMAIL},
    ]);
    ```

4.  Verify that the App responded to the input as expected. For many kinds of interactions, the
    App's response will be discernible by some change in the UI.
    [The `@testing-library/react` library](https://www.npmjs.com/package/@testing-library/react) is
    a good choice for inspecting the state of the user interface.

    ```js
    // Ensure that the UI updated to display the checkbox as "checked"
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.checked).toBe(true);
    ```

    ...while the `TestDriver` API can be used to verify App behaviors which do not influence the UI:

    ```js
    // Track every time the App attempts to expand a record.
    const recordIds = [];
    testDriver.watch('expandRecord', ({recordId}) => recordIds.push(recordId));

    // (The code necessary to simulate user inteaction elided from this example.)

    // Ensure that the App attempted to expand the Record with ID `reca`
    expect(recordIds).toEqual(['reca']);
    ```

[The automated test suite for the To-do List example App](https://github.com/Hyperbase/blocks-sdk/tree/master/examples/todo-block/test)
demonstrates this pattern.

## Extending the Testing API

In order to provide predictable behavior, the Airtable testing platform relies on simulations of
Base operations. Every simulation requires some amount of support in the testing platform. Some
simulations also require a dedicated testing API.

**Implementing internal support** Every Base operation requires some amount of simulation code in
order to support scripting in test environments.

For some operations, this simulation may be as limited as a "no-op" implementation of an internal
method. These operations include mutations which the SDK applies optimistically and messages with no
direct effect on the App.

Other operations will require more advanced simulation logic. Operations of this type generally rely
on the backend's response to determine their effect on the Base. The simulated behavior should be
predictable, mimicking the expected response in production.

**Implementing a dedicated API** A dedicated testing API is not necessary for any operation which
can be expressed through the public API of the SDK (e.g. "create many records" or "delete a table").
When a test author wishes to script such an operation, they should use the SDK directly. This is
valid because an App cannot distinguish between operations initiated by the backend and operations
initiated by a test script using the SDK.

Many other operations cannot be expressed via the public API of the SDK. The `TestDriver` API must
be extended to allow test authors to simulate these operations.

Some of these restrictions are circumstantial, owing to the fact that as of January 2021, the SDK is
incomplete and under active development. This includes an API to delete a Field. Other restrictions
are fundamental to the design of the Apps platform. For instance, the SDK intentionally omits a
method for an App to change the permissions of the current user. This distinction may inform the
decision to introduce a testing API, since doing so will increase maintenance responsibilities in a
way that may be obviated by future extensions to the SDK's public API.
