// @flow
const {h, _} = require('client_server_shared/h_');
const React = require('client/blocks/sdk/ui/react');
const CellRenderer = require('client/blocks/sdk/ui/cell_renderer');
const columnTypeProvider = require('client_server_shared/column_types/column_type_provider');
const ApiFieldTypes = require('client_server_shared/column_types/api_field_types');
const FieldModel = require('client/blocks/sdk/models/field');
const RecordModel = require('client/blocks/sdk/models/record');
const ViewModel = require('client/blocks/sdk/models/view');
const attachmentPreviewRenderer = require('client_server_shared/read_mode_renderers/attachment_preview_renderer');
const createDataContainer = require('client/blocks/sdk/ui/create_data_container');
const classNames = require('classnames');
const cellValueUtils = require('client/blocks/sdk/models/cell_value_utils');

const {PropTypes} = React;

const CARD_PADDING = 12;

const styles = {
    cellValueAndFieldLabel: {
        verticalAlign: 'top',
    },
    fieldLabel: {
        lineHeight: '13px',
        fontSize: 11,
        color: '#898989',
    },
    cellValue: {
        lineHeight: '16px',
        marginTop: 6,
        fontSize: 12,
    },
};

const CellValueAndFieldLabel = createDataContainer(({record, cellValue, field, width}) => {
    return (
        <div
            className="borderBoxSizing relative inline-block m0 pr1"
            style={{
                width,
                ...styles.cellValueAndFieldLabel,
            }}>
            <div
                className="block textOverflowEllipsis uppercase small appFontWeightRegular"
                style={styles.fieldLabel}>
                {field.name}
            </div>
            <CellRenderer
                record={record}
                cellValue={cellValue}
                field={field}
                className="recordCardCellValue block textOverflowEllipsis"
                style={styles.cellValue}
            />
        </div>
    );
}, props => [
    {watch: props.field, key: ['name', 'config']},
]);

CellValueAndFieldLabel.propTypes = {
    record: PropTypes.instanceOf(RecordModel),

    // NOTE: this currently will not work for linked record fields, since CellRenderer
    // cannot currently handle all cell types.
    // TODO(jb): make the constraints for rendering cell values less strict than the
    // constraints we put on updating cell values.
    cellValue: PropTypes.any,
    field: PropTypes.instanceOf(FieldModel).isRequired,
    width: PropTypes.number.isRequired,
};

type RecordCardProps = {
    record?: RecordModel,
    cellValuesByFieldId?: {[key: string]: mixed},
    fields?: Array<FieldModel>,
    view?: ViewModel,
    attachmentCoverField?: FieldModel,
    width?: number,
    height?: number,
    onClick?: Function,
    className?: string,
    style?: Object,
};

// TODO(jb): move this stuff into the field model when we decide on an api for it.
const FormulaicFieldTypes = {
    [ApiFieldTypes.FORMULA]: true,
    [ApiFieldTypes.ROLLUP]: true,
    [ApiFieldTypes.LOOKUP]: true,
};
const isFieldFormulaic = (field: FieldModel): boolean => {
    return !!FormulaicFieldTypes[field.config.type];
};
const getFieldResultType = (field: FieldModel): string => {
    if (field.config.type === ApiFieldTypes.COUNT) {
        return ApiFieldTypes.NUMBER;
    }
    if (isFieldFormulaic(field)) {
        if (!field.config.options.resultConfig) {
            // Formula is misconfigured.
            return ApiFieldTypes.SINGLE_LINE_TEXT;
        } else {
            return field.config.options.resultConfig.type;
        }
    } else {
        return field.config.type;
    }
};

