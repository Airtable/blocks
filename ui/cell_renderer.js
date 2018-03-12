// @flow
const React = require('client/blocks/sdk/ui/react');
const PropTypes = require('prop-types');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const columnTypeProvider = require('client_server_shared/column_types/column_type_provider');
const Record = require('client/blocks/sdk/models/record');
const Field = require('client/blocks/sdk/models/field');
const cellValueUtils = require('client/blocks/sdk/models/cell_value_utils');
const CellContext = require('client_server_shared/cell_context/cell_context');
const CellContextTypes = require('client_server_shared/cell_context/cell_context_types');

type CellRendererProps = {
    record?: Record,
    cellValue?: mixed,
    field: Field,
    shouldWrap?: boolean,
    className?: string,
    style?: Object,
};

/** */
class CellRenderer extends React.Component {
    props: CellRendererProps;
    static propTypes = {
        // NOTE: must pass in one of record or cellValue. It will default to using
        // the record if one is passed in, and cellValue otherwise.
        record: PropTypes.instanceOf(Record),
        cellValue: PropTypes.any,
        field: PropTypes.instanceOf(Field).isRequired,
        shouldWrap: PropTypes.bool,
        className: PropTypes.string,
        style: PropTypes.object,
    };
    static defaultProps = {
        shouldWrap: true,
    };

    constructor(props: CellRendererProps) {
        super(props);

        this._validateProps(props);
    }
    componentWillReceiveProps(nextProps: CellRendererProps) {
        this._validateProps(nextProps);
    }
    _validateProps(props: CellRendererProps) {
        if (props.record && !props.record.isDeleted && !props.field.isDeleted && props.record.parentTable.id !== props.field.parentTable.id) {
            throw new Error('CellRenderer: record and field must have the same parent table');
        }
    }
    render() {
        const {record, cellValue, field, shouldWrap} = this.props;

        if (field.isDeleted) {
            return null;
        }

        let privateCellValue;
        if (record) {
            if (cellValue !== undefined) {
                console.warn('CellRenderer was given both record and cellValue, choosing to render record value'); // eslint-disable-line
            }

            if (record.isDeleted) {
                return null;
            }

            privateCellValue = record.__getRawCellValue(field.id);
        } else {
            // NOTE: this will not work if you want to render a cell value for
            // foreign record, single/multi select, or single/multi collaborator
            // fields and the cell value is not *currently* valid for that field.
            // i.e. if you want to render a foreign record for a record that
            // does not yet exist, this will throw.
            // TODO: handle "preview" cell values that are not yet valid in the given field
            // but that *could* be.
            privateCellValue = cellValueUtils.parsePublicCellValueForUpdate(cellValue, null, field);
        }

        const cellContextType = shouldWrap ? CellContextTypes.BLOCKS_READ_WRAP : CellContextTypes.BLOCKS_READ_NO_WRAP;

        const rawHtml = columnTypeProvider.renderReadModeCellValue(
            privateCellValue,
            field.__getRawType(),
            field.__getRawTypeOptions(),
            field.parentTable.parentBase.__appBlanket,
            CellContext.forContextType(cellContextType),
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
                className={`cell read ${this.props.className || ''}`}
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
