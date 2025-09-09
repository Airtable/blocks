import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {InterfaceBlockSdk} from '../../../src/interface/sdk';
import AbstractModel from '../../../src/shared/models/abstract_model';
import {type Base} from '../../../src/interface/models/base';
import {Record} from '../../../src/interface/models/record';
import {type Table} from '../../../src/interface/models/table';
import {type ObjectMap} from '../../../src/shared/private_utils';

const mockAirtableInterface = MockAirtableInterface.linkedRecordsExample();
jest.mock('../../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default: () => mockAirtableInterface,
}));

describe('Record', () => {
    let sdk: InterfaceBlockSdk;
    let base: Base;
    let table: Table;
    let recordA: Record;
    let recordB: Record;
    let recordC: Record;

    const createdTime = '2020-10-23T16:34:04.281Z';

    const makeRecord = (recordId: string, cellValuesByFieldId: ObjectMap<string, any>) => {
        const baseData = mockAirtableInterface.sdkInitData.baseData;
        const parentTableData = baseData.tablesById.tblFirst;
        parentTableData.recordsById[recordId] = {
            id: recordId,
            cellValuesByFieldId,
            createdTime,
        };
        parentTableData.recordOrder.push(recordId);

        const parentRecordStore = sdk.base.__getRecordStore(parentTableData.id);

        const newRecord = parentRecordStore.getRecordByIdIfExists(recordId);

        return newRecord!;
    };

    beforeEach(async () => {
        sdk = new InterfaceBlockSdk(mockAirtableInterface);
        base = sdk.base;
        table = base.getTable('First Table');

        recordA = makeRecord('recA', {
            fld1stPrimary: 'Bonjour!',
            fld1stLinked: {id: 'recB'},
            fldMockLookup: null,
        });
        recordB = makeRecord('recB', {
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
        });
        recordC = makeRecord('recC', {
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
        });
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
        });
    });

    describe('properties', () => {
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
                }).toThrowErrorMatchingInlineSnapshot(`"TableCore has been deleted"`);
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
                          "isEditable": true,
                          "isSynced": false,
                          "lock": null,
                          "name": "Name",
                          "type": "singleLineText",
                          "typeOptions": null,
                        },
                      ],
                      Array [
                        Object {},
                        "Hello!",
                        Object {
                          "description": "",
                          "id": "fld1stPrimary",
                          "isEditable": true,
                          "isSynced": false,
                          "lock": null,
                          "name": "Name",
                          "type": "singleLineText",
                          "typeOptions": null,
                        },
                      ],
                      Array [
                        Object {},
                        "¡Hola!",
                        Object {
                          "description": "",
                          "id": "fld1stPrimary",
                          "isEditable": true,
                          "isSynced": false,
                          "lock": null,
                          "name": "Name",
                          "type": "singleLineText",
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
                          "isEditable": true,
                          "isSynced": false,
                          "lock": null,
                          "name": "Name",
                          "type": "singleLineText",
                          "typeOptions": null,
                        },
                      ],
                      Array [
                        Object {},
                        "Hello!",
                        Object {
                          "description": "",
                          "id": "fld1stPrimary",
                          "isEditable": true,
                          "isSynced": false,
                          "lock": null,
                          "name": "Name",
                          "type": "singleLineText",
                          "typeOptions": null,
                        },
                      ],
                      Array [
                        Object {},
                        "¡Hola!",
                        Object {
                          "description": "",
                          "id": "fld1stPrimary",
                          "isEditable": true,
                          "isSynced": false,
                          "lock": null,
                          "name": "Name",
                          "type": "singleLineText",
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
                          "isEditable": true,
                          "isSynced": false,
                          "lock": null,
                          "name": "Name",
                          "type": "singleLineText",
                          "typeOptions": null,
                        },
                      ],
                      Array [
                        Object {},
                        "Hello!",
                        Object {
                          "description": "",
                          "id": "fld1stPrimary",
                          "isEditable": true,
                          "isSynced": false,
                          "lock": null,
                          "name": "Name",
                          "type": "singleLineText",
                          "typeOptions": null,
                        },
                      ],
                      Array [
                        Object {},
                        "¡Hola!",
                        Object {
                          "description": "",
                          "id": "fld1stPrimary",
                          "isEditable": true,
                          "isSynced": false,
                          "lock": null,
                          "name": "Name",
                          "type": "singleLineText",
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
                }).toThrowErrorMatchingInlineSnapshot(`"TableCore has been deleted"`);
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

        describe('#toString()', () => {
            test('returns a debugging string', async () => {
                expect(recordA.toString()).toMatchInlineSnapshot(`"[Record recA]"`);
            });
        });

        describe('#watch()', () => {
            const recordPath = ['tablesById', 'tblFirst', 'recordsById', 'recA'];

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
            });
        });

        describe('#unwatch()', () => {
            const recordPath = ['tablesById', 'tblFirst', 'recordsById', 'recA'];

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
            });
        });
    });
});
