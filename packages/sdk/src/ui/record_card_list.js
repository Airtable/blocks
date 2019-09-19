// @flow
import PropTypes from 'prop-types';
import * as React from 'react';
import {FixedSizeList} from 'react-window';
import {compose} from '@styled-system/core';
import {invariant, spawnError} from '../error_utils';
import {type RecordDef} from '../types/record';
import Record from '../models/record';
import Field from '../models/field';
import View from '../models/view';
import RecordCard from './record_card';
import Box from './box';
import createDetectElementResize from './create_detect_element_resize';
import withStyledSystem from './with_styled_system';
import {
    dimensionsSet,
    dimensionsSetPropTypes,
    type DimensionsSetProps,
    flexItemSet,
    flexItemSetPropTypes,
    type FlexItemSetProps,
    positionSet,
    positionSetPropTypes,
    type PositionSetProps,
    margin,
    marginPropTypes,
    type MarginProps,
} from './system';

const RECORD_CARD_ROW_HEIGHT = 80;
const RECORD_CARD_SPACING = 10;

/** @private */
type FixedSizeListType = HTMLDivElement & {scrollTo: number => void, scrollToItem: number => void};
/** @private */
type RecordCardItemRendererProps = {
    data: {
        records: Array<Record> | Array<RecordDef>,
        fields?: Array<Field>,
        view?: View,
        width: number,
        attachmentCoverField: Field | void,
        onClick: null | void | ((Record | RecordDef, number) => void),
        onMouseEnter: null | ((Record | RecordDef, number) => void),
        onMouseLeave: null | ((Record | RecordDef, number) => void),
    },
    style: {[string]: mixed, left: number, top: number},
    className?: string,
    index: number,
};

/**
 * Item renderer component for react-window FixedSizeList. Responsible for rendering each
 * individual record card item, identified by the index prop.
 *
 * @param {RecordCardItemRendererProps} props
 * @private
 */
function RecordCardItemRenderer(props: RecordCardItemRendererProps) {
    const {
        records,
        fields,
        view,
        width,
        attachmentCoverField,
        onClick,
        onMouseEnter,
        onMouseLeave,
    } = props.data;
    const {index: itemIndex, style, className} = props;
    const record = records[itemIndex];
    const filteredRecords: Array<Record> = [];
    for (const currentRecord of records) {
        if (currentRecord instanceof Record) {
            filteredRecords.push(currentRecord);
        }
    }
    if (filteredRecords.length !== records.length && filteredRecords.length !== 0) {
        throw spawnError(
            "RecordCardList's props.records should not contain a mix of Record and RecordDef",
        );
    }
    return (
        <RecordCard
            record={record}
            fields={fields}
            view={view}
            attachmentCoverField={attachmentCoverField}
            onClick={onClick ? () => onClick(record, itemIndex) : onClick}
            expandRecordOptions={filteredRecords.length > 0 ? {records: filteredRecords} : null}
            onMouseEnter={onMouseEnter ? () => onMouseEnter(record, itemIndex) : null}
            onMouseLeave={onMouseLeave ? () => onMouseLeave(record, itemIndex) : null}
            width={width}
            height={RECORD_CARD_ROW_HEIGHT}
            className={className}
            style={{
                ...style,
                left: parseFloat(style.left) + RECORD_CARD_SPACING,
                top: parseFloat(style.top) + RECORD_CARD_SPACING,
            }}
        />
    );
}

RecordCardItemRenderer.propTypes = {
    data: PropTypes.shape({
        records: PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.instanceOf(Record), PropTypes.object]),
        ).isRequired,
        fields: PropTypes.arrayOf(PropTypes.instanceOf(Field)),
        view: PropTypes.instanceOf(View),
        attachmentCoverField: PropTypes.instanceOf(Field),
        onClick: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        width: PropTypes.number.isRequired,
        className: PropTypes.string,
        style: PropTypes.object,
    }),
    index: PropTypes.number.isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
};

/**
 * Utility function to measure scrollbar size.
 * Used to correctly calculate the width for record cards in the container.
 * @private
 */
