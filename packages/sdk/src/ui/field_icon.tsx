/** @module @airtable/blocks/ui: FieldIcon */ /** */
import PropTypes from 'prop-types';
import * as React from 'react';
import getSdk from '../get_sdk';
import Field from '../models/field';
import Icon, {sharedIconPropTypes, SharedIconProps} from './icon';
import {IconName} from './icon_config';

/**
 * Props for the {@link FieldIcon} component. Also accepts:
 * * {@link IconStyleProps}
 *
 * @docsPath UI/components/FieldIcon
 */

interface FieldIconProps extends SharedIconProps {
    /** The field model to display an icon for. */
    field: Field;
}

/**
 * A vector icon for a field’s type.
 *
 * [[ Story id="fieldicon--example" title="FieldIcon example" ]]
 *
 * @docsPath UI/components/FieldIcon
 * @component
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
};

export default FieldIcon;
