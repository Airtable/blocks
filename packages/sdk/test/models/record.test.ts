import MockAirtableInterface from '../airtable_interface_mocks/mock_airtable_interface_internal';
import Sdk from '../../src/sdk';
import AbstractModel from '../../src/models/abstract_model';
import Base from '../../src/models/base';
import Field from '../../src/models/field';
import LinkedRecordsQueryResult from '../../src/models/linked_records_query_result';
import Record from '../../src/models/record';
import RecordQueryResult from '../../src/models/record_query_result';
import Table from '../../src/models/table';
import View from '../../src/models/view';

const mockAirtableInterface = MockAirtableInterface.linkedRecordsExample();
jest.mock('../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default: () => mockAirtableInterface,
}));

describe('Record', () => {
    let sdk: Sdk;
    let base: Base;
    let table: Table;
    let tableQueryResult: RecordQueryResult;
    let view: View;
    let viewQueryResult: RecordQueryResult;
    let recordA: Record;
    let recordB: Record;
    let recordC: Record;

    let createdTime = '2020-10-23T16:34:04.281Z';

    beforeEach(async () => {
        mockAirtableInterface.fetchAndSubscribeToTableDataAsync.mockResolvedValue({
            recordsById: {
                recA: {
                    id: 'recA',
                    cellValuesByFieldId: {
                        fld1stPrimary: 'Bonjour!',
                        fld1stLinked: {id: 'recB'},
                        fldMockLookup: null,
                    },
                    commentCount: 0,
                    createdTime,
                },
                recB: {
                    id: 'recB',
                    cellValuesByFieldId: {
                        fld1stPrimary: 'Hello!',
                        fld1stLinked: {id: 'recC'},
                        fldMockLookup: {
                            linkedRecordIds: ['recLink1', 'recLink2', 'recLink3', 'recLink4'],
                            valuesByLinkedRecordId: {
                                recLink1: null,
                                recLink2: 'abc123',
                                recLink3: {id: 'sel123abc', name: 'recLink3'},
                                recLink4: [1, 2, 3],
                            },
                        },
                    },
                    commentCount: 0,
                    createdTime,
                },
                recC: {
                    id: 'recC',
                    cellValuesByFieldId: {
                        fld1stPrimary: '¡Hola!',
                        fld1stLinked: {id: 'recA'},
                        fldMockLookup: {
                            linkedRecordIds: ['recLink1', 'recLink2', 'recLink3', 'recLink4'],
                            valuesByLinkedRecordId: {
                                recLink1: null,
                                recLink2: 'XYZ',
                                recLink3: {id: 'selFooBarBaz', name: 'recLink3'},
                                recLink4: [1, 2, 3],
                            },
                        },
                    },
                    commentCount: 0,
                    createdTime,
                },
            },
        });

        mockAirtableInterface.fetchAndSubscribeToViewDataAsync.mockResolvedValue({
            visibleRecordIds: ['recA', 'recC'],
            fieldOrder: {
                fieldIds: ['fld1stPrimary', 'fld1stLinked'],
                visibleFieldCount: 2,
            },
            colorsByRecordId: {
                recA: 'purpleBright',
                recC: 'pinkBright',
            },
        });

        mockAirtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync.mockResolvedValue({
            recordsById: {},
        });
        mockAirtableInterface.fetchAndSubscribeToCursorDataAsync.mockResolvedValue({
            selectedRecordIdSet: {},
            selectedFieldIdSet: {},
        });

        sdk = new Sdk(mockAirtableInterface);
        base = sdk.base;
        table = base.getTable('First Table');
        tableQueryResult = await table.selectRecordsAsync();

        recordA = tableQueryResult.getRecordById('recA');
        recordB = tableQueryResult.getRecordById('recB');
        recordC = tableQueryResult.getRecordById('recC');

        view = table.getViewById('viwPrjctAll');
        viewQueryResult = await view.selectRecordsAsync();
    });

    afterEach(() => {
        mockAirtableInterface.reset();
    });

    describe('constructor', () => {
        test('instance of Record', () => {
            expect(recordA).toBeInstanceOf(Record);
        });
        test('Record subclass of AbstractModel', () => {
            expect(recordA).toBeInstanceOf(AbstractModel);
        });
    });

    describe('internal', () => {
        test('throws when record is missing', () => {
            expect(recordA.isDeleted).toBe(false);

            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblFirst', 'recordsById', 'recA'],
                    value: undefined,
                },
            ]);

            expect(() => {
                recordA.commentCount;
            }).toThrowErrorMatchingInlineSnapshot(`"Record has been deleted"`);
            expect(recordA.isDeleted).toBe(true);
        });

        test('throws when table data is missing', () => {
            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblFirst'],
                    value: null,
                },
                {
                    path: ['tableOrder'],
                    value: ['tblSecond'],
                },
                {
                    path: ['activeTableId'],
                    value: 'tblSecond',
                },
            ]);

            expect(() => {
                recordA.commentCount;
            }).toThrowErrorMatchingInlineSnapshot(`"Record has been deleted"`);
        });
    });

    describe('properties', () => {
        test('#commentCount', () => {
            expect(recordA.commentCount).toBe(0);
            expect(() => {
                // @ts-ignore
                recordA.commentCount = 1;
            }).toThrowErrorMatchingInlineSnapshot(
                `"Cannot set property commentCount of [object Object] which has only a getter"`,
            );
            expect(recordA.commentCount).toBe(0);

            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblFirst', 'recordsById', 'recA', 'commentCount'],
                    value: 20,
                },
            ]);

            expect(recordA.commentCount).toBe(20);
        });
        test('#createdTime', () => {
            expect(recordA.createdTime.toISOString()).toBe(createdTime);
            expect(() => {
                // @ts-ignore
                recordA.createdTime = 1;
            }).toThrowErrorMatchingInlineSnapshot(
                `"Cannot set property createdTime of [object Object] which has only a getter"`,
            );
            expect(recordA.createdTime.toISOString()).toBe(createdTime);
        });
        test('#id', () => {
            expect(recordA.id).toBe('recA');
            expect(() => {
                // @ts-ignore
                recordA.id = 1;
            }).toThrowErrorMatchingInlineSnapshot(
                `"Cannot set property id of [object Object] which has only a getter"`,
            );
            expect(recordA.id).toBe('recA');
        });
        test('#isDeleted', () => {
            expect(recordA.isDeleted).toBe(false);
            expect(() => {
                // @ts-ignore
                recordA.isDeleted = 1;
            }).toThrowErrorMatchingInlineSnapshot(
                `"Cannot set property isDeleted of [object Object] which has only a getter"`,
            );
            expect(recordA.isDeleted).toBe(false);

            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['tablesById', 'tblFirst', 'recordsById', 'recA'],
                    value: undefined,
                },
            ]);

            expect(recordA.isDeleted).toBe(true);
        });
        test('#name', () => {
            expect(recordA.name).toBe('');
            expect(() => {
                // @ts-ignore
                recordA.name = 1;
            }).toThrowErrorMatchingInlineSnapshot(
                `"Cannot set property name of [object Object] which has only a getter"`,
            );
            expect(recordA.name).toBe('');
        });
        test('#url', () => {
            expect(recordA.url).toBe('https://airtable.test/tblFirst/recA');
            expect(() => {
                // @ts-ignore
                recordA.url = 1;
            }).toThrowErrorMatchingInlineSnapshot(
                `"Cannot set property url of [object Object] which has only a getter"`,
            );
            expect(recordA.url).toBe('https://airtable.test/tblFirst/recA');
        });
    });

    describe('methods', () => {
        describe('#getCellValue()', () => {
            test('#getCellValue(fieldOrFieldIdOrFieldName), Field', () => {
                expect(recordA.getCellValue(table.fields[0])).toBe('Bonjour!');
                expect(recordB.getCellValue(table.fields[0])).toBe('Hello!');
                expect(recordC.getCellValue(table.fields[0])).toBe('¡Hola!');
                expect(recordA.getCellValue(table.fields[1])).toMatchObject({id: 'recB'});
                expect(recordB.getCellValue(table.fields[1])).toMatchObject({id: 'recC'});
                expect(recordC.getCellValue(table.fields[1])).toMatchObject({id: 'recA'});
                expect(recordA.getCellValue(table.fields[2])).toBe(null);
                expect(recordB.getCellValue(table.fields[2])).toMatchInlineSnapshot(`
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
                          "name": "recLink3",
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
                expect(recordC.getCellValue(table.fields[2])).toMatchInlineSnapshot(`
                    Array [
                      Object {
                        "linkedRecordId": "recLink1",
                        "value": null,
                      },
                      Object {
                        "linkedRecordId": "recLink2",
                        "value": "XYZ",
                      },
                      Object {
                        "linkedRecordId": "recLink3",
                        "value": Object {
                          "id": "selFooBarBaz",
                          "name": "recLink3",
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

            test('#getCellValue(fieldOrFieldIdOrFieldName), FieldId', () => {
                const fld1stPrimary = 'fld1stPrimary';
                const fld1stLinked = 'fld1stLinked';
                const fldMockLookup = 'fldMockLookup';

                expect(recordA.getCellValue(fld1stPrimary)).toBe('Bonjour!');
                expect(recordB.getCellValue(fld1stPrimary)).toBe('Hello!');
                expect(recordC.getCellValue(fld1stPrimary)).toBe('¡Hola!');
                expect(recordA.getCellValue(fld1stLinked)).toMatchObject({id: 'recB'});
                expect(recordB.getCellValue(fld1stLinked)).toMatchObject({id: 'recC'});
                expect(recordC.getCellValue(fld1stLinked)).toMatchObject({id: 'recA'});
                expect(recordA.getCellValue(fldMockLookup)).toBe(null);
                expect(recordB.getCellValue(fldMockLookup)).toMatchInlineSnapshot(`
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
                          "name": "recLink3",
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
                expect(recordC.getCellValue(fldMockLookup)).toMatchInlineSnapshot(`
                    Array [
                      Object {
                        "linkedRecordId": "recLink1",
                        "value": null,
                      },
                      Object {
                        "linkedRecordId": "recLink2",
                        "value": "XYZ",
                      },
                      Object {
                        "linkedRecordId": "recLink3",
                        "value": Object {
                          "id": "selFooBarBaz",
                          "name": "recLink3",
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

            test('#getCellValue(fieldOrFieldIdOrFieldName), string name', () => {
                const fld1stPrimary = 'Name';
                const fld1stLinked = 'linked records';
                const fldMockLookup = 'lookup';

                expect(recordA.getCellValue(fld1stPrimary)).toBe('Bonjour!');
                expect(recordB.getCellValue(fld1stPrimary)).toBe('Hello!');
                expect(recordC.getCellValue(fld1stPrimary)).toBe('¡Hola!');
                expect(recordA.getCellValue(fld1stLinked)).toMatchObject({id: 'recB'});
                expect(recordB.getCellValue(fld1stLinked)).toMatchObject({id: 'recC'});
                expect(recordC.getCellValue(fld1stLinked)).toMatchObject({id: 'recA'});
                expect(recordA.getCellValue(fldMockLookup)).toBe(null);
                expect(recordB.getCellValue(fldMockLookup)).toMatchInlineSnapshot(`
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
                          "name": "recLink3",
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
                expect(recordC.getCellValue(fldMockLookup)).toMatchInlineSnapshot(`
                    Array [
                      Object {
                        "linkedRecordId": "recLink1",
                        "value": null,
                      },
                      Object {
                        "linkedRecordId": "recLink2",
                        "value": "XYZ",
                      },
                      Object {
                        "linkedRecordId": "recLink3",
                        "value": Object {
                          "id": "selFooBarBaz",
                          "name": "recLink3",
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

            test('reformatting is disabled when isUsingNewLookupCellValueFormat = true', () => {
                mockAirtableInterface.sdkInitData.isUsingNewLookupCellValueFormat = true;

                expect(recordA.getCellValue('fldMockLookup')).toMatchInlineSnapshot(`null`);
                expect(recordB.getCellValue('fldMockLookup')).toMatchInlineSnapshot(`
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
                          "name": "recLink3",
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

            test('reformatting is enabled when isUsingNewLookupCellValueFormat = undefined', () => {
                mockAirtableInterface.sdkInitData.isUsingNewLookupCellValueFormat = undefined;

                expect(recordA.getCellValue('fldMockLookup')).toMatchInlineSnapshot(`null`);
                expect(recordB.getCellValue('fldMockLookup')).toMatchInlineSnapshot(`
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
                          "name": "recLink3",
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

            test('tablesById[id] is undefined', async () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblFirst'],
                        value: undefined,
                    },
                    {
                        path: ['tableOrder'],
                        value: ['tblSecond'],
                    },
                    {
                        path: ['activeTableId'],
                        value: 'tblSecond',
                    },
                ]);

                expect(() => {
                    recordA.getCellValue('fld1stPrimary');
                }).toThrowErrorMatchingInlineSnapshot(`"Table has been deleted"`);
            });

            test('recordsById is undefined', async () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblFirst', 'recordsById'],
                        value: undefined,
                    },
                ]);
                expect(() => {
                    recordA.getCellValue('fld1stPrimary');
                }).toThrowErrorMatchingInlineSnapshot(`"Record data is not loaded"`);
            });

            test('cellValuesByFieldId is undefined', async () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblFirst',
                            'recordsById',
                            'recA',
                            'cellValuesByFieldId',
                        ],
                        value: undefined,
                    },
                ]);

                expect(recordA.getCellValue('fld1stPrimary')).toBe(null);
            });

            test('cellValuesByFieldId[id] is undefined', async () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblFirst',
                            'recordsById',
                            'recA',
                            'cellValuesByFieldId',
                            'fld1stPrimary',
                        ],
                        value: undefined,
                    },
                ]);
                expect(recordA.getCellValue('fld1stPrimary')).toBe(null);
            });

            test('cellValuesByFieldId is null', async () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblFirst',
                            'recordsById',
                            'recA',
                            'cellValuesByFieldId',
                        ],
                        value: null,
                    },
                ]);

                expect(recordA.getCellValue('fld1stPrimary')).toBe(null);
            });

            test('cellValuesByFieldId[id] is null', async () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblFirst',
                            'recordsById',
                            'recA',
                            'cellValuesByFieldId',
                            'fld1stPrimary',
                        ],
                        value: null,
                    },
                ]);
                expect(recordA.getCellValue('fld1stPrimary')).toBe(null);
            });
        });

        describe('#getCellValueAsString()', () => {
            beforeEach(() => {
                mockAirtableInterface.fieldTypeProvider.convertCellValueToString = jest.fn(
                    (appInterface, cellValue, fieldData) => String(cellValue),
                );
            });

            test('#getCellValueAsString(fieldOrFieldIdOrFieldName), Field', async () => {
                expect(recordA.getCellValueAsString(table.fields[0])).toBe('Bonjour!');
                expect(recordB.getCellValueAsString(table.fields[0])).toBe('Hello!');
                expect(recordC.getCellValueAsString(table.fields[0])).toBe('¡Hola!');
                expect(mockAirtableInterface.fieldTypeProvider.convertCellValueToString.mock.calls)
                    .toMatchInlineSnapshot(`
                    Array [
                      Array [
                        Object {},
                        "Bonjour!",
                        Object {
                          "description": "",
                          "id": "fld1stPrimary",
                          "lock": null,
                          "name": "Name",
                          "type": "text",
                          "typeOptions": null,
                        },
                      ],
                      Array [
                        Object {},
                        "Hello!",
                        Object {
                          "description": "",
                          "id": "fld1stPrimary",
                          "lock": null,
                          "name": "Name",
                          "type": "text",
                          "typeOptions": null,
                        },
                      ],
                      Array [
                        Object {},
                        "¡Hola!",
                        Object {
                          "description": "",
                          "id": "fld1stPrimary",
                          "lock": null,
                          "name": "Name",
                          "type": "text",
                          "typeOptions": null,
                        },
                      ],
                    ]
                `);
            });

            test('#getCellValueAsString(fieldOrFieldIdOrFieldName), FieldId', async () => {
                expect(recordA.getCellValueAsString('fld1stPrimary')).toBe('Bonjour!');
                expect(recordB.getCellValueAsString('fld1stPrimary')).toBe('Hello!');
                expect(recordC.getCellValueAsString('fld1stPrimary')).toBe('¡Hola!');
                expect(mockAirtableInterface.fieldTypeProvider.convertCellValueToString.mock.calls)
                    .toMatchInlineSnapshot(`
                    Array [
                      Array [
                        Object {},
                        "Bonjour!",
                        Object {
                          "description": "",
                          "id": "fld1stPrimary",
                          "lock": null,
                          "name": "Name",
                          "type": "text",
                          "typeOptions": null,
                        },
                      ],
                      Array [
                        Object {},
                        "Hello!",
                        Object {
                          "description": "",
                          "id": "fld1stPrimary",
                          "lock": null,
                          "name": "Name",
                          "type": "text",
                          "typeOptions": null,
                        },
                      ],
                      Array [
                        Object {},
                        "¡Hola!",
                        Object {
                          "description": "",
                          "id": "fld1stPrimary",
                          "lock": null,
                          "name": "Name",
                          "type": "text",
                          "typeOptions": null,
                        },
                      ],
                    ]
                `);
            });

            test('#getCellValueAsString(fieldOrFieldIdOrFieldName), string name', async () => {
                expect(recordA.getCellValueAsString('Name')).toBe('Bonjour!');
                expect(recordB.getCellValueAsString('Name')).toBe('Hello!');
                expect(recordC.getCellValueAsString('Name')).toBe('¡Hola!');
                expect(mockAirtableInterface.fieldTypeProvider.convertCellValueToString.mock.calls)
                    .toMatchInlineSnapshot(`
                    Array [
                      Array [
                        Object {},
                        "Bonjour!",
                        Object {
                          "description": "",
                          "id": "fld1stPrimary",
                          "lock": null,
                          "name": "Name",
                          "type": "text",
                          "typeOptions": null,
                        },
                      ],
                      Array [
                        Object {},
                        "Hello!",
                        Object {
                          "description": "",
                          "id": "fld1stPrimary",
                          "lock": null,
                          "name": "Name",
                          "type": "text",
                          "typeOptions": null,
                        },
                      ],
                      Array [
                        Object {},
                        "¡Hola!",
                        Object {
                          "description": "",
                          "id": "fld1stPrimary",
                          "lock": null,
                          "name": "Name",
                          "type": "text",
                          "typeOptions": null,
                        },
                      ],
                    ]
                `);
            });

            test('tablesById[id] is undefined', async () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblFirst'],
                        value: undefined,
                    },
                    {
                        path: ['tableOrder'],
                        value: ['tblSecond'],
                    },
                    {
                        path: ['activeTableId'],
                        value: 'tblSecond',
                    },
                ]);
                expect(() => {
                    recordA.getCellValueAsString('fld1stPrimary');
                }).toThrowErrorMatchingInlineSnapshot(`"Table has been deleted"`);
            });

            test('recordsById is undefined', async () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblFirst', 'recordsById'],
                        value: undefined,
                    },
                ]);
                expect(() => {
                    recordA.getCellValueAsString('fld1stPrimary');
                }).toThrowErrorMatchingInlineSnapshot(`"Record data is not loaded"`);
            });

            test('cellValuesByFieldId is undefined', async () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblFirst',
                            'recordsById',
                            'recA',
                            'cellValuesByFieldId',
                        ],
                        value: undefined,
                    },
                ]);
                expect(recordA.getCellValueAsString('fld1stPrimary')).toBe('');
            });

            test('cellValuesByFieldId[id] is undefined', async () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblFirst',
                            'recordsById',
                            'recA',
                            'cellValuesByFieldId',
                            'fld1stPrimary',
                        ],
                        value: undefined,
                    },
                ]);
                expect(recordA.getCellValueAsString('fld1stPrimary')).toBe('');
            });

            test('cellValuesByFieldId is null', async () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblFirst',
                            'recordsById',
                            'recA',
                            'cellValuesByFieldId',
                        ],
                        value: null,
                    },
                ]);

                expect(recordA.getCellValueAsString('fld1stPrimary')).toBe('');
            });

            test('cellValuesByFieldId[id] is null', async () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblFirst',
                            'recordsById',
                            'recA',
                            'cellValuesByFieldId',
                            'fld1stPrimary',
                        ],
                        value: null,
                    },
                ]);
                expect(recordA.getCellValueAsString('fld1stPrimary')).toBe('');
            });
        });

        describe('#getAttachmentClientUrlFromCellValueUrl()', () => {
            test('returns a string', async () => {
                expect(
                    typeof recordA.getAttachmentClientUrlFromCellValueUrl(
                        'attachmentId',
                        'attachmentUrl',
                    ),
                ).toBe('string');
                expect(mockAirtableInterface.urlConstructor.getAttachmentClientUrl.mock.calls)
                    .toMatchInlineSnapshot(`
                    Array [
                      Array [
                        Object {},
                        "attachmentId",
                        "attachmentUrl",
                      ],
                    ]
                `);
            });
        });

        describe('#getColorInView()', () => {
            test('#getColorInView(viewOrViewIdOrViewName), View', async () => {
                recordA = viewQueryResult.getRecordById('recA');
                recordC = viewQueryResult.getRecordById('recC');

                expect(recordA.getColorInView(view)).toBe('purpleBright');
                expect(recordC.getColorInView(view)).toBe('pinkBright');
            });

            test('#getColorInView(viewOrViewIdOrViewName), ViewId', async () => {
                recordA = viewQueryResult.getRecordById('recA');
                recordC = viewQueryResult.getRecordById('recC');

                expect(recordA.getColorInView(view.id)).toBe('purpleBright');
                expect(recordC.getColorInView(view.id)).toBe('pinkBright');
            });

            test('#getColorInView(viewOrViewIdOrViewName), View Name', async () => {
                recordA = viewQueryResult.getRecordById('recA');
                recordC = viewQueryResult.getRecordById('recC');

                expect(recordA.getColorInView(view.name)).toBe('purpleBright');
                expect(recordC.getColorInView(view.name)).toBe('pinkBright');
            });

            test('colorsByRecordId is empty', async () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblFirst', 'viewsById', view.id, 'colorsByRecordId'],
                        value: {},
                    },
                ]);

                expect(recordC.getColorInView(view.name)).toBe(null);
            });

            test('reports error when provided view is in another table', () => {
                const otherTable = base.getTable('Second Table');
                recordA = viewQueryResult.getRecordById('recA');

                expect(() => {
                    recordA.getColorInView(otherTable.views[0]);
                }).toThrowErrorMatchingInlineSnapshot(
                    `"View 'All tasks' is from a different table than table 'First Table'"`,
                );
            });

            test('reports error when specified view does not exist', () => {
                recordA = viewQueryResult.getRecordById('recA');

                expect(() => {
                    recordA.getColorInView('non existent view');
                }).toThrowErrorMatchingInlineSnapshot(
                    `"View 'non existent view' does not exist in table 'First Table'"`,
                );
            });

            test('reports error when specified view has been deleted', () => {
                recordA = viewQueryResult.getRecordById('recA');
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblFirst', 'viewsById', view.id],
                        value: undefined,
                    },
                ]);

                expect(() => {
                    recordA.getColorInView(view);
                }).toThrowErrorMatchingInlineSnapshot(`"View has been deleted"`);
            });
        });

        describe('#getColorHexInView()', () => {
            beforeEach(() => {
                recordA = viewQueryResult.getRecordById('recA');
                recordC = viewQueryResult.getRecordById('recC');
            });

            test('#getColorHexInView(viewOrViewIdOrViewName), View', async () => {
                expect(recordA.getColorHexInView(view)).toBe('#8b46ff');
                expect(recordC.getColorHexInView(view)).toBe('#ff08c2');
            });

            test('#getColorHexInView(viewOrViewIdOrViewName), ViewId', async () => {
                expect(recordA.getColorHexInView(view.id)).toBe('#8b46ff');
                expect(recordC.getColorHexInView(view.id)).toBe('#ff08c2');
            });

            test('#getColorHexInView(viewOrViewIdOrViewName), View Name', async () => {
                expect(recordA.getColorHexInView(view.name)).toBe('#8b46ff');
                expect(recordC.getColorHexInView(view.name)).toBe('#ff08c2');
            });

            test('colorsByRecordId is empty', async () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblFirst', 'viewsById', view.id, 'colorsByRecordId'],
                        value: {},
                    },
                ]);

                expect(recordC.getColorHexInView(view.name)).toBe(null);
            });
        });

        describe('#selectLinkedRecordsFromCell()', () => {
            let field: Field;
            let linkedRecordsFromCell: LinkedRecordsQueryResult;

            beforeEach(async () => {
                field = recordB.parentTable.getFieldById('fld1stLinked');
            });

            test('#selectLinkedRecordsFromCell(fieldOrFieldIdOrFieldName), Field', async () => {
                linkedRecordsFromCell = recordB.selectLinkedRecordsFromCell(field);
                await linkedRecordsFromCell.loadDataAsync();
                expect(linkedRecordsFromCell.isDataLoaded).toBe(true);
            });

            test('#selectLinkedRecordsFromCell(fieldOrFieldIdOrFieldName), FieldId', async () => {
                linkedRecordsFromCell = recordB.selectLinkedRecordsFromCell(field.id);
                await linkedRecordsFromCell.loadDataAsync();
                expect(linkedRecordsFromCell.isDataLoaded).toBe(true);
            });

            test('#selectLinkedRecordsFromCell(fieldOrFieldIdOrFieldName), Field Name', async () => {
                linkedRecordsFromCell = recordB.selectLinkedRecordsFromCell(field.name);
                await linkedRecordsFromCell.loadDataAsync();
                expect(linkedRecordsFromCell.isDataLoaded).toBe(true);
            });

            test('#selectLinkedRecordsFromCell(fieldOrFieldIdOrFieldName, opts), Field', async () => {
                linkedRecordsFromCell = recordB.selectLinkedRecordsFromCell(field, {});
                await linkedRecordsFromCell.loadDataAsync();
                expect(linkedRecordsFromCell.isDataLoaded).toBe(true);
            });

            test('#selectLinkedRecordsFromCell(fieldOrFieldIdOrFieldName, opts), FieldId', async () => {
                linkedRecordsFromCell = recordB.selectLinkedRecordsFromCell(field.id, {});
                await linkedRecordsFromCell.loadDataAsync();
                expect(linkedRecordsFromCell.isDataLoaded).toBe(true);
            });

            test('#selectLinkedRecordsFromCell(fieldOrFieldIdOrFieldName, opts), Field Name', async () => {
                linkedRecordsFromCell = recordB.selectLinkedRecordsFromCell(field.name, {});
                await linkedRecordsFromCell.loadDataAsync();
                expect(linkedRecordsFromCell.isDataLoaded).toBe(true);
            });

            test('throws for invalid sorting directions', () => {
                expect(() => {
                    recordB.selectLinkedRecordsFromCell(field.name, {
                        sorts: [{field: 'fld2ndPrimary', direction: 'rowboatscending' as 'desc'}],
                    });
                }).toThrowErrorMatchingInlineSnapshot(`"Invalid sort direction: rowboatscending"`);
            });

            it('does not throw for some falsey `fields` values', () => {
                recordB.selectLinkedRecordsFromCell(field.name, {
                    // eslint-disable-next-line no-sparse-arrays
                    fields: [,],
                });
                recordB.selectLinkedRecordsFromCell(field.name, {
                    fields: [undefined],
                });
                recordB.selectLinkedRecordsFromCell(field.name, {
                    fields: [null],
                });
                recordB.selectLinkedRecordsFromCell(field.name, {
                    fields: [false],
                });
            });

            it('throws for invalid field specifiers', () => {
                expect(() => {
                    recordB.selectLinkedRecordsFromCell(field.name, {
                        fields: [(1.0004 as unknown) as string],
                    });
                }).toThrowErrorMatchingInlineSnapshot(
                    `"Invalid value for field, expected a field, id, or name but got: 1.0004"`,
                );
            });
        });

        describe('#selectLinkedRecordsFromCellAsync()', () => {
            let field: Field;
            let linkedRecordsFromCell: LinkedRecordsQueryResult;

            beforeEach(async () => {
                field = recordB.parentTable.getFieldById('fld1stLinked');
            });

            afterEach(async () => {
                linkedRecordsFromCell.unloadData();
            });

            test('#selectLinkedRecordsFromCellAsync(fieldOrFieldIdOrFieldName), Field', async () => {
                linkedRecordsFromCell = await recordB.selectLinkedRecordsFromCellAsync(field);
                expect(linkedRecordsFromCell.isDataLoaded).toBe(true);
            });

            test('#selectLinkedRecordsFromCellAsync(fieldOrFieldIdOrFieldName), FieldId', async () => {
                linkedRecordsFromCell = await recordB.selectLinkedRecordsFromCellAsync(field.id);
                expect(linkedRecordsFromCell.isDataLoaded).toBe(true);
            });

            test('#selectLinkedRecordsFromCellAsync(fieldOrFieldIdOrFieldName), Field Name', async () => {
                linkedRecordsFromCell = await recordB.selectLinkedRecordsFromCellAsync(field.name);
                expect(linkedRecordsFromCell.isDataLoaded).toBe(true);
            });

            test('#selectLinkedRecordsFromCellAsync(fieldOrFieldIdOrFieldName, opts), Field', async () => {
                linkedRecordsFromCell = await recordB.selectLinkedRecordsFromCellAsync(field, {});
                expect(linkedRecordsFromCell.isDataLoaded).toBe(true);
            });

            test('#selectLinkedRecordsFromCellAsync(fieldOrFieldIdOrFieldName, opts), FieldId', async () => {
                linkedRecordsFromCell = await recordB.selectLinkedRecordsFromCellAsync(
                    field.id,
                    {},
                );
                expect(linkedRecordsFromCell.isDataLoaded).toBe(true);
            });

            test('#selectLinkedRecordsFromCellAsync(fieldOrFieldIdOrFieldName, opts), Field Name', async () => {
                linkedRecordsFromCell = await recordB.selectLinkedRecordsFromCellAsync(
                    field.name,
                    {},
                );
                expect(linkedRecordsFromCell.isDataLoaded).toBe(true);
            });
        });

        describe('#toString()', () => {
            test('returns a debugging string', async () => {
                expect(recordA.toString()).toMatchInlineSnapshot(`"[Record recA]"`);
            });
        });

        describe('#watch()', () => {
            const recordPath = ['tablesById', 'tblFirst', 'recordsById', 'recA'];
            const viewPath = [
                'tablesById',
                'tblFirst',
                'viewsById',
                'viwPrjctAll',
                'colorsByRecordId',
            ];

            const trigger = (recId: string, path: Array<string>, value: any) => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path,
                        value,
                    },
                ]);
            };

            test('#watch(invalid key) throws', () => {
                expect(() =>
                    recordA.watch('isDeleted', () => {}),
                ).toThrowErrorMatchingInlineSnapshot(
                    `"Invalid key to watch for Record: isDeleted"`,
                );
            });

            describe('#watch(valid key)', () => {
                test('#watch("cellValues")', () => {
                    const fn = jest.fn();
                    recordA.watch('cellValues', fn);

                    expect(fn).toHaveBeenCalledTimes(0);

                    trigger(
                        'recA',
                        [...recordPath, 'cellValuesByFieldId', 'fld1stPrimary'],
                        'Something else',
                    );

                    expect(fn).toHaveBeenCalledTimes(1);
                    expect(fn).toHaveBeenCalledWith(recordA, 'cellValues', ['fld1stPrimary']);
                });

                test('#watch("cellValueInField")', () => {
                    const fn = jest.fn();
                    recordA.watch('cellValueInField:fld1stPrimary', fn);

                    expect(fn).toHaveBeenCalledTimes(0);

                    trigger('recA', [...recordPath, 'cellValuesByFieldId', 'fld1stPrimary'], 2);

                    expect(fn).toHaveBeenCalledTimes(1);
                    expect(fn).toHaveBeenCalledWith(
                        recordA,
                        'cellValueInField:fld1stPrimary',
                        'fld1stPrimary',
                    );
                });

                test('#watch("colorInView")', () => {
                    const fn = jest.fn();
                    recordA.watch(`colorInView:${view.id}`, fn);

                    expect(fn).toHaveBeenCalledTimes(0);

                    trigger('recA', [...viewPath, 'recA'], 'pinkBright');

                    expect(fn).toHaveBeenCalledTimes(1);
                    expect(fn).toHaveBeenCalledWith(recordA, `colorInView:${view.id}`);
                });

                test('#watch("commentCount")', () => {
                    const fn = jest.fn();
                    recordA.watch('commentCount', fn);

                    expect(fn).toHaveBeenCalledTimes(0);

                    trigger('recA', [...recordPath, 'commentCount'], 2);

                    expect(fn).toHaveBeenCalledTimes(1);
                    expect(fn).toHaveBeenCalledWith(recordA, 'commentCount');
                });
            });
        });

        describe('#unwatch()', () => {
            const recordPath = ['tablesById', 'tblFirst', 'recordsById', 'recA'];
            const viewPath = [
                'tablesById',
                'tblFirst',
                'viewsById',
                'viwPrjctAll',
                'colorsByRecordId',
            ];

            const trigger = (recId: string, path: Array<string>, value: any) => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path,
                        value,
                    },
                ]);
            };

            describe('#unwatch(valid key)', () => {
                test('#unwatch("cellValues")', () => {
                    const fn = jest.fn();
                    recordA.watch('cellValues', fn);

                    expect(fn).toHaveBeenCalledTimes(0);

                    trigger(
                        'recA',
                        [...recordPath, 'cellValuesByFieldId', 'fld1stPrimary'],
                        'Something else',
                    );

                    expect(fn).toHaveBeenCalledTimes(1);

                    recordA.unwatch('cellValues', fn);

                    trigger(
                        'recA',
                        [...recordPath, 'cellValuesByFieldId', 'fld1stPrimary'],
                        'Something else',
                    );

                    expect(fn).toHaveBeenCalledTimes(1);
                });

                test('#unwatch("cellValueInField")', () => {
                    const fn = jest.fn();
                    recordA.watch('cellValueInField:fld1stPrimary', fn);

                    expect(fn).toHaveBeenCalledTimes(0);

                    trigger('recA', [...recordPath, 'cellValuesByFieldId', 'fld1stPrimary'], 2);

                    expect(fn).toHaveBeenCalledTimes(1);

                    recordA.unwatch('cellValueInField:fld1stPrimary', fn);

                    trigger('recA', [...recordPath, 'cellValuesByFieldId', 'fld1stPrimary'], 3);

                    expect(fn).toHaveBeenCalledTimes(1);
                });

                test('#unwatch("colorInView")', () => {
                    const fn = jest.fn();
                    recordA.watch(`colorInView:${view.id}`, fn);

                    expect(fn).toHaveBeenCalledTimes(0);

                    trigger('recA', [...viewPath, 'recA'], 'pinkBright');

                    expect(fn).toHaveBeenCalledTimes(1);

                    recordA.unwatch(`colorInView:${view.id}`, fn);

                    trigger('recA', [...viewPath, 'recA'], 'pinkBright');

                    expect(fn).toHaveBeenCalledTimes(1);
                });

                test('#unwatch("commentCount")', () => {
                    const fn = jest.fn();
                    recordA.watch('commentCount', fn);

                    expect(fn).toHaveBeenCalledTimes(0);

                    trigger('recA', [...recordPath, 'commentCount'], 2);

                    expect(fn).toHaveBeenCalledTimes(1);

                    recordA.unwatch('commentCount', fn);

                    trigger('recA', [...recordPath, 'commentCount'], 3);

                    expect(fn).toHaveBeenCalledTimes(1);
                });
            });
        });
    });
});
