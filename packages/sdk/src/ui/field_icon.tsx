/** @module @airtable/blocks/ui: FieldIcon */ /** */
import PropTypes from 'prop-types';
import * as React from 'react';
import getSdk from '../get_sdk';
import Field from '../models/field';
import Icon, {
    sharedIconPropTypes,
    SharedIconProps,
    iconStylePropTypes,
    IconStyleProps,
} from './icon';
import {IconName} from './icon_config';

/**
 * @typedef {object} FieldIconProps
 */
interface FieldIconProps extends SharedIconProps, IconStyleProps {
    /** The field model to display an icon for. */
    field: Field;
}

/**
 * A vector icon for a field's type.
 *
 * @augments React.StatelessFunctionalComponent
 * @param props
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
    return <Icon name={name as IconName} {...restOfProps} />;
};

FieldIcon.propTypes = {
    field: PropTypes.instanceOf(Field).isRequired,
    ...sharedIconPropTypes,
    ...iconStylePropTypes,
};

export default FieldIcon;
