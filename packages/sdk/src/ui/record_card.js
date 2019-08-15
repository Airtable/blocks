// @flow
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as React from 'react';
import getSdk from '../get_sdk';
import {values, isNullOrUndefinedOrEmpty, flattenDeep, keyBy, uniqBy} from '../private_utils';
import {invariant, spawnError} from '../error_utils';
import {type AttachmentData} from '../types/attachment';
import {FieldTypes} from '../types/field';
import {type RecordDef} from '../types/record';
import Field from '../models/field';
import Record from '../models/record';
import View from '../models/view';
import type ViewMetadataQueryResult from '../models/view_metadata_query_result';
import cellValueUtils from '../models/cell_value_utils';
import expandRecord, {type ExpandRecordOpts} from './expand_record';
import CellRenderer from './cell_renderer';
import useWatchable from './use_watchable';
import withHooks from './with_hooks';
import useViewMetadata from './use_view_metadata';

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
    record: Record | null,
    cellValue: mixed,
    field: Field,
    width: number,
|};

const CellValueAndFieldLabel = ({record, cellValue, field, width}: CellValueAndFieldLabelProps) => {
    useWatchable(field, ['name', 'type', 'options']);

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
};

CellValueAndFieldLabel.propTypes = {
    record: PropTypes.instanceOf(Record),

    cellValue: PropTypes.any,
    field: PropTypes.instanceOf(Field).isRequired,
    width: PropTypes.number.isRequired,
};

/** @typedef */
type RecordCardProps = {
    record: Record | RecordDef,
    fields?: Array<Field>,
    view?: View,
    attachmentCoverField?: Field,
    width?: number,
    height?: number,
    onClick?: Function,
    getExpandRecordOptions?: Record => ExpandRecordOpts,
    onMouseEnter?: mixed,
    onMouseLeave?: mixed,
    className?: string,
    style?: Object,

    /** @private injected by withHooks */
    viewMetadata: ViewMetadataQueryResult | null,
};

const FormulaicFieldTypes = {
    [FieldTypes.FORMULA]: true,
    [FieldTypes.ROLLUP]: true,
    [FieldTypes.LOOKUP]: true,
};
const isFieldFormulaic = (field: Field): boolean => {
    return !!FormulaicFieldTypes[field.type];
};
const getFieldResultType = (field: Field): string => {
    if (field.type === FieldTypes.COUNT) {
        return FieldTypes.NUMBER;
    }
    if (isFieldFormulaic(field)) {
        invariant(field.options, 'options');
        const resultConfig = field.options.resultConfig;
        if (resultConfig && typeof resultConfig === 'object') {
            const resultConfigType = resultConfig.type;
            invariant(typeof resultConfigType === 'string', 'resultConfigType must be string');
            return resultConfigType;
        } else {
            return FieldTypes.SINGLE_LINE_TEXT;
        }
    } else {
        return field.type;
    }
};

