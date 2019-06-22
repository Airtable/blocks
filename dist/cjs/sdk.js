"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _global_config = _interopRequireDefault(require("./global_config"));

var _base = _interopRequireDefault(require("./models/base"));

var _models = _interopRequireDefault(require("./models/models"));

var _cursor = _interopRequireDefault(require("./models/cursor"));

var _viewport = _interopRequireDefault(require("./viewport"));

var _ui = _interopRequireDefault(require("./ui/ui"));

var _settings_button = _interopRequireDefault(require("./settings_button"));

var _undo_redo = _interopRequireDefault(require("./undo_redo"));

var _private_utils = require("./private_utils");

// NOTE: The version of React running in the Block SDK is controlled by the block.
// The SDK should not make too many assumptions about which version of React or
// ReactDOM is running.
// HACK: make sure React.PropTypes is defined. If the block is using a newer
// version of React, PropTypes won't be available, but a few SDK components
// try to reference it. Once grepping React.PropTypes in hyperbase doesn't
// return any matches, we can remove this hack.
// eslint-disable-next-line react/no-deprecated
if (!React.PropTypes) {
  // eslint-disable-next-line react/no-deprecated
  React.PropTypes = _propTypes.default;
}

var BlockMessageTypes = window.__requirePrivateModuleFromAirtable('client/blocks/block_message_types');

var InMemoryStorage = window.__requirePrivateModuleFromAirtable('client/helpers/browser_storage/in_memory_storage');

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client/helpers/browser_storage/is_storage_available'),
    isLocalStorageAvailable = _window$__requirePriv.isLocalStorageAvailable,
    isSessionStorageAvailable = _window$__requirePriv.isSessionStorageAvailable;
/* NOTE: runInfo is not publicly documented yet.
 * @example
 * import {runInfo} from '@airtable/blocks';
 * if (runInfo.isFirstRun) {
 *     // The current user just installed this block.
 *     // Take the opportunity to show any onboarding and set
 *     // sensible defaults if the user has permission.
 *     // For example, if the block relies on a table, it would
 *     // make sense to set that to cursor.activeTableId
 * }
 */


/** @private */
function defaultUpdateBatcher(applyUpdates) {
  applyUpdates();
}
/**
 * Import the SDK from `'@airtable/blocks'`.
 * @private because we document this manually in index.js
 */


