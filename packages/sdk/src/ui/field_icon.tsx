/** @module @airtable/blocks/ui: FieldIcon */ /** */
import PropTypes from 'prop-types';
import * as React from 'react';
import getSdk from '../get_sdk';
import Field from '../models/field';
import Icon, {sharedIconPropTypes, SharedIconProps, stylePropTypes, StyleProps} from './icon';

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
interface FieldIconProps extends SharedIconProps, StyleProps {
    field: Field;
}

/**
 * A vector icon for a field's type.
 *
 * @augments React.StatelessFunctionalComponent
 * @param {FieldIconProps} props
 *
 * @example
 * ```js
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
 * ```
 */
const FieldIcon = (props: FieldIconProps) => {
    const {field, ...restOfProps} = props;

    const airtableInterface = getSdk().__airtableInterface;
    const appInterface = getSdk().__appInterface;

    const uiConfig = airtableInterface.fieldTypeProvider.getUiConfig(appInterface, field._data);

    const name = uiConfig.iconName;
    return <Icon name={name} {...restOfProps} />;
};

FieldIcon.propTypes = {
    field: PropTypes.instanceOf(Field).isRequired,
    ...sharedIconPropTypes,
    ...stylePropTypes,
};

export default FieldIcon;
