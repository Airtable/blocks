/** @module @airtable/blocks/ui: RecordCard */ /** */
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import {isNullOrUndefinedOrEmpty, keyBy, uniqBy, FlowAnyObject, has} from '../private_utils';
import {invariant, spawnError} from '../error_utils';
import {AttachmentData} from '../types/attachment';
import {FieldType} from '../types/field';
import {RecordDef, RecordId} from '../types/record';
import Field from '../models/field';
import Record from '../models/record';
import View from '../models/view';
import ViewMetadataQueryResult from '../models/view_metadata_query_result';
import colorUtils from '../color_utils';
import Sdk from '../sdk';
import {baymax} from './baymax_utils';
import expandRecord, {ExpandRecordOpts} from './expand_record';
import Box from './box';
import CellRenderer from './cell_renderer';
import useWatchable from './use_watchable';
import withHooks from './with_hooks';
import useViewMetadata from './use_view_metadata';
import {isCommandModifierKeyEvent} from './key_codes';
import useStyledSystem from './use_styled_system';
import {
    flexItemSet,
    flexItemSetPropTypes,
    FlexItemSetProps,
    positionSet,
    positionSetPropTypes,
    PositionSetProps,
    margin,
    marginPropTypes,
    MarginProps,
} from './system';
import {splitStyleProps} from './with_styled_system';
import {tooltipAnchorPropTypes} from './types/tooltip_anchor_props';
import {useSdk} from './sdk_context';

const FALLBACK_RECORD_NAME_FOR_DISPLAY = 'Unnamed record';

/**
 * Style props for the {@link RecordCard} component. Accepts:
 * * {@link FlexItemSetProps}
 * * {@link MarginProps}
 * * {@link PositionSetProps}
 *
 * @noInheritDoc
 */
interface RecordCardStyleProps extends FlexItemSetProps, PositionSetProps, MarginProps {}

const styleParser = compose(flexItemSet, positionSet, margin);

export const recordCardStylePropTypes = {
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
};

const CARD_PADDING = 12;

/** @hidden */
interface CellValueAndFieldLabelProps {
    record?: Record | null;
    cellValue?: unknown;
    field: Field;
    width: number;
    renderInvalidCellValue?: (cellValue: unknown, field: Field) => React.ReactElement;
}

const CellValueAndFieldLabel = ({
    record,
    cellValue,
    field,
    width,
    renderInvalidCellValue,
}: CellValueAndFieldLabelProps) => {
    useWatchable(field, ['name', 'type', 'options']);

    return (
        <Box
            style={{verticalAlign: 'top'}}
            position="relative"
            display="inline-block"
            margin={0}
            paddingRight={2}
            width={width}
        >
            <Box
                className={baymax('caps truncate')}
                fontSize="11px"
                lineHeight="13px"
                textColor="#898989"
            >
                {field.name}
            </Box>
            <CellRenderer
                record={record}
                cellValue={cellValue}
                field={field}
                shouldWrap={false}
                cellClassName="recordCardCellValue truncate"
                cellStyle={{lineHeight: '16px', fontSize: '12px'}}
                renderInvalidCellValue={renderInvalidCellValue}
            />
        </Box>
    );
};

CellValueAndFieldLabel.propTypes = {
    record: PropTypes.instanceOf(Record),

    cellValue: PropTypes.any,
    field: PropTypes.instanceOf(Field).isRequired,
    width: PropTypes.number.isRequired,
    renderInvalidCellValue: PropTypes.func,
};

/**
 * Props for the {@link RecordCard} component. Also accepts:
 * * {@link RecordCardStyleProps}
 *
 * @noInheritDoc
 * @docsPath UI/components/RecordCard
 */
