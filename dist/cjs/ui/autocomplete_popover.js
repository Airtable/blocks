"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var React = _interopRequireWildcard(require("react"));

var _popover = _interopRequireDefault(require("./popover"));

const {
  u
} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');

const KeyCodes = window.__requirePrivateModuleFromAirtable('client_server_shared/key_codes');

/** */
class AutocompletePopover extends React.Component {
  constructor(props) {
    var _context, _context2, _context3;

    super(props);
    this.state = {
      query: '',
      itemsMatchingQuery: props.items,
      focusedItemIndex: null
    };
    this._onInputChange = (0, _bind.default)(_context = this._onInputChange).call(_context, this);
    this._onKeyDown = (0, _bind.default)(_context2 = this._onKeyDown).call(_context2, this);
    this._resetResultsPointerEvents = (0, _bind.default)(_context3 = this._resetResultsPointerEvents).call(_context3, this);
  }

  componentDidMount() {
    if (this.props.isOpen && this.props.focusOnOpen) {
      u.defer(() => this.focus());
    }

    document.addEventListener('mousemove', this._resetResultsPointerEvents, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this._resetResultsPointerEvents, false);
  }

  componentDidUpdate(prevProps) {
    if (this.props.focusOnOpen && this.props.isOpen && !prevProps.isOpen) {
      this.focus();
    }
  }

  focus() {
    if (this._input) {
      this._input.focus();
    }
  }

  _getItemsMatchingQuery(query) {
    const {
      items: allItems
    } = this.props;

    if (!query) {
      return allItems;
    }

    if (this.props.filterItems) {
      return this.props.filterItems(query, allItems);
    } else {
      const lowercaseQuery = query.toLowerCase();
      return (0, _filter.default)(allItems).call(allItems, item => {
        var _context4;

        return (0, _indexOf.default)(_context4 = item.label.toLowerCase()).call(_context4, lowercaseQuery) !== -1 || item.aliases && (0, _some.default)(u).call(u, item.aliases, alias => {
          var _context5;

          return (0, _indexOf.default)(_context5 = alias.toLowerCase()).call(_context5, lowercaseQuery) !== -1;
        });
      });
    }
  }

  _resetResultsPointerEvents() {
    if (this._resultsContainer) {
      this._resultsContainer.style.pointerEvents = '';
    }
  }

  _onItemSelect(item) {
    this.props.onSelect(item);

    this._clearQuery();
  }

  _onItemSelectFromKeyDown() {
    if (this.state.focusedItemIndex !== null) {
      const selectedItem = this.state.itemsMatchingQuery[this.state.focusedItemIndex];

      this._onItemSelect(selectedItem);
    }
  }

  _onMouseEnterItemAtIndex(index) {
    if (this.state.focusedItemIndex !== index) {
      this.setState({
        focusedItemIndex: index
      });
    }
  }

  _moveFocus(delta) {
    const {
      itemsMatchingQuery,
      focusedItemIndex
    } = this.state;

    if (!itemsMatchingQuery || itemsMatchingQuery.length === 0) {
      return;
    }

    const totalInCycle = itemsMatchingQuery.length + 1;
    const focusedIndexNonNull = focusedItemIndex === null ? totalInCycle - 1 : focusedItemIndex;
    const newFocusedIndexNonNull = (focusedIndexNonNull + delta + totalInCycle) % totalInCycle;
    const newFocusedIndex = newFocusedIndexNonNull === totalInCycle - 1 ? null : newFocusedIndexNonNull;
    this.setState({
      focusedItemIndex: newFocusedIndex
    }, () => {
      this._scrollToSelectedIndex();
    });
  }

  _clearQuery() {
    this.setState({
      query: '',
      itemsMatchingQuery: this.props.items,
      focusedItemIndex: null
    });
  }

  _onInputChange(e) {
    const query = e.target.value;

    const itemsMatchingQuery = this._getItemsMatchingQuery(query);

    const focusedItemIndex = query.length && itemsMatchingQuery.length ? 0 : null;
    this.setState({
      query,
      itemsMatchingQuery,
      focusedItemIndex
    }, () => {
      this._scrollToSelectedIndex();
    });
  }

  _onKeyDown(e) {
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

  _scrollToSelectedIndex() {
    const resultsContainer = this._resultsContainer;
    const selectedResult = this._selectedResult;

    if (!resultsContainer || !selectedResult) {
      return;
    }

    const resultTop = selectedResult.offsetTop - resultsContainer.scrollTop;
    const resultBottom = resultTop + selectedResult.offsetHeight;
    const shouldScrollUp = resultTop < 0;
    const shouldScrollDown = resultBottom > resultsContainer.clientHeight;

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

  _renderItem(item, isFocused) {
    if (this.props.renderItem) {
      return this.props.renderItem(item, isFocused);
    } else {
      return React.createElement("div", {
        className: "p1 flex items-center"
      }, item.label);
    }
  }

  _renderInput() {
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

  _renderPopover() {
    const {
      itemsMatchingQuery
    } = this.state;

    if (!itemsMatchingQuery) {
      return null;
    }

    const items = (0, _map.default)(u).call(u, itemsMatchingQuery, (item, index) => {
      const isFocused = index === this.state.focusedItemIndex;
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

  render() {
    return this._renderPopover();
  }

}

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
  fitInWindowMode: _propTypes.default.oneOf((0, _values.default)(u).call(u, _popover.default.fitInWindowModes)),
  isOpen: _propTypes.default.bool,
  onClose: _propTypes.default.func
});
(0, _defineProperty2.default)(AutocompletePopover, "defaultProps", {
  focusOnOpen: true,
  isOpen: true
});
var _default = AutocompletePopover;
exports.default = _default;