function getScrollbarWidth() {
    const scrollDiv = document.createElement('div');

    scrollDiv.style.position = 'absolute';
    scrollDiv.style.top = '-9999px';
    scrollDiv.style.width = '50px';
    scrollDiv.style.height = '50px';
    scrollDiv.style.overflow = 'scroll';

    const body = document.body;
    invariant(body, 'no document body to measure scrollbar');
    body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    body.removeChild(scrollDiv);

    return scrollbarWidth;
}

/**
 * @private
 */
type InnerWindowProps = {|
    children: React$Node,
    style: {[string]: mixed},
|};

/**
 * Wrapper component for RecordCardList's window (passed to FixedSizeList).
 *
 * This is used to force FixedSizeList (`react-window`) to include padding at both top and bottom
 * of the record card list. The FixedSizeList accounts for card padding on every card (baked into
 * `itemSize`), but this doesn't account for the 1 extra padding required beneath the last card.
 * (ie, if we have 10 cards, the height needs to be (10 * card_height) + (11 * card_padding)).
 * @private
 */
const innerRecordCardListWindow = React.forwardRef((props: InnerWindowProps, ref) => {
    const {style, children} = props;
    return (
        <div
            ref={ref}
            style={{
                ...style,
                height: parseFloat(style.height) + RECORD_CARD_SPACING,
            }}
        >
            {children}
        </div>
    );
});

/**
 * @typedef {object} RecordCardListProps
 * @property {Array.<Record>} records Records to display in card list.
 * @property {function} [onScroll] Scroll event handler for the list window.
 * @property {function} [onRecordClick] Click event handler for an individual record card. If undefined, uses default behavior to expand record. If null, no operation is performed.
 * @property {function} [onRecordMouseEnter] Mouse enter event handler for an individual record card.
 * @property {function} [onRecordMouseLeave] Mouse leave event handler for an individual record card.
 * @property {Array.<Field>} [fields] Fields to display in each record card. The primary field is always displayed.
 * @property {View} [view] The view model to use for field order and record coloring.
 * @property {Field} [attachmentCoverField] Attachment field to display as an image in the square preview for each record card. If omitted or not an attachment field, it uses for the first attachment field in `fields`. If `fields` is not defined, it uses the first attachment field in the view.
 * @property {string} [className] Additional class names to apply to the record card list.
 * @property {object} [style] Additional styles to apply to the record card list.
 */
type RecordCardListProps = {|
    records: Array<Record> | Array<RecordDef>,
    onScroll?: ({
        scrollDirection: 'forward' | 'backward',
        scrollOffset: number,
        scrollUpdateWasRequested: boolean,
    }) => void,
    onRecordClick?: null | ((record: Record | RecordDef, index: number) => void),
    onRecordMouseEnter?: (record: Record | RecordDef, index: number) => void,
    onRecordMouseLeave?: (record: Record | RecordDef, index: number) => void,

    fields?: Array<Field>,
    view?: View,
    attachmentCoverField?: Field,
    className?: string,
    style?: {[string]: mixed},
|};

type StyleProps = {|
    ...DimensionsSetProps,
    ...FlexItemSetProps,
    ...PositionSetProps,
    ...MarginProps,
|};

const styleParser = compose(
    dimensionsSet,
    flexItemSet,
    positionSet,
    margin,
);

const stylePropTypes = {
    ...dimensionsSetPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
};

type RecordCardListState = {|
    cardListWidth: number,
    cardListHeight: number,
    isScrollbarVisible: boolean,
|};

