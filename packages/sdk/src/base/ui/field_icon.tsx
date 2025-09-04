/** @module @airtable/blocks/ui: FieldIcon */ /** */
import * as React from 'react';
import Field from '../models/field';
import {useSdk} from '../../shared/ui/sdk_context';
import {BaseSdkMode} from '../../sdk_mode';
import Icon, {SharedIconProps} from './icon';
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
    const sdk = useSdk<BaseSdkMode>();

    const airtableInterface = sdk.__airtableInterface;
    const appInterface = sdk.__appInterface;

    const uiConfig = airtableInterface.fieldTypeProvider.getUiConfig(appInterface, field._data);

    const name = uiConfig.iconName;
    return <Icon name={name as IconName} {...restOfProps} />;
};

export default FieldIcon;