interface RecordCardProps extends RecordCardStyleProps {
    /** Record to display in the card. */
    record: Record | RecordDef;
    /** The view model to use for field order and record coloring. */
    view?: View;
    /** Attachment field to display as an image in the square preview for the card. If omitted or not an attachment field, it uses for the first attachment field in `fields`. If `fields` is not defined, it uses the first attachment field in the view. */
    attachmentCoverField?: Field;
    /** Width of the record card. */
    width?: number;
    /** Height of the record card. */
    height?: number;
    /** Options object for expanding a record. */
    expandRecordOptions?: ExpandRecordOpts | null;
    /** Fields to display in the card. The primary field is always displayed. */
    fields?: Array<Field>;
    /** Mouse enter event handler for the record card. */
    onMouseEnter?: ((e: React.MouseEvent<HTMLAnchorElement>) => unknown) | null;
    /** Mouse leave event handler for the record card. */
    onMouseLeave?: ((e: React.MouseEvent<HTMLAnchorElement>) => unknown) | null;
    /** Click event handler for the record card. If undefined, uses default behavior to expand record. If null, no operation is performed. */
    onClick?: ((e: React.MouseEvent<HTMLAnchorElement>) => unknown) | null;
    /** @hidden */
    hasOnClick?: boolean;
    /** Additional class names to apply to the record card. */
    className?: string;
    /** Additional styles to apply to the record card. */
    style?: React.CSSProperties;
    /** @internal injected by withHooks */
    viewMetadata: ViewMetadataQueryResult | null;
    /** Render function if provided and validation fails. */
    renderInvalidCellValue?: (cellValue: unknown, field: Field) => React.ReactElement;
    /** @internal injected by withHooks */
    sdk: Sdk;
}

const FormulaicFieldTypes = {
    [FieldType.FORMULA]: true,
    [FieldType.ROLLUP]: true,
    [FieldType.MULTIPLE_LOOKUP_VALUES]: true,
};
const isFieldFormulaic = (field: Field): boolean => {
    return has(FormulaicFieldTypes, field.type);
};
const getFieldResultType = (field: Field): string => {
    if (field.type === FieldType.COUNT) {
        return FieldType.NUMBER;
    }
    if (isFieldFormulaic(field)) {
        invariant(field.options, 'options');
        const result = field.options.result;
        if (typeof result === 'object' && result) {
            const resultType = (result as any).type;
            invariant(typeof resultType === 'string', 'resultType must be string');
            return resultType;
        } else {
            return FieldType.SINGLE_LINE_TEXT;
        }
    } else {
        return field.type;
    }
};

/**
 * @internal
 * Given a container size (ie, height of the record card), calculate the height and width of an
 * attachment thumbnail image to fit inside the square attachment preview. Left and top margin
 * are used to center non-square images.
 */
const calculateAttachmentDimensionsAndMargin = (
    attachment: AttachmentData | null,
    containerSize: number,
): Partial<{width: number; height: number; marginTop: number; marginLeft: number}> => {
    if (!attachment || !attachment.thumbnails || !attachment.thumbnails.large) {
        return {};
    }
    const {
        thumbnails: {
            large: {width: thumbWidth, height: thumbHeight},
        },
    } = attachment;

    const height = Math.min(containerSize, thumbHeight);
    const width = Math.round((thumbWidth * height) / thumbHeight);
    const marginTop = Math.round((containerSize - height) / 2);
    const marginLeft = Math.round((containerSize - width) / 2);

    return {height, width, marginTop, marginLeft};
};

/**
 * A card component that displays an Airtable record.
 *
 * [[ Story id="recordcard--example" title="RecordCard example" ]]
 *
 * @docsPath UI/components/RecordCard
 * @component
 */
export class RecordCard extends React.Component<RecordCardProps> {
    /** @hidden */
    static propTypes = {
        record: PropTypes.oneOfType([PropTypes.instanceOf(Record), PropTypes.object]),

        fields: PropTypes.arrayOf(PropTypes.instanceOf(Field).isRequired),
        view: PropTypes.instanceOf(View),

        attachmentCoverField: PropTypes.instanceOf(Field),
        width: PropTypes.number,
        height: PropTypes.number,
        className: PropTypes.string,
        style: PropTypes.object,
        expandRecordOptions: PropTypes.object,
        renderInvalidCellValue: PropTypes.func,
        ...tooltipAnchorPropTypes,
        ...recordCardStylePropTypes,
    };
    /** @hidden */
    static defaultProps = {
        width: 568,
        height: 80,
        className: '',
        style: {},
    };

