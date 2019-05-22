"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _invariant = _interopRequireDefault(require("invariant"));

var React = _interopRequireWildcard(require("react"));

var _record2 = _interopRequireDefault(require("../models/record"));

var _field = _interopRequireDefault(require("../models/field"));

var _view = _interopRequireDefault(require("../models/view"));

var _record_card = _interopRequireDefault(require("./record_card"));

var _create_detect_element_resize = _interopRequireDefault(require("./create_detect_element_resize"));

// TODO(jb): don't rely on liveapp components
var DynamicDraw = window.__requirePrivateModuleFromAirtable('client/react/ui/dynamic_draw/dynamic_draw'); // TODO(alex): Remove this. This is a hyperbase `Rect`, but we don't want to import more hyperbase
// code. We should remove DynamicDraw entirely in favour of a standard solution like react-window.


var RecordCardListItemProvider =
/*#__PURE__*/
function (_DynamicDraw$Abstract) {
  (0, _inherits2.default)(RecordCardListItemProvider, _DynamicDraw$Abstract);

  function RecordCardListItemProvider(opts) {
    var _this;

    (0, _classCallCheck2.default)(this, RecordCardListItemProvider);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RecordCardListItemProvider).call(this));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "_getExpandRecordOptions", function () {
      return {
        records: _this._opts.records
      };
    });
    _this._opts = opts;

    _this._buildItemsList();

    return _this;
  }

  (0, _createClass2.default)(RecordCardListItemProvider, [{
    key: "_buildItemsList",
    value: function _buildItemsList() {
      var opts = this._opts;
      this._items = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator2.default)(opts.records), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _record = _step.value;

          this._items.push({
            id: _record instanceof _record2.default ? _record.id : undefined,
            size: opts.rowHeight,
            trailingMargin: opts.rowSpacing
          });
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this._layout = new DynamicDraw.LinearLayout({
        items: this._items,
        contentPadding: {
          top: opts.rowSpacing,
          left: opts.rowSpacing,
          right: opts.rowSpacing,
          bottom: opts.rowSpacing + opts.bottomInset
        }
      });
    }
  }, {
    key: "getNumberOfItems",
    value: function getNumberOfItems() {
      return this._opts.records.length;
    }
  }, {
    key: "getVisibleItemIndicesInRect",
    value: function getVisibleItemIndicesInRect(containerRect) {
      return this._layout.getVisibleItemIndicesInRect(containerRect);
    }
  }, {
    key: "getContentSize",
    value: function getContentSize(containerSize) {
      return this._layout.getContentSize(containerSize);
    }
  }, {
    key: "getComponentForItemAtIndex",
    value: function getComponentForItemAtIndex(itemIndex, containerSize) {
      var _this2 = this;

      var item = this._items[itemIndex];

      var rect = this._layout.getRectForItemAtIndex(itemIndex, containerSize);

      var record = this._opts.records[itemIndex];
      return React.createElement(DynamicDraw.ScrollViewItem, {
        key: item.id || itemIndex,
        rect: rect
      }, React.createElement(_record_card.default, {
        record: record,
        fields: this._opts.fields,
        view: this._opts.view,
        attachmentCoverField: this._opts.attachmentCoverField,
        onClick: this._opts.onRecordClick && function () {
          return _this2._opts.onRecordClick(record, itemIndex);
        },
        getExpandRecordOptions: this._getExpandRecordOptions,
        onMouseEnter: this._opts.onRecordMouseEnter && function () {
          return _this2._opts.onRecordMouseEnter(record, itemIndex);
        },
        onMouseLeave: this._opts.onRecordMouseLeave && function () {
          return _this2._opts.onRecordMouseLeave(record, itemIndex);
        },
        width: rect.width,
        height: this._opts.rowHeight,
        className: this._opts.className,
        style: this._opts.style
      }));
    }
  }, {
    key: "getScrollTopForRowAtIndex",
    value: function getScrollTopForRowAtIndex(targetRowIndex) {
      if (this.getNumberOfItems() === 0) {
        return 0;
      }

      var scrollTop = this._layout.getOffsetForItemAtIndex(targetRowIndex);

      return Math.max(0, scrollTop - this._opts.rowSpacing);
    }
  }]);
  return RecordCardListItemProvider;
}(DynamicDraw.AbstractDynamicDrawItemProvider);

