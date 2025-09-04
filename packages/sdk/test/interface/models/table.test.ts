import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {Base} from '../../../src/interface/models/base';
import {Table} from '../../../src/interface/models/table';
import {Field} from '../../../src/interface/models/field';
import {TableId, FieldId, RecordId} from '../../../src/shared/types/hyper_ids';
import {MutationTypes} from '../../../src/interface/types/mutations';
import {InterfaceBlockSdk} from '../../../src/interface/sdk';

const mockAirtableInterface = MockAirtableInterface.projectTrackerExample();
jest.mock('../../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default: () => mockAirtableInterface,
}));

const deleteTable = (id: TableId) => {
    const newOrder = ['tblDesignProjects', 'tblTasks', 'tblClients'].filter(other => other !== id);

    mockAirtableInterface.triggerModelUpdates([
        {path: ['tableOrder'], value: newOrder},
        {path: ['tablesById', id], value: undefined},
    ]);
};

const deleteField = (id: FieldId) => {
    mockAirtableInterface.triggerModelUpdates([
        {
            path: ['tablesById', 'tblDesignProjects', 'fieldsById', id],
            value: undefined,
        },
    ]);
};

describe('Table', () => {
    let sdk: InterfaceBlockSdk;
    let base: Base;
    let table: Table;

    beforeEach(() => {
        sdk = new InterfaceBlockSdk(mockAirtableInterface);
        base = sdk.base;
        table = base.getTableByName('Design projects');
    });

    afterEach(() => {
        mockAirtableInterface.reset();
    });

    const makeEmptyRecord = (id: RecordId) => {
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        const parentTableData = baseData.tablesById.tblDesignProjects;
        parentTableData.recordsById[id] = {
            id,
            cellValuesByFieldId: {},
            createdTime: '2020-10-28T01:40:24.913Z',
        };
        parentTableData.recordOrder.push(id);

        const parentRecordStore = sdk.base.__getRecordStore(parentTableData.id);

        const newRecord = parentRecordStore.getRecordByIdIfExists(id);

        return newRecord!;
    };

    describe('getFieldIfExists', () => {
        it('returns field by id', () => {
            const field1 = table.getFieldIfExists('fldPrjctName') as Field;
            const field2 = table.getFieldIfExists('fldPrjctClient') as Field;
            expect(field1).toBeInstanceOf(Field);
            expect(field1.id).toBe('fldPrjctName');
            expect(field2).toBeInstanceOf(Field);
            expect(field2.id).toBe('fldPrjctClient');
        });

        it('returns field by name', () => {
            const field1 = table.getFieldIfExists('Category') as Field;
            const field2 = table.getFieldIfExists('Complete') as Field;
            expect(field1).toBeInstanceOf(Field);
            expect(field1.id).toBe('fldPrjctCtgry');
            expect(field2).toBeInstanceOf(Field);
            expect(field2.id).toBe('fldPrjctCmplt');
        });

        it('returns null when field not found', () => {
            expect(table.getFieldIfExists('fldHOlUIpjmlyFAKE')).toBe(null);
            expect(table.getFieldIfExists('A made up field')).toBe(null);
        });
    });

    describe('getField', () => {
        it('returns field by id', () => {
            const field1 = table.getField('fldPrjctName');
            const field2 = table.getField('fldPrjctClient');
            expect(field1).toBeInstanceOf(Field);
            expect(field1.id).toBe('fldPrjctName');
            expect(field2).toBeInstanceOf(Field);
            expect(field2.id).toBe('fldPrjctClient');
        });

        it('returns field by name', () => {
            const field1 = table.getField('Category');
            const field2 = table.getField('Complete');
            expect(field1).toBeInstanceOf(Field);
            expect(field1.id).toBe('fldPrjctCtgry');
            expect(field2).toBeInstanceOf(Field);
            expect(field2.id).toBe('fldPrjctCmplt');
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

    describe('#checkPermissionsForCreateRecord', () => {
        it('correctly queries AirtableInterface when no field data is provided', () => {
            table.checkPermissionsForCreateRecord();

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: undefined,
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when a field ID is provided', () => {
            table.checkPermissionsForCreateRecord({fldPrjctName: 99});
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: {
                                fldPrjctName: 99,
                            },
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when a field name is provided', () => {
            table.checkPermissionsForCreateRecord({'Project images': 99});
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: {
                                fldPrjctImages: 99,
                            },
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('throws when a deleted field ID is provided', () => {
            deleteField('fldPrjctNotes');

            expect(() => {
                table.checkPermissionsForCreateRecord({fldPrjctNotes: '86'});
            }).toThrowErrorMatchingInlineSnapshot(
                `"Field 'fldPrjctNotes' does not exist in table 'Design projects'"`,
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
                    tableId: 'tblDesignProjects',
                    records: undefined,
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when an empty set of records is provided', () => {
            table.checkPermissionsForCreateRecords([]);

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    records: [],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when a nondescript record specifier is provided', () => {
            table.checkPermissionsForCreateRecords([{}]);

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: undefined,
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when only a field ID is provided', () => {
            table.checkPermissionsForCreateRecords([{fields: {fldPrjctName: 99}}]);
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: {
                                fldPrjctName: 99,
                            },
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when only a field name is provided', () => {
            table.checkPermissionsForCreateRecords([{fields: {'Project images': 99}}]);
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: {
                                fldPrjctImages: 99,
                            },
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when multiple records and fields are provided', () => {
            table.checkPermissionsForCreateRecords([
                {fields: {fldPrjctName: 99, fldPrjctClient: 98}},
                {fields: {fldPrjctCtgry: 97, fldPrjctCmplt: 96}},
            ]);
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: {
                                fldPrjctName: 99,
                                fldPrjctClient: 98,
                            },
                        },
                        {
                            id: undefined,
                            cellValuesByFieldId: {
                                fldPrjctCtgry: 97,
                                fldPrjctCmplt: 96,
                            },
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('throws when a deleted field ID is provided', () => {
            deleteField('fldPrjctNotes');

            expect(() => {
                table.checkPermissionsForCreateRecords([{fields: {fldPrjctNotes: '86'}}]);
            }).toThrowErrorMatchingInlineSnapshot(
                `"Field 'fldPrjctNotes' does not exist in table 'Design projects'"`,
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
                    tableId: 'tblDesignProjects',
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
                    tableId: 'tblDesignProjects',
                    recordIds: ['recQ'],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when a record model is provided', async () => {
            const record = makeEmptyRecord('recT');
            table.checkPermissionsForDeleteRecord(record);

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
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
                    tableId: 'tblDesignProjects',
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
                    tableId: 'tblDesignProjects',
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
                    tableId: 'tblDesignProjects',
                    recordIds: ['recQ'],
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when a record model is provided', async () => {
            const record = makeEmptyRecord('recT');
            table.checkPermissionsForDeleteRecords([record]);

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
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
                    tableId: 'tblDesignProjects',
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
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: undefined,
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when only a record ID is provided', () => {
            table.checkPermissionsForUpdateRecord('recQ');

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recQ',
                            cellValuesByFieldId: undefined,
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when only a record model is provided', async () => {
            const record = makeEmptyRecord('recF');
            table.checkPermissionsForUpdateRecord(record);

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recF',
                            cellValuesByFieldId: undefined,
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when only a field ID is provided', () => {
            table.checkPermissionsForUpdateRecord(undefined, {fldPrjctName: 99});
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: {
                                fldPrjctName: 99,
                            },
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when only a field name is provided', () => {
            table.checkPermissionsForUpdateRecord(undefined, {'Project images': 99});
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: {
                                fldPrjctImages: 99,
                            },
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('throws when a deleted field ID is provided', () => {
            deleteField('fldPrjctNotes');

            expect(() => {
                table.checkPermissionsForUpdateRecord(undefined, {fldPrjctNotes: '86'});
            }).toThrowErrorMatchingInlineSnapshot(
                `"Field 'fldPrjctNotes' does not exist in table 'Design projects'"`,
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
                    tableId: 'tblDesignProjects',
                    records: undefined,
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when an empty set of records is provided', () => {
            table.checkPermissionsForUpdateRecords([]);

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when a nondescript record specifier is provided', () => {
            table.checkPermissionsForUpdateRecords([{}]);

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: undefined,
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when only a record ID is provided', () => {
            table.checkPermissionsForUpdateRecords([{id: 'recQ'}]);

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recQ',
                            cellValuesByFieldId: undefined,
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when only a field ID is provided', () => {
            table.checkPermissionsForUpdateRecords([{fields: {fldPrjctName: 99}}]);
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: {
                                fldPrjctName: 99,
                            },
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when only a field name is provided', () => {
            table.checkPermissionsForUpdateRecords([{fields: {'Project images': 99}}]);
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: undefined,
                            cellValuesByFieldId: {
                                fldPrjctImages: 99,
                            },
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('correctly queries AirtableInterface when multiple records and fields are provided', () => {
            table.checkPermissionsForUpdateRecords([
                {id: 'recG', fields: {fldPrjctName: 99, fldPrjctClient: 98}},
                {id: 'recH', fields: {fldPrjctCtgry: 97, fldPrjctCmplt: 96}},
            ]);
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recG',
                            cellValuesByFieldId: {
                                fldPrjctName: 99,
                                fldPrjctClient: 98,
                            },
                        },
                        {
                            id: 'recH',
                            cellValuesByFieldId: {
                                fldPrjctCtgry: 97,
                                fldPrjctCmplt: 96,
                            },
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        it('throws when a deleted field ID is provided', () => {
            deleteField('fldPrjctNotes');

            expect(() => {
                table.checkPermissionsForUpdateRecords([{fields: {fldPrjctNotes: '86'}}]);
            }).toThrowErrorMatchingInlineSnapshot(
                `"Field 'fldPrjctNotes' does not exist in table 'Design projects'"`,
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
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recGeneratedMockId',
                            cellValuesByFieldId: {},
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
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
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recGeneratedMockId',
                            cellValuesByFieldId: {},
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                {holdForMs: 100},
            );
            expect(result).toEqual('recGeneratedMockId');
        });

        it('tolerates fields specified by ID', async () => {
            const result = await table.createRecordAsync({
                fldPrjctName: 'foo',
                fldPrjctNotes: 'bar',
            });

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recGeneratedMockId',
                            cellValuesByFieldId: {
                                fldPrjctName: 'foo',
                                fldPrjctNotes: 'bar',
                            },
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
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
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recGeneratedMockId',
                            cellValuesByFieldId: {
                                fldPrjctName: 'spike',
                                fldPrjctNotes: 'porkchop',
                            },
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
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
                    tableId: 'tblDesignProjects',
                    records: [],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
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
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recGeneratedMockId',
                            cellValuesByFieldId: {},
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                {holdForMs: 100},
            );
            expect(result).toEqual(['recGeneratedMockId']);
        });

        it('tolerates fields specified by ID', async () => {
            const result = await table.createRecordsAsync([
                {
                    fields: {
                        fldPrjctName: 'foo',
                        fldPrjctNotes: 'bar',
                    },
                },
            ]);

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recGeneratedMockId',
                            cellValuesByFieldId: {
                                fldPrjctName: 'foo',
                                fldPrjctNotes: 'bar',
                            },
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
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
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recGeneratedMockId',
                            cellValuesByFieldId: {
                                fldPrjctName: 'spike',
                                fldPrjctNotes: 'porkchop',
                            },
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
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
            makeEmptyRecord('recA');
            makeEmptyRecord('recB');
            await table.deleteRecordAsync('recA');

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    recordIds: ['recA'],
                },
                {holdForMs: 100},
            );
        });

        it('includes record specified by model', async () => {
            const record = makeEmptyRecord('recK');

            await table.deleteRecordAsync(record);

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    recordIds: ['recK'],
                },
                {holdForMs: 100},
            );
        });

        it('updates local model', async () => {
            const record = makeEmptyRecord('recD');

            await table.deleteRecordAsync(record);

            const result = table._recordStore.getRecordByIdIfExists('recD');

            expect(result).toBeNull();
        });
    });

    describe('#deleteRecordsAsync', () => {
        it('tolerates empty record sets', async () => {
            await table.deleteRecordsAsync([]);

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    recordIds: [],
                },
                {holdForMs: 100},
            );
        });

        it('includes all records (specified by ID)', async () => {
            makeEmptyRecord('recA');
            makeEmptyRecord('recB');
            await table.deleteRecordsAsync(['recA', 'recB']);

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    recordIds: ['recA', 'recB'],
                },
                {holdForMs: 100},
            );
        });

        it('includes all records (specified by model)', async () => {
            const record = makeEmptyRecord('recK');

            await table.deleteRecordsAsync([record]);

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    recordIds: ['recK'],
                },
                {holdForMs: 100},
            );
        });

        it('updates local model', async () => {
            const record = makeEmptyRecord('recD');

            await table.deleteRecordsAsync([record]);

            const result = table._recordStore.getRecordByIdIfExists('recD');

            expect(result).toBeNull();
        });
    });

    describe('#description', () => {
        it('returns the descrption of the table', () => {
            expect(table.description).toBe('description for design projects table');
        });

        it('throws when table has been deleted', () => {
            deleteTable('tblDesignProjects');

            expect(() => table.description).toThrowErrorMatchingInlineSnapshot(
                `"TableCore has been deleted"`,
            );
        });
    });

    describe('#getFieldById', () => {
        it('returns the requested field', () => {
            expect(table.getFieldById('fldPrjctClient')).toBe(table.fields[1]);
        });

        it('throws when field has been deleted', () => {
            deleteField('fldPrjctClient');

            expect(() => table.getFieldById('fldPrjctClient')).toThrowErrorMatchingInlineSnapshot(
                `"No field with ID fldPrjctClient in table 'Design projects'"`,
            );
        });

        it('throws when table has been deleted', () => {
            deleteTable('tblDesignProjects');

            expect(() => table.getFieldById('fldPrjctClient')).toThrowErrorMatchingInlineSnapshot(
                `"TableCore has been deleted"`,
            );
        });
    });

    describe('#getFieldByName', () => {
        it('returns the requested field', () => {
            expect(table.getFieldByName('Category')).toBe(table.fields[2]);
        });

        it('throws when field has been deleted', () => {
            deleteField('fldPrjctCtgry');

            expect(() => table.getFieldByName('Category')).toThrowErrorMatchingInlineSnapshot(
                `"No field named 'Category' in table 'Design projects'"`,
            );
        });

        it('throws when table has been deleted', () => {
            deleteTable('tblDesignProjects');

            expect(() => table.getFieldByName('Category')).toThrowErrorMatchingInlineSnapshot(
                `"TableCore has been deleted"`,
            );
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
            deleteTable('tblDesignProjects');

            expect(() => table.name).toThrowErrorMatchingInlineSnapshot(
                `"TableCore has been deleted"`,
            );
        });
    });

    describe('#parentBase', () => {
        it('returns the parent base', () => {
            expect(table.parentBase).toBe(base);
        });

        it('returns the parent base when table has been deleted', () => {
            deleteTable('tblDesignProjects');

            expect(table.parentBase).toBe(base);
        });
    });

    describe('#primaryField', () => {
        it('returns the primary field', () => {
            expect(table.primaryField).toBe(table.fields[0]);
        });

        it('throws when table has been deleted', () => {
            deleteTable('tblDesignProjects');

            expect(() => table.primaryField).toThrowErrorMatchingInlineSnapshot(
                `"TableCore has been deleted"`,
            );
        });
    });

    describe('#updateRecordAsync', () => {
        it('tolerates empty field value maps', async () => {
            makeEmptyRecord('recA');
            await table.updateRecordAsync('recA', {});

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [{id: 'recA', cellValuesByFieldId: {}}],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                {holdForMs: 100},
            );
        });

        it('rejects deleted fields (specified by ID)', async () => {
            makeEmptyRecord('recA');
            const target = 'fldPrjctNotes';
            deleteField(target);

            await expect(
                table.updateRecordAsync('recA', {[target]: 'hello'}),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Field 'fldPrjctNotes' does not exist in table 'Design projects'"`,
            );
        });

        it('rejects deleted fields (specified by name)', async () => {
            makeEmptyRecord('recA');
            deleteField('fldPrjctNotes');

            await expect(
                table.updateRecordAsync('recA', {Notes: 'hello'}),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Field 'Notes' does not exist in table 'Design projects'"`,
            );
        });

        it('includes all field values (record by ID and fields by ID)', async () => {
            makeEmptyRecord('recA');
            await table.updateRecordAsync('recA', {
                fldPrjctName: 'one',
                fldPrjctNotes: 'two',
            });

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recA',
                            cellValuesByFieldId: {
                                fldPrjctName: 'one',
                                fldPrjctNotes: 'two',
                            },
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                {holdForMs: 100},
            );
        });

        it('includes all field values (record by ID and fields by name)', async () => {
            makeEmptyRecord('recA');
            await table.updateRecordAsync('recA', {
                Name: 'one',
                Notes: 'two',
            });

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recA',
                            cellValuesByFieldId: {
                                fldPrjctName: 'one',
                                fldPrjctNotes: 'two',
                            },
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                {holdForMs: 100},
            );
        });

        it('includes all field values (record by model and fields by ID)', async () => {
            const record = makeEmptyRecord('recB');

            await table.updateRecordAsync(record, {
                fldPrjctName: 'one',
                fldPrjctNotes: 'two',
            });

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recB',
                            cellValuesByFieldId: {
                                fldPrjctName: 'one',
                                fldPrjctNotes: 'two',
                            },
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                {holdForMs: 100},
            );
        });

        it('includes all field values (record by model and fields by name)', async () => {
            const record = makeEmptyRecord('recB');

            await table.updateRecordAsync(record, {
                Name: 'one',
                Notes: 'two',
            });

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recB',
                            cellValuesByFieldId: {
                                fldPrjctName: 'one',
                                fldPrjctNotes: 'two',
                            },
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                {holdForMs: 100},
            );
        });

        it('updates local model', async () => {
            const record = makeEmptyRecord('recC');

            await table.updateRecordAsync('recC', {
                fldPrjctName: 'sasquatch',
                fldPrjctNotes: 'yeti',
            });

            expect(record.getCellValue('fldPrjctName')).toBe('sasquatch');
            expect(record.getCellValue('fldPrjctNotes')).toBe('yeti');
        });
    });

    describe('#updateRecordsAsync', () => {
        it('tolerates empty record sets', async () => {
            await table.updateRecordsAsync([]);

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                {holdForMs: 100},
            );
        });

        it('tolerates empty field value maps', async () => {
            makeEmptyRecord('recA');
            await table.updateRecordsAsync([{id: 'recA', fields: {}}]);

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [{id: 'recA', cellValuesByFieldId: {}}],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                {holdForMs: 100},
            );
        });

        it('rejects deleted fields (specified by ID)', async () => {
            makeEmptyRecord('recA');
            const target = 'fldPrjctNotes';
            deleteField(target);

            await expect(
                table.updateRecordsAsync([{id: 'recA', fields: {[target]: 'hello'}}]),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Field 'fldPrjctNotes' does not exist in table 'Design projects'"`,
            );
        });

        it('rejects deleted fields (specified by name)', async () => {
            const target = 'fldPrjctNotes';
            deleteField(target);

            await expect(
                table.updateRecordsAsync([{id: 'recA', fields: {Notes: 'hello'}}]),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Field 'Notes' does not exist in table 'Design projects'"`,
            );
        });

        it('includes all field values for all records (fields specified by ID)', async () => {
            makeEmptyRecord('recA');
            makeEmptyRecord('recB');
            await table.updateRecordsAsync([
                {
                    id: 'recA',
                    fields: {
                        fldPrjctName: 'one',
                        fldPrjctNotes: 'two',
                    },
                },
                {
                    id: 'recB',
                    fields: {
                        fldPrjctName: 'three',
                        fldPrjctNotes: 'four',
                    },
                },
            ]);

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recA',
                            cellValuesByFieldId: {
                                fldPrjctName: 'one',
                                fldPrjctNotes: 'two',
                            },
                        },
                        {
                            id: 'recB',
                            cellValuesByFieldId: {
                                fldPrjctName: 'three',
                                fldPrjctNotes: 'four',
                            },
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                {holdForMs: 100},
            );
        });

        it('includes all field values for all records (fields specified by name)', async () => {
            makeEmptyRecord('recA');
            makeEmptyRecord('recB');
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
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recA',
                            cellValuesByFieldId: {
                                fldPrjctName: 'one',
                                fldPrjctNotes: 'two',
                            },
                        },
                        {
                            id: 'recB',
                            cellValuesByFieldId: {
                                fldPrjctName: 'three',
                                fldPrjctNotes: 'four',
                            },
                        },
                    ],
                    opts: {
                        parseDateCellValueInColumnTimeZone: true,
                        includesForeignRowsThatShouldBeCreated: false,
                    },
                },
                {holdForMs: 100},
            );
        });

        it('updates local model', async () => {
            const record = makeEmptyRecord('recD');

            await table.updateRecordsAsync([
                {
                    id: 'recD',
                    fields: {
                        fldPrjctName: 'bigfoot',
                        fldPrjctNotes: 'sasquatch again',
                    },
                },
            ]);

            expect(record.getCellValue('fldPrjctName')).toBe('bigfoot');
            expect(record.getCellValue('fldPrjctNotes')).toBe('sasquatch again');
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
                            'tblDesignProjects',
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
