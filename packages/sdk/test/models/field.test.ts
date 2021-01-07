import MockAirtableInterface from '../airtable_interface_mocks/mock_airtable_interface_internal';
import Field from '../../src/models/field';
import {FieldType} from '../../src/types/field';
import {__reset, __sdk as sdk} from '../../src';
import {MutationTypes} from '../../src/types/mutations';

let mockAirtableInterface: jest.Mocked<MockAirtableInterface>;
jest.mock('../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default() {
        if (!mockAirtableInterface) {
            mockAirtableInterface = MockAirtableInterface.projectTrackerExample();
        }
        return mockAirtableInterface;
    },
}));

describe('Field', () => {
    let field: Field;

    const makeField = (fieldType: FieldType) => {
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
                        type: 'foreignKey',
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
                        type: 'foreignKey',
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

    describe('#convertStringToCellValue', () => {
        test('request to AirtableInterface: conversion', () => {
            field.convertStringToCellValue('hello');

            expect(
                mockAirtableInterface.fieldTypeProvider.convertStringToCellValue,
            ).toHaveBeenCalledTimes(1);
            expect(
                mockAirtableInterface.fieldTypeProvider.convertStringToCellValue,
            ).toHaveBeenCalledWith(sdk.__appInterface, 'hello', field._data);
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

    describe('#hasPermissionToUpdateOptions', () => {
        test('return value: true', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                hasPermission: true,
            });
            expect(field.hasPermissionToUpdateOptions()).toBe(true);
        });

        test('return value: true', () => {
            mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                hasPermission: false,
                reasonDisplayString: '',
            });
            expect(field.hasPermissionToUpdateOptions()).toBe(false);
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

        test('other types', () => {
            expect(sdk.base.tables[0].fields[3].type).toBe(FieldType.CHECKBOX);
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
            };
            field.watch('description', mocks.description);
            field.watch('isComputed', mocks.isComputed);
            field.watch('name', mocks.name);
            field.watch('options', mocks.options);
            field.watch('type', mocks.type);
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
        });
    });
});
