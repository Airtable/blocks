import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import Base from '../../src/models/base';
import {MutationTypes} from '../../src/types/mutations';
import warning from '../../src/warning';
import Sdk from '../../src/sdk';

const mockAirtableInterface = MockAirtableInterface.projectTrackerExample();
jest.mock('../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default: () => mockAirtableInterface,
}));

jest.mock('../../src/warning', () => jest.fn());

describe('Table', () => {
    let base: Base;

    describe('createRecordsAsync', () => {
        const makeTable = () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblTest'],
                    value: {
                        id: 'tblTest',
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
            ]);

            return base.getTable('tblTest');
        };

        beforeEach(() => {
            ({base} = new Sdk(mockAirtableInterface));
            (warning as jest.Mock).mockClear();
        });

        afterEach(() => {
            mockAirtableInterface.reset();
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

            const {applyMutationAsync} = mockAirtableInterface;
            expect(applyMutationAsync).toHaveBeenCalledTimes(1);
            expect(applyMutationAsync).toHaveBeenLastCalledWith(
                {
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
                },
                {holdForMs: 100},
            );

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

            const {applyMutationAsync} = mockAirtableInterface;
            expect(applyMutationAsync).toHaveBeenCalledTimes(1);
            expect(applyMutationAsync).toHaveBeenLastCalledWith(
                {
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
                },
                {holdForMs: 100},
            );

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

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenCalledTimes(0);
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

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenCalledTimes(0);
        });
    });
});
