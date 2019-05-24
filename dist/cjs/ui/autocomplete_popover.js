"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.map");

require("core-js/modules/es.object.to-string");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var React = _interopRequireWildcard(require("react"));

var _private_utils = require("../private_utils");

var _popover = _interopRequireDefault(require("./popover"));

var _window$__requirePriv = window.__requirePrivateModuleFromAirtable('client_server_shared/hu'),
    u = _window$__requirePriv.u;

var KeyCodes = window.__requirePrivateModuleFromAirtable('client_server_shared/key_codes');

/** */
var AutocompletePopover =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(AutocompletePopover, _React$Component);

  function AutocompletePopover(props) {
    var _this;

    (0, _classCallCheck2.default)(this, AutocompletePopover);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(AutocompletePopover).call(this, props));
    _this.state = {
      query: '',
      itemsMatchingQuery: props.items,
      focusedItemIndex: null
    };
    _this._onInputChange = _this._onInputChange.bind((0, _assertThisInitialized2.default)(_this));
    _this._onKeyDown = _this._onKeyDown.bind((0, _assertThisInitialized2.default)(_this));
    _this._resetResultsPointerEvents = _this._resetResultsPointerEvents.bind((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  (0, _createClass2.default)(AutocompletePopover, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.isOpen && this.props.focusOnOpen) {
        u.defer(() => this.focus());
      }

      document.addEventListener('mousemove', this._resetResultsPointerEvents, false);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener('mousemove', this._resetResultsPointerEvents, false);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.focusOnOpen && this.props.isOpen && !prevProps.isOpen) {
        this.focus();
      }
    }
  }, {
    key: "focus",
    value: function focus() {
      if (this._input) {
        this._input.focus();
      }
    }
  }, {
    key: "_getItemsMatchingQuery",
    value: function _getItemsMatchingQuery(query) {
      var allItems = this.props.items;

      if (!query) {
        return allItems;
      }

      if (this.props.filterItems) {
        return this.props.filterItems(query, allItems);
      } else {
        var lowercaseQuery = query.toLowerCase();
        return allItems.filter(item => {
          return item.label.toLowerCase().indexOf(lowercaseQuery) !== -1 || item.aliases && item.aliases.some(alias => {
            return alias.toLowerCase().indexOf(lowercaseQuery) !== -1;
          });
        });
      }
    }
  }, {
    key: "_resetResultsPointerEvents",
    value: function _resetResultsPointerEvents() {
      if (this._resultsContainer) {
        this._resultsContainer.style.pointerEvents = '';
      }
    }
  }, {
    key: "_onItemSelect",
    value: function _onItemSelect(item) {
      this.props.onSelect(item);

      this._clearQuery();
    }
  }, {
    key: "_onItemSelectFromKeyDown",
    value: function _onItemSelectFromKeyDown() {
      if (this.state.focusedItemIndex !== null) {
        var selectedItem = this.state.itemsMatchingQuery[this.state.focusedItemIndex];

        this._onItemSelect(selectedItem);
      }
    }
  }, {
    key: "_onMouseEnterItemAtIndex",
    value: function _onMouseEnterItemAtIndex(index) {
      if (this.state.focusedItemIndex !== index) {
        this.setState({
          focusedItemIndex: index
        });
      }
    }
  }, {
    key: "_moveFocus",
    value: function _moveFocus(delta) {
      var _this$state = this.state,
          itemsMatchingQuery = _this$state.itemsMatchingQuery,
          focusedItemIndex = _this$state.focusedItemIndex;

      if (!itemsMatchingQuery || itemsMatchingQuery.length === 0) {
        return;
      }

      var totalInCycle = itemsMatchingQuery.length + 1;
      var focusedIndexNonNull = focusedItemIndex === null ? totalInCycle - 1 : focusedItemIndex;
      var newFocusedIndexNonNull = (focusedIndexNonNull + delta + totalInCycle) % totalInCycle;
      var newFocusedIndex = newFocusedIndexNonNull === totalInCycle - 1 ? null : newFocusedIndexNonNull;
      this.setState({
        focusedItemIndex: newFocusedIndex
      }, () => {
        this._scrollToSelectedIndex();
      });
    }
  }, {
    key: "_clearQuery",
    value: function _clearQuery() {
      this.setState({
        query: '',
        itemsMatchingQuery: this.props.items,
        focusedItemIndex: null
      });
    }
  }, {
    key: "_onInputChange",
    value: function _onInputChange(e) {
      var query = e.target.value;

      var itemsMatchingQuery = this._getItemsMatchingQuery(query);

      var focusedItemIndex = query.length && itemsMatchingQuery.length ? 0 : null;
      this.setState({
        query,
        itemsMatchingQuery,
        focusedItemIndex
      }, () => {
        this._scrollToSelectedIndex();
      });
    }
  }, {
    key: "_onKeyDown",
    value: function _onKeyDown(e) {
      switch (e.keyCode) {
        case KeyCodes.ENTER:
          this._onItemSelectFromKeyDown(); // Stop propagation, since we don't want any other components to update in response
          // to this key down.


          e.stopPropagation();
          e.preventDefault();
          return;

        case KeyCodes.TAB:
          this._onItemSelectFromKeyDown();

          return;

        case KeyCodes.ESCAPE:
          this._clearQuery(); // Stop propagation, since we don't want any other components to update in response
          // to this key down. (i.e. if another component has a keydown listener to close something
          // on escape, it would be weird if this key press triggered that action).


          e.stopPropagation();
          e.preventDefault();

          if (this.props.onClose) {
            this.props.onClose({
              wasFromEscape: true
            });
          }

          return;

        case KeyCodes.UP:
        case KeyCodes.DOWN:
          this._moveFocus(e.keyCode === KeyCodes.DOWN ? 1 : -1); // Stop propagation, since we don't want any other components to update in response
          // to this key down.


          e.stopPropagation();
          e.preventDefault();
          return;

        default:
          break;
      }
    }
  }, {
    key: "_scrollToSelectedIndex",
    value: function _scrollToSelectedIndex() {
      var resultsContainer = this._resultsContainer;
      var selectedResult = this._selectedResult;

      if (!resultsContainer || !selectedResult) {
        return;
      }

      var resultTop = selectedResult.offsetTop - resultsContainer.scrollTop;
      var resultBottom = resultTop + selectedResult.offsetHeight;
      var shouldScrollUp = resultTop < 0;
      var shouldScrollDown = resultBottom > resultsContainer.clientHeight;

      if (shouldScrollUp || shouldScrollDown) {
        // Disable pointer events when scrolling. Otherwise, if the
        // mouse is hovering over the dialog, it will immediately
        // change the selection back to the result under the mouse.
        resultsContainer.style.pointerEvents = 'none';

        if (shouldScrollUp) {
          resultsContainer.scrollTop += resultTop;
        } else {
          resultsContainer.scrollTop += resultBottom - resultsContainer.clientHeight;
        }
      }
    }
  }, {
    key: "_renderItem",
    value: function _renderItem(item, isFocused) {
      if (this.props.renderItem) {
        return this.props.renderItem(item, isFocused);
      } else {
        return React.createElement("div", {
          className: "p1 flex items-center"
        }, item.label);
      }
    }
  }, {
    key: "_renderInput",
    value: function _renderInput() {
      return React.createElement("div", {
        className: "flex flex-auto"
      }, React.createElement("input", {
        ref: el => this._input = el,
        autoComplete: "false",
        className: "p1 flex-auto",
        style: {
          border: 0,
          borderBottom: '1px solid rgba(0,0,0,0.1)'
        },
        onChange: this._onInputChange,
        onKeyDown: this._onKeyDown,
        placeholder: this.props.placeholder,
        type: "text",
        value: this.state.query
      }));
    }
  }, {
    key: "_renderPopover",
    value: function _renderPopover() {
      var itemsMatchingQuery = this.state.itemsMatchingQuery;

      if (!itemsMatchingQuery) {
        return null;
      }

      var items = itemsMatchingQuery.map((item, index) => {
        var isFocused = index === this.state.focusedItemIndex;
        return React.createElement("div", {
          ref: isFocused ? el => this._selectedResult = el : null,
          key: item.value,
          className: (0, _classnames.default)('pointer', {
            darken1: isFocused
          }),
          onClick: () => this._onItemSelect(item),
          onMouseEnter: () => this._onMouseEnterItemAtIndex(index)
        }, this._renderItem(item, isFocused));
      });
      return React.createElement(_popover.default, {
        placementX: this.props.placementX,
        placementY: this.props.placementY,
        placementOffsetX: this.props.placementOffsetX,
        placementOffsetY: this.props.placementOffsetY,
        fitInWindowMode: this.props.fitInWindowMode,
        isOpen: this.props.isOpen,
        renderContent: () => React.createElement("div", {
          className: (0, _classnames.default)('rounded stroked1 white overflow-hidden', this.props.className),
          style: this.props.style
        }, this._renderInput(), items.length > 0 ? React.createElement("div", {
          ref: el => this._resultsContainer = el,
          style: {
            maxHeight: 220
          },
          className: "relative overflow-auto"
        }, items) : React.createElement("div", {
          className: "p1 quieter"
        }, "No results")),
        onClose: () => {
          if (this.props.onClose) {
            this.props.onClose({
              wasFromEscape: false
            });
          }
        }
      }, this.props.children);
    }
  }, {
    key: "render",
    value: function render() {
      return this._renderPopover();
    }
  }]);
  return AutocompletePopover;
}(React.Component);

