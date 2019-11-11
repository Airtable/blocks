[@airtable/blocks](../README.md) › [Globals](../globals.md) ›
[@airtable/blocks/ui: useSession](_airtable_blocks_ui__usesession.md)

# External module: @airtable/blocks/ui: useSession

## Index

### Functions

-   [useSession](_airtable_blocks_ui__usesession.md#usesession)

## Functions

### useSession

▸ **useSession**(): _[Session](_airtable_blocks_models__session.md#session)_

_Defined in
[src/ui/use_session.ts:34](https://github.com/airtable/blocks/blob/@airtable/blocks@0.0.35/packages/sdk/src/ui/use_session.ts#L34)_

A hook for connecting a React component to the current session. This returns a
[Session](_airtable_blocks_models__session.md#session) instance and will re-render your component
whenever the session changes (e.g. when the current user's permissions change or when the current
user's name changes).

`useSession` should meet most of your needs for working with
[Session](_airtable_blocks_models__session.md#session). If you need more granular control of when
your component updates or want to do anything other than re-render, the lower level
[useWatchable](_airtable_blocks_ui__usewatchable.md#usewatchable) hook might help.

**Example:**

```js
import {CollaboratorToken, useSession} from '@airtable/blocks/ui';

// Says hello to the current user and updates in realtime if the current user's
// name or profile pic changes.
function CurrentUserGreeter() {
    const session = useSession();
    return (
        <React.Fragment>
            Hello,
            <CollaboratorToken collaborator={session.currentUser} />!
        </React.Fragment>
    );
}
```

**Returns:** _[Session](_airtable_blocks_models__session.md#session)_

The current session.
