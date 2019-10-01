// @flow
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
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
import colorUtils from '../color_utils';
import {baymax} from './baymax_utils';
import expandRecord, {type ExpandRecordOpts} from './expand_record';
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
    type FlexItemSetProps,
    positionSet,
    positionSetPropTypes,
    type PositionSetProps,
    margin,
    marginPropTypes,
    type MarginProps,
} from './system';
import {splitStyleProps} from './with_styled_system';
import {tooltipAnchorPropTypes, type TooltipAnchorProps} from './types/tooltip_anchor_props';

const columnTypeProvider = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/column_type_provider',
);

const FALLBACK_ROW_NAME_FOR_DISPLAY = 'Unnamed record';

type StyleProps = {|
    ...FlexItemSetProps,
    ...PositionSetProps,
    ...MarginProps,
|};

const styleParser = compose(
    flexItemSet,
    positionSet,
    margin,
);

const stylePropTypes = {
    ...flexItemSetPropTypes,
    ...positionSetPropTypes,
    ...marginPropTypes,
};

const CARD_PADDING = 12;

type CellValueAndFieldLabelProps = {|
    record: Record | null,
    cellValue: mixed,
    field: Field,
    width: number,
|};

const CellValueAndFieldLabel = ({record, cellValue, field, width}: CellValueAndFieldLabelProps) => {
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
            />
        </Box>
    );
};

CellValueAndFieldLabel.propTypes = {
    record: PropTypes.instanceOf(Record),

    // NOTE: this currently will not work for linked record fields, since CellRenderer
    // cannot currently handle all cell types.
    // TODO(jb): make the constraints for rendering cell values less strict than the
    // constraints we put on updating cell values.
    cellValue: PropTypes.any,
    field: PropTypes.instanceOf(Field).isRequired,
    width: PropTypes.number.isRequired,
};

/**
 * @typedef {object} RecordCardProps
 * @property {Record} record Record to display in the card.
 * @property {Array.<Field>} [fields] Fields to display in the card. The primary field is always displayed.
 * @property {View} [view] The view model to use for field order and record coloring.
 * @property {Field} [attachmentCoverField] Attachment field to display as an image in the square preview for the card. If omitted or not an attachment field, it uses for the first attachment field in `fields`. If `fields` is not defined, it uses the first attachment field in the view.
 * @property {number} [width] Width of the record card.
 * @property {number} [height] Height of the record card.
 * @property {object} [expandRecordOptions] Options object for expanding a record.
 * @property {Array.<Record>} [expandRecordOptions.records] List of all records, used for cycling through records in the same expanded record window.
 * @property {function} [onClick] Click event handler for the record card. If undefined, uses default behavior to expand record. If null, no operation is performed.
 * @property {function} [onMouseEnter] Mouse enter event handler for the record card.
 * @property {function} [onMouseLeave] Mouse leave event handler for the record card.
 * @property {string} [className] Additional class names to apply to the record card.
 * @property {object} [style] Additional styles to apply to the record card.
 */
type RecordCardProps = {|
    record: Record | RecordDef,
    fields?: Array<Field>,
    view?: View,
    attachmentCoverField?: Field,
    width?: number,
    height?: number,
    expandRecordOptions?: ExpandRecordOpts | null,
    onClick?: ((e: SyntheticMouseEvent<HTMLAnchorElement>) => mixed) | null,
    onMouseEnter?: ((e: SyntheticMouseEvent<HTMLAnchorElement>) => mixed) | null,
    onMouseLeave?: ((e: SyntheticMouseEvent<HTMLAnchorElement>) => mixed) | null,
    className?: string,
    style?: {[string]: mixed},

    /** @private injected by withHooks */
    viewMetadata: ViewMetadataQueryResult | null,
    ...TooltipAnchorProps,
    ...StyleProps,
|};

// TODO(jb): move this stuff into the field model when we decide on an api for it.
const FormulaicFieldTypes = {
    [FieldTypes.FORMULA]: true,
    [FieldTypes.ROLLUP]: true,
    [FieldTypes.MULTIPLE_LOOKUP_VALUES]: true,
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
            // Formula is misconfigured.
            return FieldTypes.SINGLE_LINE_TEXT;
        }
    } else {
        return field.type;
    }
};

/**
 * @private
 * Given a container size (ie, height of the record card), calculate the height and width of an
 * attachment thumbnail image to fit inside the square attachment preview. Left and top margin
 * are used to center non-square images.
 */
const calculateAttachmentDimensionsAndMargin = (
    attachment: AttachmentData | null,
    containerSize: number,
): $Shape<{width: number, height: number, marginTop: number, marginLeft: number}> => {
    if (!attachment || !attachment.largeThumbUrl) {
        return {};
    }
    const {largeThumbHeight: thumbHeight, largeThumbWidth: thumbWidth} = attachment;
    invariant(thumbHeight, 'Attachment object missing height');
    invariant(thumbWidth, 'Attachment object missing width');

    const height = Math.min(containerSize, thumbHeight);
    const width = Math.round((thumbWidth * height) / thumbHeight);
    const marginTop = Math.round((containerSize - height) / 2);
    const marginLeft = Math.round((containerSize - width) / 2);

    return {height, width, marginTop, marginLeft};
};

