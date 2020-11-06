import MockAirtableInterface from '../airtable_interface_mocks/mock_airtable_interface';
import Base from '../../src/models/base';
import Table from '../../src/models/table';
import Field from '../../src/models/field';
import View from '../../src/models/view';
import {TableId} from '../../src/types/table';
import {RecordId} from '../../src/types/record';
import {ViewId, ViewType} from '../../src/types/view';
import {FieldId, FieldType} from '../../src/types/field';
import {MutationTypes} from '../../src/types/mutations';
import getSdk, {clearSdkForTest} from '../../src/get_sdk';

const mockAirtableInterface = MockAirtableInterface.projectTrackerExample();
jest.mock('../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default: () => mockAirtableInterface,
}));

const deleteTable = (id: TableId) => {
    const newOrder = ['tbly388E8NA1CNhnF', 'tblcstEo50YXLJcK4', 'tblyt8B45wJQIx1c3'].filter(
        other => other !== id,
    );

    mockAirtableInterface.triggerModelUpdates([
        {path: ['tableOrder'], value: newOrder},
        {path: ['tablesById', id], value: undefined},
    ]);
};

const deleteView = (id: ViewId) => {
    const newOrder = [
        'viwkNnS94RQAQQTMn',
        'viwqo8mFAqy2HYSCL',
        'viw8v5XkLudbiCJfD',
        'viwhz3PjFATSxaV5X',
        'viwA4Tzw8IJcHHgul',
    ].filter(other => other !== id);

    mockAirtableInterface.triggerModelUpdates([
        {
            path: ['tablesById', 'tbly388E8NA1CNhnF', 'viewOrder'],
            value: newOrder,
        },
        {
            path: ['tablesById', 'tbly388E8NA1CNhnF', 'viewsById', id],
            value: undefined,
        },
    ]);
};

const deleteField = (id: FieldId) => {
    mockAirtableInterface.triggerModelUpdates([
        {
            path: ['tablesById', 'tbly388E8NA1CNhnF', 'fieldsById', id],
            value: undefined,
        },
    ]);
};

