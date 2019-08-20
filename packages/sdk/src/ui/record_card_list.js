// @flow
import PropTypes from 'prop-types';
import * as React from 'react';
import {invariant} from '../error_utils';
import {type RecordDef} from '../types/record';
import Record from '../models/record';
import Field from '../models/field';
import View from '../models/view';
import RecordCard from './record_card';
import createDetectElementResize from './create_detect_element_resize';

const DynamicDraw = window.__requirePrivateModuleFromAirtable(
    'client/react/ui/dynamic_draw/dynamic_draw',
);

type DynamicDrawRect = mixed;
type DynamicDrawSize = mixed;

type RecordCardListItemProviderOpts = {|
    records: Array<Record | RecordDef>,
    fields: Array<Field> | null,
    view: View | null,
    attachmentCoverField: Field | void,
    rowHeight: number,
    rowSpacing: number,
    bottomInset: number,
    onRecordClick: ((Record | RecordDef, number) => void) | null | void,
    onRecordMouseEnter: null | ((Record | RecordDef, number) => void),
    onRecordMouseLeave: null | ((Record | RecordDef, number) => void),
    style: {[string]: mixed},
    className: '',
|};

class RecordCardListItemProvider extends DynamicDraw.AbstractDynamicDrawItemProvider {
    _items: Array<{id?: string, size: number, trailingMargin: number}>;
    _layout: DynamicDraw.LinearLayout;
    constructor(opts: RecordCardListItemProviderOpts) {
        super();
        this._opts = opts;
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
                id: record instanceof Record ? record.id : undefined,
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

    getVisibleItemIndicesInRect(containerRect: DynamicDrawRect) {
        return this._layout.getVisibleItemIndicesInRect(containerRect);
    }

    getContentSize(containerSize: DynamicDrawSize) {
        return this._layout.getContentSize(containerSize);
    }

    getComponentForItemAtIndex(
        itemIndex: number,
        containerSize: DynamicDrawSize,
    ): DynamicDraw.ScrollViewItem {
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

    getScrollTopForRowAtIndex(targetRowIndex: number): number {
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

/**
 * @private
 * @typedef
 */
type RecordCardListProps = {
    records: Array<Record | RecordDef>,

    onScroll?: Event => void,
    onRecordClick?: null | ((record: Record | RecordDef, index: number) => void),
    onRecordMouseEnter?: (record: Record | RecordDef, index: number) => void,
    onRecordMouseLeave?: (record: Record | RecordDef, index: number) => void,

    fields?: Array<Field>,
    view?: View,
    attachmentCoverField?: Field,
    className?: string,
    style?: Object,
};

type RecordCardListState = {|
    cardListWidth: number,
    cardListHeight: number,
|};

/** @private */
class RecordCardList extends React.Component<RecordCardListProps, RecordCardListState> {
    static propTypes = {
        records: PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.instanceOf(Record), PropTypes.object]),
        ).isRequired,

        onScroll: PropTypes.func,
        onRecordClick: PropTypes.func,
        onRecordMouseEnter: PropTypes.func,
        onRecordMouseLeave: PropTypes.func,

        fields: PropTypes.arrayOf(PropTypes.instanceOf(Field).isRequired),
        view: PropTypes.instanceOf(View),
        attachmentCoverField: PropTypes.instanceOf(Field),

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
            fields: fields || null,
            view: view || null,
            attachmentCoverField,
            rowHeight: 80,
            rowSpacing: 10,
            bottomInset: 0,
            onRecordClick: this.props.onRecordClick,
            onRecordMouseEnter: this.props.onRecordMouseEnter || null,
            onRecordMouseLeave: this.props.onRecordMouseLeave || null,
            style: {},
            className: '',
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

export default RecordCardList;
