// @flow
const {h, u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const React = require('./react');
const PropTypes = require('prop-types');
const RecordCard = require('./record_card');
const RecordModel = require('../models/record');
const FieldModel = require('../models/field');
const ViewModel = require('../models/view');
const invariant = require('invariant');
const createDetectElementResize = require('./create_detect_element_resize');

// TODO(jb): don't rely on liveapp components
const DynamicDraw = window.__requirePrivateModuleFromAirtable(
    'client/react/ui/dynamic_draw/dynamic_draw',
);

import type {RecordDef} from '../models/record';

class RecordCardListItemProvider extends DynamicDraw.AbstractDynamicDrawItemProvider {
    _items: Array<{id?: string, size: number, trailingMargin: number}>;
    _layout: DynamicDraw.LinearLayout;
    constructor(opts) {
        super();

        this._opts = u.setAndEnforceDefaultOpts(
            {
                // The height of each row card.
                rowHeight: 80,
                // Amount of space between each row card.
                rowSpacing: 10,
                // A list of records or recordDefs.
                records: [],

                // Extra space to leave at the bottom, e.g. for add record button
                // in calendar view sidebar.
                bottomInset: 0,

                // Passed through to RecordCard
                fields: null, // array
                view: null,
                attachmentCoverField: undefined,
                onRecordClick: null,
                onRecordMouseEnter: null,
                onRecordMouseLeave: null,
                style: {},
                className: '',
            },
            opts,
        );

        this._buildItemsList();
    }

    _getExpandRecordOptions = () => ({
        records: this._opts.records,
    });

    _buildItemsList() {
        const opts = this._opts;

        this._items = [];

        for (const record of opts.records) {
            this._items.push({
                id: record instanceof RecordModel ? record.id : undefined,
                size: opts.rowHeight,
                trailingMargin: opts.rowSpacing,
            });
        }

        this._layout = new DynamicDraw.LinearLayout({
            items: this._items,
            contentPadding: {
                top: opts.rowSpacing,
                left: opts.rowSpacing,
                right: opts.rowSpacing,
                bottom: opts.rowSpacing + opts.bottomInset,
            },
        });
    }

    getNumberOfItems(): number {
        return this._opts.records.length;
    }

    getVisibleItemIndicesInRect(containerRect) {
        return this._layout.getVisibleItemIndicesInRect(containerRect);
    }

    getContentSize(containerSize) {
        return this._layout.getContentSize(containerSize);
    }

    getComponentForItemAtIndex(itemIndex, containerSize): DynamicDraw.ScrollViewItem {
        const item = this._items[itemIndex];
        const rect = this._layout.getRectForItemAtIndex(itemIndex, containerSize);

        const record = this._opts.records[itemIndex];
        return (
            <DynamicDraw.ScrollViewItem key={item.id || itemIndex} rect={rect}>
                <RecordCard
                    record={record}
                    fields={this._opts.fields}
                    view={this._opts.view}
                    attachmentCoverField={this._opts.attachmentCoverField}
                    onClick={
                        this._opts.onRecordClick &&
                        (() => this._opts.onRecordClick(record, itemIndex))
                    }
                    getExpandRecordOptions={this._getExpandRecordOptions}
                    onMouseEnter={
                        this._opts.onRecordMouseEnter &&
                        (() => this._opts.onRecordMouseEnter(record, itemIndex))
                    }
                    onMouseLeave={
                        this._opts.onRecordMouseLeave &&
                        (() => this._opts.onRecordMouseLeave(record, itemIndex))
                    }
                    width={rect.width}
                    height={this._opts.rowHeight}
                    className={this._opts.className}
                    style={this._opts.style}
                />
            </DynamicDraw.ScrollViewItem>
        );
    }

    getScrollTopForRowAtIndex(targetRowIndex): number {
        if (this.getNumberOfItems() === 0) {
            return 0;
        }

        const scrollTop = this._layout.getOffsetForItemAtIndex(targetRowIndex);
        return Math.max(0, scrollTop - this._opts.rowSpacing);
    }
}

type RecordCardListWithItemProviderProps = {
    itemProvider: RecordCardListItemProvider,
    width: number,
    height: number,
    onScroll?: Event => void,
};
class RecordCardListWithItemProvider extends React.Component<RecordCardListWithItemProviderProps> {
    static propTypes = {
        itemProvider: PropTypes.instanceOf(RecordCardListItemProvider).isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        onScroll: PropTypes.func,
    };
    _scrollView: null | DynamicDraw.ScrollView;
    constructor(props: RecordCardListWithItemProviderProps) {
        super(props);

        this._scrollView = null;
    }
    getScrollTopForRecordAtIndex(recordIndex: number): number {
        const {itemProvider} = this.props;
        return itemProvider.getScrollTopForRowAtIndex(recordIndex);
    }
    scrollToRecordAtIndex(recordIndex: number) {
        invariant(this._scrollView, "Can't scroll to record without a scroll view");

        this._scrollView.setScrollPosition({
            scrollTop: this.getScrollTopForRecordAtIndex(recordIndex),
        });
    }
    get scrollTop(): number {
        invariant(this._scrollView, "Can't get scroll top without a scroll view");
        return this._scrollView.getScrollPosition().scrollTop;
    }
    set scrollTop(scrollTop: number) {
        invariant(this._scrollView, "Can't set scroll top without a scroll view");
        this._scrollView.setScrollPosition({scrollTop});
    }
    render() {
        return (
            <DynamicDraw.ScrollView
                ref={el => (this._scrollView = el)}
                width={this.props.width}
                height={this.props.height}
                itemProvider={this.props.itemProvider}
                onScroll={this.props.onScroll}
            />
        );
    }
}

type RecordCardListProps = {
    records: Array<RecordModel | RecordDef>,

    onScroll?: Event => void,
    onRecordClick?: null | ((record: RecordModel | RecordDef, index: number) => void),
    onRecordMouseEnter?: (record: RecordModel | RecordDef, index: number) => void,
    onRecordMouseLeave?: (record: RecordModel | RecordDef, index: number) => void,

    fields?: Array<FieldModel>,
    view?: ViewModel,
    attachmentCoverField?: FieldModel,
    className?: string,
    style?: Object,
};

type RecordCardListState = {|
    cardListWidth: number,
    cardListHeight: number,
|};

/** */
class RecordCardList extends React.Component<RecordCardListProps, RecordCardListState> {
    static propTypes = {
        records: PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.instanceOf(RecordModel), PropTypes.object]),
        ).isRequired,

        onScroll: PropTypes.func,
        onRecordClick: PropTypes.func,
        onRecordMouseEnter: PropTypes.func,
        onRecordMouseLeave: PropTypes.func,

        // Passed through to RecordCard.
        fields: PropTypes.arrayOf(PropTypes.instanceOf(FieldModel).isRequired),
        view: PropTypes.instanceOf(ViewModel),
        attachmentCoverField: PropTypes.instanceOf(FieldModel),

        className: PropTypes.string,
        style: PropTypes.object,
    };
    _container: ?HTMLElement;
    _cardList: null | RecordCardListWithItemProvider;
    _updateCardListSizeIfNeeded: () => void;
    _detectElementResize: ?{addResizeListener: Function, removeResizeListener: Function};
    constructor(props: RecordCardListProps) {
        super(props);

        this._container = null;
        this._cardList = null;

        this.state = {
            cardListWidth: 0,
            cardListHeight: 0,
        };

        this._updateCardListSizeIfNeeded = this._updateCardListSizeIfNeeded.bind(this);
    }
    componentDidMount() {
        this._detectElementResize = createDetectElementResize();
        this._detectElementResize.addResizeListener(
            this._container,
            this._updateCardListSizeIfNeeded,
        );

        this._updateCardListSizeIfNeeded();
    }
    componentWillUnmount() {
        if (this._detectElementResize) {
            this._detectElementResize.removeResizeListener(
                this._container,
                this._updateCardListSizeIfNeeded,
            );
        }
    }
    scrollToRecordAtIndex(recordIndex: number) {
        if (!this._cardList) {
            return;
        }
        this._cardList.scrollToRecordAtIndex(recordIndex);
    }
    getScrollTopForRecordAtIndex(recordIndex: number): number {
        if (!this._cardList) {
            return 0;
        }
        return this._cardList.getScrollTopForRecordAtIndex(recordIndex);
    }
    get scrollTop(): number {
        if (!this._cardList) {
            return 0;
        }
        return this._cardList.scrollTop;
    }
    set scrollTop(scrollTop: number) {
        if (!this._cardList) {
            return;
        }
        this._cardList.scrollTop = scrollTop;
    }
    _updateCardListSizeIfNeeded() {
        if (!this._container) {
            return;
        }

        const cardListWidth = this._container.clientWidth;
        const cardListHeight = this._container.clientHeight;

        if (
            this.state.cardListWidth !== cardListWidth ||
            this.state.cardListHeight !== cardListHeight
        ) {
            this.setState({cardListWidth, cardListHeight});
        }
    }
    render() {
        const {records, fields, view, attachmentCoverField, className, style} = this.props;

        const itemProvider = new RecordCardListItemProvider({
            records,
            fields,
            view,
            attachmentCoverField,
            rowHeight: 80,
            rowSpacing: 10,
            onRecordClick: this.props.onRecordClick,
            onRecordMouseEnter: this.props.onRecordMouseEnter,
            onRecordMouseLeave: this.props.onRecordMouseLeave,
        });

        return (
            <div ref={el => (this._container = el)} className={className} style={style}>
                <RecordCardListWithItemProvider
                    ref={el => (this._cardList = el)}
                    itemProvider={itemProvider}
                    width={this.state.cardListWidth}
                    height={this.state.cardListHeight}
                    onScroll={this.props.onScroll}
                />
            </div>
        );
    }
}

module.exports = RecordCardList;