describe('Table', () => {
    let base: Base;
    let table: Table;
    beforeEach(() => {
        ({base} = getSdk());
        table = base.getTableByName('Design projects');
    });

    afterEach(() => {
        clearSdkForTest();
        mockAirtableInterface.reset();
    });

    const loadEmptyRecordAsync = async (id: RecordId) => {
        mockAirtableInterface.fetchAndSubscribeToTableDataAsync.mockResolvedValueOnce({
            recordsById: {
                [id]: {
                    id,
                    cellValuesByFieldId: {},
                    commentCount: 0,
                    createdTime: '2020-10-28T01:40:24.913Z',
                },
            },
        });
        return (await table.selectRecordsAsync()).getRecordById(id);
    };

    describe('getFieldIfExists', () => {
        it('returns field by id', () => {
            const field1 = table.getFieldIfExists('fldXaTPfxIVhAUYde') as Field;
            const field2 = table.getFieldIfExists('fld3DvZllJtyaNYpm') as Field;
            expect(field1).toBeInstanceOf(Field);
            expect(field1.id).toBe('fldXaTPfxIVhAUYde');
            expect(field2).toBeInstanceOf(Field);
            expect(field2.id).toBe('fld3DvZllJtyaNYpm');
        });

        it('returns field by name', () => {
            const field1 = table.getFieldIfExists('Category') as Field;
            const field2 = table.getFieldIfExists('Complete') as Field;
            expect(field1).toBeInstanceOf(Field);
            expect(field1.id).toBe('fldRljtoVpOt1IDYH');
            expect(field2).toBeInstanceOf(Field);
            expect(field2.id).toBe('fldHOlUIpjmlYj549');
        });

        it('returns null when field not found', () => {
            expect(table.getFieldIfExists('fldHOlUIpjmlyFAKE')).toBe(null);
            expect(table.getFieldIfExists('A made up field')).toBe(null);
        });
    });

    describe('getField', () => {
        it('returns field by id', () => {
            const field1 = table.getField('fldXaTPfxIVhAUYde');
            const field2 = table.getField('fld3DvZllJtyaNYpm');
            expect(field1).toBeInstanceOf(Field);
            expect(field1.id).toBe('fldXaTPfxIVhAUYde');
            expect(field2).toBeInstanceOf(Field);
            expect(field2.id).toBe('fld3DvZllJtyaNYpm');
        });

        it('returns field by name', () => {
            const field1 = table.getField('Category');
            const field2 = table.getField('Complete');
            expect(field1).toBeInstanceOf(Field);
            expect(field1.id).toBe('fldRljtoVpOt1IDYH');
            expect(field2).toBeInstanceOf(Field);
            expect(field2.id).toBe('fldHOlUIpjmlYj549');
        });

        it('throws when field not found', () => {
            expect(() => table.getField('fldHOlUIpjmlyFAKE')).toThrowErrorMatchingInlineSnapshot(
                `"No field with ID or name 'fldHOlUIpjmlyFAKE' in table 'Design projects'"`,
            );
            expect(() => table.getField('A made up field')).toThrowErrorMatchingInlineSnapshot(
                `"No field with ID or name 'A made up field' in table 'Design projects'"`,
            );
        });
    });

    describe('getViewIfExists', () => {
        it('returns view by id', () => {
            const view1 = table.getViewIfExists('viwkNnS94RQAQQTMn') as View;
            const view2 = table.getViewIfExists('viwqo8mFAqy2HYSCL') as View;
            expect(view1).toBeInstanceOf(View);
            expect(view1.id).toBe('viwkNnS94RQAQQTMn');
            expect(view2).toBeInstanceOf(View);
            expect(view2.id).toBe('viwqo8mFAqy2HYSCL');
        });

        it('returns view by name', () => {
            const view1 = table.getViewIfExists('Completed projects') as View;
            const view2 = table.getViewIfExists('Project calendar') as View;
            expect(view1).toBeInstanceOf(View);
            expect(view1.id).toBe('viw8v5XkLudbiCJfD');
            expect(view2).toBeInstanceOf(View);
            expect(view2.id).toBe('viwhz3PjFATSxaV5X');
        });

        it('returns null when view not found', () => {
            expect(table.getViewIfExists('viwA4Tzw8IJchFAKE')).toBe(null);
            expect(table.getViewIfExists('A made up view')).toBe(null);
        });
    });

    describe('getView', () => {
        it('returns view by id', () => {
            const view1 = table.getView('viwA4Tzw8IJcHHgul');
            const view2 = table.getView('viwkNnS94RQAQQTMn');
            expect(view1).toBeInstanceOf(View);
            expect(view1.id).toBe('viwA4Tzw8IJcHHgul');
            expect(view2).toBeInstanceOf(View);
            expect(view2.id).toBe('viwkNnS94RQAQQTMn');
        });

        it('returns view by name', () => {
            const view1 = table.getView('Incomplete projects by leader');
            const view2 = table.getView('Completed projects');
            expect(view1).toBeInstanceOf(View);
            expect(view1.id).toBe('viwqo8mFAqy2HYSCL');
            expect(view2).toBeInstanceOf(View);
            expect(view2.id).toBe('viw8v5XkLudbiCJfD');
        });

        it('throws when view not found', () => {
            expect(() => table.getView('viwhz3PjFATSxFAKE')).toThrowErrorMatchingInlineSnapshot(
                `"No view with ID or name 'viwhz3PjFATSxFAKE' in table 'Design projects'"`,
            );
            expect(() => table.getView('A made up view')).toThrowErrorMatchingInlineSnapshot(
                `"No view with ID or name 'A made up view' in table 'Design projects'"`,
            );
        });
    });

    describe('createFieldAsync', () => {
        let mockApplyMutationAsync: any;
        let mockGetFieldById: any;

        beforeEach(() => {
            mockApplyMutationAsync = mockAirtableInterface.applyMutationAsync;
            // spy on table.getFieldById since we try to return the field after creation, but
            // we're not actually creating anything so it'll throw
            mockGetFieldById = jest
                .spyOn(table, 'getFieldById')
                .mockImplementation(fieldId => new Field(base.__baseData, table, fieldId));
        });

        it('accepts null field options and omits them from config', async () => {
            await table.createFieldAsync('name2', FieldType.SINGLE_LINE_TEXT, null);

            expect(mockApplyMutationAsync).toHaveBeenCalledTimes(1);
            expect(mockApplyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_SINGLE_FIELD,
                    tableId: table.id,
                    id: 'fldGeneratedMockId',
                    name: 'name2',
                    config: {
                        type: FieldType.SINGLE_LINE_TEXT,
                    },
                },
                {holdForMs: 100},
            );

            expect(mockGetFieldById).toHaveBeenLastCalledWith('fldGeneratedMockId');
        });

        it('accepts undefined field options and omits them from config', async () => {
            await table.createFieldAsync('name2', FieldType.SINGLE_LINE_TEXT);

            expect(mockApplyMutationAsync).toHaveBeenCalledTimes(1);
            expect(mockApplyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_SINGLE_FIELD,
                    tableId: table.id,
                    id: 'fldGeneratedMockId',
                    name: 'name2',
                    config: {
                        type: FieldType.SINGLE_LINE_TEXT,
                    },
                },
                {holdForMs: 100},
            );

            expect(mockGetFieldById).toHaveBeenLastCalledWith('fldGeneratedMockId');
        });

        it('accepts non-null field options', async () => {
            await table.createFieldAsync('name2', FieldType.SINGLE_SELECT, {
                choices: [{name: 'pick me'}],
            });

            expect(mockApplyMutationAsync).toHaveBeenCalledTimes(1);
            expect(mockApplyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_SINGLE_FIELD,
                    tableId: table.id,
                    id: 'fldGeneratedMockId',
                    name: 'name2',
                    config: {
                        type: FieldType.SINGLE_SELECT,
                        options: {
                            choices: [{name: 'pick me'}],
                        },
                    },
                },
                {holdForMs: 100},
            );

            expect(mockGetFieldById).toHaveBeenLastCalledWith('fldGeneratedMockId');
        });
    });

    describe('#checkPermissionsForCreateField', () => {
        it('correctly queries AirtableInterface when no field data is provided', () => {
            table.checkPermissionsForCreateField();

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_SINGLE_FIELD,
                    tableId: 'tbly388E8NA1CNhnF',
                    id: undefined,
                    name: undefined,
                    config: undefined,
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when a name is provided', () => {
            table.checkPermissionsForCreateField('a name');
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_SINGLE_FIELD,
                    tableId: 'tbly388E8NA1CNhnF',
                    id: undefined,
                    name: 'a name',
                    config: undefined,
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when a type is provided', () => {
            table.checkPermissionsForCreateField(undefined, FieldType.SINGLE_SELECT);
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_SINGLE_FIELD,
                    tableId: 'tbly388E8NA1CNhnF',
                    id: undefined,
                    name: undefined,
                    config: {
                        type: FieldType.SINGLE_SELECT,
                    },
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when a type is provided', () => {
            table.checkPermissionsForCreateField(undefined, FieldType.CHECKBOX, {
                color: 'very light green',
            });
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_SINGLE_FIELD,
                    tableId: 'tbly388E8NA1CNhnF',
                    id: undefined,
                    name: undefined,
                    config: {
                        type: FieldType.CHECKBOX,
                        options: {
                            color: 'very light green',
                        },
                    },
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('returns affirmative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: true,
            });

            const result = table.checkPermissionsForCreateField();

            expect(result).toEqual({hasPermission: true});
        });

        it('returns negative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: false,
                reasonDisplayString: 'spoon',
            });

            const result = table.checkPermissionsForCreateField();

            expect(result).toEqual({
                hasPermission: false,
                reasonDisplayString: 'spoon',
            });
        });
    });

    describe('#checkPermissionsForCreateRecord', () => {
        it('correctly queries AirtableInterface when no field data is provided', () => {
            table.checkPermissionsForCreateRecord();

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: undefined,
                        },
                    ],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when a field ID is provided', () => {
            table.checkPermissionsForCreateRecord({fldXaTPfxIVhAUYde: 99});
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: {
                                fldXaTPfxIVhAUYde: 99,
                            },
                        },
                    ],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when a field name is provided', () => {
            table.checkPermissionsForCreateRecord({'Project images': 99});
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: {
                                fldY1QpPpkdkz9KZk: 99,
                            },
                        },
                    ],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('throws when a deleted field ID is provided', () => {
            deleteField('fldFJ3xHdu3VMMZII');

            expect(() => {
                table.checkPermissionsForCreateRecord({fldFJ3xHdu3VMMZII: '86'});
            }).toThrowErrorMatchingInlineSnapshot(
                `"Field 'fldFJ3xHdu3VMMZII' does not exist in table 'Design projects'"`,
            );
        });

        it('returns affirmative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: true,
            });

            const result = table.checkPermissionsForCreateRecord();

            expect(result).toEqual({hasPermission: true});
        });

        it('returns negative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: false,
                reasonDisplayString: 'spoon',
            });

            const result = table.checkPermissionsForCreateRecord();

            expect(result).toEqual({
                hasPermission: false,
                reasonDisplayString: 'spoon',
            });
        });
    });

    describe('#checkPermissionsForCreateRecords', () => {
        it('correctly queries AirtableInterface when no records are provided', () => {
            table.checkPermissionsForCreateRecords();

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: undefined,
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when an empty set of records is provided', () => {
            table.checkPermissionsForCreateRecords([]);

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when a nondescript record specifier is provided', () => {
            table.checkPermissionsForCreateRecords([{}]);

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: undefined,
                        },
                    ],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when only a field ID is provided', () => {
            table.checkPermissionsForCreateRecords([{fields: {fldXaTPfxIVhAUYde: 99}}]);
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: {
                                fldXaTPfxIVhAUYde: 99,
                            },
                        },
                    ],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when only a field name is provided', () => {
            table.checkPermissionsForCreateRecords([{fields: {'Project images': 99}}]);
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: {
                                fldY1QpPpkdkz9KZk: 99,
                            },
                        },
                    ],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when multiple records and fields are provided', () => {
            table.checkPermissionsForCreateRecords([
                {fields: {fldXaTPfxIVhAUYde: 99, fld3DvZllJtyaNYpm: 98}},
                {fields: {fldRljtoVpOt1IDYH: 97, fldHOlUIpjmlYj549: 96}},
            ]);
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: {
                                fldXaTPfxIVhAUYde: 99,
                                fld3DvZllJtyaNYpm: 98,
                            },
                        },
                        {
                            id: undefined,
                            cellValuesByFieldId: {
                                fldRljtoVpOt1IDYH: 97,
                                fldHOlUIpjmlYj549: 96,
                            },
                        },
                    ],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('throws when a deleted field ID is provided', () => {
            deleteField('fldFJ3xHdu3VMMZII');

            expect(() => {
                table.checkPermissionsForCreateRecords([{fields: {fldFJ3xHdu3VMMZII: '86'}}]);
            }).toThrowErrorMatchingInlineSnapshot(
                `"Field 'fldFJ3xHdu3VMMZII' does not exist in table 'Design projects'"`,
            );
        });

        it('returns affirmative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: true,
            });

            const result = table.checkPermissionsForCreateRecords();

            expect(result).toEqual({hasPermission: true});
        });

        it('returns negative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: false,
                reasonDisplayString: 'spoon',
            });

            const result = table.checkPermissionsForCreateRecords();

            expect(result).toEqual({
                hasPermission: false,
                reasonDisplayString: 'spoon',
            });
        });
    });

    describe('#checkPermissionsForDeleteRecord', () => {
        it('correctly queries AirtableInterface when no record is provided', () => {
            table.checkPermissionsForDeleteRecord();

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    recordIds: undefined,
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when a record ID is provided', () => {
            table.checkPermissionsForDeleteRecord('recQ');

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    recordIds: ['recQ'],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when a record model is provided', async () => {
            const record = await loadEmptyRecordAsync('recT');
            table.checkPermissionsForDeleteRecord(record);

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    recordIds: ['recT'],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('returns affirmative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: true,
            });

            const result = table.checkPermissionsForDeleteRecord();

            expect(result).toEqual({hasPermission: true});
        });

        it('returns negative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: false,
                reasonDisplayString: 'spoon',
            });

            const result = table.checkPermissionsForDeleteRecord();

            expect(result).toEqual({
                hasPermission: false,
                reasonDisplayString: 'spoon',
            });
        });
    });

    describe('#checkPermissionsForDeleteRecords', () => {
        it('correctly queries AirtableInterface when no records are provided', () => {
            table.checkPermissionsForDeleteRecords();

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    recordIds: undefined,
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when an empty set of records is provided', () => {
            table.checkPermissionsForDeleteRecords([]);

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    recordIds: [],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when a record ID is provided', () => {
            table.checkPermissionsForDeleteRecords(['recQ']);

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    recordIds: ['recQ'],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when a record model is provided', async () => {
            const record = await loadEmptyRecordAsync('recT');
            table.checkPermissionsForDeleteRecords([record]);

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    recordIds: ['recT'],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when multiple records are provided', () => {
            table.checkPermissionsForDeleteRecords(['recG', 'recH']);
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    recordIds: ['recG', 'recH'],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('returns affirmative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: true,
            });

            const result = table.checkPermissionsForDeleteRecords();

            expect(result).toEqual({hasPermission: true});
        });

        it('returns negative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: false,
                reasonDisplayString: 'spoon',
            });

            const result = table.checkPermissionsForDeleteRecords();

            expect(result).toEqual({
                hasPermission: false,
                reasonDisplayString: 'spoon',
            });
        });
    });

    describe('#checkPermissionsForUpdateRecord', () => {
        it('correctly queries AirtableInterface when no record is provided', () => {
            table.checkPermissionsForUpdateRecord();

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: undefined,
                        },
                    ],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when only a record ID is provided', () => {
            table.checkPermissionsForUpdateRecord('recQ');

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: 'recQ',
                            cellValuesByFieldId: undefined,
                        },
                    ],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when only a record model is provided', async () => {
            const record = await loadEmptyRecordAsync('recF');
            table.checkPermissionsForUpdateRecord(record);

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: 'recF',
                            cellValuesByFieldId: undefined,
                        },
                    ],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when only a field ID is provided', () => {
            table.checkPermissionsForUpdateRecord(undefined, {fldXaTPfxIVhAUYde: 99});
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: {
                                fldXaTPfxIVhAUYde: 99,
                            },
                        },
                    ],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when only a field name is provided', () => {
            table.checkPermissionsForUpdateRecord(undefined, {'Project images': 99});
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: {
                                fldY1QpPpkdkz9KZk: 99,
                            },
                        },
                    ],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('throws when a deleted field ID is provided', () => {
            deleteField('fldFJ3xHdu3VMMZII');

            expect(() => {
                table.checkPermissionsForUpdateRecord(undefined, {fldFJ3xHdu3VMMZII: '86'});
            }).toThrowErrorMatchingInlineSnapshot(
                `"Field 'fldFJ3xHdu3VMMZII' does not exist in table 'Design projects'"`,
            );
        });

        it('returns affirmative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: true,
            });

            const result = table.checkPermissionsForUpdateRecord();

            expect(result).toEqual({hasPermission: true});
        });

        it('returns negative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: false,
                reasonDisplayString: 'spoon',
            });

            const result = table.checkPermissionsForUpdateRecord();

            expect(result).toEqual({
                hasPermission: false,
                reasonDisplayString: 'spoon',
            });
        });
    });

    describe('#checkPermissionsForUpdateRecords', () => {
        it('correctly queries AirtableInterface when no records are provided', () => {
            table.checkPermissionsForUpdateRecords();

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: undefined,
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when an empty set of records is provided', () => {
            table.checkPermissionsForUpdateRecords([]);

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when a nondescript record specifier is provided', () => {
            table.checkPermissionsForUpdateRecords([{}]);

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: undefined,
                        },
                    ],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when only a record ID is provided', () => {
            table.checkPermissionsForUpdateRecords([{id: 'recQ'}]);

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: 'recQ',
                            cellValuesByFieldId: undefined,
                        },
                    ],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when only a field ID is provided', () => {
            table.checkPermissionsForUpdateRecords([{fields: {fldXaTPfxIVhAUYde: 99}}]);
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: {
                                fldXaTPfxIVhAUYde: 99,
                            },
                        },
                    ],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when only a field name is provided', () => {
            table.checkPermissionsForUpdateRecords([{fields: {'Project images': 99}}]);
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: {
                                fldY1QpPpkdkz9KZk: 99,
                            },
                        },
                    ],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when multiple records and fields are provided', () => {
            table.checkPermissionsForUpdateRecords([
                {id: 'recG', fields: {fldXaTPfxIVhAUYde: 99, fld3DvZllJtyaNYpm: 98}},
                {id: 'recH', fields: {fldRljtoVpOt1IDYH: 97, fldHOlUIpjmlYj549: 96}},
            ]);
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: 'recG',
                            cellValuesByFieldId: {
                                fldXaTPfxIVhAUYde: 99,
                                fld3DvZllJtyaNYpm: 98,
                            },
                        },
                        {
                            id: 'recH',
                            cellValuesByFieldId: {
                                fldRljtoVpOt1IDYH: 97,
                                fldHOlUIpjmlYj549: 96,
                            },
                        },
                    ],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('throws when a deleted field ID is provided', () => {
            deleteField('fldFJ3xHdu3VMMZII');

            expect(() => {
                table.checkPermissionsForUpdateRecords([{fields: {fldFJ3xHdu3VMMZII: '86'}}]);
            }).toThrowErrorMatchingInlineSnapshot(
                `"Field 'fldFJ3xHdu3VMMZII' does not exist in table 'Design projects'"`,
            );
        });

        it('returns affirmative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: true,
            });

            const result = table.checkPermissionsForUpdateRecords();

            expect(result).toEqual({hasPermission: true});
        });

        it('returns negative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: false,
                reasonDisplayString: 'spoon',
            });

            const result = table.checkPermissionsForUpdateRecords();

            expect(result).toEqual({
                hasPermission: false,
                reasonDisplayString: 'spoon',
            });
        });
    });

    describe('#createRecordAsync', () => {
        it('tolerates omitted field set', async () => {
            const result = await table.createRecordAsync();

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: 'recGeneratedMockId',
                            cellValuesByFieldId: {},
                        },
                    ],
                },
                {holdForMs: 100},
            );
            expect(result).toEqual('recGeneratedMockId');
        });

        it('tolerates empty field set', async () => {
            const result = await table.createRecordAsync({});

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: 'recGeneratedMockId',
                            cellValuesByFieldId: {},
                        },
                    ],
                },
                {holdForMs: 100},
            );
            expect(result).toEqual('recGeneratedMockId');
        });

        it('tolerates fields specified by ID', async () => {
            const result = await table.createRecordAsync({
                fldXaTPfxIVhAUYde: 'foo',
                fldFJ3xHdu3VMMZII: 'bar',
            });

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: 'recGeneratedMockId',
                            cellValuesByFieldId: {
                                fldXaTPfxIVhAUYde: 'foo',
                                fldFJ3xHdu3VMMZII: 'bar',
                            },
                        },
                    ],
                },
                {holdForMs: 100},
            );
            expect(result).toEqual('recGeneratedMockId');
        });

        it('tolerates fields specified by name', async () => {
            const result = await table.createRecordAsync({
                Name: 'spike',
                Notes: 'porkchop',
            });

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: 'recGeneratedMockId',
                            cellValuesByFieldId: {
                                fldXaTPfxIVhAUYde: 'spike',
                                fldFJ3xHdu3VMMZII: 'porkchop',
                            },
                        },
                    ],
                },
                {holdForMs: 100},
            );
            expect(result).toEqual('recGeneratedMockId');
        });
    });

    describe('#createRecordsAsync', () => {
        it('tolerates empty record sets', async () => {
            const result = await table.createRecordsAsync([]);
            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [],
                },
                {holdForMs: 100},
            );
            expect(result).toEqual([]);
        });

        it('tolerates empty field sets', async () => {
            const result = await table.createRecordsAsync([{fields: {}}]);

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: 'recGeneratedMockId',
                            cellValuesByFieldId: {},
                        },
                    ],
                },
                {holdForMs: 100},
            );
            expect(result).toEqual(['recGeneratedMockId']);
        });

        it('tolerates fields specified by ID', async () => {
            const result = await table.createRecordsAsync([
                {
                    fields: {
                        fldXaTPfxIVhAUYde: 'foo',
                        fldFJ3xHdu3VMMZII: 'bar',
                    },
                },
            ]);

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: 'recGeneratedMockId',
                            cellValuesByFieldId: {
                                fldXaTPfxIVhAUYde: 'foo',
                                fldFJ3xHdu3VMMZII: 'bar',
                            },
                        },
                    ],
                },
                {holdForMs: 100},
            );
            expect(result).toEqual(['recGeneratedMockId']);
        });

        it('tolerates fields specified by name', async () => {
            const result = await table.createRecordsAsync([
                {
                    fields: {
                        Name: 'spike',
                        Notes: 'porkchop',
                    },
                },
            ]);

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: 'recGeneratedMockId',
                            cellValuesByFieldId: {
                                fldXaTPfxIVhAUYde: 'spike',
                                fldFJ3xHdu3VMMZII: 'porkchop',
                            },
                        },
                    ],
                },
                {holdForMs: 100},
            );
            expect(result).toEqual(['recGeneratedMockId']);
        });

        it('rejects missing field sets', async () => {
            // @ts-ignore
            const createPromise = table.createRecordsAsync([{}]);
            await expect(createPromise).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Invalid record format. Please define field mappings using a \`fields\` key for each record definition object"`,
            );
        });

        it('rejects extraneous information', async () => {
            // @ts-ignore
            const createPromise = table.createRecordsAsync([{foo: [], fields: {}}]);
            await expect(createPromise).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Invalid record format. Please define field mappings using a \`fields\` key for each record definition object"`,
            );
        });
    });

    describe('#deleteRecordAsync', () => {
        it('includes all record specified by ID', async () => {
            await table.deleteRecordAsync('recA');

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    recordIds: ['recA'],
                },
                {holdForMs: 100},
            );
        });

        it('includes record specified by model', async () => {
            const record = await loadEmptyRecordAsync('recK');

            await table.deleteRecordAsync(record);

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    recordIds: ['recK'],
                },
                {holdForMs: 100},
            );
        });

        it('updates local model', async () => {
            const record = await loadEmptyRecordAsync('recD');

            await table.deleteRecordAsync(record);

            const result = await table.selectRecordsAsync();

            expect(result.records.length).toBe(0);
        });
    });

    describe('#deleteRecordsAsync', () => {
        it('tolerates empty record sets', async () => {
            await table.deleteRecordsAsync([]);

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    recordIds: [],
                },
                {holdForMs: 100},
            );
        });

        it('includes all records (specified by ID)', async () => {
            await table.deleteRecordsAsync(['recA', 'recB']);

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    recordIds: ['recA', 'recB'],
                },
                {holdForMs: 100},
            );
        });

        it('includes all records (specified by model)', async () => {
            const record = await loadEmptyRecordAsync('recK');

            await table.deleteRecordsAsync([record]);

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tbly388E8NA1CNhnF',
                    recordIds: ['recK'],
                },
                {holdForMs: 100},
            );
        });

        it('updates local model', async () => {
            const record = await loadEmptyRecordAsync('recD');

            await table.deleteRecordsAsync([record]);

            const result = await table.selectRecordsAsync();

            expect(result.records.length).toBe(0);
        });
    });

    describe('#description', () => {
        it('returns the descrption of the table', () => {
            expect(table.description).toBe('description for design projects table');
        });

        it('throws when table has been deleted', () => {
            deleteTable('tbly388E8NA1CNhnF');

            expect(() => table.description).toThrowErrorMatchingInlineSnapshot(
                `"Table has been deleted"`,
            );
        });
    });

    describe('#getFieldById', () => {
        it('returns the requested field', () => {
            expect(table.getFieldById('fld3DvZllJtyaNYpm')).toBe(table.fields[1]);
        });

        it('throws when field has been deleted', () => {
            deleteField('fld3DvZllJtyaNYpm');

            expect(() =>
                table.getFieldById('fld3DvZllJtyaNYpm'),
            ).toThrowErrorMatchingInlineSnapshot(
                `"No field with ID fld3DvZllJtyaNYpm in table 'Design projects'"`,
            );
        });

        it('throws when table has been deleted', () => {
            deleteTable('tbly388E8NA1CNhnF');

            expect(() =>
                table.getFieldById('fld3DvZllJtyaNYpm'),
            ).toThrowErrorMatchingInlineSnapshot(`"Table has been deleted"`);
        });
    });

    describe('#getFieldByName', () => {
        it('returns the requested field', () => {
            expect(table.getFieldByName('Category')).toBe(table.fields[2]);
        });

        it('throws when field has been deleted', () => {
            deleteField('fldRljtoVpOt1IDYH');

            expect(() => table.getFieldByName('Category')).toThrowErrorMatchingInlineSnapshot(
                `"No field named 'Category' in table 'Design projects'"`,
            );
        });

        it('throws when table has been deleted', () => {
            deleteTable('tbly388E8NA1CNhnF');

            expect(() => table.getFieldByName('Category')).toThrowErrorMatchingInlineSnapshot(
                `"Table has been deleted"`,
            );
        });
    });

    describe('#getFirstViewOfType', () => {
        describe('no preferred view', () => {
            it('returns `null` when zero views match', () => {
                expect(table.getFirstViewOfType(ViewType.FORM)).toBe(null);
            });

            it('returns `null` when zero view types are specified', () => {
                expect(table.getFirstViewOfType([])).toBe(null);
            });

            it('returns the only matching view when exactly one view matches (single allowed view type)', () => {
                expect(table.getFirstViewOfType(ViewType.GALLERY)).toBe(table.views[2]);
            });

            it('returns the first matching view when multiple views match (single allowed view type)', () => {
                expect(table.getFirstViewOfType(ViewType.CALENDAR)).toBe(table.views[3]);
            });

            it('returns the only matching view when exactly one view matches (multiple allowed view types)', () => {
                expect(
                    table.getFirstViewOfType([ViewType.GALLERY, ViewType.FORM, ViewType.KANBAN]),
                ).toBe(table.views[2]);
            });

            it('returns the first matching view when multiple views match (multiple allowed view types)', () => {
                expect(table.getFirstViewOfType([ViewType.CALENDAR, ViewType.GALLERY])).toBe(
                    table.views[2],
                );
            });

            it('is not influenced by the sequence of allowed view types', () => {
                const results = [
                    table.getFirstViewOfType([ViewType.FORM, ViewType.CALENDAR, ViewType.GALLERY]),
                    table.getFirstViewOfType([ViewType.FORM, ViewType.GALLERY, ViewType.CALENDAR]),
                    table.getFirstViewOfType([ViewType.GALLERY, ViewType.FORM, ViewType.CALENDAR]),
                    table.getFirstViewOfType([ViewType.GALLERY, ViewType.CALENDAR, ViewType.FORM]),
                    table.getFirstViewOfType([ViewType.CALENDAR, ViewType.FORM, ViewType.GALLERY]),
                    table.getFirstViewOfType([ViewType.CALENDAR, ViewType.GALLERY, ViewType.FORM]),
                ];

                expect(results).toEqual([
                    results[0],
                    results[0],
                    results[0],
                    results[0],
                    results[0],
                    results[0],
                ]);
            });
        });

        describe('preferred view specified by ID', () => {
            it('returns matching preferred views', () => {
                expect(table.getFirstViewOfType(ViewType.GRID, 'viwqo8mFAqy2HYSCL')).toBe(
                    table.views[1],
                );
            });

            it('ignores non-matching preferred views', () => {
                expect(table.getFirstViewOfType(ViewType.GRID, 'viw8v5XkLudbiCJfD')).toBe(
                    table.views[0],
                );
            });

            it('ignores deleted preferred views', () => {
                deleteView('viwqo8mFAqy2HYSCL');

                expect(table.getFirstViewOfType(ViewType.GRID, 'viwqo8mFAqy2HYSCL')).toBe(
                    table.views[0],
                );
            });
        });

        describe('preferred view specified by model', () => {
            it('returns matching preferred views', () => {
                expect(table.getFirstViewOfType(ViewType.GRID, table.views[1])).toBe(
                    table.views[1],
                );
            });

            it('ignores non-matching preferred views', () => {
                expect(table.getFirstViewOfType(ViewType.GRID, table.views[2])).toBe(
                    table.views[0],
                );
            });

            it('ignores deleted preferred views', () => {
                deleteView('viwqo8mFAqy2HYSCL');

                expect(table.getFirstViewOfType(ViewType.GRID, table.views[1])).toBe(
                    table.views[0],
                );
            });
        });
    });

    describe('#getViewById', () => {
        it('returns the requested view', () => {
            expect(table.getViewById('viwhz3PjFATSxaV5X')).toBe(table.views[3]);
        });

        it('throws when view has been deleted', () => {
            deleteView('viwhz3PjFATSxaV5X');

            expect(() => table.getViewById('viwhz3PjFATSxaV5X')).toThrowErrorMatchingInlineSnapshot(
                `"No view with ID viwhz3PjFATSxaV5X in table 'Design projects'"`,
            );
        });

        it('throws when table has been deleted', () => {
            deleteTable('tbly388E8NA1CNhnF');

            expect(() => table.getViewById('viwhz3PjFATSxaV5X')).toThrowErrorMatchingInlineSnapshot(
                `"Table has been deleted"`,
            );
        });
    });

    describe('#getViewByIdIfExists', () => {
        it('returns the requested view', () => {
            expect(table.getViewByIdIfExists('viwhz3PjFATSxaV5X')).toBe(table.views[3]);
        });

        it('returns `null` when view has been deleted', () => {
            deleteView('viwhz3PjFATSxaV5X');

            expect(table.getViewByIdIfExists('viwhz3PjFATSxaV5X')).toBe(null);
        });

        it('throws when table has been deleted', () => {
            deleteTable('tbly388E8NA1CNhnF');

            expect(() =>
                table.getViewByIdIfExists('viwhz3PjFATSxaV5X'),
            ).toThrowErrorMatchingInlineSnapshot(`"Table has been deleted"`);
        });
    });

    describe('#getViewByName', () => {
        it('returns the requested view', () => {
            expect(table.getViewByName('Completed projects')).toBe(table.views[2]);
        });

        it('throws when view has been deleted', () => {
            deleteView('viw8v5XkLudbiCJfD');

            expect(() =>
                table.getViewByName('Completed projects'),
            ).toThrowErrorMatchingInlineSnapshot(
                `"No view named 'Completed projects' in table 'Design projects'"`,
            );
        });

        it('throws when table has been deleted', () => {
            deleteTable('tbly388E8NA1CNhnF');

            expect(() =>
                table.getViewByName('Completed projects'),
            ).toThrowErrorMatchingInlineSnapshot(`"Table has been deleted"`);
        });
    });

    describe('#hasPermissionToCreateField', () => {
        it('returns affirmative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: true,
            });

            expect(table.hasPermissionToCreateField()).toEqual(true);
        });

        it('returns negative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: false,
                reasonDisplayString: 'spoon',
            });

            expect(table.hasPermissionToCreateField()).toEqual(false);
        });
    });

    describe('#hasPermissionToCreateRecord', () => {
        it('returns affirmative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: true,
            });

            expect(table.hasPermissionToCreateRecord()).toEqual(true);
        });

        it('returns negative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: false,
                reasonDisplayString: 'spoon',
            });

            expect(table.hasPermissionToCreateRecord()).toEqual(false);
        });
    });

    describe('#hasPermissionToCreateRecords', () => {
        it('returns affirmative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: true,
            });

            expect(table.hasPermissionToCreateRecords()).toEqual(true);
        });

        it('returns negative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: false,
                reasonDisplayString: 'spoon',
            });

            expect(table.hasPermissionToCreateRecords()).toEqual(false);
        });
    });

    describe('#hasPermissionToDeleteRecord', () => {
        it('returns affirmative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: true,
            });

            expect(table.hasPermissionToDeleteRecord()).toEqual(true);
        });

        it('returns negative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: false,
                reasonDisplayString: 'spoon',
            });

            expect(table.hasPermissionToDeleteRecord()).toEqual(false);
        });
    });

    describe('#hasPermissionToDeleteRecords', () => {
        it('returns affirmative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: true,
            });

            expect(table.hasPermissionToDeleteRecords()).toEqual(true);
        });

        it('returns negative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: false,
                reasonDisplayString: 'spoon',
            });

            expect(table.hasPermissionToDeleteRecords()).toEqual(false);
        });
    });

    describe('#hasPermissionToUpdateRecord', () => {
        it('returns affirmative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: true,
            });

            expect(table.hasPermissionToUpdateRecord()).toEqual(true);
        });

        it('returns negative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: false,
                reasonDisplayString: 'spoon',
            });

            expect(table.hasPermissionToUpdateRecord()).toEqual(false);
        });
    });

    describe('#hasPermissionToUpdateRecords', () => {
        it('returns affirmative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: true,
            });

            expect(table.hasPermissionToUpdateRecords()).toEqual(true);
        });

        it('returns negative responses from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValueOnce({
                hasPermission: false,
                reasonDisplayString: 'spoon',
            });

            expect(table.hasPermissionToUpdateRecords()).toEqual(false);
        });
    });

    describe('#name', () => {
        it('returns the name of the table', () => {
            expect(table.name).toBe('Design projects');
        });

        it('throws when table has been deleted', () => {
            deleteTable('tbly388E8NA1CNhnF');

            expect(() => table.name).toThrowErrorMatchingInlineSnapshot(`"Table has been deleted"`);
        });
    });

    describe('#parentBase', () => {
        it('returns the parent base', () => {
            expect(table.parentBase).toBe(base);
        });

        it('returns the parent base when table has been deleted', () => {
            deleteTable('tbly388E8NA1CNhnF');

            expect(table.parentBase).toBe(base);
        });
    });

    describe('#primaryField', () => {
        it('returns the primary field', () => {
            expect(table.primaryField).toBe(table.fields[0]);
        });

        it('throws when table has been deleted', () => {
            deleteTable('tbly388E8NA1CNhnF');

            expect(() => table.primaryField).toThrowErrorMatchingInlineSnapshot(
                `"Table has been deleted"`,
            );
        });
    });

    describe('#selectRecords', () => {
        it('returns an unloaded query result', () => {
            const result = table.selectRecords();

            expect(result.isDataLoaded).toBe(false);
        });

        it('does not throw when table has been deleted', () => {
            deleteTable('tbly388E8NA1CNhnF');

            table.selectRecords();
        });

        it('throws for invalid sorting directions', () => {
            expect(() => {
                table.selectRecords({
                    sorts: [{field: 'fld3DvZllJtyaNYpm', direction: 'ascending' as 'asc'}],
                });
            }).toThrowErrorMatchingInlineSnapshot(`"Invalid sort direction: ascending"`);
        });

        it('does not throw for some falsey `fields` values', () => {
            table.selectRecords({
                // eslint-disable-next-line no-sparse-arrays
                fields: [,],
            });
            table.selectRecords({
                fields: [undefined],
            });
            table.selectRecords({
                fields: [null],
            });
            table.selectRecords({
                fields: [false],
            });
        });

        it('throws for invalid field specifiers', () => {
            expect(() => {
                table.selectRecords({
                    fields: [(1.0003 as unknown) as string],
                });
            }).toThrowErrorMatchingInlineSnapshot(
                `"Invalid value for field, expected a field, id, or name but got: 1.0003"`,
            );
        });
    });

    describe('#selectRecordsAsync', () => {
        beforeEach(() => {
            mockAirtableInterface.fetchAndSubscribeToTableDataAsync.mockResolvedValue({
                recordsById: {},
            });
        });

        it('returns a promise for a loaded query result', async () => {
            const resultPromise = table.selectRecordsAsync();

            expect(resultPromise).toBeTruthy();
            expect(typeof resultPromise.then).toBe('function');

            const fulfilled = await resultPromise;

            expect(fulfilled.isDataLoaded).toBe(true);
        });

        it('rejects when sort field belongs to another table', async () => {
            const foreignField = base.getTableByName('Tasks').getFieldById('fldfu76MKFFh6x6IM');

            await expect(
                table.selectRecordsAsync({sorts: [{field: foreignField}]}),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Field 'Name' is from a different table than table 'Design projects'"`,
            );
        });

        it('rejects when sort field has been deleted', async () => {
            const field = table.getFieldById('fld3DvZllJtyaNYpm');
            deleteField(field.id);

            await expect(
                table.selectRecordsAsync({sorts: [{field}]}),
            ).rejects.toThrowErrorMatchingInlineSnapshot(`"Field has been deleted"`);
        });

        it('rejects when limiting field belongs to another table', async () => {
            const foreignField = base.getTableByName('Tasks').getFieldById('fldfu76MKFFh6x6IM');

            await expect(
                table.selectRecordsAsync({fields: [foreignField]}),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Field 'Name' is from a different table than table 'Design projects'"`,
            );
        });

        it('rejects when limiting field has been deleted', async () => {
            const field = table.getFieldById('fld3DvZllJtyaNYpm');
            deleteField(field.id);

            await expect(
                table.selectRecordsAsync({fields: [field]}),
            ).rejects.toThrowErrorMatchingInlineSnapshot(`"Field has been deleted"`);
        });

        it('does not throw when table has been deleted', () => {
            deleteTable('tbly388E8NA1CNhnF');

            table.selectRecordsAsync();
        });

        it('rejects when table has been deleted', async () => {
            deleteTable('tbly388E8NA1CNhnF');

            await expect(table.selectRecordsAsync()).rejects.toThrowErrorMatchingInlineSnapshot(
                `"model (tbly388E8NA1CNhnF-RecordStore) permanently deleted"`,
            );
        });
    });

    describe('#updateRecordAsync', () => {
        it('tolerates empty field value maps', async () => {
            await table.updateRecordAsync('recA', {});

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [{id: 'recA', cellValuesByFieldId: {}}],
                },
                {holdForMs: 100},
            );
        });

        it('rejects deleted fields (specified by ID)', async () => {
            const target = 'fldFJ3xHdu3VMMZII';
            deleteField(target);

            await expect(
                table.updateRecordAsync('recA', {[target]: 'hello'}),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Field 'fldFJ3xHdu3VMMZII' does not exist in table 'Design projects'"`,
            );
        });

        it('rejects deleted fields (specified by name)', async () => {
            deleteField('fldFJ3xHdu3VMMZII');

            await expect(
                table.updateRecordAsync('recA', {Notes: 'hello'}),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Field 'Notes' does not exist in table 'Design projects'"`,
            );
        });

        it('includes all field values (record by ID and fields by ID)', async () => {
            await table.updateRecordAsync('recA', {
                fldXaTPfxIVhAUYde: 'one',
                fldFJ3xHdu3VMMZII: 'two',
            });

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: 'recA',
                            cellValuesByFieldId: {
                                fldXaTPfxIVhAUYde: 'one',
                                fldFJ3xHdu3VMMZII: 'two',
                            },
                        },
                    ],
                },
                {holdForMs: 100},
            );
        });

        it('includes all field values (record by ID and fields by name)', async () => {
            await table.updateRecordAsync('recA', {
                Name: 'one',
                Notes: 'two',
            });

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: 'recA',
                            cellValuesByFieldId: {
                                fldXaTPfxIVhAUYde: 'one',
                                fldFJ3xHdu3VMMZII: 'two',
                            },
                        },
                    ],
                },
                {holdForMs: 100},
            );
        });

        it('includes all field values (record by model and fields by ID)', async () => {
            const record = await loadEmptyRecordAsync('recB');

            await table.updateRecordAsync(record, {
                fldXaTPfxIVhAUYde: 'one',
                fldFJ3xHdu3VMMZII: 'two',
            });

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: 'recB',
                            cellValuesByFieldId: {
                                fldXaTPfxIVhAUYde: 'one',
                                fldFJ3xHdu3VMMZII: 'two',
                            },
                        },
                    ],
                },
                {holdForMs: 100},
            );
        });

        it('includes all field values (record by model and fields by name)', async () => {
            const record = await loadEmptyRecordAsync('recB');

            await table.updateRecordAsync(record, {
                Name: 'one',
                Notes: 'two',
            });

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: 'recB',
                            cellValuesByFieldId: {
                                fldXaTPfxIVhAUYde: 'one',
                                fldFJ3xHdu3VMMZII: 'two',
                            },
                        },
                    ],
                },
                {holdForMs: 100},
            );
        });

        it('updates local model', async () => {
            const record = await loadEmptyRecordAsync('recC');

            await table.updateRecordAsync('recC', {
                fldXaTPfxIVhAUYde: 'sasquatch',
                fldFJ3xHdu3VMMZII: 'yeti',
            });

            expect(record.getCellValue('fldXaTPfxIVhAUYde')).toBe('sasquatch');
            expect(record.getCellValue('fldFJ3xHdu3VMMZII')).toBe('yeti');
        });
    });

    describe('#updateRecordsAsync', () => {
        it('tolerates empty record sets', async () => {
            await table.updateRecordsAsync([]);

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [],
                },
                {holdForMs: 100},
            );
        });

        it('tolerates empty field value maps', async () => {
            await table.updateRecordsAsync([{id: 'recA', fields: {}}]);

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [{id: 'recA', cellValuesByFieldId: {}}],
                },
                {holdForMs: 100},
            );
        });

        it('rejects deleted fields (specified by ID)', async () => {
            const target = 'fldFJ3xHdu3VMMZII';
            deleteField(target);

            await expect(
                table.updateRecordsAsync([{id: 'recA', fields: {[target]: 'hello'}}]),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Field 'fldFJ3xHdu3VMMZII' does not exist in table 'Design projects'"`,
            );
        });

        it('rejects deleted fields (specified by name)', async () => {
            const target = 'fldFJ3xHdu3VMMZII';
            deleteField(target);

            await expect(
                table.updateRecordsAsync([{id: 'recA', fields: {Notes: 'hello'}}]),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Field 'Notes' does not exist in table 'Design projects'"`,
            );
        });

        it('includes all field values for all records (fields specified by ID)', async () => {
            await table.updateRecordsAsync([
                {
                    id: 'recA',
                    fields: {
                        fldXaTPfxIVhAUYde: 'one',
                        fldFJ3xHdu3VMMZII: 'two',
                    },
                },
                {
                    id: 'recB',
                    fields: {
                        fldXaTPfxIVhAUYde: 'three',
                        fldFJ3xHdu3VMMZII: 'four',
                    },
                },
            ]);

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: 'recA',
                            cellValuesByFieldId: {
                                fldXaTPfxIVhAUYde: 'one',
                                fldFJ3xHdu3VMMZII: 'two',
                            },
                        },
                        {
                            id: 'recB',
                            cellValuesByFieldId: {
                                fldXaTPfxIVhAUYde: 'three',
                                fldFJ3xHdu3VMMZII: 'four',
                            },
                        },
                    ],
                },
                {holdForMs: 100},
            );
        });

        it('includes all field values for all records (fields specified by name)', async () => {
            await table.updateRecordsAsync([
                {
                    id: 'recA',
                    fields: {
                        Name: 'one',
                        Notes: 'two',
                    },
                },
                {
                    id: 'recB',
                    fields: {
                        Name: 'three',
                        Notes: 'four',
                    },
                },
            ]);

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tbly388E8NA1CNhnF',
                    records: [
                        {
                            id: 'recA',
                            cellValuesByFieldId: {
                                fldXaTPfxIVhAUYde: 'one',
                                fldFJ3xHdu3VMMZII: 'two',
                            },
                        },
                        {
                            id: 'recB',
                            cellValuesByFieldId: {
                                fldXaTPfxIVhAUYde: 'three',
                                fldFJ3xHdu3VMMZII: 'four',
                            },
                        },
                    ],
                },
                {holdForMs: 100},
            );
        });

        it('updates local model', async () => {
            const record = await loadEmptyRecordAsync('recD');

            await table.updateRecordsAsync([
                {
                    id: 'recD',
                    fields: {
                        fldXaTPfxIVhAUYde: 'bigfoot',
                        fldFJ3xHdu3VMMZII: 'sasquatch again',
                    },
                },
            ]);

            expect(record.getCellValue('fldXaTPfxIVhAUYde')).toBe('bigfoot');
            expect(record.getCellValue('fldFJ3xHdu3VMMZII')).toBe('sasquatch again');
        });
    });

    describe('#url', () => {
        it('correctly queries AirtableInterface', () => {
            expect(mockAirtableInterface.urlConstructor.getTableUrl.mock.calls).toEqual([]);

            table.url;

            expect(mockAirtableInterface.urlConstructor.getTableUrl.mock.calls).toEqual([
                ['tbly388E8NA1CNhnF'],
            ]);
        });

        it('returns the value provided by AirtableInterface', () => {
            mockAirtableInterface.urlConstructor.getTableUrl.mockReturnValue('https://zombo.com');
            expect(table.url).toBe('https://zombo.com');
        });
    });

    describe('#views', () => {
        it('returns all views in the correct order', () => {
            expect(table.views.map(({id}) => id)).toEqual([
                'viwkNnS94RQAQQTMn',
                'viwqo8mFAqy2HYSCL',
                'viw8v5XkLudbiCJfD',
                'viwhz3PjFATSxaV5X',
                'viwA4Tzw8IJcHHgul',
            ]);
        });

        it('omits deleted views', () => {
            deleteView('viwhz3PjFATSxaV5X');

            expect(table.views.map(({id}) => id)).toEqual([
                'viwkNnS94RQAQQTMn',
                'viwqo8mFAqy2HYSCL',
                'viw8v5XkLudbiCJfD',
                'viwA4Tzw8IJcHHgul',
            ]);
        });

        it('throws when table has been deleted', () => {
            deleteTable('tbly388E8NA1CNhnF');

            expect(() => table.views).toThrowErrorMatchingInlineSnapshot(
                `"Table has been deleted"`,
            );
        });
    });

    describe('#watch', () => {
        describe('key: fields', () => {
            it('ignores unrecognized fields', () => {
                const spy = jest.fn();
                table.watch('fields', spy);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tbly388E8NA1CNhnF',
                            'fieldsById',
                            'fldUnrecognized',
                            'name',
                        ],
                        value: 'a brand new name',
                    },
                ]);

                expect(spy).toHaveBeenCalledTimes(0);
            });
        });
    });
});
