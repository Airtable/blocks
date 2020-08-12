# Mock Airtable Interface

The `AirtableInterface` component runs in the context of a Block and mediates communication between
the Block and the Base in which it is installed. This directory stores mock implementations of the
interface for the purposes of automated testing.

## Usage

**Setup** Define a concrete implementation of the abstract `MockAirtableInterface` class.

**Verify the SDK's response to messages from the Base** Use the method named `trigger*` to simulate
messages which originate from a Base, and write tests to confirm that the SDK reacts appropriately.

**Verify the messages the SDK sends to the Base** Spy on the interface's `applyMutationAsync` method
to observe messages that the SDK would send to the Base in production settings. Write tests that
induce the SDK to send messages and verify their contents.

## Future Work

-   implement all of the `trigger*` methods
-   write more tests using this technique
-   extend the Block build process to allow developers to create a build which includes a
    `MockAirtableInterface` implementation of their own design
-   design a higher-level API for Block developers to use, allowing them to elide details like table
    IDs, making their test code more concise and familiar