/** */
class RecordCard extends React.Component<RecordCardProps> {
    static propTypes = {
        record: PropTypes.oneOfType([PropTypes.instanceOf(Record), PropTypes.object]),

        fields: PropTypes.arrayOf(PropTypes.instanceOf(Field).isRequired),
        view: PropTypes.instanceOf(View),

        attachmentCoverField: PropTypes.instanceOf(Field),
        width: PropTypes.number,
        height: PropTypes.number,
        onClick: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
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

        if (record && record instanceof Record && record.isDeleted) {
            throw spawnError('Record is deleted');
        }

        if (!record) {
            throw spawnError('Must provide record');
        }

        if (record && record instanceof Record && attachmentCoverField) {
            if (attachmentCoverField.parentTable.id !== record.parentTable.id) {
                throw spawnError(
                    'Attachment cover field must have the same parent table as record',
                );
            }
        }

        if (record && record instanceof Record && fields) {
            for (const field of fields) {
                if (!field.isDeleted && field.parentTable.id !== record.parentTable.id) {
                    throw spawnError('All fields must have the same parent table as record');
                }
            }
        }

        if (record && record instanceof Record && view && !view.isDeleted) {
            if (view.parentTable.id !== record.parentTable.id) {
                throw spawnError('View must have the same parent table as record');
            }
        }
    }
    _onClick(e: SyntheticMouseEvent<>): void {
        if (this.props.onClick) {
            this.props.onClick(e);
        } else if (this.props.onClick === undefined) {

            const {record} = this.props;
            const recordModel = record && record instanceof Record ? record : null;
            if (recordModel) {
                if (keyCodeUtils.isCommandModifierKeyEvent(e) || e.shiftKey) {
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
    _getAttachmentCover(fieldsToUse: Array<Field>): Object | null {
        const attachmentField = this._getAttachmentField(fieldsToUse);
        return attachmentField ? this._getFirstAttachmentInField(attachmentField) : null;
    }
    _getAttachmentField(fieldsToUse: Array<Field>): Field | null {
        const {attachmentCoverField, fields} = this.props;

        if (
            attachmentCoverField &&
            !attachmentCoverField.isDeleted &&
            this._isAttachment(attachmentCoverField)
        ) {
            return attachmentCoverField;
        } else if (attachmentCoverField === undefined && !fields) {
            const firstAttachmentFieldInView = fieldsToUse.find(field => {
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
    _isAttachment(field: Field): boolean {
        return getFieldResultType(field) === FieldTypes.MULTIPLE_ATTACHMENTS;
    }
    _getRawCellValue(field: Field): mixed {
        const {record} = this.props;
        if (record && record instanceof Record) {
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
    _getFirstAttachmentInField(attachmentField: Field): Object | null {
        let attachmentsInField;
        if (attachmentField.type === FieldTypes.LOOKUP) {
            const rawCellValue = ((this._getRawCellValue(attachmentField): any): Object); // eslint-disable-line flowtype/no-weak-types
            attachmentsInField = flattenDeep(
                values(rawCellValue ? rawCellValue.valuesByForeignRowId : {}),
            );
        } else {
            attachmentsInField = ((this._getRawCellValue(attachmentField): any): Array<Object>); // eslint-disable-line flowtype/no-weak-types
        }
        return attachmentsInField && attachmentsInField.length > 0 ? attachmentsInField[0] : null;
    }
    _getFields(): Array<Field> {
        const {viewMetadata, fields, record} = this.props;

        let fieldsToUse;
        if (fields) {
            fieldsToUse = fields.filter(field => !field.isDeleted);
        } else if (viewMetadata && !viewMetadata.isDeleted) {
            fieldsToUse = viewMetadata.visibleFields;
        } else if (record && record instanceof Record && !record.isDeleted) {
            const parentTable = record.parentTable;
            fieldsToUse = parentTable.fields;
        } else {
            console.warn('RecordCard: no fields, view, or record, so rendering an empty card'); // eslint-disable-line no-console
            fieldsToUse = [];
        }
        return uniqBy(fieldsToUse, field => field.id);
    }
    _getPossibleFieldsForCard(): Array<Field> {
        const fields = this._getFields();

        return fields.filter(field => {
            return !field.isPrimaryField;
        });
    }
    _getWidthAndFieldIdArray(cellContainerWidth: number, fieldsToUse: Array<Field>) {
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
    _getRecord(): Record | null {
        const {record} = this.props;
        if (record && record instanceof Record) {
            return record;
        } else {
            return null;
        }
    }
    _renderCellsAndFieldLabels(
        attachmentSize: number,
        fieldsToUse: Array<Field>,
    ): Array<React.Element<typeof CellValueAndFieldLabel>> {
        const {record, width} = this.props;
        invariant(typeof width === 'number', 'width in defaultProps');

        const cellContainerWidth = width - CARD_PADDING - attachmentSize;
        const widthAndFieldIdArray = this._getWidthAndFieldIdArray(cellContainerWidth, fieldsToUse);
        const fieldsById = keyBy(fieldsToUse, o => o.id);

        return widthAndFieldIdArray.map(widthAndFieldId => {
            const field = fieldsById[widthAndFieldId.fieldId];
            return (
                <CellValueAndFieldLabel
                    key={field.id}
                    field={field}
                    width={widthAndFieldId.width}
                    {...(record instanceof Record ? {record} : {cellValue: record[field.id]})}
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

        if (record && record instanceof Record && record.isDeleted) {
            return null;
        }

        const allFields = this._getFields();
        const fieldsToUse = this._getPossibleFieldsForCard();
        const attachmentObjIfAvailable = this._getAttachmentCover(fieldsToUse);
        const hasAttachment = !!attachmentObjIfAvailable;

        const hasOnClick = !!onClick || !!this._getRecord();

        const containerClasses = classNames(
            'white rounded relative block overflow-hidden',
            {
                'pointer cardBoxShadow': hasOnClick,
                stroked1: !hasOnClick,
            },
            className,
        );

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

            const attachmentObj: AttachmentData = (attachmentObjIfAvailable: any); // eslint-disable-line flowtype/no-weak-types
            const userScopedAppInterface = getSdk().__appInterface;
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
        if (record instanceof Record) {
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
        if (isNullOrUndefinedOrEmpty(primaryCellValueAsString)) {
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

export default withHooks<
    RecordCardProps,
    {|viewMetadata: ViewMetadataQueryResult | null|},
    RecordCard,
>(RecordCard, props => {
    const recordModel = props.record && props.record instanceof Record ? props.record : null;
    let parentTable = null;
    if (recordModel) {
        parentTable = recordModel.parentTable;
    } else if (props.fields && props.fields.length > 0) {
        parentTable = props.fields[0].parentTable;
    } else if (props.view) {
        parentTable = props.view.parentTable;
    }

    useWatchable(recordModel, [
        'primaryCellValue',
        props.view ? `colorInView:${props.view.id}` : null,
    ]);
    useWatchable(parentTable, ['fields']);

    const viewMetadata = useViewMetadata(props.view);

    return {viewMetadata};
});
