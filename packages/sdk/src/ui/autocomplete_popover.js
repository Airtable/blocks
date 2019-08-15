// @flow
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as React from 'react';
import {values} from '../private_utils';
import Popover, {
    type PopoverPlacementX,
    type PopoverPlacementY,
    type FitInWindowMode,
} from './popover';

const KeyCodes = window.__requirePrivateModuleFromAirtable('client_server_shared/key_codes');

/** @typedef */
type AutocompleteItem = {|
    value: string,
    label: string,
    aliases?: Array<string>,
|};

/** @typedef */
type AutocompletePopoverProps = {
    children: React$Element<*>,
    items: Array<AutocompleteItem>,
    renderItem?: (item: AutocompleteItem, isFocused: boolean) => React$Element<*>,
    filterItems?: (query: string, items: Array<AutocompleteItem>) => Array<AutocompleteItem>,
    onSelect: AutocompleteItem => void,
    placeholder?: string,
    focusOnOpen?: boolean,
    className?: string,
    style?: Object,

    placementX?: PopoverPlacementX,
    placementY?: PopoverPlacementY,
    placementOffsetX?: number,
    placementOffsetY?: number,
    fitInWindowMode?: FitInWindowMode,
    isOpen?: boolean,
    onClose?: (opts: {wasFromEscape: boolean}) => void,
};

type AutocompletePopoverState = {|
    query: string,
    itemsMatchingQuery: Array<AutocompleteItem>,
    focusedItemIndex: number | null,
|};

/** */
class AutocompletePopover extends React.Component<
    AutocompletePopoverProps,
    AutocompletePopoverState,
