import MockAirtableInterface from '../airtable_interface_mocks/mock_airtable_interface';
import Field from '../../src/models/field';
import {FieldType} from '../../src/types/field';
import {MutationTypes} from '../../src/types/mutations';

const mockAirtableInterface = MockAirtableInterface.projectTrackerExample();
jest.mock('../../src/injected/airtable_interface', () => () => mockAirtableInterface);

let mockMutations: any;
jest.mock('../../src/get_sdk', () => () => ({
    __mutations: mockMutations,
    runInfo: {
        isDevelopment: true,
    },
}));

describe('Field', () => {
    describe('updateOptionsAsync', () => {
        const makeField = (fieldType: FieldType) => {
            const baseData = {
                tablesById: {
                    tblTest: {
                        fieldsById: {
                            fldTest: {
                                name: 'Field 1',
                            },
                        },
                    },
                },
            } as any;
            const parentTable = {id: 'tblTest'} as any;
            const fieldId = 'fldTest';

            const field = new Field(baseData, parentTable, fieldId);

            Object.defineProperty(field, 'type', {
                get: jest.fn(() => fieldType),
            });

            return field;
        };

        beforeEach(() => {
            mockMutations = {
                applyMutationAsync: jest.fn(),
            };
        });

        it('accepts non-null field options', async () => {
            const field = makeField(FieldType.SINGLE_SELECT);

            await field.updateOptionsAsync({
                choices: [{name: 'pick me'}],
            });

            expect(mockMutations.applyMutationAsync).toHaveBeenCalledTimes(1);
            expect(mockMutations.applyMutationAsync).toHaveBeenLastCalledWith({
                type: MutationTypes.UPDATE_SINGLE_FIELD_CONFIG,
                tableId: 'tblTest',
                id: 'fldTest',
                config: {
                    type: FieldType.SINGLE_SELECT,
                    options: {
                        choices: [{name: 'pick me'}],
                    },
                },
            });
        });
    });
});
