import MockAirtableInterface from '../airtable_interface_mocks/mock_airtable_interface';
import Base from '../../src/models/base';
import Mutations from '../../src/models/mutations';
import Session from '../../src/models/session';
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

describe('Mutations', () => {
    let base: Base;
    let mutations: Mutations;

    beforeEach(() => {
        base = new Base(mockAirtableInterface.sdkInitData.baseData, mockAirtableInterface);

        const session = new Session(
            mockAirtableInterface.sdkInitData.baseData,
            mockAirtableInterface,
        );

        mutations = new Mutations(
            mockAirtableInterface,
            session,
            base,
            changes => null,
            updates => null,
        );
    });

    let afterCallbacks: Array<() => void> = [];
    const after = (cb: () => void) => afterCallbacks.push(cb);
    afterEach(() => {
        for (const cb of afterCallbacks) {
            cb();
        }
        afterCallbacks = [];
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
                        tableId: 'tbly388E8NA1CNhnF',
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
                        tableId: 'tblcstEo50YXLJcK4',
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
                        tableId: 'tblcstEo50YXLJcK4',
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
                        tableId: 'tblcstEo50YXLJcK4',
                        id: 'fldNewFieldId',
                        name: 'name',
                        config: {
                            type: FieldType.SINGLE_LINE_TEXT,
                        },
                    });
                }).toThrow("Can't create field: field with name 'name' already exists");
            });

            it('validates field config', () => {
                const mockValidate = jest
                    .spyOn(mockAirtableInterface.fieldTypeProvider, 'validateConfigForUpdate')
                    .mockImplementation(() => {
                        return {isValid: false, reason: 'Mock reason'};
                    });
                after(() => mockValidate.mockRestore());

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
                        tableId: 'tblcstEo50YXLJcK4',
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
                const mockValidate = jest.spyOn(
                    mockAirtableInterface.fieldTypeProvider,
                    'validateConfigForUpdate',
                );
                after(() => mockValidate.mockRestore());

                const config = {
                    type: FieldType.CHECKBOX,
                    options: {
                        icon: 'heart',
                        color: 'blueBright',
                    },
                };

                mutations._assertMutationIsValid({
                    type: MutationTypes.CREATE_SINGLE_FIELD,
                    tableId: 'tblcstEo50YXLJcK4',
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
                        tableId: 'tblcstEo50YXLJcK4',
                        id: 'fldNonExistentFieldId',
                        config: {
                            type: FieldType.SINGLE_LINE_TEXT,
                        },
                    });
                }).toThrow("Can't update field: No field with id fldNonExistentFieldId exists");
            });

            it('validates field config', () => {
                let mockValidate = jest
                    .spyOn(mockAirtableInterface.fieldTypeProvider, 'validateConfigForUpdate')
                    .mockImplementation(() => {
                        return {isValid: false, reason: 'Mock reason'};
                    });
                after(() => mockValidate.mockRestore());

                const oldConfig = {
                    type: FieldType.CHECKBOX,
                    options: {
                        icon: 'check',
                        color: 'greyBright',
                    },
                };
                jest.spyOn(mockAirtableInterface.fieldTypeProvider, 'getConfig').mockImplementation(
                    () => {
                        return oldConfig;
                    },
                );

                const table = base.getTableById('tblcstEo50YXLJcK4');
                const field = table.getFieldById('fldX2QXZGxsqj7YC0');

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
                mockValidate.mockRestore();

                mockValidate = jest.spyOn(
                    mockAirtableInterface.fieldTypeProvider,
                    'validateConfigForUpdate',
                );
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

                const mockValidate = jest
                    .spyOn(mockAirtableInterface.fieldTypeProvider, 'validateConfigForUpdate')
                    .mockImplementation(() => {
                        return {isValid: false, reason: 'Mock reason'};
                    });
                after(() => mockValidate.mockRestore());

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
                const mockCanBePrimary = jest
                    .spyOn(mockAirtableInterface.fieldTypeProvider, 'canBePrimary')
                    .mockImplementation(() => {
                        return false;
                    });
                after(() => mockCanBePrimary.mockRestore());

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
                const mockValidate = jest.spyOn(
                    mockAirtableInterface.fieldTypeProvider,
                    'validateConfigForUpdate',
                );
                const mockCanBePrimary = jest.spyOn(
                    mockAirtableInterface.fieldTypeProvider,
                    'canBePrimary',
                );
                after(() => mockValidate.mockRestore());
                after(() => mockCanBePrimary.mockRestore());

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
});
