import Table from '../../src/models/table';
import getAirtableInterface from '../../src/injected/airtable_interface';
import {MutationTypes} from '../../src/types/mutations';
import warning from '../../src/warning';

jest.mock('../../src/injected/airtable_interface', () => () => ({
    idGenerator: {
        generateRecordId: () => 'recGeneratedMockId',
    },
}));

let mockMutations: any;
jest.mock('../../src/get_sdk', () => () => ({
    __mutations: mockMutations,
    runInfo: {
        isDevelopment: true,
    },
}));

jest.mock('../../src/warning', () => jest.fn());

describe('Table', () => {
    describe('createRecordsAsync', () => {
        const makeTable = () => {
            const baseData = {
                tablesById: {
                    tblTest: {
                        fieldsById: {
                            fldTest1: {
                                name: 'Field 1',
                            },
                            fldTest2: {
                                name: 'Field 2',
                            },
                        },
                    },
                },
            } as any;
            const parentBase = {} as any;
            const recordStore = {} as any;
            const tableId = 'tblTest';

            return new Table(baseData, parentBase, recordStore, tableId, getAirtableInterface());
        };

        beforeEach(() => {
            (warning as jest.Mock).mockClear();
            mockMutations = {
                applyMutationAsync: jest.fn(),
            };
        });

        it('performs a mutation with no warning when passed an object with a `fields` key containing field names', async () => {
            const table = makeTable();
            await table.createRecordsAsync([
                {
                    fields: {
                        'Field 1': 1,
                        'Field 2': 2,
                    },
                },
            ]);

            expect(mockMutations.applyMutationAsync).toHaveBeenCalledTimes(1);
            expect(mockMutations.applyMutationAsync).toHaveBeenLastCalledWith({
                type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                tableId: 'tblTest',
                records: [
                    {
                        id: 'recGeneratedMockId',
                        cellValuesByFieldId: {
                            fldTest1: 1,
                            fldTest2: 2,
                        },
                    },
                ],
            });

            expect(warning).not.toHaveBeenCalled();
        });

        it('performs a mutation with no warning when passed an object with a `fields` key containing field ids', async () => {
            const table = makeTable();
            await table.createRecordsAsync([
                {
                    fields: {
                        fldTest1: 3,
                        fldTest2: 4,
                    },
                },
            ]);

            expect(mockMutations.applyMutationAsync).toHaveBeenCalledTimes(1);
            expect(mockMutations.applyMutationAsync).toHaveBeenLastCalledWith({
                type: MutationTypes.CREATE_MULTIPLE_RECORDS,
                tableId: 'tblTest',
                records: [
                    {
                        id: 'recGeneratedMockId',
                        cellValuesByFieldId: {
                            fldTest1: 3,
                            fldTest2: 4,
                        },
                    },
                ],
            });

            expect(warning).not.toHaveBeenCalled();
        });

        it('throws error when passed an object of field names (legacy syntax)', async () => {
            const table = makeTable();

            await expect(
                table.createRecordsAsync([
                    {
                        'Field 1': 5,
                        'Field 2': 6,
                    } as any, 
                ]),
            ).rejects.toThrowError(
                'Invalid record format. Please define field mappings using a `fields` key for each record definition object',
            );

            expect(mockMutations.applyMutationAsync).toHaveBeenCalledTimes(0);
        });

        it('throws error when passed an object of field ids (legacy syntax)', async () => {
            const table = makeTable();
            await expect(
                table.createRecordsAsync([
                    {
                        fldTest1: 7,
                        fldTest2: 8,
                    } as any, 
                ]),
            ).rejects.toThrowError(
                'Invalid record format. Please define field mappings using a `fields` key for each record definition object',
            );

            expect(mockMutations.applyMutationAsync).toHaveBeenCalledTimes(0);
        });
    });
});
