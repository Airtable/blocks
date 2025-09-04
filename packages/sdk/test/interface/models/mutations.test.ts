import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {Base} from '../../../src/interface/models/base';
import {Mutations} from '../../../src/interface/models/mutations';
import {InterfaceBlockSdk} from '../../../src/interface/sdk';
import {ModelChange} from '../../../src/shared/types/base_core';
import {MutationTypes} from '../../../src/interface/types/mutations';
import {Session} from '../../../src/interface/models/session';
import {FieldId, RecordId} from '../../../src/shared/types/hyper_ids';
import {ObjectMap} from '../../../src/shared/private_utils';

const mockAirtableInterface = MockAirtableInterface.projectTrackerExample();
jest.mock('../../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default: () => mockAirtableInterface,
}));

jest.mock('../../../src/shared/types/mutation_constants', () => ({
    MAX_NUM_FIELDS_PER_TABLE: 10,
    MAX_FIELD_NAME_LENGTH: 20,
    MAX_FIELD_DESCRIPTION_LENGTH: 50,
    MAX_TABLE_NAME_LENGTH: 20,
}));

const compareUpdatePath = (a: ModelChange, b: ModelChange) => {
    return a.path.join('') > b.path.join('') ? 1 : -1;
};

const createdTime = new Date().toJSON();
const mockRecordsById = {
    recA: {id: 'recA', cellValuesByFieldId: {fldMockLookup: null}, createdTime},
    recB: {id: 'recB', cellValuesByFieldId: {fldMockLookup: null}, createdTime},
    recC: {id: 'recC', cellValuesByFieldId: {fldMockLookup: null}, createdTime},
};

