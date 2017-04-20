// @flow
const React = require('client/blocks/sdk/ui/react');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const TableModel = require('client/blocks/sdk/models/table');

type TablePickerOptionProps = {table: TableModel};
const _TablePickerOption = (props: TablePickerOptionProps) => {
    const {table} = props;
    return <option value={table.id}>{table.name}</option>;
};
const TablePickerOption = createDataContainer(_TablePickerOption, (props: TablePickerOptionProps) => {
    return [
        {watch: props.table, key: 'name'},
    ];
});

type TablePickerProps = {
    table: ?TableModel,
    onChange?: (tableModel: TableModel | null) => void,
    placeholder?: string,
    style: ?Object,
    className: ?string,
    disabled: ?boolean,
};

class TablePicker extends React.Component {
    static propTypes = {
        table: React.PropTypes.instanceOf(TableModel),
        onChange: React.PropTypes.func,
        placeholder: React.PropTypes.string,
        style: React.PropTypes.object,
        className: React.PropTypes.string,
        disabled: React.PropTypes.bool,
    };
    static defaultProps = {
        placeholder: 'Pick a table...',
    };
    props: TablePickerProps;
    _onChange(e) {
        const {onChange} = this.props;
        if (onChange) {
            const table = getSdk().base.getTableById(e.target.value) || null;
            onChange(table);
        }
    }
    _onTablesChanged() {
        const {table} = this.props;
        if (table && table.isDeleted && this.props.onChange) {
            this.props.onChange(null);
        }
        this.forceUpdate();
    }
    render() {
        const selectedTable = this.props.table && !this.props.table.isDeleted ? this.props.table : null;
        return (
            <select
                value={selectedTable ? selectedTable.id : ''}
                onChange={this._onChange.bind(this)}
                style={this.props.style}
                className={this.props.className}
                disabled={this.props.disabled}>
                <option value={''} disabled={true}>{this.props.placeholder}</option>
                {getSdk().base.tables.map(table => <TablePickerOption key={table.id} table={table} />)}
            </select>
        );
    }
}

module.exports = createDataContainer(TablePicker, (props: TablePickerProps) => {
    return [
        {watch: getSdk().base, key: 'tables', callback: TablePicker.prototype._onTablesChanged},
    ];
});
