import React from 'react';
import {storiesOf} from '@storybook/react';
import {values as objectValues} from '../src/private_utils';
import Icon, {iconStylePropTypes} from '../src/ui/icon';
import {FieldType} from '../src/types/field';
import {ReadableFieldTypes, IconNamesByFieldType} from './helpers/field_type';
import Example from './helpers/example';

const stories = storiesOf('FieldIcon', module);

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
                import {FieldIcon, useBase, useRecords} from '@airtable/blocks/ui';
                
                const FieldIconExample = (props) => {
                   const base = useBase();
                   const table = base.getTableByName('All field types');
                   const field = base.getFieldByName('${fieldName} field');
 
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

stories.add('example', () => <FieldIconExample />);
