import MockAirtableInterface from '../airtable_interface_mocks/mock_airtable_interface';
import Base from '../../src/models/base';
import Mutations from '../../src/models/mutations';
import Session from '../../src/models/session';
import {ModelChange} from '../../src/types/base';
import {FieldType} from '../../src/types/field';
import {MutationTypes} from '../../src/types/mutations';
import {FieldTypeConfig} from '../../src/types/airtable_interface';

const mockAirtableInterface = MockAirtableInterface.projectTrackerExample();
jest.mock('../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default: () => mockAirtableInterface,
}));

jest.mock('../../src/models/mutation_constants', () => ({
    MAX_NUM_FIELDS_PER_TABLE: 10,
    MAX_FIELD_NAME_LENGTH: 20,
    MAX_TABLE_NAME_LENGTH: 20,
}));

const compareUpdatePath = (a: ModelChange, b: ModelChange) => {
    return a.path.join('') > b.path.join('') ? 1 : -1;
};

const genericRecordData = {
    cellValuesByFieldId: {fldMockLookup: null},
    commentCount: 0,
    createdTime: new Date().toJSON(),
};
const recordsById = {
    recA: {id: 'recA', ...genericRecordData},
    recB: {id: 'recB', ...genericRecordData},
    recC: {id: 'recC', ...genericRecordData},
};

