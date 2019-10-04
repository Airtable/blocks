// @flow
import PropTypes from 'prop-types';
import {cx} from 'emotion';
import * as React from 'react';
import {compose} from '@styled-system/core';
import getSdk from '../get_sdk';
import {spawnError} from '../error_utils';
import Record from '../models/record';
import Field from '../models/field';
import cellValueUtils from '../models/cell_value_utils';
import {type PrivateColumnType} from '../types/field';
import withHooks from './with_hooks';
import useWatchable from './use_watchable';
import {
    display,
    displayPropTypes,
    maxWidth,
    maxWidthPropTypes,
    type MaxWidthProps,
    minWidth,
    minWidthPropTypes,
    type MinWidthProps,
    width,
    widthPropTypes,
    type WidthProps,
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
import useStyledSystem from './use_styled_system';
import {splitStyleProps} from './with_styled_system';
import {type Prop} from './system/utils/types';
import {tooltipAnchorPropTypes, type TooltipAnchorProps} from './types/tooltip_anchor_props';

const columnTypeProvider = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/column_type_provider',
);
const CellReadModeContext = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/cell_context/cell_read_mode_context',
);
const CellContextTypes = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/cell_context/cell_context_types',
);

type StyleProps = {|
    display?: Prop<'block' | 'inline' | 'inline-block'>,
    ...FlexItemSetProps,
    ...MarginProps,
    ...MaxWidthProps,
    ...MinWidthProps,
    ...PositionSetProps,
    ...WidthProps,
|};

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
 * @property {string|number|Object|Array.<Object>} [cellValue] The cell value to render. Either `record` or `cellValue` must be provided to the CellRenderer. If both are provided, `record` will be used.
 * @property {Field} field The {@link Field} for a given {@link Record} being rendered as a cell.
 * @property {boolean} [shouldWrap] Whether to wrap cell contents. Defaults to true.
 * @property {string} [className] Additional class names to apply to the cell renderer container, separated by spaces.
 * @property {object} [style] Additional styles to apply to the cell renderer container.
 * @property {string} [cellClassName] Additional class names to apply to the cell itself, separated by spaces.
 * @property {object} [cellStyle] Additional styles to apply to the cell itself.
 */
type CellRendererProps = {|
    record?: ?Record,
    cellValue?: mixed,
    field: Field,
    shouldWrap?: boolean,
    className?: string,
    style?: {[string]: mixed},
    cellClassName?: string,
    cellStyle?: {[string]: mixed},
    ...TooltipAnchorProps,
    ...StyleProps,
|};

/**
 * Displays the contents of a cell.
 *
 * @example
 * import React, {useState} from 'react';
 * import {Box, CellRenderer, FieldPicker, useBase, useRecords} from '@airtable/blocks/ui';
 *
 * export default function CellRendererExample(props: void) {
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
 */
class CellRenderer extends React.Component<CellRendererProps> {
    static propTypes = {
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
        const attributes: {|
            'data-columntype': PrivateColumnType,
            'data-formatting'?: {[string]: mixed},
        |} = {
            'data-columntype': field.__getRawType(),
        };
        const typeOptions = field.__getRawTypeOptions();
        if (typeOptions && typeOptions.resultType) {
            attributes['data-formatting'] = typeOptions.resultType;
        }
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
                        __html: rawHtml,
                    }}
                />
            </div>
        );
    }
}

export default withHooks<CellRendererProps, {}, CellRenderer>(CellRenderer, props => {
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
