import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import Field from '../../../src/base/models/field';
import {FieldType} from '../../../src/shared/types/field_core';
import {__reset, __sdk as sdk} from '../../../src/base';
import {MutationTypes} from '../../../src/base/types/mutations';
import getAirtableInterface from '../../../src/injected/airtable_interface';

jest.mock('../../../src/injected/airtable_interface', () => {
    let mockAirtableInterface: jest.Mocked<MockAirtableInterface>;
    return {
        __esModule: true,
        default() {
            if (!mockAirtableInterface) {
                mockAirtableInterface = MockAirtableInterface.projectTrackerExample();
            }
            return mockAirtableInterface;
        },
    };
});

const mockAirtableInterface = getAirtableInterface() as jest.Mocked<MockAirtableInterface>;

describe('Field', () => {
    let field: Field;

    const makeField = (fieldType: FieldType) => {
        return makeFieldWithIsSynced(fieldType, null);
    };

    const makeFieldWithIsSynced = (fieldType: FieldType, isSynced: boolean | null) => {
        const fieldId = 'fldTest';
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        const parentTable = baseData.tablesById.tblDesignProjects;
        parentTable.fieldsById[fieldId] = {
            id: fieldId,
            name: 'Field 1',
            type: '',
            typeOptions: null,
            description: null,
            lock: null,
            isSynced: isSynced,
        };

        const newField = new Field(sdk, sdk.base.getTableById('tblDesignProjects'), fieldId);

        Object.defineProperty(newField, 'type', {
            get: jest.fn(() => fieldType),
        });

        return newField;
    };

    beforeEach(() => {
        field = sdk.base.tables[0].fields[1];
    });

    afterEach(() => {
        mockAirtableInterface.reset();
        __reset();
    });

    describe('updateOptionsAsync', () => {
        it('accepts non-null field options', async () => {
            const newField = makeField(FieldType.SINGLE_SELECT);

            await newField.updateOptionsAsync({
                choices: [{name: 'pick me'}],
            });

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenCalledTimes(1);
            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.UPDATE_SINGLE_FIELD_CONFIG,
                    tableId: 'tblDesignProjects',
                    id: 'fldTest',
                    config: {
                        type: FieldType.SINGLE_SELECT,
                        options: {
                            choices: [{name: 'pick me'}],
                        },
                    },
                    opts: {},
                },
                {holdForMs: 100},
            );
        });
    });

    test.skip('#availableAggregators', () => {});

    describe('#checkPermissionsForUpdateOptions', () => {
        test('request to AirtableInterface - without options', () => {
            field.checkPermissionsForUpdateOptions();

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenCalledTimes(1);
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenCalledWith(
                {
                    config: {
                        options: undefined,
                        type: 'multipleRecordLinks',
                    },
                    id: 'fldPrjctClient',
                    tableId: 'tblDesignProjects',
                    type: 'updateSingleFieldConfig',
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        test('request to AirtableInterface - with options', () => {
            field.checkPermissionsForUpdateOptions({foo: 'bar'});
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenCalledTimes(1);
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenCalledWith(
                {
                    config: {
                        options: {foo: 'bar'},
                        type: 'multipleRecordLinks',
                    },
                    id: 'fldPrjctClient',
                    tableId: 'tblDesignProjects',
                    type: 'updateSingleFieldConfig',
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        test('forwarding of response from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                hasPermission: true,
            });
            expect(field.checkPermissionsForUpdateOptions()).toStrictEqual({
                hasPermission: true,
            });
        });
    });

    describe('#hasPermissionToUpdateOptions', () => {
        test('return value: true', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                hasPermission: true,
            });
            expect(field.hasPermissionToUpdateOptions()).toBe(true);
        });

        test('return value: false', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                hasPermission: false,
                reasonDisplayString: '',
            });
            expect(field.hasPermissionToUpdateOptions()).toBe(false);
        });
    });

    describe('updateDescriptionAsync', () => {
        it('accepts non-null description', async () => {
            await field.updateDescriptionAsync('This is a field');

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenCalledTimes(1);
            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    tableId: 'tblDesignProjects',
                    id: 'fldPrjctClient',
                    description: 'This is a field',
                    type: 'updateSingleFieldDescription',
                },
                {holdForMs: 100},
            );
        });
    });

    describe('#checkPermissionsForUpdateDescription', () => {
        test('request to AirtableInterface - without description', () => {
            field.checkPermissionsForUpdateDescription();

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenCalledTimes(1);
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenCalledWith(
                {
                    description: undefined,
                    id: 'fldPrjctClient',
                    tableId: 'tblDesignProjects',
                    type: 'updateSingleFieldDescription',
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        test('request to AirtableInterface - with description', () => {
            field.checkPermissionsForUpdateDescription('This is a field');
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenCalledTimes(1);
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenCalledWith(
                {
                    description: 'This is a field',
                    id: 'fldPrjctClient',
                    tableId: 'tblDesignProjects',
                    type: 'updateSingleFieldDescription',
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        test('forwarding of response from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                hasPermission: true,
            });
            expect(field.checkPermissionsForUpdateDescription()).toStrictEqual({
                hasPermission: true,
            });
        });
    });

    describe('#hasPermissionToUpdateDescription', () => {
        test('return value: true', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                hasPermission: true,
            });
            expect(field.hasPermissionToUpdateDescription()).toBe(true);
        });

        test('return value: false', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                hasPermission: false,
                reasonDisplayString: '',
            });
            expect(field.hasPermissionToUpdateDescription()).toBe(false);
        });
    });

    describe('updateNameAsync', () => {
        it('accepts non-null name', async () => {
            const fieldName = 'my awesome name';
            await field.updateNameAsync(fieldName);

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenCalledTimes(1);
            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    tableId: 'tblDesignProjects',
                    id: 'fldPrjctClient',
                    name: fieldName,
                    type: 'updateSingleFieldName',
                },
                {holdForMs: 100},
            );
        });
    });

    describe('#checkPermissionsForUpdateName', () => {
        test('request to AirtableInterface - without name', () => {
            field.checkPermissionsForUpdateName();

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenCalledTimes(1);
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenCalledWith(
                {
                    name: undefined,
                    id: 'fldPrjctClient',
                    tableId: 'tblDesignProjects',
                    type: 'updateSingleFieldName',
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        test('request to AirtableInterface - with name', () => {
            const fieldName = 'a cool name';
            field.checkPermissionsForUpdateName(fieldName);
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenCalledTimes(1);
            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenCalledWith(
                {
                    name: fieldName,
                    id: 'fldPrjctClient',
                    tableId: 'tblDesignProjects',
                    type: 'updateSingleFieldName',
                },
                mockAirtableInterface.sdkInitData.baseData,
            );
        });

        test('forwarding of response from AirtableInterface', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                hasPermission: true,
            });
            expect(field.checkPermissionsForUpdateName()).toStrictEqual({
                hasPermission: true,
            });
        });
    });

    describe('#hasPermissionToUpdateName', () => {
        test('return value: true', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                hasPermission: true,
            });
            expect(field.hasPermissionToUpdateName()).toBe(true);
        });

        test('return value: false', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                hasPermission: false,
                reasonDisplayString: '',
            });
            expect(field.hasPermissionToUpdateName()).toBe(false);
        });
    });

    describe('#convertStringToCellValue', () => {
        test('request to AirtableInterface: conversion', () => {
            field.convertStringToCellValue('hello');

            expect(
                mockAirtableInterface.fieldTypeProvider.convertStringToCellValue,
            ).toHaveBeenCalledTimes(1);
            expect(
                mockAirtableInterface.fieldTypeProvider.convertStringToCellValue,
            ).toHaveBeenCalledWith(sdk.__appInterface, 'hello', field._data, {
                parseDateCellValueInColumnTimeZone: false,
            });
        });

        test('computed value (no validation applied)', () => {
            mockAirtableInterface.fieldTypeProvider.convertStringToCellValue.mockReturnValue(
                'converted value 1',
            );
            mockAirtableInterface.fieldTypeProvider.validateCellValueForUpdate.mockReturnValue({
                isValid: false,
                reason: '',
            });
            mockAirtableInterface.fieldTypeProvider.isComputed.mockReturnValue(true);

            expect(field.convertStringToCellValue('hello')).toBe('converted value 1');
        });

        test('request to AirtableInterface: validation', () => {
            mockAirtableInterface.fieldTypeProvider.convertStringToCellValue.mockReturnValue(
                'converted value 2',
            );

            field.convertStringToCellValue('hello');

            expect(
                mockAirtableInterface.fieldTypeProvider.validateCellValueForUpdate,
            ).toHaveBeenCalledTimes(1);
            expect(
                mockAirtableInterface.fieldTypeProvider.validateCellValueForUpdate,
            ).toHaveBeenCalledWith(sdk.__appInterface, 'converted value 2', null, field._data);
        });

        test('non-computed value, passing validation', () => {
            mockAirtableInterface.fieldTypeProvider.convertStringToCellValue.mockReturnValue(
                'converted value 3',
            );
            mockAirtableInterface.fieldTypeProvider.validateCellValueForUpdate.mockReturnValue({
                isValid: true,
            });
            mockAirtableInterface.fieldTypeProvider.isComputed.mockReturnValue(false);

            expect(field.convertStringToCellValue('hello')).toBe('converted value 3');
        });

        test('non-computed value, passing validation', () => {
            mockAirtableInterface.fieldTypeProvider.convertStringToCellValue.mockReturnValue(
                'converted value 4',
            );
            mockAirtableInterface.fieldTypeProvider.validateCellValueForUpdate.mockReturnValue({
                isValid: false,
                reason: '',
            });
            mockAirtableInterface.fieldTypeProvider.isComputed.mockReturnValue(false);

            expect(field.convertStringToCellValue('hello')).toBe(null);
        });
    });

    test('#description', () => {
        expect(field.description).toBe('the project client');
    });

    describe('#isFieldSynced', () => {
        test('null', () => {
            const newField = makeFieldWithIsSynced(FieldType.SINGLE_SELECT, null);
            expect(newField.isFieldSynced).toBe(false);
        });

        test('affirmative', () => {
            const newField = makeFieldWithIsSynced(FieldType.SINGLE_SELECT, true);
            expect(newField.isFieldSynced).toBe(true);
        });

        test('negative', () => {
            const newField = makeFieldWithIsSynced(FieldType.SINGLE_SELECT, false);
            expect(newField.isFieldSynced).toBe(false);
        });
    });

    describe('#isComputed', () => {
        test('affirmative', () => {
            mockAirtableInterface.fieldTypeProvider.isComputed.mockReturnValue(true);

            expect(field.isComputed).toBe(true);
        });

        test('negative', () => {
            expect(field.isComputed).toBe(false);
        });
    });

    describe('#isDeleted', () => {
        test('affirmative', () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblDesignProjects', 'fieldsById', 'fldPrjctClient'],
                    value: null,
                },
            ]);

            expect(field.isDeleted).toBe(true);
        });

        test('negative', () => {
            expect(field.isDeleted).toBe(false);
        });
    });

    describe('#isPrimaryField', () => {
        test('affirmative', () => {
            expect(sdk.base.tables[0].fields[0].isPrimaryField).toBe(true);
        });

        test('negative', () => {
            expect(field.isPrimaryField).toBe(false);
        });
    });

    test('#name', () => {
        expect(field.name).toBe('Client');
    });

    describe('#options', () => {
        test('no options available', () => {
            expect(sdk.base.tables[0].fields[0].options).toBe(null);
        });

        test('options available', () => {
            expect(field.options).toStrictEqual({
                foreignTableId: 'tblClients',
                relationship: 'many',
                symmetricColumnId: 'fldClientProjects',
            });
        });
    });

    describe('#type', () => {
        test('lookup type', () => {
            mockAirtableInterface.sdkInitData.baseData.tablesById.tblDesignProjects.fieldsById.fldPrjctClient.type =
                'lookup';
            expect(field.type).toBe(FieldType.MULTIPLE_LOOKUP_VALUES);
        });

        test('ensure cache for type updates changes', () => {
            mockAirtableInterface.sdkInitData.baseData.tablesById.tblDesignProjects.fieldsById.fldPrjctClient.type =
                'lookup';
            expect(field.type).toBe(FieldType.MULTIPLE_LOOKUP_VALUES);

            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblDesignProjects',
                        'fieldsById',
                        'fldPrjctClient',
                        'type',
                    ],
                    value: FieldType.SINGLE_SELECT,
                },
            ]);
            expect(field.type).toBe(FieldType.SINGLE_SELECT);
        });

        test('other types', () => {
            expect(sdk.base.tables[0].fields[3].type).toBe(FieldType.CHECKBOX);
        });
    });

    describe('#config', () => {
        test('lookup config', () => {
            mockAirtableInterface.sdkInitData.baseData.tablesById.tblDesignProjects.fieldsById.fldPrjctClient.type =
                'lookup';
            expect(field.config).toStrictEqual({
                type: FieldType.MULTIPLE_LOOKUP_VALUES,
                options: {
                    foreignTableId: 'tblClients',
                    relationship: 'many',
                    symmetricColumnId: 'fldClientProjects',
                },
            });
        });
    });

    describe('#watch', () => {
        let mocks: {[key: string]: jest.Mock};

        beforeEach(() => {
            mocks = {
                description: jest.fn(),
                isComputed: jest.fn(),
                name: jest.fn(),
                options: jest.fn(),
                type: jest.fn(),
                isFieldSynced: jest.fn(),
            };
            field.watch('description', mocks.description);
            field.watch('isComputed', mocks.isComputed);
            field.watch('name', mocks.name);
            field.watch('options', mocks.options);
            field.watch('type', mocks.type);
            field.watch('isFieldSynced', mocks.isFieldSynced);
        });

        test('key: description', () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblDesignProjects',
                        'fieldsById',
                        'fldPrjctClient',
                        'description',
                    ],
                    value: 'some other description',
                },
            ]);

            expect(mocks.description).toHaveBeenCalledTimes(1);
            expect(mocks.isComputed).toHaveBeenCalledTimes(0);
            expect(mocks.name).toHaveBeenCalledTimes(0);
            expect(mocks.options).toHaveBeenCalledTimes(0);
            expect(mocks.type).toHaveBeenCalledTimes(0);
            expect(mocks.isFieldSynced).toHaveBeenCalledTimes(0);
        });

        test('key: isComputed', () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblDesignProjects',
                        'fieldsById',
                        'fldPrjctClient',
                        'type',
                    ],
                    value: 'select',
                },
            ]);

            expect(mocks.description).toHaveBeenCalledTimes(0);
            expect(mocks.isComputed).toHaveBeenCalledTimes(1);
            expect(mocks.name).toHaveBeenCalledTimes(0);
            expect(mocks.options).toHaveBeenCalledTimes(0);
            expect(mocks.type).toHaveBeenCalledTimes(1);
            expect(mocks.isFieldSynced).toHaveBeenCalledTimes(0);
        });

        test('key: name', () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblDesignProjects',
                        'fieldsById',
                        'fldPrjctClient',
                        'name',
                    ],
                    value: 'some other name',
                },
            ]);

            expect(mocks.description).toHaveBeenCalledTimes(0);
            expect(mocks.isComputed).toHaveBeenCalledTimes(0);
            expect(mocks.name).toHaveBeenCalledTimes(1);
            expect(mocks.options).toHaveBeenCalledTimes(0);
            expect(mocks.type).toHaveBeenCalledTimes(0);
            expect(mocks.isFieldSynced).toHaveBeenCalledTimes(0);
        });

        test('key: options', () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblDesignProjects',
                        'fieldsById',
                        'fldPrjctClient',
                        'typeOptions',
                    ],
                    value: {},
                },
            ]);

            expect(mocks.description).toHaveBeenCalledTimes(0);
            expect(mocks.isComputed).toHaveBeenCalledTimes(0);
            expect(mocks.name).toHaveBeenCalledTimes(0);
            expect(mocks.options).toHaveBeenCalledTimes(1);
            expect(mocks.type).toHaveBeenCalledTimes(0);
            expect(mocks.isFieldSynced).toHaveBeenCalledTimes(0);
        });

        test('key: type', () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblDesignProjects',
                        'fieldsById',
                        'fldPrjctClient',
                        'type',
                    ],
                    value: 'select',
                },
            ]);

            expect(mocks.description).toHaveBeenCalledTimes(0);
            expect(mocks.isComputed).toHaveBeenCalledTimes(1);
            expect(mocks.name).toHaveBeenCalledTimes(0);
            expect(mocks.options).toHaveBeenCalledTimes(0);
            expect(mocks.type).toHaveBeenCalledTimes(1);
            expect(mocks.isFieldSynced).toHaveBeenCalledTimes(0);
        });

        test('key: isFieldSynced', () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: [
                        'tablesById',
                        'tblDesignProjects',
                        'fieldsById',
                        'fldPrjctClient',
                        'isSynced',
                    ],
                    value: 'true',
                },
            ]);

            expect(mocks.description).toHaveBeenCalledTimes(0);
            expect(mocks.isComputed).toHaveBeenCalledTimes(0);
            expect(mocks.name).toHaveBeenCalledTimes(0);
            expect(mocks.options).toHaveBeenCalledTimes(0);
            expect(mocks.type).toHaveBeenCalledTimes(0);
            expect(mocks.isFieldSynced).toHaveBeenCalledTimes(1);
        });
    });
});