var BlockSdk =
/*#__PURE__*/
function () {
  // When models are updated on the frontend, we want to batch them together and have React do a
  // single render.
  //
  // Without this, in sync-mode React (the current default), anything that triggers an update
  // (like .setState or .forceUpdate) will instantly, synchronously re-render. So if you have an
  // update that triggers multiple updates across your tree, you get multiple renders in an
  // unpredictable order. This is bad because it's unnecessary work and the update order can
  // contradict react's normal top-down data flow which can cause subtle bugs.
  //
  // We set _runWithUpdateBatching to ReactDOM.unstable_batchedUpdates to facilitate this. We
  // don't know for sure though that React is in use on the page, so we leave actually setting
  // this when the developer sets up their block with React, in UI.initializeBlock.

  /** @hideconstructor */
  function BlockSdk(airtableInterface) {
    (0, _classCallCheck2.default)(this, BlockSdk);
    (0, _defineProperty2.default)(this, "_runWithUpdateBatching", defaultUpdateBatcher);
    this.__airtableInterface = airtableInterface;
    airtableInterface.assertAllowedSdkPackageVersion("@airtable/blocks", BlockSdk.VERSION);
    var sdkInitData = (0, _private_utils.cloneDeep)(airtableInterface.sdkInitData);
    this.globalConfig = new _global_config.default(sdkInitData.initialKvValuesByKey, airtableInterface);
    this.base = new _base.default(sdkInitData.baseData, airtableInterface);
    this.models = _models.default;
    this.installationId = sdkInitData.blockInstallationId; // Bind the public methods on this class so users can import
    // just the method, e.g.
    // import {reload} from '@airtable/blocks';

    this.reload = this.reload.bind(this); // When localStorage/sessionStorage aren't available (e.g. when
    // "Block third-party cookies" is enabled in Chrome), we provide
    // an in-memory replacement. Otherwise, accessing window.localStorage or
    // window.sessionStorage will throw an exception.

    this.localStorage = isLocalStorageAvailable() ? window.localStorage : new InMemoryStorage();
    this.sessionStorage = isSessionStorageAvailable() ? window.sessionStorage : new InMemoryStorage();
    this.viewport = new _viewport.default(sdkInitData.isFullscreen, airtableInterface);
    this.cursor = new _cursor.default(sdkInitData.baseData, airtableInterface);
    this.UI = _ui.default;
    this.settingsButton = new _settings_button.default(airtableInterface);
    this.undoRedo = new _undo_redo.default(airtableInterface);
    this.runInfo = Object.freeze({
      isFirstRun: sdkInitData.isFirstRun,
      isDevelopmentMode: sdkInitData.isDevelopmentMode
    }); // Now that we've constructed our models, let's hook them up to realtime changes.

    this._registerHandlers(); // TODO: freeze this object before we ship the code editor.

  }

  (0, _createClass2.default)(BlockSdk, [{
    key: "__applyModelChanges",
    value: function __applyModelChanges(changes) {
      this._runWithUpdateBatching(() => {
        var changedBasePaths = this.base.__applyChangesWithoutTriggeringEvents(changes);

        var changedCursorKeys = this.cursor.__applyChangesWithoutTriggeringEvents(changes);

        this.base.__triggerOnChangeForChangedPaths(changedBasePaths);

        this.cursor.__triggerOnChangeForChangedKeys(changedCursorKeys);
      });
    }
  }, {
    key: "__applyGlobalConfigUpdates",
    value: function __applyGlobalConfigUpdates(updates) {
      this._runWithUpdateBatching(() => {
        this.globalConfig.__setMultipleKvPaths(updates);
      });
    }
  }, {
    key: "_registerHandlers",
    value: function _registerHandlers() {
      // base
      this.__airtableInterface.registerHandler(BlockMessageTypes.HostToBlock.UPDATE_MODELS, data => {
        this.__applyModelChanges(data.changes);
      }); // global config


      this.__airtableInterface.registerHandler(BlockMessageTypes.HostToBlock.SET_MULTIPLE_KV_PATHS, data => {
        this.__applyGlobalConfigUpdates(data.updates);
      }); // settings button


      this.__airtableInterface.registerHandler(BlockMessageTypes.HostToBlock.DID_CLICK_SETTINGS_BUTTON, () => {
        if (this.settingsButton.isVisible) {
          this._runWithUpdateBatching(() => {
            // Since there's an async gap when communicating with liveapp,
            // no-op if the button has been hidden since it was clicked.
            this.settingsButton.__onClick();
          });
        }
      }); // viewport


      this.__airtableInterface.registerHandler(BlockMessageTypes.HostToBlock.DID_ENTER_FULLSCREEN, () => {
        this._runWithUpdateBatching(() => {
          this.viewport.__onEnterFullscreen();
        });
      });

      this.__airtableInterface.registerHandler(BlockMessageTypes.HostToBlock.DID_EXIT_FULLSCREEN, () => {
        this._runWithUpdateBatching(() => {
          this.viewport.__onExitFullscreen();
        });
      });

      this.__airtableInterface.registerHandler(BlockMessageTypes.HostToBlock.FOCUS, () => {
        this._runWithUpdateBatching(() => {
          this.viewport.__focus();
        });
      });
    }
  }, {
    key: "reload",
    value: function reload() {
      this.__airtableInterface.reloadFrame();
    }
  }, {
    key: "__setBatchedUpdatesFn",
    value: function __setBatchedUpdatesFn(newUpdateBatcher) {
      this._runWithUpdateBatching = newUpdateBatcher;
    }
  }]);
  return BlockSdk;
}();

(0, _defineProperty2.default)(BlockSdk, "VERSION", "0.0.13");
var _default = BlockSdk;
exports.default = _default;