/** @module @airtable/blocks/ui: CellRenderer */ /** */
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import {spawnError} from '../error_utils';
import Sdk from '../sdk';
import Record from '../models/record';
import Field from '../models/field';
import {FieldType} from '../types/field';
import {RecordId} from '../types/record';
import {ObjectMap} from '../private_utils';
import withHooks from './with_hooks';
import useWatchable from './use_watchable';
import {
    display,
    displayPropTypes,
    maxWidth,
    maxWidthPropTypes,
    MaxWidthProps,
    minWidth,
    minWidthPropTypes,
    MinWidthProps,
    width,
    widthPropTypes,
    WidthProps,
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
import useStyledSystem from './use_styled_system';
import {splitStyleProps} from './with_styled_system';
import {OptionalResponsiveProp} from './system/utils/types';
import {tooltipAnchorPropTypes, TooltipAnchorProps} from './types/tooltip_anchor_props';
import {useSdk} from './sdk_context';

/**
 * Style props for the {@link CellRenderer} component. Also accepts:
 * * {@link FlexItemSetProps}
 * * {@link MarginProps}
 * * {@link MaxWidthProps}
 * * {@link MinWidthProps}
 * * {@link PositionSetProps}
 * * {@link WidthProps}
 *
 * @noInheritDoc
 */
interface CellRendererStyleProps
    extends FlexItemSetProps,
        MarginProps,
        MaxWidthProps,
        MinWidthProps,
        PositionSetProps,
        WidthProps {
    /** Defines the display type of an element, which consists of the two basic qualities of how an element generates boxes — the outer display type defining how the box participates in flow layout, and the inner display type defining how the children of the box are laid out. */
    display?: OptionalResponsiveProp<'block' | 'inline' | 'inline-block'>;
}

const styleParser = compose(display, flexItemSet, margin, maxWidth, minWidth, positionSet, width);

export const cellRendererStylePropTypes = {
    ...displayPropTypes,
    ...flexItemSetPropTypes,
    ...marginPropTypes,
    ...maxWidthPropTypes,
    ...minWidthPropTypes,
    ...positionSetPropTypes,
    ...widthPropTypes,
};

/**
 * Props for the {@link CellRenderer} component. Also accepts:
 * * {@link CellRendererStyleProps}
 *
 * @docsPath UI/components/CellRenderer
 * @noInheritDoc
 */
interface CellRendererProps extends CellRendererStyleProps, TooltipAnchorProps<HTMLDivElement> {
    /** The {@link Record} from which to render a cell. Either `record` or `cellValue` must be provided to the CellRenderer. If both are provided, `record` will be used. */
    record?: Record | null | undefined;
    /** The cell value to render. Either `record` or `cellValue` must be provided to the CellRenderer. If both are provided, `record` will be used. */
    cellValue?: unknown;
    /** The {@link Field} for a given {@link Record} being rendered as a cell. */
    field: Field;
    /** Whether to wrap cell contents. Defaults to true. */
    shouldWrap?: boolean;
    /** Additional class names to apply to the cell renderer container, separated by spaces. */
    className?: string;
    /** Additional styles to apply to the cell renderer container. */
    style?: React.CSSProperties;
    /** Additional class names to apply to the cell itself, separated by spaces. */
    cellClassName?: string;
    /** Additional styles to apply to the cell itself. */
    cellStyle?: React.CSSProperties;
    /** Render function if provided and validation fails. */
    renderInvalidCellValue?: (cellValue: unknown, field: Field) => React.ReactElement;
    /** @internal injected by withHooks */
    sdk: Sdk;
}

/**
 * Displays the contents of a cell given a field and record.
 *
 * [[ Story id="cellrenderer--example" title="Cell renderer example" ]]
 *
 * @component
 * @docsPath UI/components/CellRenderer
 */
export class CellRenderer extends React.Component<CellRendererProps> {
    /** @hidden */
    static propTypes = {
        record: PropTypes.instanceOf(Record),
        cellValue: PropTypes.any,
        field: PropTypes.instanceOf(Field).isRequired,
        shouldWrap: PropTypes.bool,
        className: PropTypes.string,
        style: PropTypes.object,
        cellClassName: PropTypes.string,
        cellStyle: PropTypes.object,
        renderInvalidCellValue: PropTypes.func,
        ...tooltipAnchorPropTypes,
        ...cellRendererStylePropTypes,
    };
    /** @hidden */
    static defaultProps = {
        shouldWrap: true,
    };

    /** @hidden */
    constructor(props: CellRendererProps) {
        super(props);

        this._validateProps(props);
    }
    /** @hidden */
    UNSAFE_componentWillReceiveProps(nextProps: CellRendererProps) {
        this._validateProps(nextProps);
    }
    /** @internal */
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
    /** @hidden */
    render() {
        const {
            record,
            cellValue,
            field,
            shouldWrap,
            onMouseEnter,
            onMouseLeave,
            onClick,
            className,
            style,
            cellClassName,
            cellStyle,
            renderInvalidCellValue,
            sdk,
        } = this.props;

        if (field.isDeleted) {
            return null;
        }

        const airtableInterface = sdk.__airtableInterface;
        const appInterface = sdk.__appInterface;

        let cellValueToRender;
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

            cellValueToRender = record.getCellValue(field.id);
        } else {
            if (!field.isComputed) {
                const validationResult = airtableInterface.fieldTypeProvider.validateCellValueForUpdate(
                    appInterface,
                    cellValue,
                    null,
                    field._data,
                );
                if (!validationResult.isValid) {
                    if (renderInvalidCellValue) {
                        return (
                            <div
                                onMouseEnter={onMouseEnter}
                                onMouseLeave={onMouseLeave}
                                onClick={onClick}
                                className={className}
                                style={style}
                            >
                                {renderInvalidCellValue(cellValue, field)}
                            </div>
                        );
                    } else {
                        throw spawnError(
                            'Cannot render invalid cell value %s: %s',
                            cellValue,
                            validationResult.reason,
                        );
                    }
                }
            }

            cellValueToRender = cellValue;
        }

        if (
            cellValueToRender &&
            field.type === FieldType.MULTIPLE_LOOKUP_VALUES &&
            !airtableInterface.sdkInitData.isUsingNewLookupCellValueFormat
        ) {
            const originalCellValue = cellValueToRender as Array<{
                linkedRecordId: RecordId;
                value: unknown;
            }>;
            const linkedRecordIdsSet = new Set();
            const valuesByLinkedRecordId = {} as ObjectMap<RecordId, Array<unknown>>;

            for (const {linkedRecordId, value} of originalCellValue) {
                linkedRecordIdsSet.add(linkedRecordId);
                if (!valuesByLinkedRecordId[linkedRecordId]) {
                    valuesByLinkedRecordId[linkedRecordId] = [];
                }
                valuesByLinkedRecordId[linkedRecordId].push(value);
            }

            cellValueToRender = {
                linkedRecordIds: Array.from(linkedRecordIdsSet),
                valuesByLinkedRecordId,
            };
        }

        const {cellValueHtml, attributes} = airtableInterface.fieldTypeProvider.getCellRendererData(
            appInterface,
            cellValueToRender,
            field._data,
            !!shouldWrap,
        );

        return (
            <div
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
                className={cx('baymax', className)}
                style={style}
            >
                <div
                    {...attributes}
                    className={cx('cell read', cellClassName)}
                    style={cellStyle}
                    dangerouslySetInnerHTML={{
                        __html: cellValueHtml,
                    }}
                />
            </div>
        );
    }
}

export default withHooks<{className?: string; sdk: Sdk}, CellRendererProps, CellRenderer>(
    CellRenderer,
    props => {
        const {styleProps, nonStyleProps} = splitStyleProps<
            Omit<CellRendererProps, 'sdk'>,
            CellRendererStyleProps
        >(props, styleParser.propNames, {display: 'block'});
        const {className} = nonStyleProps;
        const classNameForStyleProps = useStyledSystem<CellRendererStyleProps>(
            styleProps,
            styleParser,
        );
        const sdk = useSdk();
        useWatchable(props.record, [`cellValueInField:${props.field.id}`]);
        useWatchable(props.field, ['type', 'options']);
        return {className: cx(classNameForStyleProps, className), sdk};
    },
);