var RecordCardListWithItemProvider =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(RecordCardListWithItemProvider, _React$Component);

  function RecordCardListWithItemProvider(props) {
    var _this3;

    (0, _classCallCheck2.default)(this, RecordCardListWithItemProvider);
    _this3 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RecordCardListWithItemProvider).call(this, props));
    _this3._scrollView = null;
    return _this3;
  }

  (0, _createClass2.default)(RecordCardListWithItemProvider, [{
    key: "getScrollTopForRecordAtIndex",
    value: function getScrollTopForRecordAtIndex(recordIndex) {
      var itemProvider = this.props.itemProvider;
      return itemProvider.getScrollTopForRowAtIndex(recordIndex);
    }
  }, {
    key: "scrollToRecordAtIndex",
    value: function scrollToRecordAtIndex(recordIndex) {
      (0, _invariant.default)(this._scrollView, "Can't scroll to record without a scroll view");

      this._scrollView.setScrollPosition({
        scrollTop: this.getScrollTopForRecordAtIndex(recordIndex)
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      return React.createElement(DynamicDraw.ScrollView, {
        ref: function ref(el) {
          return _this4._scrollView = el;
        },
        width: this.props.width,
        height: this.props.height,
        itemProvider: this.props.itemProvider,
        onScroll: this.props.onScroll
      });
    }
  }, {
    key: "scrollTop",
    get: function get() {
      (0, _invariant.default)(this._scrollView, "Can't get scroll top without a scroll view");
      return this._scrollView.getScrollPosition().scrollTop;
    },
    set: function set(scrollTop) {
      (0, _invariant.default)(this._scrollView, "Can't set scroll top without a scroll view");

      this._scrollView.setScrollPosition({
        scrollTop: scrollTop
      });
    }
  }]);
  return RecordCardListWithItemProvider;
}(React.Component);

(0, _defineProperty2.default)(RecordCardListWithItemProvider, "propTypes", {
  itemProvider: _propTypes.default.instanceOf(RecordCardListItemProvider).isRequired,
  width: _propTypes.default.number.isRequired,
  height: _propTypes.default.number.isRequired,
  onScroll: _propTypes.default.func
});

/** */
var RecordCardList =
/*#__PURE__*/
function (_React$Component2) {
  (0, _inherits2.default)(RecordCardList, _React$Component2);

  function RecordCardList(props) {
    var _context;

    var _this5;

    (0, _classCallCheck2.default)(this, RecordCardList);
    _this5 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RecordCardList).call(this, props));
    _this5._container = null;
    _this5._cardList = null;
    _this5.state = {
      cardListWidth: 0,
      cardListHeight: 0
    };
    _this5._updateCardListSizeIfNeeded = (0, _bind.default)(_context = _this5._updateCardListSizeIfNeeded).call(_context, (0, _assertThisInitialized2.default)(_this5));
    return _this5;
  }

  (0, _createClass2.default)(RecordCardList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this._detectElementResize = (0, _create_detect_element_resize.default)();

      this._detectElementResize.addResizeListener(this._container, this._updateCardListSizeIfNeeded);

      this._updateCardListSizeIfNeeded();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this._detectElementResize) {
        this._detectElementResize.removeResizeListener(this._container, this._updateCardListSizeIfNeeded);
      }
    }
  }, {
    key: "scrollToRecordAtIndex",
    value: function scrollToRecordAtIndex(recordIndex) {
      if (!this._cardList) {
        return;
      }

      this._cardList.scrollToRecordAtIndex(recordIndex);
    }
  }, {
    key: "getScrollTopForRecordAtIndex",
    value: function getScrollTopForRecordAtIndex(recordIndex) {
      if (!this._cardList) {
        return 0;
      }

      return this._cardList.getScrollTopForRecordAtIndex(recordIndex);
    }
  }, {
    key: "_updateCardListSizeIfNeeded",
    value: function _updateCardListSizeIfNeeded() {
      if (!this._container) {
        return;
      }

      var cardListWidth = this._container.clientWidth;
      var cardListHeight = this._container.clientHeight;

      if (this.state.cardListWidth !== cardListWidth || this.state.cardListHeight !== cardListHeight) {
        this.setState({
          cardListWidth: cardListWidth,
          cardListHeight: cardListHeight
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      var _this$props = this.props,
          records = _this$props.records,
          fields = _this$props.fields,
          view = _this$props.view,
          attachmentCoverField = _this$props.attachmentCoverField,
          className = _this$props.className,
          style = _this$props.style;
      var itemProvider = new RecordCardListItemProvider({
        records: records,
        fields: fields || null,
        view: view || null,
        attachmentCoverField: attachmentCoverField,
        rowHeight: 80,
        rowSpacing: 10,
        bottomInset: 0,
        onRecordClick: this.props.onRecordClick || null,
        onRecordMouseEnter: this.props.onRecordMouseEnter || null,
        onRecordMouseLeave: this.props.onRecordMouseLeave || null,
        style: {},
        className: ''
      });
      return React.createElement("div", {
        ref: function ref(el) {
          return _this6._container = el;
        },
        className: className,
        style: style
      }, React.createElement(RecordCardListWithItemProvider, {
        ref: function ref(el) {
          return _this6._cardList = el;
        },
        itemProvider: itemProvider,
        width: this.state.cardListWidth,
        height: this.state.cardListHeight,
        onScroll: this.props.onScroll
      }));
    }
  }, {
    key: "scrollTop",
    get: function get() {
      if (!this._cardList) {
        return 0;
      }

      return this._cardList.scrollTop;
    },
    set: function set(scrollTop) {
      if (!this._cardList) {
        return;
      }

      this._cardList.scrollTop = scrollTop;
    }
  }]);
  return RecordCardList;
}(React.Component);

(0, _defineProperty2.default)(RecordCardList, "propTypes", {
  records: _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.instanceOf(_record2.default), _propTypes.default.object])).isRequired,
  onScroll: _propTypes.default.func,
  onRecordClick: _propTypes.default.func,
  onRecordMouseEnter: _propTypes.default.func,
  onRecordMouseLeave: _propTypes.default.func,
  // Passed through to RecordCard.
  fields: _propTypes.default.arrayOf(_propTypes.default.instanceOf(_field.default).isRequired),
  view: _propTypes.default.instanceOf(_view.default),
  attachmentCoverField: _propTypes.default.instanceOf(_field.default),
  className: _propTypes.default.string,
  style: _propTypes.default.object
});
var _default = RecordCardList;
exports.default = _default;