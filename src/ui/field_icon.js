// @flow
const u = require('client_server_shared/u');
const React = require('client/blocks/sdk/ui/react');
const PropTypes = require('prop-types');
const Icon = require('client/blocks/sdk/ui/icon');
const FieldModel = require('client/blocks/sdk/models/field');
const columnTypeProvider = require('client_server_shared/column_types/column_type_provider');

type FieldIconProps = {
    field: FieldModel,
    size?: number,
    fillColor?: string,
    className?: string,
    style?: Object,
    pathClassName?: string,

    // DEPRECTED (in favor of size).
    scale?: number,
};

/** */
const FieldIcon = (props: FieldIconProps) => {
    const {field} = props;
    const restOfProps = u.omit(props, 'field');

    const type = field.__getRawType();
    const typeOptions = field.__getRawTypeOptions();

    const displayType = columnTypeProvider.getDisplayType(type, typeOptions);
    const displayTypeConfigs = columnTypeProvider.getDisplayTypeConfigs(type);
    const config = displayTypeConfigs[displayType];

    const name = config.displayTypeIcon;
    return <Icon name={name} {...restOfProps} />;
};

const iconPropsWithoutName = u.omit(Icon.propTypes, 'name');
FieldIcon.propTypes = {
    ...iconPropsWithoutName,
    field: PropTypes.instanceOf(FieldModel).isRequired,
};

module.exports = FieldIcon;