(0, _defineProperty2.default)(AutocompletePopover, "placements", _popover.default.placements);
(0, _defineProperty2.default)(AutocompletePopover, "fitInWindowModes", _popover.default.fitInWindowModes);
(0, _defineProperty2.default)(AutocompletePopover, "propTypes", {
  children: _propTypes.default.element.isRequired,
  items: _propTypes.default.arrayOf(_propTypes.default.shape({
    value: _propTypes.default.string.isRequired,
    label: _propTypes.default.string.isRequired,
    aliases: _propTypes.default.arrayOf(_propTypes.default.string)
  })).isRequired,
  renderItem: _propTypes.default.func,
  filterItems: _propTypes.default.func,
  onSelect: _propTypes.default.func.isRequired,
  placeholder: _propTypes.default.string,
  focusOnOpen: _propTypes.default.bool,
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  // Proxied through to Popover
  placementX: _propTypes.default.oneOf([_popover.default.placements.LEFT, _popover.default.placements.CENTER, _popover.default.placements.RIGHT]),
  placementY: _propTypes.default.oneOf([_popover.default.placements.TOP, _popover.default.placements.CENTER, _popover.default.placements.BOTTOM]),
  placementOffsetX: _propTypes.default.number,
  placementOffsetY: _propTypes.default.number,
  fitInWindowMode: _propTypes.default.oneOf((0, _private_utils.values)(_popover.default.fitInWindowModes)),
  isOpen: _propTypes.default.bool,
  onClose: _propTypes.default.func
});
(0, _defineProperty2.default)(AutocompletePopover, "defaultProps", {
  focusOnOpen: true,
  isOpen: true
});
var _default = AutocompletePopover;
exports.default = _default;