> {
    static placements = Popover.placements;
    static fitInWindowModes = Popover.fitInWindowModes;

    static propTypes = {
        children: PropTypes.element.isRequired,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                value: PropTypes.string.isRequired,
                label: PropTypes.string.isRequired,
                aliases: PropTypes.arrayOf(PropTypes.string),
            }),
        ).isRequired,
        renderItem: PropTypes.func,
        filterItems: PropTypes.func,
        onSelect: PropTypes.func.isRequired,
        placeholder: PropTypes.string,
        focusOnOpen: PropTypes.bool,
        className: PropTypes.string,
        style: PropTypes.object,

        placementX: PropTypes.oneOf([
            Popover.placements.LEFT,
            Popover.placements.CENTER,
            Popover.placements.RIGHT,
        ]),
        placementY: PropTypes.oneOf([
            Popover.placements.TOP,
            Popover.placements.CENTER,
            Popover.placements.BOTTOM,
        ]),
        placementOffsetX: PropTypes.number,
        placementOffsetY: PropTypes.number,
        fitInWindowMode: PropTypes.oneOf(values(Popover.fitInWindowModes)),
        isOpen: PropTypes.bool,
        onClose: PropTypes.func,
    };
    static defaultProps = {
        focusOnOpen: true,
        isOpen: true,
    };
    props: AutocompletePopoverProps;
    _input: ?HTMLElement;
    _resultsContainer: ?HTMLElement;
    _selectedResult: ?HTMLElement;
    _onInputChange: (SyntheticInputEvent<>) => void;
    _onKeyDown: (SyntheticKeyboardEvent<>) => void;
    _resetResultsPointerEvents: () => void;
    constructor(props: AutocompletePopoverProps) {
        super(props);

        this.state = {
            query: '',
            itemsMatchingQuery: props.items,
            focusedItemIndex: null,
        };

        this._onInputChange = this._onInputChange.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
        this._resetResultsPointerEvents = this._resetResultsPointerEvents.bind(this);
    }
    componentDidMount() {
        if (this.props.isOpen && this.props.focusOnOpen) {
            setTimeout(() => this.focus(), 0);
        }

        document.addEventListener('mousemove', this._resetResultsPointerEvents, false);
    }
    componentWillUnmount() {
        document.removeEventListener('mousemove', this._resetResultsPointerEvents, false);
    }
    componentDidUpdate(prevProps: AutocompletePopoverProps) {
        if (this.props.focusOnOpen && this.props.isOpen && !prevProps.isOpen) {
            this.focus();
        }
    }
    focus() {
        if (this._input) {
            this._input.focus();
        }
    }
    _getItemsMatchingQuery(query: string): Array<AutocompleteItem> {
        const {items: allItems} = this.props;
        if (!query) {
            return allItems;
        }
        if (this.props.filterItems) {
            return this.props.filterItems(query, allItems);
        } else {
            const lowercaseQuery = query.toLowerCase();
            return allItems.filter(item => {
                return (
                    item.label.toLowerCase().indexOf(lowercaseQuery) !== -1 ||
                    (item.aliases &&
                        item.aliases.some(alias => {
                            return alias.toLowerCase().indexOf(lowercaseQuery) !== -1;
                        }))
                );
            });
        }
    }
    _resetResultsPointerEvents() {
        if (this._resultsContainer) {
            this._resultsContainer.style.pointerEvents = '';
        }
    }
    _onItemSelect(item: AutocompleteItem) {
        this.props.onSelect(item);
        this._clearQuery();
    }
    _onItemSelectFromKeyDown() {
        if (this.state.focusedItemIndex !== null) {
            const selectedItem = this.state.itemsMatchingQuery[this.state.focusedItemIndex];
            this._onItemSelect(selectedItem);
        }
    }
    _onMouseEnterItemAtIndex(index: number) {
        if (this.state.focusedItemIndex !== index) {
            this.setState({
                focusedItemIndex: index,
            });
        }
    }
    _moveFocus(delta: 1 | -1) {
        const {itemsMatchingQuery, focusedItemIndex} = this.state;

        if (!itemsMatchingQuery || itemsMatchingQuery.length === 0) {
            return;
        }

        const totalInCycle = itemsMatchingQuery.length + 1;
        const focusedIndexNonNull = focusedItemIndex === null ? totalInCycle - 1 : focusedItemIndex;
        const newFocusedIndexNonNull = (focusedIndexNonNull + delta + totalInCycle) % totalInCycle;

        const newFocusedIndex =
            newFocusedIndexNonNull === totalInCycle - 1 ? null : newFocusedIndexNonNull;

        this.setState(
            {
                focusedItemIndex: newFocusedIndex,
            },
            () => {
                this._scrollToSelectedIndex();
            },
        );
    }
    _clearQuery() {
        this.setState({
            query: '',
            itemsMatchingQuery: this.props.items,
            focusedItemIndex: null,
        });
    }
    _onInputChange(e: SyntheticInputEvent<>) {
        const query = e.target.value;
        const itemsMatchingQuery = this._getItemsMatchingQuery(query);
        const focusedItemIndex = query.length && itemsMatchingQuery.length ? 0 : null;
        this.setState(
            {
                query,
                itemsMatchingQuery,
                focusedItemIndex,
            },
            () => {
                this._scrollToSelectedIndex();
            },
        );
    }
    _onKeyDown(e: SyntheticKeyboardEvent<>) {
        switch (e.keyCode) {
            case KeyCodes.ENTER:
                this._onItemSelectFromKeyDown();
                e.stopPropagation();
                e.preventDefault();
                return;

            case KeyCodes.TAB:
                this._onItemSelectFromKeyDown();
                return;

            case KeyCodes.ESCAPE:
                this._clearQuery();
                e.stopPropagation();
                e.preventDefault();
                if (this.props.onClose) {
                    this.props.onClose({wasFromEscape: true});
                }
                return;

            case KeyCodes.UP:
            case KeyCodes.DOWN:
                this._moveFocus(e.keyCode === KeyCodes.DOWN ? 1 : -1);
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
            resultsContainer.style.pointerEvents = 'none';

            if (shouldScrollUp) {
                resultsContainer.scrollTop += resultTop;
            } else {
                resultsContainer.scrollTop += resultBottom - resultsContainer.clientHeight;
            }
        }
    }
    _renderItem(item: AutocompleteItem, isFocused: boolean): React$Element<*> {
        if (this.props.renderItem) {
            return this.props.renderItem(item, isFocused);
        } else {
            return <div className="p1 flex items-center">{item.label}</div>;
        }
    }
    _renderInput() {
        return (
            <div className="flex flex-auto">
                <input
                    ref={el => (this._input = el)}
                    autoComplete="false"
                    className="p1 flex-auto"
                    style={{
                        border: 0,
                        borderBottom: '1px solid rgba(0,0,0,0.1)',
                    }}
                    onChange={this._onInputChange}
                    onKeyDown={this._onKeyDown}
                    placeholder={this.props.placeholder}
                    type="text"
                    value={this.state.query}
                />
            </div>
        );
    }
    _renderPopover() {
        const {itemsMatchingQuery} = this.state;

        if (!itemsMatchingQuery) {
            return null;
        }

        const items = itemsMatchingQuery.map((item: AutocompleteItem, index) => {
            const isFocused = index === this.state.focusedItemIndex;
            return (
                <div
                    ref={isFocused ? el => (this._selectedResult = el) : null}
                    key={item.value}
                    className={classNames('pointer', {
                        darken1: isFocused,
                    })}
                    onClick={() => this._onItemSelect(item)}
                    onMouseEnter={() => this._onMouseEnterItemAtIndex(index)}
                >
                    {this._renderItem(item, isFocused)}
                </div>
            );
        });

        return (
            <Popover
                placementX={this.props.placementX}
                placementY={this.props.placementY}
                placementOffsetX={this.props.placementOffsetX}
                placementOffsetY={this.props.placementOffsetY}
                fitInWindowMode={this.props.fitInWindowMode}
                isOpen={this.props.isOpen}
                renderContent={() => (
                    <div
                        className={classNames(
                            'rounded stroked1 white overflow-hidden',
                            this.props.className,
                        )}
                        style={this.props.style}
                    >
                        {this._renderInput()}
                        {items.length > 0 ? (
                            <div
                                ref={el => (this._resultsContainer = el)}
                                style={{maxHeight: 220}}
                                className="relative overflow-auto"
                            >
                                {items}
                            </div>
                        ) : (
                            <div className="p1 quieter">No results</div>
                        )}
                    </div>
                )}
                onClose={() => {
                    if (this.props.onClose) {
                        this.props.onClose({wasFromEscape: false});
                    }
                }}
            >
                {this.props.children}
            </Popover>
        );
    }
    render() {
        return this._renderPopover();
    }
}

export default AutocompletePopover;