/**
 * Scrollable list of record cards.
 *
 * @example
 * import {RecordCardList} from '@airtable/blocks/ui';
 * import React, {useState} from 'react';
 *
 * function Block() {
 *     const base = useBase();
 *     const [selectedRecord, setSelectedRecord] = useState(null);
 *     const table = base.getTableByName('Table 1');
 *     const view = table ? table.getViewByName('View 1') : null;
 *     const queryResult = table ? table.selectRecords() : null;
 *     const records = useRecords(queryResult);
 *
 *     return (
 *         <RecordCardList
 *             records={records}
 *             view={view}
 *             onRecordClick={record => {setSelectedRecord(record)}}
 *         />
 *     );
 * }
 */
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
    _container: {|current: HTMLElement | null|};
    _cardList: {|current: FixedSizeListType | null|};
    _cardListInnerWindow: {|current: HTMLDivElement | null|};
    _detectElementResize: {|
        addResizeListener: (element: HTMLElement, fn: () => void) => void,
        removeResizeListener: (element: HTMLElement, fn: () => void) => void,
    |};
    _scrollbarWidth: number;
    constructor(props: RecordCardListProps) {
        super(props);
        this._container = React.createRef();
        this._cardList = React.createRef();
        this._cardListInnerWindow = React.createRef();
        this._detectElementResize = createDetectElementResize();
        this._scrollbarWidth = getScrollbarWidth();
        this.state = {
            cardListWidth: 0,
            cardListHeight: 0,
            isScrollbarVisible: false,
        };
    }
    componentDidMount() {
        invariant(this._container.current, 'No container to detect resize on');
        this._detectElementResize.addResizeListener(
            this._container.current,
            this._updateCardListSizeIfNeeded,
        );
        this._updateCardListSizeIfNeeded();
    }
    componentWillUnmount() {
        if (this._container.current) {
            this._detectElementResize.removeResizeListener(
                this._container.current,
                this._updateCardListSizeIfNeeded,
            );
        }
    }
    componentDidUpdate(prevProps: RecordCardListProps) {
        if (this.props.records.length !== prevProps.records.length) {
            this._updateCardListSizeIfNeeded();
        }
    }
    scrollToRecordAtIndex(recordIndex: number) {
        invariant(this._cardList.current, 'No card list to scroll');
        this._cardList.current.scrollToItem(recordIndex);
    }
    _updateCardListSizeIfNeeded = () => {
        invariant(this._container.current, 'No container to update card list size');

        const {
            width: cardListWidth,
            height: cardListHeight,
        } = this._container.current.getBoundingClientRect();

        invariant(
            this._cardListInnerWindow.current,
            'No card list inner window to measure scroll height',
        );
        const isScrollbarVisible = this._cardListInnerWindow.current.scrollHeight > cardListHeight;

        if (
            this.state.cardListWidth !== cardListWidth ||
            this.state.cardListHeight !== cardListHeight ||
            this.state.isScrollbarVisible !== isScrollbarVisible
        ) {
            this.setState({cardListWidth, cardListHeight, isScrollbarVisible});
        }
    };
    render() {
        const {records, fields, view, attachmentCoverField, className, style} = this.props;
        const itemData = {
            records,
            fields,
            view,
            width:
                this.state.cardListWidth -
                2 * RECORD_CARD_SPACING -
                (this.state.isScrollbarVisible ? this._scrollbarWidth : 0),
            attachmentCoverField,
            onClick: this.props.onRecordClick,
            onMouseEnter: this.props.onRecordMouseEnter || null,
            onMouseLeave: this.props.onRecordMouseLeave || null,
            style: {},
            className: '',
        };
        return (
            <Box
                ref={this._container}
                className={className}
                overflow="hidden"
                height="100%"
                style={style}
            >
                <FixedSizeList
                    outerRef={this._cardList}
                    width={this.state.cardListWidth}
                    height={this.state.cardListHeight}
                    innerElementType={innerRecordCardListWindow}
                    innerRef={this._cardListInnerWindow}
                    itemData={itemData}
                    itemCount={this.props.records.length}
                    itemKey={(index, data) => data.records[index].id}
                    itemSize={RECORD_CARD_ROW_HEIGHT + RECORD_CARD_SPACING}
                    onScroll={this.props.onScroll}
                >
                    {RecordCardItemRenderer}
                </FixedSizeList>
            </Box>
        );
    }
}

export default withStyledSystem<RecordCardListProps, StyleProps, RecordCardList, {}>(
    RecordCardList,
    styleParser,
    stylePropTypes,
);
