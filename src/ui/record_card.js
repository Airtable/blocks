// @flow
import invariant from 'invariant';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {type AttachmentObj} from 'client_server_shared/types/app_json/attachment_obj';
import * as React from 'react';
import FieldTypes from '../types/field_types';
import FieldModel from '../models/field';
import RecordModel, {type RecordDef} from '../models/record';
import ViewModel from '../models/view';
import cellValueUtils from '../models/cell_value_utils';
import createDataContainer from './create_data_container';
import expandRecord, {type ExpandRecordOpts} from './expand_record';
import CellRenderer from './cell_renderer';

const {u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const columnTypeProvider = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/column_type_provider',
);
const attachmentPreviewRenderer = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/read_mode_renderers/attachment_preview_renderer',
);
const keyCodeUtils = window.__requirePrivateModuleFromAirtable('client/mylib/key_code_utils');
const {FALLBACK_ROW_NAME_FOR_DISPLAY} = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/client_server_shared_config_settings',
);

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
        fontSize: 12,
    },
};

type CellValueAndFieldLabelProps = {|
    record: RecordModel | null,
    cellValue: mixed,
    field: FieldModel,
    width: number,
|};

const CellValueAndFieldLabel = createDataContainer(
    ({record, cellValue, field, width}: CellValueAndFieldLabelProps) => {
        return (
            <div
                className="borderBoxSizing relative inline-block m0 pr1"
                style={{
                    width,
                    ...styles.cellValueAndFieldLabel,
                }}
            >
                <div
                    className="block textOverflowEllipsis uppercase small appFontWeightRegular"
                    style={styles.fieldLabel}
                >
                    {field.name}
                </div>
                <CellRenderer
                    record={record}
                    cellValue={cellValue}
                    field={field}
                    shouldWrap={false}
                    className="recordCardCellValue block textOverflowEllipsis"
                    style={styles.cellValue}
                />
            </div>
        );
    },
    props => [{watch: props.field, key: ['name', 'config']}],
);

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
    record: RecordModel | RecordDef,
    fields?: Array<FieldModel>,
    view?: ViewModel,
    attachmentCoverField?: FieldModel,
    width?: number,
    height?: number,
    onClick?: Function,
    getExpandRecordOptions?: RecordModel => ExpandRecordOpts,
    onMouseEnter?: mixed,
    onMouseLeave?: mixed,
    className?: string,
    style?: Object,
};

// TODO(jb): move this stuff into the field model when we decide on an api for it.
const FormulaicFieldTypes = {
    [FieldTypes.FORMULA]: true,
    [FieldTypes.ROLLUP]: true,
    [FieldTypes.LOOKUP]: true,
};
const isFieldFormulaic = (field: FieldModel): boolean => {
    return !!FormulaicFieldTypes[field.config.type];
};
const getFieldResultType = (field: FieldModel): string => {
    if (field.config.type === FieldTypes.COUNT) {
        return FieldTypes.NUMBER;
    }
    if (isFieldFormulaic(field)) {
        invariant(field.config.options, 'options');
        if (!field.config.options.resultConfig) {
            // Formula is misconfigured.
            return FieldTypes.SINGLE_LINE_TEXT;
        } else {
            return field.config.options.resultConfig.type;
        }
    } else {
        return field.config.type;
    }
};

/** */
class RecordCard extends React.Component<RecordCardProps> {
    static propTypes = {
        // Record can either be a record model or a record def (cellValuesByFieldId)
        record: PropTypes.oneOfType([PropTypes.instanceOf(RecordModel), PropTypes.object]),

        // Should provide one of fields and view
        fields: PropTypes.arrayOf(PropTypes.instanceOf(FieldModel).isRequired),
        view: PropTypes.instanceOf(ViewModel),

        // This component will always respect attachmentCoverField if one is passed in.
        // Pass a null value to explicitly indicate that an attachment should not be
        // shown. If attachmentCoverField is undefined, it will fall back to using the
        // first attachment in the view provided (if a view is provided).
        attachmentCoverField: PropTypes.instanceOf(FieldModel),
        width: PropTypes.number,
        height: PropTypes.number,
        onClick: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        // TODO: add all other mouse events: https://facebook.github.io/react/docs/events.html#mouse-events
        className: PropTypes.string,
        style: PropTypes.object,
        getExpandRecordOptions: PropTypes.func,
    };
    static defaultProps = {
        width: 568,
        height: 80,
        className: '',
        style: {},
    };

