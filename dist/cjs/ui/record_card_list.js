"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.to-string");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

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


class RecordCardListItemProvider extends DynamicDraw.AbstractDynamicDrawItemProvider {
  constructor(opts) {
    super();
    (0, _defineProperty2.default)(this, "_getExpandRecordOptions", () => ({
      records: this._opts.records
    }));
    this._opts = opts;

    this._buildItemsList();
  }

  _buildItemsList() {
    var opts = this._opts;
    this._items = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = opts.records[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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

  getNumberOfItems() {
    return this._opts.records.length;
  }

  getVisibleItemIndicesInRect(containerRect) {
    return this._layout.getVisibleItemIndicesInRect(containerRect);
  }

  getContentSize(containerSize) {
    return this._layout.getContentSize(containerSize);
  }

  getComponentForItemAtIndex(itemIndex, containerSize) {
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
      onClick: this._opts.onRecordClick && (() => this._opts.onRecordClick(record, itemIndex)),
      getExpandRecordOptions: this._getExpandRecordOptions,
      onMouseEnter: this._opts.onRecordMouseEnter && (() => this._opts.onRecordMouseEnter(record, itemIndex)),
      onMouseLeave: this._opts.onRecordMouseLeave && (() => this._opts.onRecordMouseLeave(record, itemIndex)),
      width: rect.width,
      height: this._opts.rowHeight,
      className: this._opts.className,
      style: this._opts.style
    }));
  }

  getScrollTopForRowAtIndex(targetRowIndex) {
    if (this.getNumberOfItems() === 0) {
      return 0;
    }

    var scrollTop = this._layout.getOffsetForItemAtIndex(targetRowIndex);

    return Math.max(0, scrollTop - this._opts.rowSpacing);
  }

}

class RecordCardListWithItemProvider extends React.Component {
  constructor(props) {
    super(props);
    this._scrollView = null;
  }

  getScrollTopForRecordAtIndex(recordIndex) {
    var itemProvider = this.props.itemProvider;
    return itemProvider.getScrollTopForRowAtIndex(recordIndex);
  }

  scrollToRecordAtIndex(recordIndex) {
    (0, _invariant.default)(this._scrollView, "Can't scroll to record without a scroll view");

    this._scrollView.setScrollPosition({
      scrollTop: this.getScrollTopForRecordAtIndex(recordIndex)
    });
  }

  get scrollTop() {
    (0, _invariant.default)(this._scrollView, "Can't get scroll top without a scroll view");
    return this._scrollView.getScrollPosition().scrollTop;
  }

  set scrollTop(scrollTop) {
    (0, _invariant.default)(this._scrollView, "Can't set scroll top without a scroll view");

    this._scrollView.setScrollPosition({
      scrollTop
    });
  }

  render() {
    return React.createElement(DynamicDraw.ScrollView, {
      ref: el => this._scrollView = el,
      width: this.props.width,
      height: this.props.height,
      itemProvider: this.props.itemProvider,
      onScroll: this.props.onScroll
    });
  }

}

(0, _defineProperty2.default)(RecordCardListWithItemProvider, "propTypes", {
  itemProvider: _propTypes.default.instanceOf(RecordCardListItemProvider).isRequired,
  width: _propTypes.default.number.isRequired,
  height: _propTypes.default.number.isRequired,
  onScroll: _propTypes.default.func
});

/** */
class RecordCardList extends React.Component {
  constructor(props) {
    super(props);
    this._container = null;
    this._cardList = null;
    this.state = {
      cardListWidth: 0,
      cardListHeight: 0
    };
    this._updateCardListSizeIfNeeded = this._updateCardListSizeIfNeeded.bind(this);
  }

  componentDidMount() {
    this._detectElementResize = (0, _create_detect_element_resize.default)();

    this._detectElementResize.addResizeListener(this._container, this._updateCardListSizeIfNeeded);

    this._updateCardListSizeIfNeeded();
  }

  componentWillUnmount() {
    if (this._detectElementResize) {
      this._detectElementResize.removeResizeListener(this._container, this._updateCardListSizeIfNeeded);
    }
  }

  scrollToRecordAtIndex(recordIndex) {
    if (!this._cardList) {
      return;
    }

    this._cardList.scrollToRecordAtIndex(recordIndex);
  }

  getScrollTopForRecordAtIndex(recordIndex) {
    if (!this._cardList) {
      return 0;
    }

    return this._cardList.getScrollTopForRecordAtIndex(recordIndex);
  }

  get scrollTop() {
    if (!this._cardList) {
      return 0;
    }

    return this._cardList.scrollTop;
  }

  set scrollTop(scrollTop) {
    if (!this._cardList) {
      return;
    }

    this._cardList.scrollTop = scrollTop;
  }

  _updateCardListSizeIfNeeded() {
    if (!this._container) {
      return;
    }

    var cardListWidth = this._container.clientWidth;
    var cardListHeight = this._container.clientHeight;

    if (this.state.cardListWidth !== cardListWidth || this.state.cardListHeight !== cardListHeight) {
      this.setState({
        cardListWidth,
        cardListHeight
      });
    }
  }

  render() {
    var _this$props = this.props,
        records = _this$props.records,
        fields = _this$props.fields,
        view = _this$props.view,
        attachmentCoverField = _this$props.attachmentCoverField,
        className = _this$props.className,
        style = _this$props.style;
    var itemProvider = new RecordCardListItemProvider({
      records,
      fields: fields || null,
      view: view || null,
      attachmentCoverField,
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
      ref: el => this._container = el,
      className: className,
      style: style
    }, React.createElement(RecordCardListWithItemProvider, {
      ref: el => this._cardList = el,
      itemProvider: itemProvider,
      width: this.state.cardListWidth,
      height: this.state.cardListHeight,
      onScroll: this.props.onScroll
    }));
  }

}

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