// @flow
const React = require('client/blocks/sdk/ui/react');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const columnTypeProvider = require('client_server_shared/column_types/column_type_provider');
const Record = require('client/blocks/sdk/models/record');
const Field = require('client/blocks/sdk/models/field');

type CellRendererProps = {
    record: Record,
    field: Field,
    style?: Object,
};

class CellRenderer extends React.Component {
    static propTypes = {
        record: React.PropTypes.instanceOf(Record).isRequired,
        field: React.PropTypes.instanceOf(Field).isRequired,
        style: React.PropTypes.object,
    };
    props: CellRendererProps;

    render() {
        const {record, field} = this.props;

        if (record.isDeleted || field.isDeleted) {
            return null;
        }

        const rawCellValue = record.__getRawCellValue(field.id);
        const rawHtml = columnTypeProvider.renderReadModeCellValue(
            rawCellValue,
            field.__getRawType(),
            field.__getRawTypeOptions(),
            record.parentTable.parentBase.__appBlanket
        );
        const attributes: Object = {
            'data-columntype': field.__getRawType(),
        };
        const typeOptions = field.__getRawTypeOptions();
        if (typeOptions && typeOptions.resultType) {
            attributes['data-formatting'] = typeOptions.resultType;
        }
        return (
            <div
                style={this.props.style}
                {...attributes}
                className="cell read"
                dangerouslySetInnerHTML={{
                    __html: rawHtml,
                }}
            />
        );
    }
}

module.exports = createDataContainer(CellRenderer, (props: CellRendererProps) => {
    return [
        {watch: props.record, key: `cellValueInField:${props.field.id}`},
        {watch: props.field, key: 'config'},
    ];
});