    /** @hidden */
    constructor(props: RecordCardProps) {
        super(props);

        this._onClick = this._onClick.bind(this);
        this._validateProps(props);
    }
    /** @hidden */
    UNSAFE_componentWillReceiveProps(nextProps: RecordCardProps) {
        this._validateProps(nextProps);
    }
    /** @internal */
    _validateProps(props: RecordCardProps) {
        const {record, view, fields, attachmentCoverField} = props;

        if (record && record instanceof Record && record.isDeleted) {
            throw spawnError('Record %s is deleted', record.id);
        }

        if (!record) {
            throw spawnError('Must provide record');
        }

        if (record && record instanceof Record && attachmentCoverField) {
            if (attachmentCoverField.parentTable.id !== record.parentTable.id) {
                throw spawnError(
                    'Attachment cover field %s must have the same parent table as record (record ID %s, table ID %s)',
                    attachmentCoverField.id,
                    record.id,
                    record.parentTable.id,
                );
            }
        }

        if (record && record instanceof Record && fields) {
            for (const field of fields) {
                if (!field.isDeleted && field.parentTable.id !== record.parentTable.id) {
                    throw spawnError(
                        'Field %s must have the same parent table as record (record ID %s, table ID %s)',
                        field.id,
                        record.id,
                        record.parentTable.id,
                    );
                }
            }
        }

        if (record && record instanceof Record && view && !view.isDeleted) {
            if (view.parentTable.id !== record.parentTable.id) {
                throw spawnError(
                    'View %s must have the same parent table as record (record ID %s, table ID %s)',
                    view.id,
                    record.id,
                    record.parentTable.id,
                );
            }
        }
    }
    /** @internal */
    _onClick(e: React.MouseEvent<HTMLAnchorElement>): void {
        if (this.props.onClick) {
            this.props.onClick(e);
        }
        if (
            this.props.onClick === undefined ||
            this.props.hasOnClick === false 
        ) {

            const {record} = this.props;
            const recordModel = record && record instanceof Record ? record : null;
            if (recordModel) {
                if (isCommandModifierKeyEvent(e) || e.shiftKey) {
                } else {
                    e.preventDefault();
                    const opts = this.props.expandRecordOptions || {};
                    expandRecord(recordModel, opts);
                }
            }
        }
    }
    /** @internal */
    _getAttachmentCover(fieldsToUse: Array<Field>): AttachmentData | null {
        const attachmentField = this._getAttachmentField(fieldsToUse);
        return attachmentField ? this._getFirstAttachmentInField(attachmentField) : null;
    }
    /** @internal */
    _getAttachmentField(fieldsToUse: Array<Field>): Field | null {
        const {attachmentCoverField} = this.props;

        if (
            attachmentCoverField &&
            !attachmentCoverField.isDeleted &&
            this._isAttachment(attachmentCoverField)
        ) {
            return attachmentCoverField;
        } else if (attachmentCoverField === undefined) {
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
    /** @internal */
    _isAttachment(field: Field): boolean {
        return getFieldResultType(field) === FieldType.MULTIPLE_ATTACHMENTS;
    }
    /** @internal */
    _getCellValue(field: Field): unknown {
        const {record} = this.props;
        if (record && record instanceof Record) {
            return record.getCellValue(field.id);
        } else {
            const cellValue = record[field.id];

            if (!field.isComputed) {
                const airtableInterface = this.props.sdk.__airtableInterface;
                const appInterface = this.props.sdk.__appInterface;

                const validationResult = airtableInterface.fieldTypeProvider.validateCellValueForUpdate(
                    appInterface,
                    cellValue,
                    null,
                    field._data,
                );
                if (!validationResult.isValid) {
                    throw spawnError(validationResult.reason);
                }
            }

            return cellValue;
        }
    }
    /** @internal */
    _getFirstAttachmentInField(attachmentField: Field): AttachmentData | null {
        let attachmentsInField;
        if (attachmentField.type === FieldType.MULTIPLE_LOOKUP_VALUES) {
            const cellValue = this._getCellValue(attachmentField) as FlowAnyObject;
            attachmentsInField = cellValue
                ? cellValue.map((cv: {linkedRecordId: RecordId; value: unknown}) => cv.value)
                : [];
        } else {
            attachmentsInField = this._getCellValue(attachmentField) as Array<FlowAnyObject>;
        }
        return attachmentsInField && attachmentsInField.length > 0 ? attachmentsInField[0] : null;
    }
    /** @internal */
    _getFields(): Array<Field> {
        const {viewMetadata, fields, record} = this.props;

        let fieldsToUse: Array<Field>;
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
    /** @internal */
    _getPossibleFieldsForCard(): Array<Field> {
        const fields = this._getFields();

        return fields.filter(field => {
            return !field.isPrimaryField;
        });
    }
    /** @internal */
    _getWidthAndFieldIdArray(cellContainerWidth: number, fieldsToUse: Array<Field>) {
        const widthAndFieldIdArray = [];
        let runningWidth = 0;
        const airtableInterface = this.props.sdk.__airtableInterface;
        const appInterface = this.props.sdk.__appInterface;

        for (const field of fieldsToUse) {
            const uiConfig = airtableInterface.fieldTypeProvider.getUiConfig(
                appInterface,
                field._data,
            );
            const desiredWidth = uiConfig.desiredCellWidthForRecordCard;

            if (runningWidth + desiredWidth < cellContainerWidth) {
                widthAndFieldIdArray.push({width: desiredWidth, fieldId: field.id});
                runningWidth += desiredWidth;
            } else {
                const minCellWidth = uiConfig.minimumCellWidthForRecordCard;

                if (runningWidth + minCellWidth < cellContainerWidth) {
                    widthAndFieldIdArray.push({width: minCellWidth, fieldId: field.id});
                    runningWidth += minCellWidth;
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
    /** @internal */
    _getRecord(): Record | null {
        const {record} = this.props;
        if (record && record instanceof Record) {
            return record;
        } else {
            return null;
        }
    }
    /** @internal */
    _renderCellsAndFieldLabels(
        attachmentSize: number,
        fieldsToUse: Array<Field>,
    ): Array<React.ReactElement<React.ComponentProps<typeof CellValueAndFieldLabel>>> {
        const {record, width, renderInvalidCellValue} = this.props;
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
                    renderInvalidCellValue={renderInvalidCellValue}
                    {...(record instanceof Record ? {record} : {cellValue: record[field.id]})}
                />
            );
        });
    }
    /** @hidden */
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

        const containerClasses = cx(
            baymax('white rounded relative block overflow-hidden'),
            {
                [baymax('pointer cardBoxShadow')]: hasOnClick,
                [baymax('stroked1')]: !hasOnClick,
            },
            className,
        );

        invariant(typeof height === 'number', 'height in defaultProps');

        const attachmentSize = hasAttachment ? height : 0;

        let primaryValue;
        let isUnnamed;

        let recordName;
        let recordUrl;
        let recordColor;
        if (record instanceof Record) {
            recordUrl = record.url;
            recordName = record.name;
            if (view) {
                recordColor = record.getColorInView(view);
            }
        } else {
            const primaryField =
                allFields.length > 0 ? allFields[0].parentTable.primaryField : null;
            const primaryCellValue = primaryField ? record[primaryField.id] : null;
            recordName =
                primaryCellValue === null || primaryCellValue === undefined
                    ? null
                    : String(primaryCellValue);
        }
        if (isNullOrUndefinedOrEmpty(recordName)) {
            primaryValue = FALLBACK_RECORD_NAME_FOR_DISPLAY;
            isUnnamed = true;
        } else {
            primaryValue = recordName;
            isUnnamed = false;
        }

        const attachmentDimensionsAndPosition = calculateAttachmentDimensionsAndMargin(
            attachmentObjIfAvailable,
            attachmentSize,
        );
        return (
            <a
                href={onClick === undefined && recordUrl ? recordUrl : undefined}
                className={containerClasses}
                style={{...style, width, height}}
                onClick={this._onClick}
                onMouseEnter={onMouseEnter || undefined}
                onMouseLeave={onMouseLeave || undefined}
            >
                <Box
                    right={`${attachmentSize}px`}
                    backgroundColor="transparent"
                    padding={`${CARD_PADDING}px`}
                    position="absolute"
                    top={0}
                    bottom={0}
                    left={0}
                    textColor="dark"
                >
                    <Box
                        className={cx({unnamed: isUnnamed})}
                        fontWeight={500}
                        position="relative"
                        marginTop={0}
                        display="flex"
                        alignItems="center"
                        lineHeight={1.5}
                        height="18px"
                        fontSize="14px"
                    >
                        {recordColor && (
                            <Box
                                width="6px"
                                height="20px"
                                flex="none"
                                marginRight={1}
                                borderRadius="circle"
                                backgroundColor={colorUtils.getHexForColor(recordColor)}
                            />
                        )}
                        <Box className={baymax('truncate')} flex="auto">
                            {primaryValue}
                        </Box>
                    </Box>
                    <Box textColor="#555555" position="absolute" marginTop="3px">
                        {this._renderCellsAndFieldLabels(attachmentSize, fieldsToUse)}
                    </Box>
                </Box>
                {attachmentObjIfAvailable &&
                    attachmentObjIfAvailable.thumbnails &&
                    attachmentObjIfAvailable.thumbnails.large && (
                        <Box
                            className={baymax('noevents')}
                            style={{
                                borderTopRightRadius: 2,
                                borderBottomRightRadius: 2,
                            }}
                            height={`${attachmentSize}px`}
                            width={`${attachmentSize}px`}
                            position="absolute"
                            right="0"
                            overflow="hidden"
                        >
                            <img
                                draggable={false}
                                height={attachmentDimensionsAndPosition.height}
                                width={attachmentDimensionsAndPosition.width}
                                style={{
                                    marginTop: attachmentDimensionsAndPosition.marginTop,
                                    marginLeft: attachmentDimensionsAndPosition.marginLeft,
                                }}
                                src={attachmentObjIfAvailable.thumbnails.large.url}
                            />
                        </Box>
                    )}
            </a>
        );
    }
}

export default withHooks<
    {viewMetadata: ViewMetadataQueryResult | null; sdk: Sdk},
    RecordCardProps,
    RecordCard
>(RecordCard, props => {
    const {styleProps, nonStyleProps} = splitStyleProps<
        Omit<RecordCardProps, 'viewMetadata' | 'sdk'>,
        RecordCardStyleProps
    >(props, styleParser.propNames);

    const {record, fields, view, className} = nonStyleProps;
    const classNameForStyledProps = useStyledSystem<RecordCardStyleProps>(styleProps, styleParser);

    const recordModel = record && record instanceof Record ? record : null;
    let parentTable = null;
    if (recordModel) {
        parentTable = recordModel.parentTable;
    } else if (fields && fields.length > 0) {
        parentTable = fields[0].parentTable;
    } else if (view) {
        parentTable = view.parentTable;
    }

    useWatchable(recordModel, ['name', view ? `colorInView:${view.id}` : null]);
    useWatchable(parentTable, ['fields']);

    const viewMetadata = useViewMetadata(view);
    const sdk = useSdk();

    return {
        viewMetadata,
        className: cx(classNameForStyledProps, className),
        sdk,
    };
});