/** */
class RecordCard extends React.Component<RecordCardProps> {
    static propTypes = {
        // Record can either be a record model or a record def (cellValuesByFieldId)
        record: PropTypes.oneOfType([PropTypes.instanceOf(Record), PropTypes.object]),

        // Should provide one of fields and view
        fields: PropTypes.arrayOf(PropTypes.instanceOf(Field).isRequired),
        view: PropTypes.instanceOf(View),

        // This component will always respect attachmentCoverField if one is passed in.
        // Pass a null value to explicitly indicate that an attachment should not be
        // shown. If attachmentCoverField is undefined, it will fall back to using the
        // first attachment in the view provided (if a view is provided).
        attachmentCoverField: PropTypes.instanceOf(Field),
        width: PropTypes.number,
        height: PropTypes.number,
        onClick: PropTypes.func,
        hasOnClick: PropTypes.bool,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        // TODO: add all other mouse events: https://facebook.github.io/react/docs/events.html#mouse-events
        className: PropTypes.string,
        style: PropTypes.object,
        expandRecordOptions: PropTypes.object,
        ...tooltipAnchorPropTypes,
        ...stylePropTypes,
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
    _onClick(e: SyntheticMouseEvent<HTMLAnchorElement>): void {
        if (this.props.onClick) {
            this.props.onClick(e);
        }
        if (
            this.props.onClick === undefined ||
            !this.props.hasOnClick // TODO (stephen): remove tooltip anchor props
        ) {
            // NOTE: `null` disables the default click behavior.

            const {record} = this.props;
            const recordModel = record && record instanceof Record ? record : null;
            if (recordModel) {
                if (isCommandModifierKeyEvent(e) || e.shiftKey) {
                    // No-op, let the <a> tag handle opening in new tab or window.
                } else {
                    e.preventDefault();
                    const opts = this.props.expandRecordOptions || {};
                    expandRecord(recordModel, opts);
                }
            }
        }
    }
    _getAttachmentCover(fieldsToUse: Array<Field>): AttachmentData | null {
        const attachmentField = this._getAttachmentField(fieldsToUse);
        return attachmentField ? this._getFirstAttachmentInField(attachmentField) : null;
    }
    _getAttachmentField(fieldsToUse: Array<Field>): Field | null {
        const {attachmentCoverField} = this.props;

        if (
            attachmentCoverField &&
            !attachmentCoverField.isDeleted &&
            this._isAttachment(attachmentCoverField)
        ) {
            return attachmentCoverField;
        } else if (attachmentCoverField === undefined) {
            // The attachment field in this case is either coming from the view
            // if there is a view, or from the table's arbitrary field ordering
            // if there is no view.
            // TODO: use the real cover field if the view is gallery or kanban instead of
            // the first attachment field
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
            const publicCellValue = record[field.id];
            cellValueUtils.validatePublicCellValueForUpdate(publicCellValue, null, field);
            return cellValueUtils.parsePublicApiCellValue(publicCellValue, field);
        }
    }
    _getFirstAttachmentInField(attachmentField: Field): AttachmentData | null {
        let attachmentsInField;
        if (attachmentField.type === FieldTypes.MULTIPLE_LOOKUP_VALUES) {
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

        // remove primary field if it exists
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
                const minCellWidth = columnTypeProvider.getMinCellWidthForRowCard(
                    field.__getRawType(),
                    field.__getRawTypeOptions(),
                );
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

        const containerClasses = cx(
            baymax('white rounded relative block overflow-hidden'),
            {
                [baymax('pointer cardBoxShadow')]: hasOnClick,
                [baymax('stroked1')]: !hasOnClick,
            },
            className,
        );

        // use height as size in order to get square attachment
        invariant(typeof height === 'number', 'height in defaultProps');
        const attachmentSize = hasAttachment ? height : 0;

        let primaryValue;
        let isUnnamed;

        let primaryCellValueAsString;
        let recordUrl;
        let recordColor;
        if (record instanceof Record) {
            recordUrl = record.url;
            primaryCellValueAsString = record.primaryCellValueAsString;
            if (view) {
                recordColor = record.getColorInView(view);
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
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
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
                {attachmentObjIfAvailable && attachmentObjIfAvailable.largeThumbUrl && (
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
                            draggable="false"
                            height={attachmentDimensionsAndPosition.height}
                            width={attachmentDimensionsAndPosition.width}
                            style={{
                                marginTop: attachmentDimensionsAndPosition.marginTop,
                                marginLeft: attachmentDimensionsAndPosition.marginLeft,
                            }}
                            src={attachmentObjIfAvailable.largeThumbUrl}
                        ></img>
                    </Box>
                )}
            </a>
        );
    }
}

export default withHooks<
    RecordCardProps,
    {viewMetadata: ViewMetadataQueryResult | null},
    RecordCard,
>(RecordCard, props => {
    const {styleProps, nonStyleProps} = splitStyleProps<
        $Diff<RecordCardProps, {|viewMetadata: ViewMetadataQueryResult | null|}>,
        StyleProps,
    >(props, styleParser.propNames);

    const {record, fields, view, className} = nonStyleProps;
    const classNameForStyledProps = useStyledSystem(styleProps, styleParser);

    const recordModel = record && record instanceof Record ? record : null;
    let parentTable = null;
    if (recordModel) {
        parentTable = recordModel.parentTable;
    } else if (fields && fields.length > 0) {
        parentTable = fields[0].parentTable;
    } else if (view) {
        parentTable = view.parentTable;
    }

    useWatchable(recordModel, ['primaryCellValue', view ? `colorInView:${view.id}` : null]);
    // It's safe to watch the record's parentTable since a record's parent table never changes.
    useWatchable(parentTable, ['fields']);

    // if a view is supplied, we need to load the field order to use it for rendering the card
    const viewMetadata = useViewMetadata(view);

    return {
        viewMetadata,
        className: cx(classNameForStyledProps, className),
    };
});
