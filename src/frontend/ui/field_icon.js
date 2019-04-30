// @flow
const u = window.__requirePrivateModuleFromAirtable('client_server_shared/u');
const React = require('./react');
const PropTypes = require('prop-types');
const Icon = require('./icon');
const FieldModel = require('../../shared/models/field');
const columnTypeProvider = window.__requirePrivateModuleFromAirtable(
    'client_server_shared/column_types/column_type_provider',
);

type FieldIconProps = {
    field: FieldModel,
    size?: number,
    fillColor?: string,
    className?: string,
    style?: Object,
    pathClassName?: string,

    // DEPRECATED (in favor of size).
    scale?: number,
};

/** */
const FieldIcon = (props: FieldIconProps) => {
    const {field} = props;
    const restOfProps = u.omit(props, 'field');

    const type = field.__getRawType();
    const typeOptions = field.__getRawTypeOptions();
    const appInterface = field.parentTable.parentBase.__appInterface;

    const displayType = columnTypeProvider.getDisplayType(type, typeOptions, appInterface);
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
