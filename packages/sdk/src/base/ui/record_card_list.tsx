/** @module @airtable/blocks/ui: RecordCardList */ /** */
import PropTypes from 'prop-types';
import * as React from 'react';
import {FixedSizeList} from 'react-window';
import {compose} from '@styled-system/core';
import {invariant, spawnError} from '../../shared/error_utils';
import {RecordDef} from '../../shared/types/record';
import Record from '../models/record';
import Field from '../models/field';
import View from '../models/view';
import Box from './box';
import createDetectElementResize from './create_detect_element_resize';
import withStyledSystem from './with_styled_system';
import {
    dimensionsSet,
    dimensionsSetPropTypes,
    DimensionsSetProps,
    flexItemSet,
    flexItemSetPropTypes,
    FlexItemSetProps,
    positionSet,
    positionSetPropTypes,
    PositionSetProps,
    margin,
    marginPropTypes,
    MarginProps,
} from './system';
import RecordCard from './record_card';

const RECORD_CARD_ROW_HEIGHT = 80;
const RECORD_CARD_SPACING = 10;

/** @internal */
type FixedSizeListType = HTMLDivElement & {
    scrollTo: (arg1: number) => void;
    scrollToItem: (arg1: number) => void;
};
/** @internal */
interface RecordCardItemRendererProps {
    data: {
        records: Array<Record> | Array<RecordDef>;
        fields?: Array<Field>;
        view?: View;
        width: number;
        attachmentCoverField: Field | undefined;
        onClick: null | undefined | ((arg1: Record | RecordDef, arg2: number) => void);
        onMouseEnter: null | ((arg1: Record | RecordDef, arg2: number) => void);
        onMouseLeave: null | ((arg1: Record | RecordDef, arg2: number) => void);
    };
    style: {left: number; top: number; [key: string]: unknown};
    className?: string;
    index: number;
}

/**
 * Item renderer component for react-window FixedSizeList. Responsible for rendering each
 * individual record card item, identified by the index prop.
 *
 * @param props
 * @internal
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

    let _onClick;
    if (onClick) {
        _onClick = () => onClick(record, itemIndex);
    } else if (onClick === undefined) {
        _onClick = undefined;
    } else {
        _onClick = null;
    }

    return (
        <RecordCard
            record={record}
            fields={fields}
            view={view}
            attachmentCoverField={attachmentCoverField}
            onClick={_onClick}
            expandRecordOptions={filteredRecords.length > 0 ? {records: filteredRecords} : null}
            onMouseEnter={onMouseEnter ? () => onMouseEnter(record, itemIndex) : undefined}
            onMouseLeave={onMouseLeave ? () => onMouseLeave(record, itemIndex) : undefined}
            width={width}
            height={RECORD_CARD_ROW_HEIGHT}
            className={className}
            style={{
                ...style,
                left: Number(style.left) + RECORD_CARD_SPACING,
                top: Number(style.top) + RECORD_CARD_SPACING,
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
 *
 * @internal
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
 * @internal
 */
interface InnerWindowProps {
    children: React.ReactNode;
    style: React.CSSProperties;
}

/**
 * Wrapper component for RecordCardList's window (passed to FixedSizeList).
 *
 * This is used to force FixedSizeList (`react-window`) to include padding at both top and bottom
 * of the record card list. The FixedSizeList accounts for card padding on every card (baked into
 * `itemSize`), but this doesn't account for the 1 extra padding required beneath the last card.
 * (ie, if we have 10 cards, the height needs to be (10 * card_height) + (11 * card_padding)).
 *
 * @internal
 */
const innerRecordCardListWindow = React.forwardRef(
    (props: InnerWindowProps, ref: React.Ref<HTMLDivElement>) => {
        const {style, children} = props;
        return (
            <div
                ref={ref}
                style={{
                    ...style,
                    height: Number(style.height) + RECORD_CARD_SPACING,
                }}
            >
                {children}
            </div>
        );
    },
);

/**
 * Scroll event for {@link RecordCardList}.
 */
interface RecordCardListScrollEvent {
    /** The direction of the scroll event. */
    scrollDirection: 'forward' | 'backward';
    /** The vertical offset of the scrollable area. */
    scrollOffset: number;
    /** `true` for programmatic scrolling and `false` if the scroll was the result of a user interaction in the browser. */
    scrollUpdateWasRequested: boolean;
}

/**
 * Props for the {@link RecordCardList} component. Also accepts:
 * * {@link RecordCardListStyleProps}
 *
 * @docsPath UI/components/RecordCardList
 */