    _onClick: (e: SyntheticMouseEvent<>) => void;
    constructor(props: RecordCardProps) {
        super(props);

        this._onClick = this._onClick.bind(this);
        this._validateProps(props);
    }
    UNSAFE_componentWillReceiveProps(nextProps: RecordCardProps) {
        this._validateProps(nextProps);
    }
    _validateProps(props: RecordCardProps) {
        const {record, view, fields, attachmentCoverField} = props;

        if (record && record instanceof RecordModel && record.isDeleted) {
            throw new Error('Record is deleted');
        }

        if (!record) {
            throw new Error('Must provide record');
        }

        if (record && record instanceof RecordModel && attachmentCoverField) {
            if (attachmentCoverField.parentTable.id !== record.parentTable.id) {
                throw new Error('Attachment cover field must have the same parent table as record');
            }
        }

        if (record && record instanceof RecordModel && fields) {
            for (const field of fields) {
                if (!field.isDeleted && field.parentTable.id !== record.parentTable.id) {
                    throw new Error('All fields must have the same parent table as record');
                }
            }
        }

        if (record && record instanceof RecordModel && view && !view.isDeleted) {
            if (view.parentTable.id !== record.parentTable.id) {
                throw new Error('View must have the same parent table as record');
            }
        }
    }
    _onClick(e: SyntheticMouseEvent<>): void {
        if (this.props.onClick) {
            this.props.onClick(e);
        } else if (this.props.onClick === undefined) {
            // NOTE: `null` disables the default click behavior.

            const {record} = this.props;
            const recordModel = record && record instanceof RecordModel ? record : null;
            if (recordModel) {
                if (keyCodeUtils.isCommandModifierKeyEvent(e) || e.shiftKey) {
                    // No-op, let the <a> tag handle opening in new tab or window.
                } else {
                    e.preventDefault();
                    const opts = this.props.getExpandRecordOptions
                        ? this.props.getExpandRecordOptions(recordModel)
                        : {};
                    expandRecord(recordModel, opts);
                }
            }
        }
    }
    _getAttachmentCover(fieldsToUse: Array<FieldModel>): Object | null {
        const attachmentField = this._getAttachmentField(fieldsToUse);
        return attachmentField ? this._getFirstAttachmentInField(attachmentField) : null;
    }
    _getAttachmentField(fieldsToUse: Array<FieldModel>): FieldModel | null {
        const {attachmentCoverField, fields} = this.props;

        if (
            attachmentCoverField &&
            !attachmentCoverField.isDeleted &&
            this._isAttachment(attachmentCoverField)
        ) {
            return attachmentCoverField;
        } else if (attachmentCoverField === undefined && !fields) {
            // The attachment field in this case is either coming from the view
            // if there is a view, or from the table's arbitrary field ordering
            // if there is no view.
            // TODO: use the real cover field if the view is gallery or kanban instead of
            // the first attachment field
            const firstAttachmentFieldInView = u.find(fieldsToUse, field => {
                return this._isAttachment(field);
            });
            if (firstAttachmentFieldInView === undefined) {
                return null;
            }
            return firstAttachmentFieldInView;
        } else {
            return null;
        }
    }
    _isAttachment(field: FieldModel): boolean {
        return getFieldResultType(field) === FieldTypes.MULTIPLE_ATTACHMENTS;
    }
    _getRawCellValue(field: FieldModel): mixed {
        const {record} = this.props;
        if (record && record instanceof RecordModel) {
            return record.__getRawCellValue(field.id);
        } else {
            let publicCellValue = record[field.id];
            cellValueUtils.validatePublicCellValueForUpdate(publicCellValue, null, field);
            publicCellValue = cellValueUtils.normalizePublicCellValueForUpdate(
                publicCellValue,
                field,
            );
            return cellValueUtils.parsePublicApiCellValue(publicCellValue, field);
        }
    }
    _getFirstAttachmentInField(attachmentField: FieldModel): Object | null {
        let attachmentsInField;
        if (attachmentField.config.type === FieldTypes.LOOKUP) {
            const rawCellValue = ((this._getRawCellValue(attachmentField): any): Object); // eslint-disable-line flowtype/no-weak-types
            attachmentsInField = u.flattenDeep(
                u.values(rawCellValue ? rawCellValue.valuesByForeignRowId : {}),
            );
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
        } else if (record && record instanceof RecordModel && !record.isDeleted) {
            const parentTable = record.parentTable;
            fieldsToUse = parentTable.fields;
        } else {
            console.warn('RecordCard: no fields, view, or record, so rendering an empty card'); // eslint-disable-line no-console
            fieldsToUse = [];
        }
        return u.uniqBy(fieldsToUse, field => field.id);
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
    _getRecordModel(): RecordModel | null {
        const {record} = this.props;
        if (record && record instanceof RecordModel) {
            return record;
        } else {
            return null;
        }
    }
    _renderCellsAndFieldLabels(
        attachmentSize: number,
        fieldsToUse: Array<FieldModel>,
    ): Array<React.Element<typeof CellValueAndFieldLabel>> {
        const {record, width} = this.props;
        invariant(typeof width === 'number', 'width in defaultProps');

        const cellContainerWidth = width - CARD_PADDING - attachmentSize;
        const widthAndFieldIdArray = this._getWidthAndFieldIdArray(cellContainerWidth, fieldsToUse);
        const fieldsById = u.keyBy(fieldsToUse, o => o.id);

        return widthAndFieldIdArray.map(widthAndFieldId => {
            const field = fieldsById[widthAndFieldId.fieldId];
            return (
                <CellValueAndFieldLabel
                    key={field.id}
                    field={field}
                    width={widthAndFieldId.width}
                    {...(record instanceof RecordModel ? {record} : {cellValue: record[field.id]})}
                />
            );
        });
    }
    render() {
        const {
            record,
            view,
            width,
            height,
            onClick,
            onMouseEnter,
            onMouseLeave,
            className,
            style,
        } = this.props;

        if (record && record instanceof RecordModel && record.isDeleted) {
            return null;
        }

        const allFields = this._getFields();
        const fieldsToUse = this._getPossibleFieldsForCard();
        const attachmentObjIfAvailable = this._getAttachmentCover(fieldsToUse);
        const hasAttachment = !!attachmentObjIfAvailable;

        const hasOnClick = !!onClick || !!this._getRecordModel();

        const containerClasses = classNames(
            'white rounded relative block overflow-hidden',
            {
                'pointer cardBoxShadow': hasOnClick,
                stroked1: !hasOnClick,
            },
            className,
        );

        // use height as size in order to get square attachment
        invariant(typeof height === 'number', 'height in defaultProps');
        const attachmentSize = hasAttachment ? height : 0;
        let imageHtml = '';
        if (hasAttachment) {
            const attachmentField = this._getAttachmentField(fieldsToUse);
            invariant(
                attachmentField,
                'attachmentField must be present when we have an attachment',
            );
            invariant(
                attachmentObjIfAvailable,
                'attachmentObjIfAvailable is defined if hasAttachment',
            );

            const attachmentObj: AttachmentObj = (attachmentObjIfAvailable: any); // eslint-disable-line flowtype/no-weak-types
            const userScopedAppInterface = attachmentField.parentTable.parentBase.__appInterface;
            imageHtml = attachmentPreviewRenderer.renderSquarePreview(
                attachmentObj,
                userScopedAppInterface,
                {
                    extraClassString: 'absolute right-0 height-full overflow-hidden noevents',
                    extraStyles: {
                        'border-top-right-radius': 2,
                        'border-bottom-right-radius': 2,
                    },
                    size: attachmentSize,
                },
            );
        }

        const containerStyles = {
            ...style,
            width,
            height,
        };

        let primaryValue;
        let isUnnamed;

        let primaryCellValueAsString;
        let recordUrl;
        let recordColorClass;
        if (record instanceof RecordModel) {
            recordUrl = record.url;
            primaryCellValueAsString = record.primaryCellValueAsString;
            if (view) {
                recordColorClass = record.getColorInView(view);
            }
        } else {
            const primaryField =
                allFields.length > 0 ? allFields[0].parentTable.primaryField : null;
            const primaryCellValue = primaryField ? record[primaryField.id] : null;
            primaryCellValueAsString =
                primaryCellValue === null || primaryCellValue === undefined
                    ? null
                    : String(primaryCellValue);
        }
        if (u.isNullOrUndefinedOrEmpty(primaryCellValueAsString)) {
            primaryValue = FALLBACK_ROW_NAME_FOR_DISPLAY;
            isUnnamed = true;
        } else {
            primaryValue = primaryCellValueAsString;
            isUnnamed = false;
        }
        const primaryClasses = classNames(
            'strong relative cellValue mt0 flex items-center line-height-4',
            {
                unnamed: isUnnamed,
            },
        );
        const primaryStyles = {
            height: 18,
            fontSize: 14,
        };

        return (
            <a
                href={onClick === undefined && recordUrl ? recordUrl : undefined}
                className={containerClasses}
                style={containerStyles}
                onClick={this._onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <div
                    className="absolute top-0 bottom-0 left-0 appFontColor"
                    style={{
                        right: attachmentSize,
                        background: 'transparent',
                        padding: CARD_PADDING,
                    }}
                >
                    <div className={primaryClasses} style={primaryStyles}>
                        {recordColorClass && (
                            <div
                                className={`flex-none pill mr-half ${recordColorClass}`}
                                style={{width: 6, height: 20}}
                            />
                        )}
                        <div className="flex-auto truncate">{primaryValue}</div>
                    </div>
                    <div
                        className="absolute appFontColorLight"
                        style={{
                            marginTop: 3,
                        }}
                    >
                        {this._renderCellsAndFieldLabels(attachmentSize, fieldsToUse)}
                    </div>
                </div>
                <div dangerouslySetInnerHTML={{__html: imageHtml}} />
            </a>
        );
    }
}

export default createDataContainer(RecordCard, (props: RecordCardProps) => {
    const recordModel = props.record && props.record instanceof RecordModel ? props.record : null;
    let parentTable;
    if (recordModel) {
        parentTable = recordModel.parentTable;
    } else if (props.fields && props.fields.length > 0) {
        parentTable = props.fields[0].parentTable;
    } else if (props.view) {
        parentTable = props.view.parentTable;
    }
    return [
        {watch: recordModel, key: 'primaryCellValue'},
        props.view && {watch: recordModel, key: `colorInView:${props.view.id}`},

        // It's safe to watch the record's parentTable since a record's
        // parent table never changes.
        {watch: parentTable, key: 'fields'},
        {watch: props.view, key: 'visibleFields'},
    ];
});