describe('Mutations (Interface)', () => {
    let base: Base;
    let mutations: Mutations;
    let applyModelChanges: jest.Mock;
    let applyGlobalConfigUpdates: jest.Mock;

    beforeEach(() => {
        const sdk = new InterfaceBlockSdk(mockAirtableInterface);
        base = sdk.base;

        const session = new Session(sdk);
        applyModelChanges = jest.fn();
        applyGlobalConfigUpdates = jest.fn();

        mutations = new Mutations(sdk, session, base, applyModelChanges, applyGlobalConfigUpdates);
    });

    afterEach(() => {
        mockAirtableInterface.reset();
    });

    const makeRecord = (
        id: RecordId,
        cellValuesByFieldId: ObjectMap<FieldId, unknown>,
        createdTime: string,
    ) => {
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        const parentTableData = baseData.tablesById.tblDesignProjects;
        parentTableData.recordsById[id] = {
            id,
            cellValuesByFieldId,
            createdTime,
        };
        parentTableData.recordOrder.push(id);

        const parentRecordStore = base.__getRecordStore(parentTableData.id);

        const newRecord = parentRecordStore.getRecordByIdIfExists(id);

        return newRecord!;
    };

    describe('_assertMutationIsValid', () => {
        describe('SET_MULTIPLE_RECORDS_CELL_VALUES', () => {
            it('throws error when table does not exist', () => {
                const mutation = {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblNonExistent',
                    records: [],
                };

                expect(() => mutations._assertMutationIsValid(mutation)).toThrow(
                    "Can't set cell values: No table with id tblNonExistent exists",
                );
            });

            it('throws error when field does not exist', () => {
                makeRecord('recA', {}, '');

                const mutation = {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recA',
                            cellValuesByFieldId: {
                                fldNonExistent: 'value',
                            },
                        },
                    ],
                };

                expect(() => mutations._assertMutationIsValid(mutation)).toThrow(
                    "Can't set cell values: No field with id fldNonExistent exists in table 'Design projects'",
                );
            });

            it('throws error when field is computed', () => {
                makeRecord('recA', {}, '');
                mockAirtableInterface.fieldTypeProvider.isComputed.mockReturnValue(true);

                const mutation = {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recA',
                            cellValuesByFieldId: {
                                fldPrjctCtgry: 'value',
                            },
                        },
                    ],
                };

                expect(() => mutations._assertMutationIsValid(mutation)).toThrow(
                    "Can't set cell values: Field 'Category' is computed and cannot be set",
                );

                mockAirtableInterface.fieldTypeProvider.isComputed.mockReturnValue(false);
            });

            it('throws error when record does not exist and record store is ready', () => {
                const mutation = {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recNonExistent',
                            cellValuesByFieldId: {
                                fldPrjctCtgry: 'value',
                            },
                        },
                    ],
                };

                expect(() => mutations._assertMutationIsValid(mutation)).toThrow(
                    "Can't set cell values: No record with id recNonExistent exists",
                );
            });

            it('throws error when cell value is invalid for existing record', () => {
                makeRecord('recA', {}, '');

                mockAirtableInterface.fieldTypeProvider.validateCellValueForUpdate.mockReturnValue({
                    isValid: false,
                    reason: 'Invalid value type',
                });

                const mutation = {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recA',
                            cellValuesByFieldId: {
                                fldPrjctCtgry: 'invalid',
                            },
                        },
                    ],
                };

                expect(() => mutations._assertMutationIsValid(mutation)).toThrow(
                    "Can't set cell values: invalid cell value for field 'Category'.\nInvalid value type",
                );

                mockAirtableInterface.fieldTypeProvider.validateCellValueForUpdate.mockReturnValue({
                    isValid: true,
                });
            });

            it('succeeds with valid mutation', () => {
                makeRecord('recA', {}, '');

                const mutation = {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recA',
                            cellValuesByFieldId: {
                                fldPrjctCtgry: 'valid',
                            },
                        },
                    ],
                };

                expect(() => mutations._assertMutationIsValid(mutation)).not.toThrow();
            });
        });

        describe('DELETE_MULTIPLE_RECORDS', () => {
            it('throws error when table does not exist', () => {
                const mutation = {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tblNonExistent',
                    recordIds: ['recA'],
                };

                expect(() => mutations._assertMutationIsValid(mutation)).toThrow(
                    "Can't delete records: No table with id tblNonExistent exists",
                );
            });

            it('throws error when record does not exist and record store is ready', () => {
                const mutation = {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    recordIds: ['recNonExistent'],
                };

                expect(() => mutations._assertMutationIsValid(mutation)).toThrow(
                    "Can't delete records: No record with id recNonExistent exists in table 'Design projects'",
                );
            });

            it('succeeds with valid mutation', () => {
                makeRecord('recA', {}, '');

                const mutation = {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    recordIds: ['recA'],
                };

                expect(() => mutations._assertMutationIsValid(mutation)).not.toThrow();
            });
        });

        describe('CREATE_MULTIPLE_RECORDS', () => {
            it('throws error when table does not exist', () => {
                const mutation = {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tblNonExistent',
                    records: [],
                };

                expect(() => mutations._assertMutationIsValid(mutation)).toThrow(
                    "Can't create records: No table with id tblNonExistent exists",
                );
            });

            it('throws error when field does not exist', () => {
                const mutation = {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recNew',
                            cellValuesByFieldId: {
                                fldNonExistent: 'value',
                            },
                        },
                    ],
                };

                expect(() => mutations._assertMutationIsValid(mutation)).toThrow(
                    "Can't create records: No field with id fldNonExistent exists in table 'Design projects'",
                );
            });

            it('throws error when field is computed', () => {
                mockAirtableInterface.fieldTypeProvider.isComputed.mockReturnValue(true);

                const mutation = {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recNew',
                            cellValuesByFieldId: {
                                fldPrjctCtgry: 'value',
                            },
                        },
                    ],
                };

                expect(() => mutations._assertMutationIsValid(mutation)).toThrow(
                    "Can't set cell values: Field 'Category' is computed and cannot be set",
                );

                mockAirtableInterface.fieldTypeProvider.isComputed.mockReturnValue(false);
            });

            it('throws error when cell value is invalid', () => {
                mockAirtableInterface.fieldTypeProvider.validateCellValueForUpdate.mockReturnValue({
                    isValid: false,
                    reason: 'Invalid value for new record',
                });

                const mutation = {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recNew',
                            cellValuesByFieldId: {
                                fldPrjctCtgry: 'invalid',
                            },
                        },
                    ],
                };

                expect(() => mutations._assertMutationIsValid(mutation)).toThrow(
                    "Can't create records: invalid cell value for field 'Category'.\nInvalid value for new record",
                );

                mockAirtableInterface.fieldTypeProvider.validateCellValueForUpdate.mockReturnValue({
                    isValid: true,
                });
            });

            it('succeeds with valid mutation', () => {
                const mutation = {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recNew',
                            cellValuesByFieldId: {
                                fldPrjctCtgry: 'valid',
                            },
                        },
                    ],
                };

                expect(() => mutations._assertMutationIsValid(mutation)).not.toThrow();
            });
        });

        describe('SET_MULTIPLE_GLOBAL_CONFIG_PATHS', () => {
            it('succeeds without validation (handled by globalConfig)', () => {
                const mutation = {
                    type: MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS,
                    updates: [
                        {
                            path: ['test', 'path'],
                            value: 'test value',
                        },
                    ],
                };

                expect(() => mutations._assertMutationIsValid(mutation)).not.toThrow();
            });
        });

        describe('unhandled mutation type', () => {
            it('throws error for unknown mutation type', () => {
                const mutation = {
                    type: 'UNKNOWN_TYPE' as any,
                    tableId: 'tblDesignProjects',
                    records: [],
                } as any;

                expect(() => mutations._assertMutationIsValid(mutation)).toThrow(
                    'unhandled mutation type: UNKNOWN_TYPE',
                );
            });
        });
    });

    describe('_getOptimisticModelChangesForMutation', () => {
        describe('CREATE_MULTIPLE_RECORDS', () => {
            it('uses default optimistic behavior for CREATE_MULTIPLE_RECORDS', () => {
                const mutation = {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recNew1',
                            cellValuesByFieldId: {
                                fldPrjctName: 'New Project',
                            },
                        },
                    ],
                };

                const modelChanges = mutations._getOptimisticModelChangesForMutation(mutation);

                expect(modelChanges).toBeDefined();
                expect(Array.isArray(modelChanges)).toBe(true);
            });
        });

        describe('DELETE_MULTIPLE_RECORDS', () => {
            beforeEach(() => {
                const recordStore = {
                    recordIds: ['rec1', 'rec2', 'rec3', 'rec4'],
                };
                jest.spyOn(base, '__getRecordStore').mockReturnValue(recordStore as any);
            });

            it('optimistically removes records from recordOrder and calls super', () => {
                const mutation = {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    recordIds: ['rec2', 'rec4'],
                };

                const modelChanges = mutations._getOptimisticModelChangesForMutation(mutation);

                const recordOrderChange = modelChanges.find(change =>
                    change.path.includes('recordOrder'),
                );
                expect(recordOrderChange).toBeDefined();
                expect(recordOrderChange!.path).toEqual([
                    'tablesById',
                    'tblDesignProjects',
                    'recordOrder',
                ]);
                expect(recordOrderChange!.value).toEqual(['rec1', 'rec3']);

                expect(modelChanges.length).toBeGreaterThan(1);
            });

            it('handles empty recordIds gracefully', () => {
                const mutation = {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    recordIds: [],
                };

                const modelChanges = mutations._getOptimisticModelChangesForMutation(mutation);

                const recordOrderChange = modelChanges.find(change =>
                    change.path.includes('recordOrder'),
                );
                expect(recordOrderChange).toBeDefined();
                expect(recordOrderChange!.value).toEqual(['rec1', 'rec2', 'rec3', 'rec4']);
            });

            it('handles deleting all records', () => {
                const mutation = {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    recordIds: ['rec1', 'rec2', 'rec3', 'rec4'],
                };

                const modelChanges = mutations._getOptimisticModelChangesForMutation(mutation);

                const recordOrderChange = modelChanges.find(change =>
                    change.path.includes('recordOrder'),
                );
                expect(recordOrderChange).toBeDefined();
                expect(recordOrderChange!.value).toEqual([]);
            });
        });

        describe('other mutation types', () => {
            it('delegates to super for other mutation types', () => {
                const mutation = {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'rec1',
                            cellValuesByFieldId: {
                                fldPrjctName: 'Updated Project',
                            },
                        },
                    ],
                };

                const modelChanges = mutations._getOptimisticModelChangesForMutation(
                    mutation as any,
                );

                expect(modelChanges).toBeDefined();
                expect(Array.isArray(modelChanges)).toBe(true);
            });
        });
    });

    describe('applyMutationAsync', () => {
        describe('SET_MULTIPLE_RECORDS_CELL_VALUES', () => {
            const validRecord = {
                id: 'recA',
                cellValuesByFieldId: {
                    fldPrjctCtgry: 9,
                },
            };

            it('checks that the table exists', async () => {
                await expect(
                    mutations.applyMutationAsync({
                        type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                        tableId: 'tblNonExistentTableId',
                        records: [],
                    }),
                ).rejects.toThrowErrorMatchingInlineSnapshot(
                    `"Can't set cell values: No table with id tblNonExistentTableId exists"`,
                );
                expect(applyModelChanges.mock.calls.length).toBe(0);
            });

            it('checks that the field exists', async () => {
                makeRecord(validRecord.id, validRecord.cellValuesByFieldId, '');

                await expect(
                    mutations.applyMutationAsync({
                        type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                        tableId: 'tblDesignProjects',
                        records: [{id: validRecord.id, cellValuesByFieldId: {fldNonExistent: {}}}],
                    }),
                ).rejects.toThrowErrorMatchingInlineSnapshot(
                    `"Can't set cell values: No field with id fldNonExistent exists in table 'Design projects'"`,
                );
                expect(applyModelChanges.mock.calls.length).toBe(0);
            });

            it('checks that the field is not computed', async () => {
                makeRecord(validRecord.id, validRecord.cellValuesByFieldId, '');

                mockAirtableInterface.fieldTypeProvider.isComputed.mockReturnValue(true);
                await expect(
                    mutations.applyMutationAsync({
                        type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                        tableId: 'tblDesignProjects',
                        records: [{id: validRecord.id, cellValuesByFieldId: {fldPrjctCtgry: {}}}],
                    }),
                ).rejects.toThrowErrorMatchingInlineSnapshot(
                    `"Can't set cell values: Field 'Category' is computed and cannot be set"`,
                );
                expect(applyModelChanges.mock.calls.length).toBe(0);
            });

            it('fails when batch size limit is exceeded', async () => {
                makeRecord(validRecord.id, validRecord.cellValuesByFieldId, '');

                await expect(
                    mutations.applyMutationAsync({
                        type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                        tableId: 'tblDesignProjects',
                        records: Array.from(new Array(51)).map(() => validRecord),
                    }),
                ).rejects.toThrowErrorMatchingInlineSnapshot(
                    `"Request exceeds maximum batch size limit of 50 items"`,
                );
                expect(applyModelChanges.mock.calls.length).toBe(0);
            });

            it('fails when permission is denied', async () => {
                makeRecord(validRecord.id, validRecord.cellValuesByFieldId, '');

                const mutation = {
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [validRecord],
                };
                mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                    hasPermission: false,
                    reasonDisplayString: 'mock reason',
                });

                await expect(
                    mutations.applyMutationAsync(mutation),
                ).rejects.toThrowErrorMatchingInlineSnapshot(
                    `"Cannot apply setMultipleRecordsCellValues mutation: mock reason"`,
                );

                expect(mockAirtableInterface.checkPermissionsForMutation.mock.calls.length).toBe(1);
                expect(
                    mockAirtableInterface.checkPermissionsForMutation.mock.calls[0][0],
                ).toStrictEqual(mutation);
                expect(applyModelChanges.mock.calls.length).toBe(0);
            });

            it('succeeds when input is valid', async () => {
                makeRecord(validRecord.id, validRecord.cellValuesByFieldId, '');

                await mutations.applyMutationAsync({
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: Array.from(new Array(50)).map(() => validRecord),
                });
                expect(applyModelChanges.mock.calls.length).toBe(1);
            });

            describe('loaded records', () => {
                beforeEach(() => {
                    Object.values(mockRecordsById).forEach(record => {
                        makeRecord(record.id, record.cellValuesByFieldId, record.createdTime);
                    });
                });

                it('checks that the record exists', async () => {
                    expect(
                        mutations.applyMutationAsync({
                            type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                            tableId: 'tblDesignProjects',
                            records: [
                                {
                                    id: 'recNonExistent',
                                    cellValuesByFieldId: {
                                        fldNonExistent: {},
                                    },
                                },
                            ],
                        }),
                    ).rejects.toThrowErrorMatchingInlineSnapshot(
                        `"Can't set cell values: No record with id recNonExistent exists"`,
                    );
                    expect(applyModelChanges.mock.calls.length).toBe(0);
                });

                it('checks that value is valid', async () => {
                    mockAirtableInterface.fieldTypeProvider.validateCellValueForUpdate.mockReturnValue(
                        {isValid: false, reason: 'Mock reason'},
                    );
                    await expect(
                        mutations.applyMutationAsync({
                            type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                            tableId: 'tblDesignProjects',
                            records: [
                                {
                                    id: 'recA',
                                    cellValuesByFieldId: {
                                        fldPrjctCtgry: 9,
                                    },
                                },
                            ],
                        }),
                    ).rejects.toThrowErrorMatchingInlineSnapshot(`
"Can't set cell values: invalid cell value for field 'Category'.
Mock reason"
`);
                    expect(applyModelChanges.mock.calls.length).toBe(0);
                });

                it('succeeds when input is valid', async () => {
                    await mutations.applyMutationAsync({
                        type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                        tableId: 'tblDesignProjects',
                        records: [validRecord],
                    });
                    expect(applyModelChanges.mock.calls.length).toBe(1);
                });
            });
        });

        describe('DELETE_MULTIPLE_RECORDS', () => {
            it('checks that the table exists', async () => {
                expect(
                    mutations.applyMutationAsync({
                        type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                        tableId: 'tblNonExistentTableId',
                        recordIds: [],
                    }),
                ).rejects.toThrowErrorMatchingInlineSnapshot(
                    `"Can't delete records: No table with id tblNonExistentTableId exists"`,
                );
                expect(applyModelChanges.mock.calls.length).toBe(0);
            });

            it('fails when batch size limit is exceeded', async () => {
                const recA = mockRecordsById.recA;
                makeRecord(recA.id, recA.cellValuesByFieldId, recA.createdTime);

                await expect(
                    mutations.applyMutationAsync({
                        type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                        tableId: 'tblDesignProjects',
                        recordIds: Array.from(new Array(51)).map(() => 'recA'),
                    }),
                ).rejects.toThrowErrorMatchingInlineSnapshot(
                    `"Request exceeds maximum batch size limit of 50 items"`,
                );
                expect(applyModelChanges.mock.calls.length).toBe(0);
            });

            it('fails when permission is denied', async () => {
                const recA = mockRecordsById.recA;
                makeRecord(recA.id, recA.cellValuesByFieldId, recA.createdTime);

                const mutation = {
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    recordIds: ['recA'],
                };
                mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                    hasPermission: false,
                    reasonDisplayString: 'mock reason',
                });

                await expect(
                    mutations.applyMutationAsync(mutation),
                ).rejects.toThrowErrorMatchingInlineSnapshot(
                    `"Cannot apply deleteMultipleRecords mutation: mock reason"`,
                );

                expect(mockAirtableInterface.checkPermissionsForMutation.mock.calls.length).toBe(1);
                expect(
                    mockAirtableInterface.checkPermissionsForMutation.mock.calls[0][0],
                ).toStrictEqual(mutation);
                expect(applyModelChanges.mock.calls.length).toBe(0);
            });

            it('succeeds when input is valid', async () => {
                const recA = mockRecordsById.recA;
                makeRecord(recA.id, recA.cellValuesByFieldId, recA.createdTime);

                await mutations.applyMutationAsync({
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    recordIds: Array.from(new Array(50)).map(() => 'recA'),
                });

                expect(applyModelChanges.mock.calls.length).toBe(1);
            });

            describe('loaded records', () => {
                beforeEach(async () => {
                    Object.values(mockRecordsById).forEach(record => {
                        makeRecord(record.id, record.cellValuesByFieldId, record.createdTime);
                    });
                });

                it('checks that the record exists', async () => {
                    await expect(
                        mutations.applyMutationAsync({
                            type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                            tableId: 'tblDesignProjects',
                            recordIds: ['recNonExistent'],
                        }),
                    ).rejects.toThrowErrorMatchingInlineSnapshot(
                        `"Can't delete records: No record with id recNonExistent exists in table 'Design projects'"`,
                    );
                    expect(applyModelChanges.mock.calls.length).toBe(0);
                });

                it('succeeds when input is valid', async () => {
                    const recA = mockRecordsById.recA;
                    makeRecord(recA.id, recA.cellValuesByFieldId, recA.createdTime);
                    const recC = mockRecordsById.recC;
                    makeRecord(recC.id, recC.cellValuesByFieldId, recC.createdTime);

                    await mutations.applyMutationAsync({
                        type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                        tableId: 'tblDesignProjects',
                        recordIds: ['recA', 'recC'],
                    });
                    expect(applyModelChanges.mock.calls.length).toBe(1);
                    expect(
                        applyModelChanges.mock.calls[0][0].sort(compareUpdatePath),
                    ).toStrictEqual([
                        {
                            path: ['tablesById', 'tblDesignProjects', 'recordOrder'],
                            value: ['recB'],
                        },
                        {
                            path: ['tablesById', 'tblDesignProjects', 'recordsById', 'recA'],
                            value: undefined,
                        },
                        {
                            path: ['tablesById', 'tblDesignProjects', 'recordsById', 'recC'],
                            value: undefined,
                        },
                    ]);
                });
            });
        });

        describe('CREATE_MULTIPLE_RECORDS', () => {
            const validRecord = {
                id: 'recD',
                cellValuesByFieldId: {
                    fldPrjctName: 9,
                    fldPrjctCtgry: 10,
                },
            };

            it('checks that the table exists', async () => {
                await expect(
                    mutations.applyMutationAsync({
                        type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                        tableId: 'tblNonExistentTableId',
                        records: [],
                    }),
                ).rejects.toThrowErrorMatchingInlineSnapshot(
                    `"Can't create records: No table with id tblNonExistentTableId exists"`,
                );
                expect(applyModelChanges.mock.calls.length).toBe(0);
            });

            it('checks that the field exists', async () => {
                await expect(
                    mutations.applyMutationAsync({
                        type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                        tableId: 'tblDesignProjects',
                        records: [
                            {
                                id: 'recNonExistent',
                                cellValuesByFieldId: {
                                    fldNonExistent: {},
                                },
                            },
                        ],
                    }),
                ).rejects.toThrowErrorMatchingInlineSnapshot(
                    `"Can't create records: No field with id fldNonExistent exists in table 'Design projects'"`,
                );
                expect(applyModelChanges.mock.calls.length).toBe(0);
            });

            it('checks that the field is not computed', async () => {
                mockAirtableInterface.fieldTypeProvider.isComputed.mockReturnValue(true);
                await expect(
                    mutations.applyMutationAsync({
                        type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                        tableId: 'tblDesignProjects',
                        records: [
                            {
                                id: 'recNonExistent',
                                cellValuesByFieldId: {
                                    fldPrjctCtgry: {},
                                },
                            },
                        ],
                    }),
                ).rejects.toThrowErrorMatchingInlineSnapshot(
                    `"Can't set cell values: Field 'Category' is computed and cannot be set"`,
                );
                expect(applyModelChanges.mock.calls.length).toBe(0);
            });

            it('checks that value is valid', async () => {
                mockAirtableInterface.fieldTypeProvider.validateCellValueForUpdate.mockReturnValue({
                    isValid: false,
                    reason: 'Mock reason',
                });
                await expect(
                    mutations.applyMutationAsync({
                        type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                        tableId: 'tblDesignProjects',
                        records: [
                            {
                                id: 'recA',
                                cellValuesByFieldId: {
                                    fldPrjctCtgry: 9,
                                },
                            },
                        ],
                    }),
                ).rejects.toThrowErrorMatchingInlineSnapshot(`
"Can't create records: invalid cell value for field 'Category'.
Mock reason"
`);
                expect(applyModelChanges.mock.calls.length).toBe(0);
            });

            it('fails when batch size limit is exceeded', async () => {
                await expect(
                    mutations.applyMutationAsync({
                        type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                        tableId: 'tblDesignProjects',
                        records: Array.from(new Array(51)).map(() => validRecord),
                    }),
                ).rejects.toThrowErrorMatchingInlineSnapshot(
                    `"Request exceeds maximum batch size limit of 50 items"`,
                );
                expect(applyModelChanges.mock.calls.length).toBe(0);
            });

            it('fails when permission is denied', async () => {
                const mutation = {
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    records: [validRecord],
                };
                mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                    hasPermission: false,
                    reasonDisplayString: 'mock reason',
                });

                await expect(
                    mutations.applyMutationAsync(mutation),
                ).rejects.toThrowErrorMatchingInlineSnapshot(
                    `"Cannot apply createMultipleRecords mutation: mock reason"`,
                );

                expect(mockAirtableInterface.checkPermissionsForMutation.mock.calls.length).toBe(1);
                expect(
                    mockAirtableInterface.checkPermissionsForMutation.mock.calls[0][0],
                ).toStrictEqual(mutation);
                expect(applyModelChanges.mock.calls.length).toBe(0);
            });

            it('succeeds when input is valid', async () => {
                await mutations.applyMutationAsync({
                    type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    records: Array.from(new Array(50)).map(() => validRecord),
                });
                expect(applyModelChanges.mock.calls.length).toBe(1);
            });

            describe('loaded records', () => {
                beforeEach(async () => {
                    Object.values(mockRecordsById).forEach(record => {
                        makeRecord(record.id, record.cellValuesByFieldId, record.createdTime);
                    });
                });

                it('succeeds when input is valid', async () => {
                    await mutations.applyMutationAsync({
                        type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                        tableId: 'tblDesignProjects',
                        records: [validRecord],
                    });
                    expect(applyModelChanges.mock.calls.length).toBe(1);
                    const changes = applyModelChanges.mock.calls[0][0].sort(compareUpdatePath);
                    expect(Date.parse(changes[0].value.createdTime)).toBeTruthy();
                    changes[0].value.createdTime = '';
                    expect(changes).toStrictEqual([
                        {
                            path: [
                                'tablesById',
                                'tblDesignProjects',
                                'recordsById',
                                validRecord.id,
                            ],
                            value: {
                                id: validRecord.id,
                                cellValuesByFieldId: validRecord.cellValuesByFieldId,
                                createdTime: '',
                            },
                        },
                    ]);
                });
            });
        });

        describe('SET_MULTIPLE_GLOBAL_CONFIG_PATHS', () => {
            const validUpdate = {
                path: ['foo'],
                value: 'bar',
            };

            it('fails when permission is denied', async () => {
                const mutation = {
                    type: MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS,
                    tableId: 'tblDesignProjects',
                    updates: [],
                };
                mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                    hasPermission: false,
                    reasonDisplayString: 'mock reason',
                });

                await expect(
                    mutations.applyMutationAsync(mutation),
                ).rejects.toThrowErrorMatchingInlineSnapshot(
                    `"Cannot apply setMultipleGlobalConfigPaths mutation: mock reason"`,
                );

                expect(mockAirtableInterface.checkPermissionsForMutation.mock.calls.length).toBe(1);
                expect(
                    mockAirtableInterface.checkPermissionsForMutation.mock.calls[0][0],
                ).toStrictEqual(mutation);
                expect(applyGlobalConfigUpdates.mock.calls.length).toBe(0);
            });

            it('fails when batch size limit is exceeded', async () => {
                await expect(
                    mutations.applyMutationAsync({
                        type: MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS,
                        updates: Array.from(new Array(51)).map(() => validUpdate),
                    }),
                ).rejects.toThrowErrorMatchingInlineSnapshot(
                    `"Request exceeds maximum batch size limit of 50 items"`,
                );
                expect(applyGlobalConfigUpdates.mock.calls.length).toBe(0);
            });

            it('forwards updates to injected function', () => {
                mutations.applyMutationAsync({
                    type: MutationTypes.SET_MULTIPLE_GLOBAL_CONFIG_PATHS,
                    updates: [validUpdate],
                });
                expect(applyGlobalConfigUpdates.mock.calls.length).toBe(1);
                expect(applyGlobalConfigUpdates.mock.calls[0].length).toBe(1);
                expect(applyGlobalConfigUpdates.mock.calls[0][0]).toStrictEqual([validUpdate]);
            });
        });

        it('rejects enormous mutations', async () => {
            const recA = mockRecordsById.recA;
            makeRecord(recA.id, recA.cellValuesByFieldId, recA.createdTime);

            await expect(
                mutations.applyMutationAsync({
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: [
                        {
                            id: 'recA',
                            cellValuesByFieldId: {
                                fldPrjctCtgry: 'x'.repeat(2 * 2 ** 20),
                            },
                        },
                    ],
                }),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Request exceeds maximum size limit of 1992294.4 bytes"`,
            );
            expect(applyModelChanges.mock.calls.length).toBe(0);
        });

        it('rejects unrecognized mutation types', async () => {
            const circular: {[key: string]: object} = {};
            circular.circular = circular;

            await expect(
                mutations.applyMutationAsync({
                    type: 'foo' as typeof MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tblNonExistentTableId',
                    recordIds: [(circular as unknown) as string],
                }),
            ).rejects.toThrowErrorMatchingInlineSnapshot(`"unhandled mutation type: foo"`);
            expect(applyModelChanges.mock.calls.length).toBe(0);
        });

        it('rejects when synchronization failures occur and no state changes have been optimistically applied', async () => {
        });

        describe('uncaught exception after optimistic update', () => {
            beforeEach(() => {
                jest.useFakeTimers();
            });

            afterEach(() => {
                jest.runOnlyPendingTimers();
                jest.useRealTimers();
            });

            function flushPromises() {
                return new Promise(resolve => setImmediate(resolve));
            }

            it('produces an uncaught exception when synchronization failures occur and a state change has been optimistically applied', async () => {
                const recA = mockRecordsById.recA;
                makeRecord(recA.id, recA.cellValuesByFieldId, recA.createdTime);

                mockAirtableInterface.applyMutationAsync.mockRejectedValue(new Error('foobar'));

                mutations
                    .applyMutationAsync({
                        type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                        tableId: 'tblDesignProjects',
                        records: [
                            {
                                id: 'recA',
                                cellValuesByFieldId: {
                                    fldPrjctCtgry: 9,
                                },
                            },
                        ],
                    })
                    .then(() => {
                        // eslint-disable-next-line @airtable/blocks/no-throw-new
                        throw new Error('Unexpected fulfillment');
                    });

                await flushPromises();

                let wasErrorCaught = false;
                try {
                    jest.runAllTimers();
                } catch (e) {
                    wasErrorCaught = true;
                    expect(e).toMatchInlineSnapshot(`[Error: foobar]`);
                }
                expect(wasErrorCaught).toBe(true);
            });
        });
    });
});