export interface RecordCardListProps {
    /** Records to display in card list. */
    records: Array<Record> | Array<RecordDef>;
    /** Scroll event handler for the list window. */
    onScroll?: (scrollEvent: RecordCardListScrollEvent) => void;
    /** Click event handler for an individual record card. If undefined, uses default behavior to expand record. If null, no operation is performed. */
    onRecordClick?: null | ((record: Record | RecordDef, index: number) => void);
    /** Mouse enter event handler for an individual record card. */
    onRecordMouseEnter?: (record: Record | RecordDef, index: number) => void;
    /** Mouse leave event handler for an individual record card. */
    onRecordMouseLeave?: (record: Record | RecordDef, index: number) => void;
    /** Fields to display in each record card. The primary field is always displayed. */
    fields?: Array<Field>;
    /** The view model to use for field order and record coloring. */
    view?: View;
    /** Attachment field to display as an image in the square preview for each record card. If omitted or not an attachment field, it uses for the first attachment field in `fields`. If `fields` is not defined, it uses the first attachment field in the view. */
    attachmentCoverField?: Field;
    /** Additional class names to apply to the record card list. */
    className?: string;
    /** Additional styles to apply to the record card list. */
    style?: React.CSSProperties;
}

/**
 * Style props for the {@link RecordCardList} component. Accepts:
 * * {@link DimensionsSetProps}
 * * {@link FlexItemSetProps}
 * * {@link MarginProps}
 * * {@link PositionSetProps}
 *
 * @noInheritDoc
 */
export interface RecordCardListStyleProps
    extends DimensionsSetProps,
        FlexItemSetProps,
        PositionSetProps,
        MarginProps {}

const styleParser = compose(dimensionsSet, flexItemSet, positionSet, margin);

export const recordCardListStylePropTypes = {
    ...dimensionsSetPropTypes,
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
};

/** @hidden */
interface RecordCardListState {
    cardListWidth: number;
    cardListHeight: number;
    isScrollbarVisible: boolean;
}

/**
 * Scrollable list of record cards.
 *
 * [[ Story id="recordcardlist--example" title="RecordCardList example" height="560px" ]]
 *
 * @docsPath UI/components/RecordCardList
 * @component
 */
export class RecordCardList extends React.Component<RecordCardListProps, RecordCardListState> {
    /** @hidden */
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
    /** @internal */
    _container: {current: HTMLElement | null};
    /** @internal */
    _cardList: {current: FixedSizeListType | null};
    /** @internal */
    _cardListInnerWindow: {current: HTMLDivElement | null};
    /** @internal */
    _detectElementResize: {
        addResizeListener: (element: HTMLElement, fn: () => void) => void;
        removeResizeListener: (element: HTMLElement, fn: () => void) => void;
    };
    /** @internal */
    _scrollbarWidth: number;
    /** @hidden */
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
    /** @hidden */
    componentDidMount() {
        invariant(this._container.current, 'No container to detect resize on');
        this._detectElementResize.addResizeListener(
            this._container.current,
            this._updateCardListSizeIfNeeded,
        );
        this._updateCardListSizeIfNeeded();
    }
    /** @hidden */
    componentWillUnmount() {
        if (this._container.current) {
            this._detectElementResize.removeResizeListener(
                this._container.current,
                this._updateCardListSizeIfNeeded,
            );
        }
    }
    /** @hidden */
    componentDidUpdate(prevProps: RecordCardListProps) {
        if (this.props.records.length !== prevProps.records.length) {
            this._updateCardListSizeIfNeeded();
        }
    }
    /** @hidden */
    scrollToRecordAtIndex(recordIndex: number) {
        invariant(this._cardList.current, 'No card list to scroll');
        this._cardList.current.scrollToItem(recordIndex);
    }
    /** @internal */
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
    /** @hidden */
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
            onMouseEnter: this.props.onRecordMouseEnter ?? null,
            onMouseLeave: this.props.onRecordMouseLeave ?? null,
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
                    itemKey={(index, data) => data.records[index].id as string}
                    itemSize={RECORD_CARD_ROW_HEIGHT + RECORD_CARD_SPACING}
                    onScroll={this.props.onScroll}
                >
                    {
                        RecordCardItemRenderer as any
                    }
                </FixedSizeList>
            </Box>
        );
    }
}

export default withStyledSystem<RecordCardListProps, RecordCardListStyleProps, RecordCardList, {}>(
    RecordCardList,
    styleParser,
    recordCardListStylePropTypes,
);
