import MockAirtableInterface from '../airtable_interface_mocks/mock_airtable_interface';
import getSdk, {clearSdkForTest} from '../../src/get_sdk';
import BlockSdk from '../../src/sdk';

const mockAirtableInterface = MockAirtableInterface.projectTrackerExample();
jest.mock('../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default: () => mockAirtableInterface,
}));

describe('Record', () => {
    let sdk: BlockSdk;
    beforeEach(() => {
        sdk = getSdk();
    });

    afterEach(() => {
        clearSdkForTest();
        mockAirtableInterface.reset();
    });

    describe('getCellValue', () => {
        it('reformats lookup cell values when isUsingNewLookupCellValueFormat is not set', async () => {
            const table = sdk.base.getTable('Design projects');
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', table.id, 'fieldsById', 'fldMockLookup'],
                    value: {
                        id: 'fldMockLookup',
                        name: 'lookup',
                        type: 'multipleLookupValues',
                        typeOptions: null,
                    },
                },
            ]);
            mockAirtableInterface.fetchAndSubscribeToTableDataAsync.mockReturnValueOnce(
                Promise.resolve({
                    recordsById: {
                        recA: {
                            id: 'recA',
                            cellValuesByFieldId: {fldMockLookup: null},
                            commentCount: 0,
                            createdTime: new Date().toJSON(),
                        },
                        recB: {
                            id: 'recB',
                            cellValuesByFieldId: {
                                fldMockLookup: {
                                    linkedRecordIds: [
                                        'recLink1',
                                        'recLink2',
                                        'recLink3',
                                        'recLink4',
                                    ],
                                    valuesByLinkedRecordId: {
                                        recLink1: null,
                                        recLink2: 'abc123',
                                        recLink3: {id: 'sel123abc', name: 'A name'},
                                        recLink4: [1, 2, 3],
                                    },
                                },
                            },
                            commentCount: 0,
                            createdTime: new Date().toJSON(),
                        },
                    },
                }),
            );
            const queryResult = await table.selectRecordsAsync();

            expect(
                queryResult.getRecordById('recA').getCellValue('fldMockLookup'),
            ).toMatchInlineSnapshot(`null`);
            expect(queryResult.getRecordById('recB').getCellValue('fldMockLookup'))
                .toMatchInlineSnapshot(`
                Array [
                  Object {
                    "linkedRecordId": "recLink1",
                    "value": null,
                  },
                  Object {
                    "linkedRecordId": "recLink2",
                    "value": "abc123",
                  },
                  Object {
                    "linkedRecordId": "recLink3",
                    "value": Object {
                      "id": "sel123abc",
                      "name": "A name",
                    },
                  },
                  Object {
                    "linkedRecordId": "recLink4",
                    "value": 1,
                  },
                  Object {
                    "linkedRecordId": "recLink4",
                    "value": 2,
                  },
                  Object {
                    "linkedRecordId": "recLink4",
                    "value": 3,
                  },
                ]
            `);
        });

        it('does not reformat lookup cell values when isUsingNewLookupCellValueFormat is set', async () => {
            mockAirtableInterface.sdkInitData.isUsingNewLookupCellValueFormat = true;

            const table = sdk.base.getTable('Design projects');
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', table.id, 'fieldsById', 'fldMockLookup'],
                    value: {
                        id: 'fldMockLookup',
                        name: 'lookup',
                        type: 'multipleLookupValues',
                        typeOptions: null,
                    },
                },
            ]);
            mockAirtableInterface.fetchAndSubscribeToTableDataAsync.mockReturnValueOnce(
                Promise.resolve({
                    recordsById: {
                        recA: {
                            id: 'recA',
                            cellValuesByFieldId: {fldMockLookup: null},
                            commentCount: 0,
                            createdTime: new Date().toJSON(),
                        },
                        recB: {
                            id: 'recB',
                            cellValuesByFieldId: {
                                fldMockLookup: {
                                    linkedRecordIds: [
                                        'recLink1',
                                        'recLink2',
                                        'recLink3',
                                        'recLink4',
                                    ],
                                    valuesByLinkedRecordId: {
                                        recLink1: null,
                                        recLink2: 'abc123',
                                        recLink3: {id: 'sel123abc', name: 'A name'},
                                        recLink4: [1, 2, 3],
                                    },
                                },
                            },
                            commentCount: 0,
                            createdTime: new Date().toJSON(),
                        },
                    },
                }),
            );
            const queryResult = await table.selectRecordsAsync();

            expect(
                queryResult.getRecordById('recA').getCellValue('fldMockLookup'),
            ).toMatchInlineSnapshot(`null`);
            expect(queryResult.getRecordById('recB').getCellValue('fldMockLookup'))
                .toMatchInlineSnapshot(`
                Object {
                  "linkedRecordIds": Array [
                    "recLink1",
                    "recLink2",
                    "recLink3",
                    "recLink4",
                  ],
                  "valuesByLinkedRecordId": Object {
                    "recLink1": null,
                    "recLink2": "abc123",
                    "recLink3": Object {
                      "id": "sel123abc",
                      "name": "A name",
                    },
                    "recLink4": Array [
                      1,
                      2,
                      3,
                    ],
                  },
                }
            `);
        });
    });
});