class RecordCard extends React.Component {
    constructor(props: RecordCardProps) {
        super(props);

        this._validateProps(props);
    }
    componentWillReceiveProps(nextProps: RecordCardProps) {
        this._validateProps(nextProps);
    }
    _validateProps(props: RecordCardProps) {
        const {record, cellValuesByFieldId, view, fields, attachmentCoverField} = props;

        if (record && record.isDeleted) {
            throw new Error('Record is deleted');
        }

        if (!record && !cellValuesByFieldId) {
            throw new Error('Must provide either record or cellValuesByFieldId');
        }

        if (record && attachmentCoverField) {
            if (attachmentCoverField.parentTable.id !== record.parentTable.id) {
                throw new Error('Attachment cover field must have the same parent table as record');
            }
        }

        if (record && fields) {
            for (const field of fields) {
                if (!field.isDeleted && field.parentTable.id !== record.parentTable.id) {
                    throw new Error('All fields must have the same parent table as record');
                }
            }
        }

        if (record && view && !view.isDeleted) {
            if (view.parentTable.id !== record.parentTable.id) {
                throw new Error('View must have the same parent table as record');
            }
        }
    }
    _getAttachmentCover(fieldsToUse: Array<FieldModel>): Object | null {
        const attachmentField = this._getAttachmentField(fieldsToUse);
        return attachmentField ? this._getFirstAttachmentInField(attachmentField) : null;
    }
    _getAttachmentField(fieldsToUse: Array<FieldModel>): FieldModel | null {
        const {attachmentCoverField, fields} = this.props;

        if (attachmentCoverField && !attachmentCoverField.isDeleted && this._isAttachment(attachmentCoverField)) {
            return attachmentCoverField;
        } else if (attachmentCoverField === undefined && !fields) {
            // The attachment field in this case is either coming from the view
            // if there is a view, or from the table's arbitrary field ordering
            // if there is no view.
            // TODO: use the real cover field if the view is gallery or kanban instead of
            // the first attachment field
            const firstAttachmentFieldInView = _.find(fieldsToUse, field => {
                return this._isAttachment(field);
            });
            return firstAttachmentFieldInView;
        } else {
            return null;
        }
    }
    _isAttachment(field: FieldModel): boolean {
        return getFieldResultType(field) === ApiFieldTypes.MULTIPLE_ATTACHMENTS;
    }
    _getRawCellValue(field: FieldModel): mixed {
        const {record, cellValuesByFieldId} = this.props;
        if (record) {
            return record.__getRawCellValue(field.id);
        } else {
            const publicCellValue = cellValuesByFieldId[field.id];
            return cellValueUtils.parsePublicCellValueForUpdate(publicCellValue, null, field);
        }
    }
    _getFirstAttachmentInField(attachmentField: FieldModel): Object | null {
        let attachmentsInField;
        if (attachmentField.config.type === ApiFieldTypes.LOOKUP) {
            const rawCellValue = ((this._getRawCellValue(attachmentField): any): Object); // eslint-disable-line flowtype/no-weak-types
            attachmentsInField = _.flattenDeep(_.values(rawCellValue ? rawCellValue.valuesByForeignRowId : {}));
        } else {
            attachmentsInField = ((this._getRawCellValue(attachmentField): any): Array<Object>); // eslint-disable-line flowtype/no-weak-types
        }
        return attachmentsInField && attachmentsInField.length > 0 ? attachmentsInField[0] : null;
    }
    _getFields(): Array<FieldModel> {
        const {view, fields, record} = this.props;

        let fieldsToUse;
        if (fields) {
            fieldsToUse = fields.filter(field => !field.isDeleted);
        } else if (view && !view.isDeleted) {
            fieldsToUse = view.visibleFields;
        } else if (record && !record.isDeleted) {
            const parentTable = record.parentTable;
            fieldsToUse = parentTable.fields;
        } else {
            console.warn('RecordCard: no fields, view, or record, so rendering an empty card'); // eslint-disable-line no-console
            fieldsToUse = [];
        }
        return _.uniqBy(fieldsToUse, field => field.id);
    }
    _getPossibleFieldsForCard(): Array<FieldModel> {
        const fields = this._getFields();

        // remove primary field if it exists
        return fields.filter(field => {
            return !field.isPrimaryField;
        });
    }
    _getWidthAndFieldIdArray(cellContainerWidth: number, fieldsToUse: Array<FieldModel>) {
        const widthAndFieldIdArray = [];
        let runningWidth = 0;

        for (const field of fieldsToUse) {
            const desiredWidth = columnTypeProvider.getDesiredCellWidthForRowCard(
                field.__getRawType(),
                field.__getRawTypeOptions(),
            );

            if (runningWidth + desiredWidth < cellContainerWidth) {
                widthAndFieldIdArray.push({width: desiredWidth, fieldId: field.id});
                runningWidth += desiredWidth;
            } else {
                const minWidth = columnTypeProvider.getMinCellWidthForRowCard(
                    field.__getRawType(),
                    field.__getRawTypeOptions(),
                );
                if (runningWidth + minWidth < cellContainerWidth) {
                    widthAndFieldIdArray.push({width: minWidth, fieldId: field.id});
                    runningWidth += minWidth;
                } else {
                    break;
                }
            }
        }

        if (runningWidth < cellContainerWidth && widthAndFieldIdArray.length > 0) {
            const lastWidthAndFieldId = widthAndFieldIdArray[widthAndFieldIdArray.length - 1];
            lastWidthAndFieldId.width += cellContainerWidth - runningWidth;
        }

        return widthAndFieldIdArray;
    }
    _renderCellsAndFieldLabels(attachmentSize: number, fieldsToUse: Array<FieldModel>) {
        const {record, cellValuesByFieldId, width} = this.props;

        const cellContainerWidth = width - CARD_PADDING - attachmentSize;
        const widthAndFieldIdArray = this._getWidthAndFieldIdArray(cellContainerWidth, fieldsToUse);
        const fieldsById = _.keyBy(fieldsToUse, o => o.id);

        return widthAndFieldIdArray.map(widthAndFieldId => {
            const field = fieldsById[widthAndFieldId.fieldId];
            return (
                <CellValueAndFieldLabel
                    key={field.id}
                    record={record}
                    cellValue={cellValuesByFieldId ? cellValuesByFieldId[field.id] : undefined}
                    field={field}
                    width={widthAndFieldId.width}
                />
            );
        });
    }
    render() {
        const {record, cellValuesByFieldId, width, height, onClick, className, style} = this.props;

        if (record && cellValuesByFieldId) {
            console.warn('RecordCard: given record and cellValuesByFieldId, choosing to render based on record'); // eslint-disable-line no-console
        }

        if (record && record.isDeleted) {
            return null;
        }

        const allFields = this._getFields();
        const fieldsToUse = this._getPossibleFieldsForCard();
        const attachmentObj = this._getAttachmentCover(fieldsToUse);
        const hasAttachment = !!attachmentObj;

        const containerClasses = classNames('white rounded relative block overflow-hidden cardBoxShadow', className, {
            pointer: !!onClick,
        });

        // use height as size in order to get square attachment
        const attachmentSize = hasAttachment ? height : 0;
        const imageHtml = hasAttachment
            ? attachmentPreviewRenderer.renderSquarePreview(attachmentObj, {
                extraClassString: 'absolute right-0 height-full overflow-hidden noevents',
                extraStyles: {
                    'border-top-right-radius': 2,
                    'border-bottom-right-radius': 2,
                },
                size: attachmentSize,
            })
            : '';

        const containerStyles = {
            ...style,
            width,
            height,
        };

        let primaryValue;
        let isUnnamed;

        let primaryCellValueAsString;
        if (record) {
            primaryCellValueAsString = record.primaryCellValueAsString;
        } else {
            const primaryField = allFields.length > 0 ? allFields[0].parentTable.primaryField : null;
            primaryCellValueAsString = primaryField ? cellValuesByFieldId[primaryField.id] : null;
        }
        if (h.utils.isNullOrUndefinedOrEmpty(primaryCellValueAsString)) {
            primaryValue = 'Unnamed record';
            isUnnamed = true;
        } else {
            primaryValue = primaryCellValueAsString;
            isUnnamed = false;
        }
        const primaryClasses = classNames('strong relative block cellValue textOverflowEllipsis mt0', {
            unnamed: isUnnamed,
        });
        const primaryStyles = {
            height: 18,
            fontSize: 14,
            lineHeight: '14px',
        };

        return (
            <div
                className={containerClasses}
                style={containerStyles}
                onClick={onClick}>
                <div className="absolute top-0 bottom-0 left-0 appFontColor" style={{
                    right: attachmentSize,
                    background: 'transparent',
                    padding: CARD_PADDING,
                }}>
                    <div className={primaryClasses} style={primaryStyles}>{primaryValue}</div>
                    <div className="absolute appFontColorLight" style={{
                        height: 32,
                        marginTop: 5,
                    }}>
                        {this._renderCellsAndFieldLabels(attachmentSize, fieldsToUse)}
                    </div>
                </div>
                <div dangerouslySetInnerHTML={{__html: imageHtml}} />
            </div>
        );
    }
}

RecordCard.propTypes = {
    // Should provide one of record and cellValuesByFieldId
    record: PropTypes.instanceOf(RecordModel),
    cellValuesByFieldId: PropTypes.object,

    // Should provide one of fields and view
    fields: PropTypes.arrayOf(
        PropTypes.instanceOf(FieldModel).isRequired,
    ),
    view: PropTypes.instanceOf(ViewModel),

    // This component will always respect attachmentCoverField if one is passed in.
    // Pass a null value to explicitly indicate that an attachment should not be
    // shown. If attachmentCoverField is undefined, it will fall back to using the
    // first attachment in the view provided (if a view is provided).
    attachmentCoverField: PropTypes.instanceOf(FieldModel),
    width: PropTypes.number,
    height: PropTypes.number,
    onClick: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
};

RecordCard.defaultProps = {
    width: 568,
    height: 80,
    className: '',
    style: {},
};

module.exports = createDataContainer(RecordCard, (props: RecordCardProps) => {
    return [
        {watch: props.record, key: 'primaryCellValue'},

        // It's safe to watch the record's parentTable since a record's
        // parent table never changes.
        props.record && {watch: props.record.parentTable, key: 'fields'},
        {watch: props.view, key: 'visibleFields'},
    ];
});
