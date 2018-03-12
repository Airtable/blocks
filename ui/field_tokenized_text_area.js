// @flow
const {h, u} = require('client_server_shared/hu');
const React = require('client/blocks/sdk/ui/react');
const PropTypes = require('prop-types');
const TableModel = require('client/blocks/sdk/models/table');
const FieldModel = require('client/blocks/sdk/models/field');
const Tooltip = require('client/blocks/sdk/ui/tooltip');
const Icon = require('client/blocks/sdk/ui/icon');
const loadQuillAsync = require('client/helpers/load_quill_async');
const AutocompletePopover = require('client/blocks/sdk/ui/autocomplete_popover');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const invariant = require('invariant');
const classNames = require('classnames');
const QuillDelta = require('quill-delta');

import type {Quill as QuillType} from 'quill';

type FieldTokenPickerProps = {
    table: TableModel,
    left: number,
    top: number,
    onClose: () => void,
    onSelect: FieldModel => void,
};

class FieldTokenPicker extends React.Component {
    static propTypes = {
        table: PropTypes.instanceOf(TableModel).isRequired,
        left: PropTypes.number.isRequired,
        top: PropTypes.number.isRequired,
        onClose: PropTypes.func.isRequired,
        onSelect: PropTypes.func.isRequired,
    };
    props: FieldTokenPickerProps;
    render() {
        const {left, top, onClose} = this.props;
        return (
            <AutocompletePopover
                items={this.props.table.fields.map(field => ({
                    value: field.id,
                    label: field.name,
                }))}
                placementX={AutocompletePopover.placements.RIGHT}
                placementY={AutocompletePopover.placements.BOTTOM}
                onSelect={item => {
                    const fieldId = item.value;
                    const field = this.props.table.getFieldById(fieldId);
                    invariant(field, `No field for id: ${fieldId}`);
                    this.props.onSelect(field);
                }}
                onClose={onClose}
                focusOnOpen={true}
                placeholder="Pick a field...">
                <div className="absolute" style={{top, left, width: 0, height: 0}} />
            </AutocompletePopover>
        );
    }
}

let lastRegisteredQuillClass = null;
function registerFieldTokenBlot(Quill) {
    if (lastRegisteredQuillClass === Quill) {
        // This is a nice-to-have check for perf. We only keep track of
        // the most recent Quill class that we registered the blot for since
        // in practice we don't load multiple versions of Quill on the page.
        // If we did, it would be okay. `Quill.register` will just replace
        // the previous blot.
        return;
    }
    lastRegisteredQuillClass = Quill;

    const Embed = Quill.import('blots/embed');

    class FieldTokenBlot extends Embed {
        static blotName = 'fieldToken';
        static tagName = 'control';
        static className = 'fieldToken';
        static create(data) {
            const {base} = getSdk();
            const table = base.getTableById(data.tableId);
            invariant(table, 'No table');
            const field = table.getFieldById(data.fieldId);

            const node = super.create(data);
            node.setAttribute('data-fieldid', data.fieldId);
            node.setAttribute('data-tableid', data.tableId);

            const token = document.createElement('span');
            token.className = classNames('px1 pill nowrap text-white', {
                blue: !!field,
                red: !field,
            });
            token.textContent = field ? field.name : 'Deleted field';

            node.appendChild(token);

            return node;
        }
        static value(node) {
            return {
                fieldId: node.getAttribute('data-fieldid'),
                tableId: node.getAttribute('data-tableid'),
            };
        }
    }

    Quill.register({
        'formats/fieldToken': FieldTokenBlot,
    }, true);
}

// See https://quilljs.com/docs/api/#events
const QuillChangeSourceTypes = {
    SILENT: 'silent',
    USER: 'user',
    API: 'api',
};

type FieldTokenizedTextAreaProps = {
    table: TableModel,
    value: ?Array<Object>,
    onChange?: ?Array<Object> => void,
    disabled?: boolean,
    className?: string,
    style?: Object,
};

