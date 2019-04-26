// @flow
const React = require('./react');
const PropTypes = require('prop-types');
const createDataContainer = require('./create_data_container');
const getSdk = require('../../shared/get_sdk');
const TableModel = require('../../shared/models/table');
const ModelPickerSelect = require('./model_picker_select');
const invariant = require('invariant');

type TablePickerProps = {
    table?: TableModel,
    shouldAllowPickingNone?: boolean,
    onChange?: (tableModel: TableModel | null) => void,
    placeholder?: string,
    style?: Object,
    className?: string,
    disabled?: boolean,
};

/** */
class TablePicker extends React.Component<TablePickerProps> {
    static propTypes = {
        table: PropTypes.instanceOf(TableModel),
        shouldAllowPickingNone: PropTypes.bool,
        onChange: PropTypes.func,
        placeholder: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
        disabled: PropTypes.bool,
    };
    props: TablePickerProps;
    _select: ModelPickerSelect<TableModel> | null;
    _onChange: (string | null) => void;
    constructor(props) {
        super(props);

        this._select = null;
        this._onChange = this._onChange.bind(this);
    }
    focus() {
        invariant(this._select, 'No select to focus');
        this._select.focus();
    }
    blur() {
        invariant(this._select, 'No select to blur');
        this._select.blur();
    }
    click() {
        invariant(this._select, 'No select to click');
        this._select.click();
    }
    _onChange(tableId: string | null) {
        const {onChange} = this.props;
        if (onChange) {
            const table = tableId ? getSdk().base.getTableById(tableId) : null;
            onChange(table);
        }
    }
    render() {
        const {
            table,
            shouldAllowPickingNone,
            style,
            className,
            disabled,
            placeholder,
            // Filter these out so they're not
            // included in restOfProps:
            onChange, // eslint-disable-line no-unused-vars
            ...restOfProps
        } = this.props;
        const selectedTable = table && !table.isDeleted ? table : null;

        let placeholderToUse;
        if (placeholder === undefined) {
            // Let's set a good default value for the placeholder, depending
            // on the shouldAllowPickingNone flag.
            placeholderToUse = shouldAllowPickingNone ? 'None' : 'Pick a table...';
        } else {
            placeholderToUse = placeholder;
        }

        return (
            <ModelPickerSelect
                ref={el => (this._select = el)}
                models={getSdk().base.tables}
                selectedModelId={selectedTable ? selectedTable.id : null}
                onChange={this._onChange}
                style={style}
                className={className}
                disabled={disabled}
                placeholder={placeholderToUse}
                shouldAllowPickingNone={shouldAllowPickingNone}
                modelKeysToWatch={['name']}
                {...restOfProps}
            />
        );
    }
}

module.exports = createDataContainer(
    TablePicker,
    (props: TablePickerProps) => {
        return [{watch: getSdk().base, key: 'tables'}];
    },
    ['focus', 'blur', 'click'],
);
