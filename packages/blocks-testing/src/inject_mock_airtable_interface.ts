// istanbul ignore file
import {FieldType, ViewType} from '@airtable/blocks/models';
import MockAirtableInterface from './mock_airtable_interface';

const vacantAirtableInterface = new MockAirtableInterface({
    base: {
        id: 'appVACANTFORTESTING',
        name: 'Vacant Base intended for use in automated testing environments only',
        tables: [
            {
                id: 'tblVACANTFORTESTING',
                name: 'Vacant table intended for use in automated testing environments only',
                description: 'Vacant table intended for use in automated testing environments only',
                fields: [
                    {
                        id: 'fldVACANTFORTESTING',
                        name:
                            'Vacant field intended for use in automated testing environments only',
                        type: FieldType.SINGLE_LINE_TEXT,
                        options: null,
                        description: '',
                    },
                ],
                views: [
                    {
                        id: 'viwVACANTFORTESTING',
                        name: 'Vacant view intended for use in automated testing environments only',
                        type: ViewType.GRID,
                        fieldOrder: {
                            fieldIds: ['fldVACANTFORTESTING'],
                            visibleFieldCount: 1,
                        },
                        records: [],
                    },
                ],
                records: [],
            },
        ],
        collaborators: [
            {
                id: 'usrVACANTFORTESTING',
                email: 'vacant@airtable.test',
                isActive: true,
            },
        ],
    },
});

(window as any).__getAirtableInterfaceAtVersion = () => vacantAirtableInterface;
