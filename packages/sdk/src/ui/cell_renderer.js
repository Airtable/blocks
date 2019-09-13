// @flow
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import getSdk from '../get_sdk';
import {spawnError} from '../error_utils';
import Record from '../models/record';
import Field from '../models/field';
import cellValueUtils from '../models/cell_value_utils';
import withHooks from './with_hooks';
import useWatchable from './use_watchable';

const columnTypeProvider = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/column_type_provider',
);
const CellReadModeContext = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/cell_context/cell_read_mode_context',
);
const CellContextTypes = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/cell_context/cell_context_types',
);

/** @typedef */
type CellRendererProps = {|
    record?: ?Record,
    cellValue?: mixed,
    field: Field,
    shouldWrap?: boolean,
    className?: string,
    style?: Object,
    // These props exist to separate styling on the baymax wrapper div
    // (e.g. layout/sizing) from styling on the cell div (needed by RecordCard).
    cellClassName?: string,
    cellStyle?: Object,
|};

/** */
class CellRenderer extends React.Component<CellRendererProps> {
    static propTypes = {
        // NOTE: must pass in one of record or cellValue. It will default to using
        // the record if one is passed in, and cellValue otherwise.
        record: PropTypes.instanceOf(Record),
        cellValue: PropTypes.any,
        field: PropTypes.instanceOf(Field).isRequired,
        shouldWrap: PropTypes.bool,
        className: PropTypes.string,
        style: PropTypes.object,
        cellClassName: PropTypes.string,
        cellStyle: PropTypes.object,
    };
    static defaultProps = {
        shouldWrap: true,
    };

    constructor(props: CellRendererProps) {
        super(props);

        this._validateProps(props);
    }
    UNSAFE_componentWillReceiveProps(nextProps: CellRendererProps) {
        this._validateProps(nextProps);
    }
    _validateProps(props: CellRendererProps) {
        if (
            props.record &&
            !props.record.isDeleted &&
            !props.field.isDeleted &&
            props.record.parentTable.id !== props.field.parentTable.id
        ) {
            throw spawnError(
                'CellRenderer: record %s and field %s do not have the same parent table',
                props.record.parentTable.id,
                props.field.parentTable.id,
            );
        }
    }
    render() {
        const {
            record,
            cellValue,
            field,
            shouldWrap,
            className,
            style,
            cellClassName,
            cellStyle,
        } = this.props;

        if (field.isDeleted) {
            return null;
        }

        let publicCellValue;
        if (record) {
            if (cellValue !== undefined) {
                // eslint-disable-next-line
                console.warn(
                    'CellRenderer was given both record and cellValue, choosing to render record value',
                );
            }

            if (record.isDeleted) {
                return null;
            }

            publicCellValue = record.getCellValue(field.id);
        } else {
            // NOTE: this will not work if you want to render a cell value for
            // foreign record, single/multi select, or single/multi collaborator
            // fields and the cell value is not *currently* valid for that field.
            // i.e. if you want to render a foreign record for a record that
            // does not yet exist, this will throw.
            // TODO: handle "preview" cell values that are not yet valid in the given field
            // but that *could* be.
            cellValueUtils.validatePublicCellValueForUpdate(cellValue, null, field);
            publicCellValue = cellValue;
        }
        const privateCellValue = cellValueUtils.parsePublicApiCellValue(publicCellValue, field);

        const cellContextType = shouldWrap
            ? CellContextTypes.BLOCKS_READ_WRAP
            : CellContextTypes.BLOCKS_READ_NO_WRAP;

        const rawHtml = columnTypeProvider.renderReadModeCellValue(
            privateCellValue,
            field.__getRawType(),
            field.__getRawTypeOptions(),
            getSdk().__appInterface,
            CellReadModeContext.forContextType(cellContextType),
        );
        const attributes: Object = {
            'data-columntype': field.__getRawType(),
        };
        const typeOptions = field.__getRawTypeOptions();
        if (typeOptions && typeOptions.resultType) {
            attributes['data-formatting'] = typeOptions.resultType;
        }
        return (
            <div className={cx('baymax', className)} style={style}>
                <div
                    {...attributes}
                    className={cx('cell read', cellClassName)}
                    style={cellStyle}
                    dangerouslySetInnerHTML={{
                        __html: rawHtml,
                    }}
                />
            </div>
        );
    }
}

export default withHooks<CellRendererProps, {}, CellRenderer>(CellRenderer, props => {
    useWatchable(props.record, [`cellValueInField:${props.field.id}`]);
    useWatchable(props.field, ['type', 'options']);
    return {};
});
