/** @module @airtable/blocks/ui: CellRenderer */ /** */
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import getSdk from '../get_sdk';
import {spawnError} from '../error_utils';
import Record from '../models/record';
import Field from '../models/field';
import cellValueUtils from '../models/cell_value_utils';
import {PrivateColumnType} from '../types/field';
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
import {Prop} from './system/utils/types';
import {tooltipAnchorPropTypes, TooltipAnchorProps} from './types/tooltip_anchor_props';

const columnTypeProvider = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/column_type_provider',
);
const CellReadModeContext = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/cell_context/cell_read_mode_context',
);
const CellContextTypes = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/cell_context/cell_context_types',
);

interface StyleProps
    extends FlexItemSetProps,
        MarginProps,
        MaxWidthProps,
        MinWidthProps,
        PositionSetProps,
        WidthProps {
    display?: Prop<'block' | 'inline' | 'inline-block'>;
}

const styleParser = compose(
    display,
    flexItemSet,
    margin,
    maxWidth,
    minWidth,
    positionSet,
    width,
);

const stylePropTypes = {
    // TODO (billy): currently, this will accept all values for display, not just block/inline/inline-block
    ...displayPropTypes,
    ...flexItemSetPropTypes,
    ...marginPropTypes,
    ...maxWidthPropTypes,
    ...minWidthPropTypes,
    ...positionSetPropTypes,
    ...widthPropTypes,
};

/**
 * @typedef {object} CellRendererProps
 * @property {Record} [record] The {@link Record} from which to render a cell. Either `record` or `cellValue` must be provided to the CellRenderer. If both are provided, `record` will be used.
 * @property {string|number|object|Array.<object>} [cellValue] The cell value to render. Either `record` or `cellValue` must be provided to the CellRenderer. If both are provided, `record` will be used.
 * @property {Field} field The {@link Field} for a given {@link Record} being rendered as a cell.
 * @property {boolean} [shouldWrap] Whether to wrap cell contents. Defaults to true.
 * @property {string} [className] Additional class names to apply to the cell renderer container, separated by spaces.
 * @property {object} [style] Additional styles to apply to the cell renderer container.
 * @property {string} [cellClassName] Additional class names to apply to the cell itself, separated by spaces.
 * @property {object} [cellStyle] Additional styles to apply to the cell itself.
 */
interface CellRendererProps extends TooltipAnchorProps, StyleProps {
    record?: Record | null | undefined;
    cellValue?: unknown;
    field: Field;
    shouldWrap?: boolean;
    className?: string;
    style?: React.CSSProperties;
    // These props exist to separate styling on the baymax wrapper div
    // (e.g. layout/sizing) from styling on the cell div (needed by RecordCard).
    cellClassName?: string;
    cellStyle?: React.CSSProperties;
}

/**
 * Displays the contents of a cell.
 *
 * @example
 * ```js
 * import React, {useState} from 'react';
 * import {Box, CellRenderer, FieldPicker, useBase, useRecords} from '@airtable/blocks/ui';
 *
 * export default function CellRendererExample(props) {
 *    const [field, setField] = useState(null);
 *    const base = useBase();
 *    const table = base.tables[0];
 *    const queryResult = table.selectRecords();
 *    const records = useRecords(queryResult);
 *    return (
 *        <Box display="flex" flexDirection="column">
 *            <FieldPicker table={table} field={field} onChange={setField} />
 *            {field && (
 *                <CellRenderer
 *                    className="user-defined-class"
 *                    field={field}
 *                    record={records[0]}
 *                    margin={3}
 *                />
 *            )}
 *        </Box>
 *    );
 * }
 * ```
 */
export class CellRenderer extends React.Component<CellRendererProps> {
    /** @hidden */
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
        ...tooltipAnchorPropTypes,
        ...stylePropTypes,
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
        const attributes: {
            ['data-columntype']: PrivateColumnType;
            ['data-formatting']?: {[key: string]: unknown};
        } = {
            'data-columntype': field.__getRawType(),
        };
        const typeOptions = field.__getRawTypeOptions();
        if (typeOptions && typeOptions.resultType) {
            attributes['data-formatting'] = typeOptions.resultType;
        }
        return (
            <div
                // TODO (stephen): remove tooltip anchor props
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
                        __html: rawHtml,
                    }}
                />
            </div>
        );
    }
}

export default withHooks<{}, CellRendererProps, CellRenderer>(CellRenderer, props => {
    const {styleProps, nonStyleProps} = splitStyleProps<CellRendererProps, StyleProps>(
        props,
        styleParser.propNames,
        {display: 'block'},
    );
    const {className} = nonStyleProps;
    const classNameForStyleProps = useStyledSystem<StyleProps>(styleProps, styleParser);
    useWatchable(props.record, [`cellValueInField:${props.field.id}`]);
    useWatchable(props.field, ['type', 'options']);
    return {className: cx(classNameForStyleProps, className)};
});