describe('Mutations', () => {
    let base: Base;
    let mutations: Mutations;
    let applyModelChanges: jest.Mock;
    let applyGlobalConfigUpdates: jest.Mock;

    beforeEach(() => {
        base = new Base(mockAirtableInterface.sdkInitData.baseData, mockAirtableInterface);

        const session = new Session(
            mockAirtableInterface.sdkInitData.baseData,
            mockAirtableInterface,
        );
        applyModelChanges = jest.fn();
        applyGlobalConfigUpdates = jest.fn();

        mutations = new Mutations(
            mockAirtableInterface,
            session,
            base,
            applyModelChanges,
            applyGlobalConfigUpdates,
        );
    });

    afterEach(() => {
        mockAirtableInterface.reset();
    });

    describe('_assertMutationIsValid', () => {
        describe('CREATE_SINGLE_FIELD', () => {
            it('checks that the table exists', () => {
                expect(() => {
                    mutations._assertMutationIsValid({
                        type: MutationTypes.CREATE_SINGLE_FIELD,
                        tableId: 'tblNonExistentTableId',
                        id: 'fldNewFieldId',
                        name: 'new field',
                        config: {
                            type: FieldType.SINGLE_LINE_TEXT,
                        },
                    });
                }).toThrow("Can't create field: No table with id tblNonExistentTableId exists");
            });

            it('checks that the number of fields in the table does not exceed the maximum', () => {
                expect(() => {
                    mutations._assertMutationIsValid({
                        type: MutationTypes.CREATE_SINGLE_FIELD,
                        tableId: 'tblDesignProjects',
                        id: 'fldNewFieldId',
                        name: 'new field',
                        config: {
                            type: FieldType.SINGLE_LINE_TEXT,
                        },
                    });
                }).toThrow("Can't create field: table already has the maximum of 10 fields");
            });

            it('checks the field name', () => {
                expect(() => {
                    mutations._assertMutationIsValid({
                        type: MutationTypes.CREATE_SINGLE_FIELD,
                        tableId: 'tblTasks',
                        id: 'fldNewFieldId',
                        name: '',
                        config: {
                            type: FieldType.SINGLE_LINE_TEXT,
                        },
                    });
                }).toThrow("Can't create field: must provide non-empty name");

                expect(() => {
                    mutations._assertMutationIsValid({
                        type: MutationTypes.CREATE_SINGLE_FIELD,
                        tableId: 'tblTasks',
                        id: 'fldNewFieldId',
                        name: 'really long field name wow',
                        config: {
                            type: FieldType.SINGLE_LINE_TEXT,
                        },
                    });
                }).toThrow(
                    "Can't create field: name 'really long field name wow' exceeds maximum length of 20 characters",
                );

                expect(() => {
                    mutations._assertMutationIsValid({
                        type: MutationTypes.CREATE_SINGLE_FIELD,
                        tableId: 'tblTasks',
                        id: 'fldNewFieldId',
                        name: 'name',
                        config: {
                            type: FieldType.SINGLE_LINE_TEXT,
                        },
                    });
                }).toThrow("Can't create field: field with name 'name' already exists");
            });

            it('validates field config', () => {
                const mockValidate = mockAirtableInterface.fieldTypeProvider.validateConfigForUpdate.mockImplementation(
                    () => {
                        return {isValid: false, reason: 'Mock reason'};
                    },
                );

                const config = {
                    type: FieldType.CHECKBOX,
                    options: {
                        icon: 'heart',
                        color: 'blueBright',
                    },
                };

                expect(() => {
                    mutations._assertMutationIsValid({
                        type: MutationTypes.CREATE_SINGLE_FIELD,
                        tableId: 'tblTasks',
                        id: 'fldNewFieldId',
                        name: 'new field',
                        config,
                    });
                }).toThrow("Can't create field: invalid field config.\nMock reason");

                expect(mockValidate).toHaveBeenCalledTimes(1);
                expect(mockValidate).toHaveBeenCalledWith(
                    mockAirtableInterface.sdkInitData.baseData.appInterface,
                    config,
                    null,
                    null,
                    'pro',
                );
            });

            it('successfully returns when all criteria pass', () => {
                const mockValidate =
                    mockAirtableInterface.fieldTypeProvider.validateConfigForUpdate;
                const config = {
                    type: FieldType.CHECKBOX,
                    options: {
                        icon: 'heart',
                        color: 'blueBright',
                    },
                };

                mutations._assertMutationIsValid({
                    type: MutationTypes.CREATE_SINGLE_FIELD,
                    tableId: 'tblTasks',
                    id: 'fldNewFieldId',
                    name: 'new field',
                    config,
                });

                expect(mockValidate).toHaveBeenCalledTimes(1);
                expect(mockValidate).toHaveBeenCalledWith(
                    mockAirtableInterface.sdkInitData.baseData.appInterface,
                    config,
                    null,
                    null,
                    'pro',
                );
            });
        });

        describe('UPDATE_SINGLE_FIELD', () => {
            it('checks that the table exists', () => {
                expect(() => {
                    mutations._assertMutationIsValid({
                        type: MutationTypes.UPDATE_SINGLE_FIELD_CONFIG,
                        tableId: 'tblNonExistentTableId',
                        id: 'fldNonExistentFieldId',
                        config: {
                            type: FieldType.SINGLE_LINE_TEXT,
                        },
                    });
                }).toThrow("Can't update field: No table with id tblNonExistentTableId exists");
            });
            it('checks that the field exists', () => {
                expect(() => {
                    mutations._assertMutationIsValid({
                        type: MutationTypes.UPDATE_SINGLE_FIELD_CONFIG,
                        tableId: 'tblTasks',
                        id: 'fldNonExistentFieldId',
                        config: {
                            type: FieldType.SINGLE_LINE_TEXT,
                        },
                    });
                }).toThrow("Can't update field: No field with id fldNonExistentFieldId exists");
            });

            it('validates field config', () => {
                let mockValidate = mockAirtableInterface.fieldTypeProvider.validateConfigForUpdate.mockImplementation(
                    () => {
                        return {isValid: false, reason: 'Mock reason'};
                    },
                );

                const oldConfig = {
                    type: FieldType.CHECKBOX,
                    options: {
                        icon: 'check',
                        color: 'greyBright',
                    },
                };
                mockAirtableInterface.fieldTypeProvider.getConfig.mockImplementation(() => {
                    return oldConfig;
                });

                const table = base.getTableById('tblTasks');
                const field = table.getFieldById('fldTaskCompleted');

                const newConfig = {
                    type: FieldType.CHECKBOX,
                    options: {
                        icon: 'heart',
                        color: 'blueBright',
                    },
                };
                expect(() => {
                    mutations._assertMutationIsValid({
                        type: MutationTypes.UPDATE_SINGLE_FIELD_CONFIG,
                        tableId: table.id,
                        id: field.id,
                        config: newConfig,
                    });
                }).toThrow("Can't update field: invalid field config.\nMock reason");

                expect(mockValidate).toHaveBeenCalledTimes(1);
                expect(mockValidate).toHaveBeenCalledWith(
                    mockAirtableInterface.sdkInitData.baseData.appInterface,
                    newConfig,
                    oldConfig,
                    field._data,
                    'pro',
                );

                mockValidate.mockClear();
                mockValidate.mockReturnValue({isValid: true});

                mutations._assertMutationIsValid({
                    type: MutationTypes.UPDATE_SINGLE_FIELD_CONFIG,
                    tableId: table.id,
                    id: field.id,
                    config: newConfig,
                });

                expect(mockValidate).toHaveBeenCalledTimes(1);
                expect(mockValidate).toHaveBeenCalledWith(
                    mockAirtableInterface.sdkInitData.baseData.appInterface,
                    newConfig,
                    oldConfig,
                    field._data,
                    'pro',
                );
            });
        });

        describe('CREATE_SINGLE_TABLE', () => {
            it('checks the table name', () => {
                expect(() => {
                    mutations._assertMutationIsValid({
                        type: MutationTypes.CREATE_SINGLE_TABLE,
                        id: 'fldNewTableId',
                        name: '',
                        fields: [],
                    });
                }).toThrow("Can't create table: must provide non-empty name");

                expect(() => {
                    mutations._assertMutationIsValid({
                        type: MutationTypes.CREATE_SINGLE_TABLE,
                        id: 'fldNewTableId',
                        name: 'design Projects',
                        fields: [],
                    });
                }).toThrow("Can't create table: table with name 'design Projects' already exists");

                expect(() => {
                    mutations._assertMutationIsValid({
                        type: MutationTypes.CREATE_SINGLE_TABLE,
                        id: 'fldNewTableId',
                        name: 'really long table name that is too long',
                        fields: [],
                    });
                }).toThrow(
                    "Can't create table: name 'really long table name that is too long' exceeds maximum length of 20 characters",
                );
            });

            it('checks the number of fields', () => {
                expect(() => {
                    mutations._assertMutationIsValid({
                        type: MutationTypes.CREATE_SINGLE_TABLE,
                        id: 'fldNewTableId',
                        name: 'new table',
                        fields: [],
                    });
                }).toThrow("Can't create table: must specify at least one field");

                const tooManyFields: Array<{name: string; config: FieldTypeConfig}> = [];
                for (let i = 0; i < 11; i++) {
                    tooManyFields.push({
                        name: `field ${i}`,
                        config: {
                            type: FieldType.SINGLE_LINE_TEXT,
                        },
                    });
                }

                expect(() => {
                    mutations._assertMutationIsValid({
                        type: MutationTypes.CREATE_SINGLE_TABLE,
                        id: 'fldNewTableId',
                        name: 'new table',
                        fields: tooManyFields,
                    });
                }).toThrow("Can't create table: number of fields exceeds maximum of 10");
            });

            it('checks the fields have valid name and config', () => {
                expect(() => {
                    mutations._assertMutationIsValid({
                        type: MutationTypes.CREATE_SINGLE_TABLE,
                        id: 'fldNewTableId',
                        name: 'new table',
                        fields: [{name: '', config: {type: FieldType.SINGLE_LINE_TEXT}}],
                    });
                }).toThrow("Can't create table: must provide non-empty name for every field");

                expect(() => {
                    mutations._assertMutationIsValid({
                        type: MutationTypes.CREATE_SINGLE_TABLE,
                        id: 'fldNewTableId',
                        name: 'new table',
                        fields: [
                            {
                                name: 'new field with name that is too long',
                                config: {type: FieldType.SINGLE_LINE_TEXT},
                            },
                        ],
                    });
                }).toThrow(
                    "Can't create table: field name 'new field with name that is too long' exceeds maximum length of 20 characters",
                );

                const mockValidate = mockAirtableInterface.fieldTypeProvider.validateConfigForUpdate.mockImplementation(
                    () => {
                        return {isValid: false, reason: 'Mock reason'};
                    },
                );

                expect(() => {
                    mutations._assertMutationIsValid({
                        type: MutationTypes.CREATE_SINGLE_TABLE,
                        id: 'fldNewTableId',
                        name: 'new table',
                        fields: [{name: 'new field', config: {type: FieldType.SINGLE_LINE_TEXT}}],
                    });
                }).toThrow(
                    "Can't create table: invalid field config for field 'new field'.\nMock reason",
                );

                expect(mockValidate).toHaveBeenCalledTimes(1);
                expect(mockValidate).toHaveBeenCalledWith(
                    mockAirtableInterface.sdkInitData.baseData.appInterface,
                    {type: FieldType.SINGLE_LINE_TEXT},
                    null,
                    null,
                    'pro',
                );
            });

            it('checks the field names for case-insensitive uniqueness', () => {
                expect(() => {
                    mutations._assertMutationIsValid({
                        type: MutationTypes.CREATE_SINGLE_TABLE,
                        id: 'fldNewTableId',
                        name: 'new table',
                        fields: [
                            {name: 'new field', config: {type: FieldType.SINGLE_LINE_TEXT}},
                            {name: 'New Field', config: {type: FieldType.SINGLE_LINE_TEXT}},
                        ],
                    });
                }).toThrow("Can't create table: duplicate field name 'New Field'");
            });

            it('checks the primary field', () => {
                const mockCanBePrimary = mockAirtableInterface.fieldTypeProvider.canBePrimary.mockImplementation(
                    () => {
                        return false;
                    },
                );

                expect(() => {
                    mutations._assertMutationIsValid({
                        type: MutationTypes.CREATE_SINGLE_TABLE,
                        id: 'fldNewTableId',
                        name: 'new table',
                        fields: [{name: 'new field', config: {type: FieldType.FORMULA}}],
                    });
                }).toThrow(
                    "Can't create table: first field 'new field' has type 'formula' which cannot be a primary field",
                );

                expect(mockCanBePrimary).toHaveBeenCalledTimes(1);
                expect(mockCanBePrimary).toHaveBeenCalledWith(
                    mockAirtableInterface.sdkInitData.baseData.appInterface,
                    {type: FieldType.FORMULA},
                    'pro',
                );
            });

            it('successfully returns when all criteria pass', () => {
                const mockValidate =
                    mockAirtableInterface.fieldTypeProvider.validateConfigForUpdate;
                const mockCanBePrimary = mockAirtableInterface.fieldTypeProvider.canBePrimary;

                mutations._assertMutationIsValid({
                    type: MutationTypes.CREATE_SINGLE_TABLE,
                    id: 'fldNewTableId',
                    name: 'new table',
                    fields: [{name: 'new field', config: {type: FieldType.SINGLE_LINE_TEXT}}],
                });

                expect(mockValidate).toHaveBeenCalledTimes(1);
                expect(mockValidate).toHaveBeenCalledWith(
                    mockAirtableInterface.sdkInitData.baseData.appInterface,
                    {type: FieldType.SINGLE_LINE_TEXT},
                    null,
                    null,
                    'pro',
                );

                expect(mockCanBePrimary).toHaveBeenCalledTimes(1);
                expect(mockCanBePrimary).toHaveBeenCalledWith(
                    mockAirtableInterface.sdkInitData.baseData.appInterface,
                    {
                        type: FieldType.SINGLE_LINE_TEXT,
                    },
                    'pro',
                );
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
                await expect(
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
                    `"Can't set cell values: No field with id fldNonExistent exists in table 'Design projects'"`,
                );
                expect(applyModelChanges.mock.calls.length).toBe(0);
            });

            it('checks that the field is not computed', async () => {
                mockAirtableInterface.fieldTypeProvider.isComputed.mockReturnValue(true);
                await expect(
                    mutations.applyMutationAsync({
                        type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
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

            it('fails when batch size limit is exceeded', async () => {
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
                await mutations.applyMutationAsync({
                    type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                    tableId: 'tblDesignProjects',
                    records: Array.from(new Array(50)).map(() => validRecord),
                });
                expect(applyModelChanges.mock.calls.length).toBe(0);
            });

            describe('loaded records', () => {
                beforeEach(() => {
                    mockAirtableInterface.fetchAndSubscribeToTableDataAsync.mockResolvedValue({
                        recordsById,
                    });
                    mockAirtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync.mockResolvedValue(
                        {
                            recordsById,
                        },
                    );
                    return base.tables[0].selectRecordsAsync();
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

                it('succeeds when input is valid', () =>
                    mutations.applyMutationAsync({
                        type: MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES,
                        tableId: 'tblDesignProjects',
                        records: [validRecord],
                    }));
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
                await mutations.applyMutationAsync({
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    recordIds: Array.from(new Array(50)).map(() => 'recA'),
                });

                expect(applyModelChanges.mock.calls.length).toBe(0);
            });

            describe('loaded records', () => {
                beforeEach(async () => {
                    mockAirtableInterface.fetchAndSubscribeToTableDataAsync.mockResolvedValue({
                        recordsById,
                    });
                    mockAirtableInterface.fetchAndSubscribeToViewDataAsync.mockResolvedValue({
                        visibleRecordIds: ['recA', 'recB', 'recC'],
                        fieldOrder: {
                            fieldIds: ['fldPrjctName', 'fldPrjctClient'],
                            visibleFieldCount: 2,
                        },
                        colorsByRecordId: {},
                    });
                    mockAirtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync.mockResolvedValue(
                        {
                            recordsById,
                        },
                    );

                    await base.tables[0].views[0].selectMetadataAsync();
                    await base.tables[0].selectRecordsAsync();
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
                            path: ['tablesById', 'tblDesignProjects', 'recordsById', 'recA'],
                            value: undefined,
                        },
                        {
                            path: ['tablesById', 'tblDesignProjects', 'recordsById', 'recC'],
                            value: undefined,
                        },
                        {
                            path: [
                                'tablesById',
                                'tblDesignProjects',
                                'viewsById',
                                'viwPrjctAll',
                                'visibleRecordIds',
                            ],
                            value: ['recB'],
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
                expect(applyModelChanges.mock.calls.length).toBe(0);
            });

            describe('loaded records', () => {
                beforeEach(async () => {
                    mockAirtableInterface.fetchAndSubscribeToTableDataAsync.mockResolvedValue({
                        recordsById,
                    });
                    mockAirtableInterface.fetchAndSubscribeToViewDataAsync.mockResolvedValue({
                        visibleRecordIds: ['recA', 'recB', 'recC'],
                        fieldOrder: {
                            fieldIds: ['fldPrjctName', 'fldPrjctClient'],
                            visibleFieldCount: 2,
                        },
                        colorsByRecordId: {},
                    });
                    mockAirtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync.mockResolvedValue(
                        {
                            recordsById,
                        },
                    );

                    await base.tables[0].views[0].selectMetadataAsync();
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
                            path: ['tablesById', 'tblDesignProjects', 'recordsById', 'recD'],
                            value: {
                                id: 'recD',
                                cellValuesByFieldId: {
                                    fldPrjctName: 9,
                                },
                                commentCount: 0,
                                createdTime: '',
                            },
                        },
                        {
                            path: [
                                'tablesById',
                                'tblDesignProjects',
                                'viewsById',
                                'viwPrjctAll',
                                'visibleRecordIds',
                            ],
                            value: ['recA', 'recB', 'recC', 'recD'],
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

        describe('CREATE_SINGLE_FIELD', () => {
            it('succeeds when input is valid', async () => {
                await mutations.applyMutationAsync({
                    type: MutationTypes.CREATE_SINGLE_FIELD,
                    tableId: 'tblTasks',
                    name: 'foo',
                    id: 'fldNew',
                    config: {
                        type: FieldType.SINGLE_LINE_TEXT,
                    },
                });

                expect(applyModelChanges.mock.calls.length).toBe(0);
            });
        });

        describe('UPDATE_SINGLE_FIELD_CONFIG', () => {
            it('succeeds when input is valid', async () => {
                await mutations.applyMutationAsync({
                    type: MutationTypes.UPDATE_SINGLE_FIELD_CONFIG,
                    tableId: 'tblTasks',
                    id: 'fldTaskNotes',
                    config: {
                        type: FieldType.SINGLE_LINE_TEXT,
                    },
                });

                expect(applyModelChanges.mock.calls.length).toBe(0);
            });
        });

        describe('CREATE_SINGLE_TABLE', () => {
            it('succeeds when input is valid', async () => {
                await mutations.applyMutationAsync({
                    type: MutationTypes.CREATE_SINGLE_TABLE,
                    id: 'tblNew',
                    name: 'foo',
                    fields: [
                        {
                            name: 'bar',
                            config: {
                                type: FieldType.SINGLE_LINE_TEXT,
                            },
                        },
                    ],
                });

                expect(applyModelChanges.mock.calls.length).toBe(0);
            });
        });

        it('rejects enormous mutations', async () => {
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
            ).rejects.toThrowErrorMatchingInlineSnapshot(`"Unknown value foo for mutation type"`);
            expect(applyModelChanges.mock.calls.length).toBe(0);
        });

        it('rejects when synchronization failures occur and no state changes have been optimistically applied', async () => {
            mockAirtableInterface.applyMutationAsync.mockRejectedValue(new Error('foobar'));
            await expect(
                mutations.applyMutationAsync({
                    type: MutationTypes.DELETE_MULTIPLE_RECORDS,
                    tableId: 'tblDesignProjects',
                    recordIds: [],
                }),
            ).rejects.toThrowErrorMatchingInlineSnapshot(`"foobar"`);
        });

        it('produces an uncaught exception when synchronization failures occur and a state change has been optimistically applied', async () => {
            mockAirtableInterface.fetchAndSubscribeToTableDataAsync.mockResolvedValue({
                recordsById,
            });
            mockAirtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync.mockResolvedValue({
                recordsById,
            });
            await base.tables[0].selectRecordsAsync();

            mockAirtableInterface.applyMutationAsync.mockRejectedValue(new Error('foobar'));

            const applyPromise = mutations
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
                    throw new Error('Unexpected fulfillment');
                });
            const uncaughtException = new Promise(resolve => {
                window.onerror = () => {
                    resolve();
                    return true;
                };
            });

            try {
                await Promise.race([applyPromise, uncaughtException]);
            } finally {
                window.onerror = null;
            }
        });
    });
});
