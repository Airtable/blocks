import React from 'react';
import {values as objectValues} from '../src/shared/private_utils';
import Icon, {iconStylePropTypes} from '../src/base/ui/icon';
import {FieldType} from '../src/shared/types/field';
import {ReadableFieldTypes, IconNamesByFieldType} from './helpers/field_type';
import Example from './helpers/example';

export default {
    component: Icon,
    title: 'FieldIcon',
};

function FieldIconExample() {
    return (
        <Example
            options={{
                fieldType: {
                    type: 'select',
                    label: 'Field type',
                    options: objectValues(FieldType),
                    defaultValue: FieldType.MULTIPLE_SELECTS,
                    renderLabel: (fieldType: any) => ReadableFieldTypes[fieldType as FieldType],
                },
                size: {
                    type: 'selectButtons',
                    label: 'Size',
                    options: [12, 16, 20],
                    defaultValue: 16,
                },
            }}
            styleProps={Object.keys(iconStylePropTypes)}
            renderCodeFn={({fieldType, size}) => {
                const fieldName = ReadableFieldTypes[fieldType];
                return `
                import {FieldIcon, useBase, useRecords} from '@airtable/blocks/base/ui';

                const FieldIconExample = (props) => {
                   const base = useBase();
                   const table = base.getTableByName('All field types');
                   const field = table.getFieldByName('${fieldName} field');

                   return (
                        <FieldIcon field={field} size={${size}} />
                   );
                }
                `;
            }}
        >
            {({fieldType, size}) => {
                const fieldTypeIconName = IconNamesByFieldType[fieldType];
                return <Icon name={fieldTypeIconName} size={size} />;
            }}
        </Example>
    );
}

export const _Example = {
    render: () => <FieldIconExample />,
};
