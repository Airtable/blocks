// @flow
import PropTypes from 'prop-types';
import * as React from 'react';
import getSdk from '../get_sdk';
import Field from '../models/field';
import Icon, {stylePropTypes, type SharedIconProps} from './icon';

const columnTypeProvider = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/column_type_provider',
);

/**
 * @typedef {object} FieldIconProps
 * @property {Field} field The field model to display an icon for.
 * @property {number} [size=16] The width/height of the icon.
 * @property {string} [fillColor] The color of the icon.
 * @property {string} [className] Additional class names to apply to the icon.
 * @property {object} [style] Additional styles to apply to the icon.
 * @property {string} [pathClassName] Additional class names to apply to the icon path.
 * @property {object} [pathStyle] Additional styles to apply to the icon path.
 */
type FieldIconProps = {|
    field: Field,
    ...SharedIconProps,
|};

/**
 * A vector icon for a field's type.
 *
 * @augments React.StatelessFunctionalComponent
 * @param {FieldIconProps} props
 *
 * @example
 * import {FieldIcon, useBase} from '@airtable/blocks/ui';
 *
 * const base = useBase();
 * const table = base.tables[0];
 * const {primaryField} = table;
 *
 * const FieldToken = (
 *     <div style={{
 *         display: 'inline-flex',
 *         alignItems: 'center',
 *         padding: 8,
 *         fontWeight: 500,
 *         backgroundColor: '#eee',
 *         borderRadius: 3,
 *     }}>
 *         <FieldIcon
 *             field={primaryField}
 *             marginRight={2}
 *         />
 *         {primaryField.name}
 *     </div>
 * );
 */
const FieldIcon = (props: FieldIconProps) => {
    const {
        field,
        size = 16,
        fillColor,
        className,
        style,
        pathClassName,
        pathStyle,
        ...restOfProps
    } = props;

    const type = field.__getRawType();
    const typeOptions = field.__getRawTypeOptions();
    const appInterface = getSdk().__appInterface;

    const displayType = columnTypeProvider.getDisplayType(type, typeOptions, appInterface);
    const displayTypeConfigs = columnTypeProvider.getDisplayTypeConfigs(type);
    const config = displayTypeConfigs[displayType];

    const name = config.displayTypeIcon;
    return (
        <Icon
            name={name}
            size={size}
            fillColor={fillColor}
            className={className}
            style={style}
            pathClassName={pathClassName}
            pathStyle={pathStyle}
            {...restOfProps}
        />
    );
};

FieldIcon.propTypes = {
    field: PropTypes.instanceOf(Field).isRequired,
    size: PropTypes.number,
    fillColor: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    pathClassName: PropTypes.string,
    pathStyle: PropTypes.object,
    ...stylePropTypes,
};

export default FieldIcon;
