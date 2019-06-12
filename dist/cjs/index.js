"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _get_sdk = _interopRequireDefault(require("./get_sdk"));

/**
 * #### [import {base} from '@airtable/blocks';](#base)
 * An instance of {@link Base} representing the current Airtable base. If you're writing a React
 * Component, you might want to use the {@link useBase} hook rather than importing `base` directly.
 *
 * #### [import {globalConfig} from '@airtable/blocks';](#globalconfig)
 * {@link GlobalConfig} is a key-value store shared between every user of a particular installation
 * of your block. Use it for storing block configuration.
 *
 * #### [import {cursor} from '@airtable/blocks';](#cursor)
 * An instance of {@link Cursor}, containing information about the table & view that the user
 * currently has open in the main Airtable app, as well as which records they have selected.
 *
 * #### [import {viewport} from '@airtable/blocks';](#viewport)
 * Controls the block's viewport within Airtable. Use this to fullscreen the block and add size
 * constraints. See {@link Viewport}.
 *
 * #### [import {settingsButton} from '@airtable/blocks';](#settingsbutton)
 * Controls the block's settings button. See {@link SettingsButton}.
 *
 * #### import {reload} from '@airtable/blocks';
 * Call this function to reload the block frame:
 * ```js
 * import {reload} from '@airtable/blocks';
 * reload();
 * ```
 *
 * #### import {installationId} from '@airtable/blocks';
 * A unique ID for this block installation.
 *
 * #### import {localStorage, sessionStorage} from '@airtable/blocks';
 * Wrappers for {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage window.localStorage}
 * and {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage window.sessionStorage}
 * which will automatically fall back to an in-memory alternative when the browser version is
 * unavailable.
 *
 * #### [import * as models from '@airtable/blocks/models';](#airtableblocksmodels)
 * Model classes, field types, view types, and utilities for working with record coloring and
 * record aggregation.
 *
 * #### [import * as UI from '@airtable/blocks/ui';](#airtableblocksui)
 * React component library, hooks for integrating Airtable data with React components, and UI helpers.
 *
 * @alias SDK
 */
var sdk = (0, _get_sdk.default)(); // we need to use module.exports syntax here because we want people to be able to do destructuring
// imports. Usually, this isn't possible when exporting a class with ESM - it's a quirk of how
// babel handles inter-op between commonjs and es modules.
// TODO: use direct es exports rather than an SDK instance

module.exports = sdk;