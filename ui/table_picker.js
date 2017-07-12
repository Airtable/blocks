// @flow
const React = require('client/blocks/sdk/ui/react');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const getSdk = require('client/blocks/sdk/get_sdk');
const TableModel = require('client/blocks/sdk/models/table');
const ModelPickerSelect = require('client/blocks/sdk/ui/model_picker_select');

type TablePickerProps = {
     table: ?TableModel,
     shouldAllowPickingNone?: boolean,
     onChange?: (tableModel: TableModel | null) => void,
     placeholder?: string,
     style: ?Object,
     className: ?string,
     disabled: ?boolean,
};

class TablePicker extends React.Component {
    static propTypes = {
        table: React.PropTypes.instanceOf(TableModel),
        shouldAllowPickingNone: React.PropTypes.bool,
        onChange: React.PropTypes.func,
        placeholder: React.PropTypes.string,
        style: React.PropTypes.object,
        className: React.PropTypes.string,
        disabled: React.PropTypes.bool,
    };
    props: TablePickerProps;
    _onChange: (string | null) => void;
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
    }
    _onChange(tableId: string | null) {
        const {onChange} = this.props;
        if (onChange) {
            const table = tableId ? getSdk().base.getTableById(tableId) : null;
            onChange(table);
        }
    }
    render() {
        const {shouldAllowPickingNone, style, className, disabled} = this.props;
        const selectedTable = this.props.table && !this.props.table.isDeleted ? this.props.table : null;

        let placeholder;
        if (this.props.placeholder === undefined) {
            // Let's set a good default value for the placeholder, depending
            // on the shouldAllowPickingNone flag.
            placeholder = shouldAllowPickingNone ? 'None' : 'Pick a table...';
        } else {
            placeholder = this.props.placeholder;
        }

        return (
            <ModelPickerSelect
                models={getSdk().base.tables}
                selectedModelId={selectedTable ? selectedTable.id : null}
                onChange={this._onChange}
                style={style}
                className={className}
                disabled={disabled}
                placeholder={placeholder}
                shouldAllowPickingNone={shouldAllowPickingNone}
                modelKeysToWatch={['name']}
            />
        );
    }
}

module.exports = createDataContainer(TablePicker, (props: TablePickerProps) => {
    return [
        {watch: getSdk().base, key: 'tables'},
    ];
});
