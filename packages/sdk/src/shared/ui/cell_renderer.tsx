/** @module @airtable/blocks/ui: CellRenderer */ /** */
import * as React from 'react';
import {spawnError} from '../../shared/error_utils';
import {FieldType} from '../../shared/types/field_core';
import {type RecordId} from '../../shared/types/hyper_ids';
import {type ObjectMap} from '../../shared/private_utils';
import useWatchable from '../../shared/ui/use_watchable';
import {useSdk} from '../../shared/ui/sdk_context';
import {type SdkMode} from '../../sdk_mode';

/**
 * @hidden
 */
interface CellRendererProps<SdkModeT extends SdkMode> {
    /** The {@link Record} from which to render a cell. Either `record` or `cellValue` must be provided to the CellRenderer. If both are provided, `record` will be used. */
    record?: SdkModeT['RecordT'] | null | undefined;
    /** The cell value to render. Either `record` or `cellValue` must be provided to the CellRenderer. If both are provided, `record` will be used. */
    cellValue?: unknown;
    /** The {@link Field} for a given {@link Record} being rendered as a cell. */
    field: SdkModeT['FieldT'];
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
    renderInvalidCellValue?: (cellValue: unknown, field: SdkModeT['FieldT']) => React.ReactElement;
    /** @internal May be injected by Tooltip */
    onMouseEnter?: () => void;
    /** @internal May be injected by Tooltip */
    onMouseLeave?: () => void;
    /** @internal May be injected by Tooltip */
    onClick?: () => void;
}

/**
 * @internal
 */
function validateRecordAndFieldProps<SdkModeT extends SdkMode>(props: {
    record: SdkModeT['RecordT'] | null | undefined;
    field: SdkModeT['FieldT'];
}) {
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

/**
 * @hidden
 */
export function CellRenderer<SdkModeT extends SdkMode>(props: CellRendererProps<SdkModeT>) {
    const {
        record,
        cellValue,
        field,
        shouldWrap = true,
        onMouseEnter,
        onMouseLeave,
        onClick,
        className,
        style,
        cellClassName,
        cellStyle,
        renderInvalidCellValue,
    } = props;
    validateRecordAndFieldProps({record, field});

    const sdk = useSdk();
    useWatchable(record, [`cellValueInField:${field.id}`]);
    useWatchable(field, ['type', 'options']);

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
            className={`baymax ${className ?? ''}`}
            style={{
                display: 'block',
                ...style,
            }}
        >
            <div
                {...attributes}
                className={`cell read ${cellClassName ?? ''}`}
                style={cellStyle}
                dangerouslySetInnerHTML={{
                    __html: cellValueHtml,
                }}
            />
        </div>
    );
}
