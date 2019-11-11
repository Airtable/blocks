[@airtable/blocks](README.md) › [Globals](globals.md)

# @airtable/blocks

## [Full table of contents](./globals.md)

## Key modules

#### import {base} from '@airtable/blocks';

An instance of [Base](./modules/_airtable_blocks_models__base.md#base) representing the current
Airtable base. If you're writing a React component, you might want to use the
[useBase](./modules/_airtable_blocks_ui__usebase.md#usebase) hook rather than importing `base`
directly.

#### import {globalConfig} from '@airtable/blocks';

[globalConfig](./modules/_airtable_blocks__globalconfig.md) is a key-value store shared between
every user of a particular installation of your block. Use it for storing block configuration.

#### import {session} from '@airtable/blocks';

An instance of [Session](./modules/_airtable_blocks_models__session.md#session), containing
information about the current user's session. If you're writing a React component, you might want to
use the [useSession](./modules/_airtable_blocks_ui__usesession.md#usesession) hook rather than
importing `session` directly.

#### import {cursor} from '@airtable/blocks';

An instance of [Cursor](./modules/_airtable_blocks_models__cursor.md#cursor), containing information
about the table & view that the user currently has open in the main Airtable app, as well as which
records they have selected.

#### import {viewport} from '@airtable/blocks';

Controls the block's viewport within Airtable. Use this to fullscreen the block and add size
constraints. See [Viewport](./modules/_airtable_blocks__viewport.md#viewport).

#### import {settingsButton} from '@airtable/blocks';

Controls the block's settings button. See
[settingsButton](./modules/_airtable_blocks__settingsbutton.md#settingsbutton). If you're writing a
React component, you might want to use the
[useSettingsButton](./modules/_airtable_blocks_ui__usesettingsbutton.md#usesettingsbutton) hook
rather than importing `settingsButton` directly.

#### import {reload} from '@airtable/blocks';

Call this function to reload the block frame:

```js
import {reload} from '@airtable/blocks';
reload();
```

#### import {installationId} from '@airtable/blocks';

A unique ID for this block installation.

#### import \* as models from '@airtable/blocks/models';

Model classes, field types, view types, and utilities for working with record coloring and record
aggregation.

#### import \* as UI from '@airtable/blocks/ui';

React component library, hooks for integrating Airtable data with React components, and UI helpers.
