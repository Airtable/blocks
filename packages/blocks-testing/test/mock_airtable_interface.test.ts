import {FieldType, ViewType} from '@airtable/blocks/models';
import MockAirtableInterface, {FixtureData} from '../src/mock_airtable_interface';

describe('MockAirtableInterface', () => {
    let smallBase: FixtureData['base'];

    beforeEach(() => {
        smallBase = {
            id: 'appTestFixtureDat',
            name: 'Test Fixture Data Generation',
            tables: [
                {
                    id: 'tblTable1',
                    name: 'Table 1',
                    description: '',
                    fields: [
                        {
                            id: 'fldName',
                            name: 'Name',
                            description: '',
                            type: FieldType.SINGLE_LINE_TEXT,
                            options: null,
                        },
                        {
                            id: 'fldIceCream',
                            name: 'Favorite ice cream',
                            description: '',
                            type: FieldType.SINGLE_LINE_TEXT,
                            options: null,
                        },
                    ],
                    views: [
                        {
                            id: 'viwGridView',
                            name: 'Grid view',
                            type: ViewType.GRID,
                            fieldOrder: {
                                fieldIds: ['fldName', 'fldIceCream'],
                                visibleFieldCount: 2,
                            },
                            records: [
                                {
                                    id: 'reca',
                                    color: null,
                                },
                                {
                                    id: 'recb',
                                    color: null,
                                },
                                {
                                    id: 'recc',
                                    color: null,
                                },
                            ],
                        },
                        {
                            id: 'viwGrid2',
                            name: 'Grid 2',
                            type: ViewType.GRID,
                            fieldOrder: {
                                fieldIds: ['fldName'],
                                visibleFieldCount: 1,
                            },
                            records: [
                                {
                                    id: 'recb',
                                    color: null,
                                },
                                {
                                    id: 'recc',
                                    color: null,
                                },
                            ],
                        },
                    ],
                    records: [
                        {
                            id: 'reca',
                            commentCount: 1,
                            createdTime: '2020-11-04T23:20:08.000Z',
                            cellValuesByFieldId: {
                                fldName: 'a',
                                fldIceCream: 'strawberry',
                            },
                        },
                        {
                            id: 'recb',
                            commentCount: 2,
                            createdTime: '2020-11-04T23:20:11.000Z',
                            cellValuesByFieldId: {
                                fldName: 'b',
                                fldIceCream: 'pistachio',
                            },
                        },
                        {
                            id: 'recc',
                            commentCount: 3,
                            createdTime: '2020-11-04T23:20:14.000Z',
                            cellValuesByFieldId: {
                                fldName: 'c',
                                fldIceCream: 'shoe leather',
                            },
                        },
                    ],
                },
            ],
            collaborators: [
                {
                    id: 'usrPhilRath',
                    name: 'Phil Rath',
                    email: 'phil.rath@airtable.test',
                    profilePicUrl: 'https://dl.airtable.test/.profilePics/usrPhilRath',
                    isActive: true,
                },
            ],
        };
    });

    describe('constructor', () => {
        it('fails for duplicate tables', () => {
            smallBase.tables.push(smallBase.tables[0]);

            expect(
                () => new MockAirtableInterface({base: smallBase}),
            ).toThrowErrorMatchingInlineSnapshot(`"repeated table ID: tblTable1"`);
        });

        it('fails when no tables are specified', () => {
            smallBase.tables.length = 0;

            expect(
                () => new MockAirtableInterface({base: smallBase}),
            ).toThrowErrorMatchingInlineSnapshot(`"Fixture data must include at least one table"`);
        });

        it('fails for duplicate fields', () => {
            smallBase.tables[0].fields.push(smallBase.tables[0].fields[0]);

            expect(
                () => new MockAirtableInterface({base: smallBase}),
            ).toThrowErrorMatchingInlineSnapshot(`"repeated field ID: fldName"`);
        });

        it('fails when no fields are specified', () => {
            smallBase.tables[0].fields.length = 0;

            expect(
                () => new MockAirtableInterface({base: smallBase}),
            ).toThrowErrorMatchingInlineSnapshot(
                `"Every table in fixture data must specify at least one field, but table \\"tblTable1\\" specified zero fields"`,
            );
        });

        it('fails for duplicate views', () => {
            smallBase.tables[0].views.push(smallBase.tables[0].views[0]);

            expect(
                () => new MockAirtableInterface({base: smallBase}),
            ).toThrowErrorMatchingInlineSnapshot(`"repeated view ID: viwGridView"`);
        });

        it('fails when no views are specified', () => {
            smallBase.tables[0].views.length = 0;

            expect(
                () => new MockAirtableInterface({base: smallBase}),
            ).toThrowErrorMatchingInlineSnapshot(
                `"Every table in fixture data must specify at least one view, but table \\"tblTable1\\" specified zero views"`,
            );
        });

        it('fails for invalid record references in view data', () => {
            smallBase.tables[0].views[0].records[1].id = 'recd';

            expect(
                () => new MockAirtableInterface({base: smallBase}),
            ).toThrowErrorMatchingInlineSnapshot(`"record recd not present in table tblTable1"`);
        });
    });

    describe('#applyMutationAsync', () => {
        it('asynchronously emits a "mutation" event', async () => {
            const ai = new MockAirtableInterface({base: smallBase});
            const calls: Array<any> = [];

            await new Promise(resolve => {
                ai.on('mutation', (...args: Array<any>) => {
                    calls.push(args);
                    resolve();
                });
                ai.applyMutationAsync({
                    type: 'createSingleTable',
                    id: 'tblFAKE',
                    name: 'fake table',
                    fields: [
                        {
                            name: 'fake email field',
                            config: {type: FieldType.EMAIL},
                            description: null,
                        },
                    ],
                });

                expect(calls).toEqual([]);
            });

            expect(calls).toEqual([
                [
                    {
                        type: 'createSingleTable',
                        id: 'tblFAKE',
                        name: 'fake table',
                        fields: [
                            {
                                name: 'fake email field',
                                config: {
                                    type: FieldType.EMAIL,
                                },
                                description: null,
                            },
                        ],
                    },
                ],
            ]);
        });
    });

    describe('#expandRecord', () => {
        it('emits an event with relevant data', async () => {
            const ai = new MockAirtableInterface({base: smallBase});

            const {recordId} = await new Promise(resolve => {
                ai.on('expandRecord', resolve);
                ai.expandRecord('tblTable1', 'recb', null);
            });

            expect(recordId).toBe('recb');
        });

        it('does not emit to function that has been unsubscribed', async () => {
            const ai = new MockAirtableInterface({base: smallBase});

            await new Promise((resolve, reject) => {
                ai.on('expandRecord', reject);
                ai.on('expandRecord', resolve);
                ai.off('expandRecord', reject);
                ai.expandRecord('tblTable1', 'recb', null);
            });
        });
    });

    describe('#expandRecordList', () => {
        it('emits an event with relevant data', async () => {
            const ai = new MockAirtableInterface({base: smallBase});

            const {tableId, recordIds, fieldIds} = await new Promise(resolve => {
                ai.on('expandRecordList', resolve);
                ai.expandRecordList('tblTable1', ['recb', 'recc'], ['fldIceCream']);
            });

            expect(tableId).toBe('tblTable1');
            expect(recordIds).toStrictEqual(['recb', 'recc']);
            expect(fieldIds).toStrictEqual(['fldIceCream']);
        });

        it('does not emit to function that has been unsubscribed', async () => {
            const ai = new MockAirtableInterface({base: smallBase});

            await new Promise((resolve, reject) => {
                ai.on('expandRecordList', reject);
                ai.on('expandRecordList', resolve);
                ai.off('expandRecordList', reject);
                ai.expandRecordList('tblTable1', ['recb', 'recc'], ['fldIceCream']);
            });
        });
    });

    describe('#fetchAndSubscribeToCellValuesInFieldsAsync', () => {
        it('fails for unrecognized table IDs', async () => {
            const ai = new MockAirtableInterface({base: smallBase});

            await expect(
                ai.fetchAndSubscribeToCellValuesInFieldsAsync('tblFoo', ['fldName']),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"table not present in fixture data: tblFoo"`,
            );
        });

        it('fails for unrecognized field IDs', async () => {
            const ai = new MockAirtableInterface({base: smallBase});

            await expect(
                ai.fetchAndSubscribeToCellValuesInFieldsAsync('tblTable1', [
                    'fldName',
                    'fldMadeUp',
                ]),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"field fldMadeUp not present in table tblTable1"`,
            );
        });

        it('returns the requested table data', async () => {
            const ai = new MockAirtableInterface({base: smallBase});

            expect(
                await ai.fetchAndSubscribeToCellValuesInFieldsAsync('tblTable1', ['fldIceCream']),
            ).toEqual({
                recordsById: {
                    reca: {
                        id: 'reca',
                        commentCount: 1,
                        createdTime: '2020-11-04T23:20:08.000Z',
                        cellValuesByFieldId: {
                            fldIceCream: 'strawberry',
                        },
                    },
                    recb: {
                        id: 'recb',
                        commentCount: 2,
                        createdTime: '2020-11-04T23:20:11.000Z',
                        cellValuesByFieldId: {
                            fldIceCream: 'pistachio',
                        },
                    },
                    recc: {
                        id: 'recc',
                        commentCount: 3,
                        createdTime: '2020-11-04T23:20:14.000Z',
                        cellValuesByFieldId: {
                            fldIceCream: 'shoe leather',
                        },
                    },
                },
            });
        });
    });

    describe('#fetchAndSubscribeToTableDataAsync', () => {
        it('fails for unrecognized table IDs', async () => {
            const ai = new MockAirtableInterface({base: smallBase});

            await expect(
                ai.fetchAndSubscribeToTableDataAsync('tblFoo'),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"table not present in fixture data: tblFoo"`,
            );
        });

        it('returns the requested table data', async () => {
            const ai = new MockAirtableInterface({base: smallBase});

            expect(await ai.fetchAndSubscribeToTableDataAsync('tblTable1')).toEqual({
                recordsById: {
                    reca: {
                        id: 'reca',
                        commentCount: 1,
                        createdTime: '2020-11-04T23:20:08.000Z',
                        cellValuesByFieldId: {
                            fldName: 'a',
                            fldIceCream: 'strawberry',
                        },
                    },
                    recb: {
                        id: 'recb',
                        commentCount: 2,
                        createdTime: '2020-11-04T23:20:11.000Z',
                        cellValuesByFieldId: {
                            fldName: 'b',
                            fldIceCream: 'pistachio',
                        },
                    },
                    recc: {
                        id: 'recc',
                        commentCount: 3,
                        createdTime: '2020-11-04T23:20:14.000Z',
                        cellValuesByFieldId: {
                            fldName: 'c',
                            fldIceCream: 'shoe leather',
                        },
                    },
                },
            });
        });
    });

    describe('#fetchAndSubscribeToViewDataAsync', () => {
        it('fails for unrecognized table IDs', async () => {
            const ai = new MockAirtableInterface({base: smallBase});

            await expect(
                ai.fetchAndSubscribeToViewDataAsync('tblFoo', 'viwGridView'),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"table not present in fixture data: tblFoo"`,
            );
        });

        it('fails for unrecognized view IDs', async () => {
            const ai = new MockAirtableInterface({base: smallBase});

            await expect(
                ai.fetchAndSubscribeToViewDataAsync('tblTable1', 'viwFoo'),
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"view not present in fixture data: viwFoo"`,
            );
        });

        it('returns the requested view data (active view)', async () => {
            const ai = new MockAirtableInterface({base: smallBase});

            expect(await ai.fetchAndSubscribeToViewDataAsync('tblTable1', 'viwGridView')).toEqual({
                visibleRecordIds: ['reca', 'recb', 'recc'],
                fieldOrder: {
                    fieldIds: ['fldName', 'fldIceCream'],
                    visibleFieldCount: 2,
                },
                colorsByRecordId: {},
            });
        });

        it('returns the requested view data (inactive view)', async () => {
            const ai = new MockAirtableInterface({base: smallBase});

            expect(await ai.fetchAndSubscribeToViewDataAsync('tblTable1', 'viwGrid2')).toEqual({
                visibleRecordIds: ['recb', 'recc'],
                fieldOrder: {
                    fieldIds: ['fldName'],
                    visibleFieldCount: 1,
                },
                colorsByRecordId: {},
            });
        });
    });

    describe('#fieldTypeProvider', () => {
        let fieldTypeProvider: MockAirtableInterface['fieldTypeProvider'];
        const fieldData = {
            id: 'fldFAKE',
            name: 'fake name',
            type: 'fake type',
            typeOptions: {},
            description: null,
            lock: null,
        };

        beforeEach(() => {
            ({fieldTypeProvider} = new MockAirtableInterface({base: smallBase}));
        });

        describe('#convertCellValueToString', () => {
            const fakeAppInterface = {};

            it('returns the empty string for null values', () => {
                const cellValue = null;

                expect(
                    fieldTypeProvider.convertCellValueToString(
                        fakeAppInterface,
                        cellValue,
                        fieldData,
                    ),
                ).toBe('');
            });

            it('returns the "name" property of object values which define a string value', () => {
                const cellValue = {name: 'obadiah'};

                expect(
                    fieldTypeProvider.convertCellValueToString(
                        fakeAppInterface,
                        cellValue,
                        fieldData,
                    ),
                ).toBe('obadiah');
            });

            it('ignores the "name" property of object values which define a non-string value', () => {
                const cellValue = {name: 49.0004};

                expect(
                    fieldTypeProvider.convertCellValueToString(
                        fakeAppInterface,
                        cellValue,
                        fieldData,
                    ),
                ).toBe('[object Object]');
            });

            it('returns a string representation of primitive values', () => {
                expect(
                    fieldTypeProvider.convertCellValueToString(fakeAppInterface, 0, fieldData),
                ).toBe('0');
                expect(
                    fieldTypeProvider.convertCellValueToString(fakeAppInterface, -0, fieldData),
                ).toBe('0');
                expect(
                    fieldTypeProvider.convertCellValueToString(fakeAppInterface, 24601, fieldData),
                ).toBe('24601');
                expect(
                    fieldTypeProvider.convertCellValueToString(fakeAppInterface, -24601, fieldData),
                ).toBe('-24601');
                expect(
                    fieldTypeProvider.convertCellValueToString(fakeAppInterface, true, fieldData),
                ).toBe('true');
                expect(
                    fieldTypeProvider.convertCellValueToString(fakeAppInterface, false, fieldData),
                ).toBe('false');
                expect(
                    fieldTypeProvider.convertCellValueToString(
                        fakeAppInterface,
                        undefined,
                        fieldData,
                    ),
                ).toBe('undefined');
                expect(
                    fieldTypeProvider.convertCellValueToString(
                        fakeAppInterface,
                        'already a string',
                        fieldData,
                    ),
                ).toBe('already a string');
            });

            it('returns a comma-and-space-separated string for Array values', () => {
                const cellValue = [null, '', {}, {name: 'sarah'}];
                const expected = `${fieldTypeProvider.convertCellValueToString(
                    fakeAppInterface,
                    cellValue[0],
                    fieldData,
                )}, ${fieldTypeProvider.convertCellValueToString(
                    fakeAppInterface,
                    cellValue[1],
                    fieldData,
                )}, ${fieldTypeProvider.convertCellValueToString(
                    fakeAppInterface,
                    cellValue[2],
                    fieldData,
                )}, ${fieldTypeProvider.convertCellValueToString(
                    fakeAppInterface,
                    cellValue[3],
                    fieldData,
                )}`;

                expect(
                    fieldTypeProvider.convertCellValueToString(
                        fakeAppInterface,
                        cellValue,
                        fieldData,
                    ),
                ).toBe(expected);
            });
        });
    });

    describe('#globalConfigHelpers', () => {
        let globalConfigHelpers: MockAirtableInterface['globalConfigHelpers'];

        beforeEach(() => {
            ({globalConfigHelpers} = new MockAirtableInterface({base: smallBase}));
        });

        describe('#validateAndApplyUpdates', () => {
            it('modifies existing top-level values', () => {
                const store = {a: 1, b: 2, c: 3};

                const result = globalConfigHelpers.validateAndApplyUpdates(
                    [
                        {path: ['a'], value: 2},
                        {path: ['c'], value: 4},
                    ],
                    store,
                );

                expect(Array.isArray(result.changedTopLevelKeys)).toBe(true);
                expect(result.changedTopLevelKeys.sort()).toEqual(['a', 'c']);
                expect(result.newKvStore).toEqual({a: 2, b: 2, c: 4});
            });

            it('inserts new top-level values', () => {
                const store = {a: 1, b: 2, c: 3};

                const result = globalConfigHelpers.validateAndApplyUpdates(
                    [{path: ['d'], value: 8}],
                    store,
                );

                expect(Array.isArray(result.changedTopLevelKeys)).toBe(true);
                expect(result.changedTopLevelKeys).toEqual(['d']);
                expect(result.newKvStore).toEqual({a: 1, b: 2, c: 3, d: 8});
            });

            it('modifies existing values nested within objects', () => {
                const store = {nest: {a: 1, b: 2, c: 3}};

                const result = globalConfigHelpers.validateAndApplyUpdates(
                    [
                        {path: ['nest', 'a'], value: 2},
                        {path: ['nest', 'c'], value: 4},
                    ],
                    store,
                );

                expect(Array.isArray(result.changedTopLevelKeys)).toBe(true);
                expect(result.changedTopLevelKeys.sort()).toEqual(['nest']);
                expect(result.newKvStore).toEqual({nest: {a: 2, b: 2, c: 4}});
            });

            it('inserts new values nested within objects', () => {
                const store = {nest: {a: 1, b: 2, c: 3}};

                const result = globalConfigHelpers.validateAndApplyUpdates(
                    [{path: ['nest', 'd'], value: 43}],
                    store,
                );

                expect(Array.isArray(result.changedTopLevelKeys)).toBe(true);
                expect(result.changedTopLevelKeys.sort()).toEqual(['nest']);
                expect(result.newKvStore).toEqual({nest: {a: 1, b: 2, c: 3, d: 43}});
            });

            it('modifies existing values nested within arrays', () => {
                const store = {nested: [0, [1, 2, 3]]};

                const result = globalConfigHelpers.validateAndApplyUpdates(
                    [
                        {path: ['nested', '1', '0'], value: 2},
                        {path: ['nested', '1', '2'], value: 4},
                    ],
                    store,
                );

                expect(Array.isArray(result.changedTopLevelKeys)).toBe(true);
                expect(result.changedTopLevelKeys.sort()).toEqual(['nested']);
                expect(result.newKvStore).toEqual({
                    nested: [0, [2, 2, 4]],
                });
            });

            it('inserts new values nested within arrays', () => {
                const store = {nested: [0, [1, 2, 3]]};

                const result = globalConfigHelpers.validateAndApplyUpdates(
                    [{path: ['nested', '1', '3'], value: 43}],
                    store,
                );

                expect(Array.isArray(result.changedTopLevelKeys)).toBe(true);
                expect(result.changedTopLevelKeys.sort()).toEqual(['nested']);
                expect(result.newKvStore).toEqual({
                    nested: [0, [1, 2, 3, 43]],
                });
            });

            it('creates intermediate objects within objects', () => {
                const store = {a: 1, c: null, d: 3};

                const result = globalConfigHelpers.validateAndApplyUpdates(
                    [
                        {path: ['b', 'also b'], value: 23},
                        {path: ['c', 'also c'], value: 45},
                    ],
                    store,
                );

                expect(Array.isArray(result.changedTopLevelKeys)).toBe(true);
                expect(result.changedTopLevelKeys.sort()).toEqual(['b', 'c']);
                expect(result.newKvStore).toEqual({
                    a: 1,
                    b: {'also b': 23},
                    c: {'also c': 45},
                    d: 3,
                });
            });

            it('creates intermediate objects within objects, overwriting primitives', () => {
                const store = {a: 1, b: 8.9, c: null, d: 3};

                const result = globalConfigHelpers.validateAndApplyUpdates(
                    [
                        {path: ['b', 'also b'], value: 23},
                        {path: ['c', 'also c'], value: 45},
                    ],
                    store,
                );

                expect(Array.isArray(result.changedTopLevelKeys)).toBe(true);
                expect(result.changedTopLevelKeys.sort()).toEqual(['b', 'c']);
                expect(result.newKvStore).toEqual({
                    a: 1,
                    b: {'also b': 23},
                    c: {'also c': 45},
                    d: 3,
                });
            });

            it('creates intermediate objects within arrays', () => {
                const store = {nested: [0]};

                const result = globalConfigHelpers.validateAndApplyUpdates(
                    [{path: ['nested', '1', 'highly specific'], value: 23}],
                    store,
                );

                expect(Array.isArray(result.changedTopLevelKeys)).toBe(true);
                expect(result.changedTopLevelKeys.sort()).toEqual(['nested']);
                expect(result.newKvStore).toEqual({
                    nested: [0, {'highly specific': 23}],
                });
            });

            it('deletes values from objects', () => {
                const store = {nested: {a: 1, b: 2, c: 3}};

                const result = globalConfigHelpers.validateAndApplyUpdates(
                    [{path: ['nested', 'b'], value: undefined}],
                    store,
                );

                expect(Array.isArray(result.changedTopLevelKeys)).toBe(true);
                expect(result.changedTopLevelKeys.sort()).toEqual(['nested']);
                expect(result.newKvStore).toStrictEqual({nested: {a: 1, c: 3}});
            });

            it('deletes values from arrays', () => {
                const store = {nested: [23, 45, 99]};

                const result = globalConfigHelpers.validateAndApplyUpdates(
                    [{path: ['nested', '1'], value: undefined}],
                    store,
                );

                expect(Array.isArray(result.changedTopLevelKeys)).toBe(true);
                expect(result.changedTopLevelKeys.sort()).toEqual(['nested']);
                expect(result.newKvStore).toStrictEqual({
                    nested: [23, 99],
                });
            });
        });
    });

    describe('#idGenerator', () => {
        let idGenerator: MockAirtableInterface['idGenerator'];

        beforeEach(() => {
            ({idGenerator} = new MockAirtableInterface({base: smallBase}));
        });

        describe('#generateRecordId', () => {
            it('returns an apparently unique string', () => {
                expect(idGenerator.generateRecordId()).not.toEqual(idGenerator.generateRecordId());
            });
        });
    });

    it('#setFullscreenMaxSize', () => {
        const ai = new MockAirtableInterface({base: smallBase});
        expect(() => ai.setFullscreenMaxSize({width: null, height: null})).not.toThrowError();
    });

    describe('#performBackendFetchAsync', () => {
        it('returns a rejected promise', async () => {
            const ai = new MockAirtableInterface({base: smallBase});
            await expect(
                ai.performBackendFetchAsync({
                    method: 'GET',
                    url: 'http://example.com',
                    headers: [],
                    body: null,
                    integrity: null,
                    redirect: 'manual',
                }),
            ).rejects.toThrowError();
        });
    });

    describe('#fetchDefaultCellValuesByFieldIdAsync', () => {
        it('returns an empty object', async () => {
            const ai = new MockAirtableInterface({base: smallBase});
            expect(await ai.fetchDefaultCellValuesByFieldIdAsync()).toStrictEqual({});
        });
    });

    describe('#reloadFrame', () => {
        it('does not throw', () => {
            const ai = new MockAirtableInterface({base: smallBase});
            expect(() => ai.reloadFrame()).not.toThrowError();
        });
    });

    describe('#setSettingsButtonVisibility', () => {
        it('does not throw', () => {
            const ai = new MockAirtableInterface({base: smallBase});
            expect(() => ai.setSettingsButtonVisibility()).not.toThrowError();
        });
    });

    describe('#setUndoRedoMode', () => {
        it('does not throw', () => {
            const ai = new MockAirtableInterface({base: smallBase});
            expect(() => ai.setUndoRedoMode()).not.toThrowError();
        });
    });

    describe('#enterFullscreen', () => {
        it('does not throw', () => {
            const ai = new MockAirtableInterface({base: smallBase});
            expect(() => ai.enterFullscreen()).not.toThrowError();
        });
    });

    describe('#exitFullscreen', () => {
        it('does not throw', () => {
            const ai = new MockAirtableInterface({base: smallBase});
            expect(() => ai.exitFullscreen()).not.toThrowError();
        });
    });

    describe('#fetchAndSubscribeToPerformRecordActionAsync', () => {
        it('returns null', async () => {
            const ai = new MockAirtableInterface({base: smallBase});
            expect(await ai.fetchAndSubscribeToPerformRecordActionAsync()).toBe(null);
        });
    });

    describe('#trackEvent', () => {
        it('does not throw', () => {
            const ai = new MockAirtableInterface({base: smallBase});
            expect(() => ai.trackEvent()).not.toThrowError();
        });
    });

    describe('#trackExposure', () => {
        it('does not throw', () => {
            const ai = new MockAirtableInterface({base: smallBase});
            expect(() => ai.trackExposure()).not.toThrowError();
        });
    });

    describe('#sendStat', () => {
        it('does not throw', () => {
            const ai = new MockAirtableInterface({base: smallBase});
            expect(() => ai.sendStat()).not.toThrowError();
        });
    });
});