/** */
class FieldTokenizedTextArea extends React.Component {
    static propTypes = {
        table: PropTypes.instanceOf(TableModel).isRequired,
        value: PropTypes.arrayOf(PropTypes.object),
        onChange: PropTypes.func,
        disabled: PropTypes.bool,
        className: PropTypes.string,
        style: PropTypes.object,
    };
    props: FieldTokenizedTextAreaProps;
    _isMounted: boolean;
    _quill: QuillType | null;
    _input: ?HTMLElement;
    _onChange: Function;
    _onInsertFieldTokenForField: FieldModel => void;
    _onAddFieldTokenButtonClick: SyntheticMouseEvent => void;
    _onCloseFieldTokenPicker: () => void;
    focus: () => void;

    constructor(props: FieldTokenizedTextAreaProps) {
        super(props);

        this.state = {
            shouldShowFieldTokenPicker: false,
            selectionRange: null,
            prevSelectionRange: null,
            selectionBounds: null,
        };

        this._quill = null;

        this._onChange = this._onChange.bind(this);
        this._onInsertFieldTokenForField = this._onInsertFieldTokenForField.bind(this);
        this._onAddFieldTokenButtonClick = this._onAddFieldTokenButtonClick.bind(this);
        this._onCloseFieldTokenPicker = this._onCloseFieldTokenPicker.bind(this);
        this.focus = this.focus.bind(this);
    }
    componentDidMount() {
        this._isMounted = true;

        u.fireAndForgetPromise(this._loadQuillAsync.bind(this))();
    }
    componentWillUnmount() {
        this._isMounted = false;

        const quill = this._getQuill();
        if (quill) {
            quill.off('editor-change', this._onChange);
        }
    }
    componentWillReceiveProps(nextProps: FieldTokenizedTextAreaProps) {
        const quill = this._getQuill();
        if (quill) {
            const currentContents = quill.getContents();
            if (!u.isEqual(nextProps.value, currentContents.ops)) {
                // If the value in props is different from the quill contents, let's
                // set the quill contents.
                invariant(QuillDelta, 'QuillDelta');
                this._setQuillContents(new QuillDelta(nextProps.value));
            }

            if (nextProps.disabled) {
                quill.disable();
            } else {
                quill.enable();
            }
        }
    }
    async _loadQuillAsync() {
        const {Quill} = await loadQuillAsync();

        if (!this._isMounted) {
            return;
        }

        registerFieldTokenBlot(Quill);

        const quill = new Quill(this._quillContainer, {
            readOnly: this.props.disabled,

            // Disable all formats by default (except for field tokens). We can update
            // this later when we allow rich text input in a tokenized text area.
            formats: ['fieldToken'],
        });

        this._quill = quill;
        this._setQuillContents(new QuillDelta(this.props.value));
        quill.on('editor-change', this._onChange);
    }
    _setQuillContents(contents: ?Array<Object>) {
        const quill = this._getQuill();
        invariant(quill, 'quill');
        if (contents === null || contents === undefined) {
            quill.setText('', QuillChangeSourceTypes.API);
        } else {
            quill.setContents(contents, QuillChangeSourceTypes.API);
        }
    }
    _getQuill(): QuillType | null {
        return this._quill;
    }
    _onChange(eventName: string, ...args: Array<any>) { // eslint-disable-line flowtype/no-weak-types
        if (eventName === 'text-change') {
            this._onTextChange(...args);
        } else if (eventName === 'selection-change') {
            this._onSelectionChange(...args);
        }
    }
    _onInsertFieldTokenForField(field: FieldModel) {
        const {selectionRange: currSelectionRange, prevSelectionRange} = this.state;

        const quill = this._getQuill();
        invariant(quill, 'quill');

        // If we don't have a selection range, insert at the end.
        const selectionRange = currSelectionRange || prevSelectionRange || {index: quill.getText().length - 1};

        const hasSpecialFieldCharacter = selectionRange.index > 0 && quill.getText(selectionRange.index - 1, 1) === '{';

        quill.insertEmbed(
            hasSpecialFieldCharacter ? selectionRange.index - 1 : selectionRange.index,
            'fieldToken',
            {fieldId: field.id, tableId: this.props.table.id},
            QuillChangeSourceTypes.USER,
        );

        if (hasSpecialFieldCharacter) {
            // delete the '{' character
            quill.deleteText(selectionRange.index, 1, QuillChangeSourceTypes.USER);
        }

        this.setState({
            shouldShowFieldTokenPicker: false,
        }, this.focus);
    }
    _onAddFieldTokenButtonClick(e: SyntheticMouseEvent) {
        this.setState(prevState => {
            const quill = this._getQuill();
            invariant(quill, 'quill');
            let selectionBounds = prevState.selectionBounds;
            if (!selectionBounds) {
                // If we don't have selection bounds, put the field picker at the
                // end of the text (since that's where we'll insert the token).
                const text = quill.getText();
                selectionBounds = quill.getBounds(text.length - 1, 1);
            }
            return {
                shouldShowFieldTokenPicker: true,
                selectionBounds,
            };
        });
    }
    _onCloseFieldTokenPicker() {
        if (!this.state.shouldShowFieldTokenPicker) {
            return;
        }
        this.setState({
            shouldShowFieldTokenPicker: false,
        }, this.focus);
    }
    focus() {
        const quill = this._getQuill();
        if (quill) {
            // TODO: maybe queue up the focus call and autofocus once quill loads?
            // Might get weird if the user focuses *another* element in the meantime.
            quill.focus();
        }
    }
    _onFieldsChanged() {
        const quill = this._getQuill();
        if (quill) {
            quill.setContents(quill.getContents(), QuillChangeSourceTypes.SILENT);
        }
    }
    _onTextChange(delta: Object, oldDelta: Object, source: string) {
        // ignore change if the source is not "user". See https://quilljs.com/docs/api/#events
        if (source !== QuillChangeSourceTypes.USER) {
            return;
        }

        const quill = this._getQuill();
        invariant(quill, 'quill');

        if (delta.ops.some(op => op.insert === '{')) {
            const selectionRange = quill.getSelection();
            const selectionBounds = quill.getBounds(selectionRange.index, selectionRange.length);
            this.setState({
                shouldShowFieldTokenPicker: true,
                selectionBounds,
            });
        }

        const deltaDocument = quill.getContents();
        if (this.props.onChange) {
            this.props.onChange(deltaDocument.ops);
        }
    }
    _onSelectionChange(selectionRange: Object, oldSelectionRange: Object, source: string) {
        const quill = this._getQuill();
        invariant(quill, 'quill');

        const selectionBounds = selectionRange && quill.getBounds(selectionRange.index, selectionRange.length);
        this.setState(prevState => ({
            selectionRange: selectionRange === null && prevState.shouldShowFieldTokenPicker ? prevState.selectionRange : selectionRange,
            prevSelectionRange: prevState.selectionRange,
            selectionBounds: selectionBounds || prevState.selectionBounds,
        }));
    }
    render() {
        const {table, disabled, className, style} = this.props;
        const {selectionBounds, shouldShowFieldTokenPicker} = this.state;
        return (
            <div
                className={classNames('blockSdkFieldTokenizedTextArea relative rounded overflow-auto', {
                    quieter: disabled,
                }, className)}
                style={style}>
                {shouldShowFieldTokenPicker &&
                    <FieldTokenPicker
                        left={selectionBounds.left}
                        top={selectionBounds.top - 3}
                        table={table}
                        onClose={() => this.setState({shouldShowFieldTokenPicker: false})}
                        onSelect={this._onInsertFieldTokenForField}
                    />
                }
                <div
                    ref={el => this._quillContainer = el}
                    className="p1"
                />
                {!disabled &&
                    <Tooltip
                        placementX={Tooltip.placements.LEFT}
                        placementY={Tooltip.placements.CENTER}
                        content="Add record content"
                        className="nowrap"
                        shouldHideTooltipOnClick={true}>
                        <div
                            className="absolute bottom-0 right-0 mr1 mb1 darken4 text-white pointer link-quiet flex items-center justify-center circle"
                            style={{width: 24, height: 24}}
                            onClick={this._onAddFieldTokenButtonClick}>
                            <Icon name="plus" size={12} />
                        </div>
                    </Tooltip>
                }
            </div>
        );
    }
}

module.exports = createDataContainer(FieldTokenizedTextArea, (props: FieldTokenizedTextAreaProps) => {
    return [
        {watch: props.table, key: 'fields', callback: FieldTokenizedTextArea.prototype._onFieldsChanged},
        ...props.table.fields.map(field => {
            return {watch: field, key: 'name', callback: FieldTokenizedTextArea.prototype._onFieldsChanged};
        }),
    ];
});
