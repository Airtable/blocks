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
/**
 * @example
 * import {runInfo} from 'airtable-block';
 * if (runInfo.isFirstRun) {
 *     // The current user just installed this block.
 *     // Take the opportunity to show any onboarding and set
 *     // sensible defaults if the user has permission.
 *     // For example, if the block relies on a table, it would
 *     // make sense to set that to cursor.activeTableId
 * }
 */


/**
 * Top-level container for the Blocks SDK. Can be imported as `'airtable-block'`.
 */
var BlockSdk =
/*#__PURE__*/
function () {
  function BlockSdk(airtableInterface) {
    (0, _classCallCheck2.default)(this, BlockSdk);
    this.__airtableInterface = airtableInterface; // TODO(alex): remove check once hyperbase is deployed

    if (airtableInterface.assertAllowedSdkPackageVersion) {
      airtableInterface.assertAllowedSdkPackageVersion("@airtable/blocks", BlockSdk.VERSION);
    } // TODO(alex): remove initial data fallback once hyperbase is deployed


    var sdkInitData = (0, _private_utils.cloneDeep)(airtableInterface.sdkInitData || airtableInterface.initialData);
    this.globalConfig = new _global_config.default(sdkInitData.initialKvValuesByKey, airtableInterface);
    this.base = new _base.default(sdkInitData.baseData, airtableInterface);
    this.models = _models.default;
    this.installationId = sdkInitData.blockInstallationId; // Bind the public methods on this class so users can import
    // just the method, e.g.
    // import {reload} from 'airtable-block';

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
      var changedBasePaths = this.base.__applyChangesWithoutTriggeringEvents(changes);

      var changedCursorKeys = this.cursor.__applyChangesWithoutTriggeringEvents(changes);

      this.base.__triggerOnChangeForChangedPaths(changedBasePaths);

      this.cursor.__triggerOnChangeForChangedKeys(changedCursorKeys);
    }
  }, {
    key: "_registerHandlers",
    value: function _registerHandlers() {
      // base
      this.__airtableInterface.registerHandler(BlockMessageTypes.HostToBlock.UPDATE_MODELS, data => {
        this.__applyModelChanges(data.changes);
      }); // global config


      this.__airtableInterface.registerHandler(BlockMessageTypes.HostToBlock.SET_MULTIPLE_KV_PATHS, data => {
        this.globalConfig.__onSetMultipleKvPaths(data.updates);
      }); // settings button


      this.__airtableInterface.registerHandler(BlockMessageTypes.HostToBlock.DID_CLICK_SETTINGS_BUTTON, () => {
        if (this.settingsButton.isVisible) {
          // Since there's an async gap when communicating with liveapp,
          // no-op if the button has been hidden since it was clicked.
          this.settingsButton.__onClick();
        }
      }); // viewport


      this.__airtableInterface.registerHandler(BlockMessageTypes.HostToBlock.DID_ENTER_FULLSCREEN, () => {
        this.viewport.__onEnterFullscreen();
      });

      this.__airtableInterface.registerHandler(BlockMessageTypes.HostToBlock.DID_EXIT_FULLSCREEN, () => {
        this.viewport.__onExitFullscreen();
      });

      this.__airtableInterface.registerHandler(BlockMessageTypes.HostToBlock.FOCUS, () => {
        this.viewport.__focus();
      });
    }
    /** */

  }, {
    key: "reload",
    value: function reload() {
      this.__airtableInterface.reloadFrame();
    }
  }]);
  return BlockSdk;
}();

(0, _defineProperty2.default)(BlockSdk, "VERSION", "0.0.3");
var _default = BlockSdk;
exports.default = _default;