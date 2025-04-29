/* eslint-disable no-console */
import React from 'react';
import Example from './helpers/example';
import {cellRendererStylePropTypes} from '../src/base/ui/cell_renderer';
import {values} from '../src/shared/private_utils';
import FakeCellRenderer from './helpers/fake_cell_renderer';
import {FieldType} from '../src/shared/types/field';
import {ReadableFieldTypes} from './helpers/field_type';

export default {
    component: CellRendererExample,
    title: 'CellRenderer',
};

function CellRendererExample() {
    return (
        <Example
            options={{
                fieldType: {
                    type: 'select',
                    label: 'Field type',
                    options: values(FieldType),
                    defaultValue: FieldType.MULTIPLE_SELECTS,
                    renderLabel: (fieldType: any) => ReadableFieldTypes[fieldType as FieldType],
                },
            }}
            styleProps={Object.keys(cellRendererStylePropTypes)}
            renderCodeFn={({fieldType}) => {
                const fieldName = ReadableFieldTypes[fieldType];
                return `
                import {CellRenderer, useBase, useRecords} from '@airtable/blocks/ui';

                const CellRendererExample = (props) => {
                   const base = useBase();
                   const table = base.getTableByName('All field types');
                   const field = table.getFieldByName('${fieldName} field');
                   const queryResult = table.selectRecords();
                   const records = useRecords(queryResult);

                   return (
                        <CellRenderer
                            field={field}
                            record={records[0]}
                        />
                   );
                }
                `;
            }}
        >
            {({fieldType}) => {
                return <FakeCellRenderer key={fieldType} fieldType={fieldType} />;
            }}
        </Example>
    );
}

export const _Example = {
    render: () => <CellRendererExample />,
};
