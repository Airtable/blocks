import BlockSdk from '../src/sdk';
import Table from '../src/models/table';
import View from '../src/models/view';
import MockAirtableInterface from './airtable_interface_mocks/mock_airtable_interface';

const mockAirtableInterface = MockAirtableInterface.projectTrackerExample();

describe('sdk', () => {
    let sdk: BlockSdk;

    beforeEach(() => {
        mockAirtableInterface.reset();
        sdk = new BlockSdk(mockAirtableInterface);
    });

    describe('model updates', () => {
        describe('name', () => {
            it('notifies "name" watchers exactly one time for multiple changes', () => {
                const mock = jest.fn();
                sdk.base.watch('name', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {path: ['name'], value: 'foo'},
                    {path: ['name'], value: 'bar'},
                    {path: ['name'], value: 'baz'},
                ]);

                expect(mock).toHaveBeenCalledTimes(1);
                expect(sdk.base.name).toBe('baz');
            });

            it('notifies "schema" watchers', () => {
                const mock = jest.fn();
                sdk.base.watch('schema', mock);

                mockAirtableInterface.triggerModelUpdates([{path: ['name'], value: 'baz'}]);

                expect(mock).toHaveBeenCalledTimes(1);
            });

            it('does not notify "name" watchers when new value matches current', () => {
                const mock = jest.fn();
                sdk.base.watch('name', mock);

                mockAirtableInterface.triggerModelUpdates([{path: ['name'], value: sdk.base.name}]);

                expect(mock).toHaveBeenCalledTimes(0);
            });

            it('does not notify "schema" watchers when new value matches current', () => {
                const mock = jest.fn();
                sdk.base.watch('schema', mock);

                mockAirtableInterface.triggerModelUpdates([{path: ['name'], value: sdk.base.name}]);

                expect(mock).toHaveBeenCalledTimes(0);
            });
        });

        describe('tableOrder', () => {
            it('notifies "tables" watchers', () => {
                const mock = jest.fn();
                sdk.base.watch('tables', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tableOrder'],
                        value: ['tblcstEo50YXLJcK4', 'tbly388E8NA1CNhnF', 'tblyt8B45wJQIx1c3'],
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(1);
            });

            it('notifies "schema" watchers', () => {
                const mock = jest.fn();
                sdk.base.watch('schema', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tableOrder'],
                        value: ['tblcstEo50YXLJcK4', 'tbly388E8NA1CNhnF', 'tblyt8B45wJQIx1c3'],
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(1);
            });

            it('does not notify "tables" watchers when new value matches current', () => {
                const mock = jest.fn();
                sdk.base.watch('tables', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tableOrder'],
                        value: ['tbly388E8NA1CNhnF', 'tblcstEo50YXLJcK4', 'tblyt8B45wJQIx1c3'],
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(0);
            });

            it('does not notify "schema" watchers when new value matches current', () => {
                const mock = jest.fn();
                sdk.base.watch('schema', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tableOrder'],
                        value: ['tbly388E8NA1CNhnF', 'tblcstEo50YXLJcK4', 'tblyt8B45wJQIx1c3'],
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(0);
            });

            it('updates internal state - reordering', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tableOrder'],
                        value: ['tblcstEo50YXLJcK4', 'tbly388E8NA1CNhnF', 'tblyt8B45wJQIx1c3'],
                    },
                ]);

                const ids = sdk.base.tables.map(({id}) => id);
                expect(ids).toStrictEqual([
                    'tblcstEo50YXLJcK4',
                    'tbly388E8NA1CNhnF',
                    'tblyt8B45wJQIx1c3',
                ]);
            });

            it('updates internal state - removal', () => {
                let ids = sdk.base.tables.map(({id}) => id);
                expect(ids).toStrictEqual([
                    'tbly388E8NA1CNhnF',
                    'tblcstEo50YXLJcK4',
                    'tblyt8B45wJQIx1c3',
                ]);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tableOrder'],
                        value: ['tbly388E8NA1CNhnF', 'tblyt8B45wJQIx1c3'],
                    },
                    {
                        path: ['tablesById', 'tblcstEo50YXLJcK4'],
                        value: undefined,
                    },
                ]);

                ids = sdk.base.tables.map(({id}) => id);
                expect(ids).toStrictEqual(['tbly388E8NA1CNhnF', 'tblyt8B45wJQIx1c3']);
            });
        });

        describe('tablesById', () => {
            it('does not notify "tables" watchers', () => {
                const mock = jest.fn();
                sdk.base.watch('tables', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblcstEo50YXLJcK4', 'name'],
                        value: 'a new name',
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(0);
            });

            it('notifies "schema" watchers', () => {
                const mock = jest.fn();

                sdk.base.tables;

                sdk.base.watch('schema', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblcstEo50YXLJcK4', 'name'],
                        value: 'a new name',
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(1);
            });

            it('does not notify "schema" watchers when new value matches current', () => {
                const mock = jest.fn();

                sdk.base.tables;

                sdk.base.watch('schema', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblcstEo50YXLJcK4', 'name'],
                        value: 'Tasks',
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(0);
            });

            it('updates internal state - modification', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblcstEo50YXLJcK4', 'name'],
                        value: 'a new name',
                    },
                ]);

                expect(sdk.base.tables).toHaveLength(3);
                expect(sdk.base.tables[1].name).toStrictEqual('a new name');
            });

            it('handles updates to unrecognized tables', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblNEW00000000001', 'name'],
                        value: 'thing',
                    },
                ]);

                const ids = sdk.base.tables.map(({id}) => id);
                expect(ids).toStrictEqual([
                    'tbly388E8NA1CNhnF',
                    'tblcstEo50YXLJcK4',
                    'tblyt8B45wJQIx1c3',
                ]);
            });

            it('handles multiple updates', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblcstEo50YXLJcK4', 'name'],
                        value: 'first',
                    },
                    {
                        path: ['tablesById', 'tblcstEo50YXLJcK4', 'name'],
                        value: 'second',
                    },
                ]);

                const ids = sdk.base.tables.map(({id}) => id);
                expect(ids).toStrictEqual([
                    'tbly388E8NA1CNhnF',
                    'tblcstEo50YXLJcK4',
                    'tblyt8B45wJQIx1c3',
                ]);
                expect(sdk.base.tables[1].name).toStrictEqual('second');
            });
        });

        describe('table name', () => {
            let table: Table;

            beforeEach(() => {
                table = sdk.base.tables.find(({id}) => id === 'tbly388E8NA1CNhnF') as Table;
            });

            it('notifies base "schema" watchers', () => {
                const mock = jest.fn();
                sdk.base.watch('schema', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tbly388E8NA1CNhnF', 'name'],
                        value: 'Egon',
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(1);
            });

            it('notifies table "name" watchers', () => {
                const mock = jest.fn();
                table.watch('name', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tbly388E8NA1CNhnF', 'name'],
                        value: 'Egon',
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(1);
            });

            it('updates internal state', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tbly388E8NA1CNhnF', 'name'],
                        value: 'Egon',
                    },
                ]);

                expect(table.name).toStrictEqual('Egon');
            });
        });

        describe('table viewOrder', () => {
            let table: Table;

            beforeEach(() => {
                table = sdk.base.tables.find(({id}) => id === 'tbly388E8NA1CNhnF') as Table;
            });

            it('notifies base "schema" watchers', () => {
                const mock = jest.fn();
                sdk.base.watch('schema', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tbly388E8NA1CNhnF', 'viewOrder'],
                        value: [
                            'viwqo8mFAqy2HYSCL',
                            'viwkNnS94RQAQQTMn',
                            'viw8v5XkLudbiCJfD',
                            'viwhz3PjFATSxaV5X',
                            'viwA4Tzw8IJcHHgul',
                        ],
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(1);
            });

            it('notifies table "views" watchers', () => {
                const mock = jest.fn();
                table.watch('views', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tbly388E8NA1CNhnF', 'viewOrder'],
                        value: [
                            'viwqo8mFAqy2HYSCL',
                            'viwkNnS94RQAQQTMn',
                            'viw8v5XkLudbiCJfD',
                            'viwhz3PjFATSxaV5X',
                            'viwA4Tzw8IJcHHgul',
                        ],
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(1);
            });

            it('updates internal state - reordering', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tbly388E8NA1CNhnF', 'viewOrder'],
                        value: [
                            'viwqo8mFAqy2HYSCL',
                            'viwkNnS94RQAQQTMn',
                            'viw8v5XkLudbiCJfD',
                            'viwhz3PjFATSxaV5X',
                            'viwA4Tzw8IJcHHgul',
                        ],
                    },
                ]);

                const ids = table.views.map(({id}) => id);
                expect(ids).toStrictEqual([
                    'viwqo8mFAqy2HYSCL',
                    'viwkNnS94RQAQQTMn',
                    'viw8v5XkLudbiCJfD',
                    'viwhz3PjFATSxaV5X',
                    'viwA4Tzw8IJcHHgul',
                ]);
            });

            it('updates internal state - removal', () => {
                let ids = table.views.map(({id}) => id);
                expect(ids).toStrictEqual([
                    'viwkNnS94RQAQQTMn',
                    'viwqo8mFAqy2HYSCL',
                    'viw8v5XkLudbiCJfD',
                    'viwhz3PjFATSxaV5X',
                    'viwA4Tzw8IJcHHgul',
                ]);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tbly388E8NA1CNhnF', 'viewOrder'],
                        value: [
                            'viwkNnS94RQAQQTMn',
                            'viwqo8mFAqy2HYSCL',
                            'viwhz3PjFATSxaV5X',
                            'viwA4Tzw8IJcHHgul',
                        ],
                    },
                    {
                        path: ['tablesById', 'tbly388E8NA1CNhnF', 'viewsById', 'viw8v5XkLudbiCJfD'],
                        value: undefined,
                    },
                ]);

                ids = table.views.map(({id}) => id);
                expect(ids).toStrictEqual([
                    'viwkNnS94RQAQQTMn',
                    'viwqo8mFAqy2HYSCL',
                    'viwhz3PjFATSxaV5X',
                    'viwA4Tzw8IJcHHgul',
                ]);
            });
        });

        describe('table lock', () => {
            it('notifies base "schema" watchers', () => {
                const mock = jest.fn();
                sdk.base.watch('schema', mock);

                sdk.base.tables;

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tbly388E8NA1CNhnF', 'lock'],
                        value: {foo: 'bar'},
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(1);
            });

            it.skip('updates internal state', () => {});
        });

        describe('table externalSyncById', () => {
            it('notifies base "schema" watchers', () => {
                const mock = jest.fn();
                sdk.base.watch('schema', mock);

                sdk.base.tables;

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tbly388E8NA1CNhnF', 'externalSyncById'],
                        value: 'a value',
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(1);
            });

            it.skip('updates internal state', () => {});
        });

        describe('table description', () => {
            let table: Table;

            beforeEach(() => {
                table = sdk.base.tables.find(({id}) => id === 'tbly388E8NA1CNhnF') as Table;
            });

            it('notifies base "schema" watchers', () => {
                const mock = jest.fn();
                sdk.base.watch('schema', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tbly388E8NA1CNhnF', 'description'],
                        value: 'a value',
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(1);
            });

            it('notifies table "description" watchers', () => {
                const mock = jest.fn();
                table.watch('description', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tbly388E8NA1CNhnF', 'description'],
                        value: 'a value',
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(1);
            });

            it('updates internal state', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tbly388E8NA1CNhnF', 'description'],
                        value: 'a value',
                    },
                ]);

                expect(table.description).toEqual('a value');
            });
        });

        describe('view name', () => {
            let view: View;

            beforeEach(() => {
                view = (sdk.base.tables.find(
                    ({id}) => id === 'tbly388E8NA1CNhnF',
                ) as Table).views.find(({id}) => id === 'viw8v5XkLudbiCJfD') as View;
            });

            it('notifies base "schema" watchers', () => {
                const mock = jest.fn();
                sdk.base.watch('schema', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tbly388E8NA1CNhnF',
                            'viewsById',
                            'viw8v5XkLudbiCJfD',
                            'name',
                        ],
                        value: 'a new name',
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(1);
            });

            it('notifies view "name" watchers', () => {
                const mock = jest.fn();
                view.watch('name', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tbly388E8NA1CNhnF',
                            'viewsById',
                            'viw8v5XkLudbiCJfD',
                            'name',
                        ],
                        value: 'a new name',
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(1);
            });

            it('updates internal state', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tbly388E8NA1CNhnF',
                            'viewsById',
                            'viw8v5XkLudbiCJfD',
                            'name',
                        ],
                        value: 'a new name',
                    },
                ]);

                expect(view.name).toEqual('a new name');
            });
        });

        describe('collaborators', () => {
            it('notifies "collaborator" watchers', () => {
                const mock = jest.fn();
                sdk.base.watch('collaborators', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {path: ['collaboratorsById'], value: {}},
                ]);

                expect(mock).toHaveBeenCalledTimes(1);
            });

            it('does not notify "schema" watchers', () => {
                const mock = jest.fn();
                sdk.base.watch('schema', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {path: ['collaboratorsById'], value: {}},
                ]);

                expect(mock).toHaveBeenCalledTimes(0);
            });

            it('updates internal state', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['collaboratorsById'],
                        value: {usrA: {id: 'usrA'}, usrB: {id: 'usrB'}, usrC: {id: 'usrC'}},
                    },
                    {path: ['activeCollaboratorIds'], value: ['usrA', 'usrC']},
                ]);

                const sorted = sdk.base.activeCollaborators
                    .slice()
                    .sort((a, b) => (a.id > b.id ? 1 : -1));

                expect(sorted).toMatchObject([{id: 'usrA'}, {id: 'usrC'}]);
            });
        });

        describe('appInterface', () => {
            it('notifies "schema" watchers', () => {
                const mock = jest.fn();
                sdk.base.watch('schema', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {path: ['appInterface'], value: {foo: 'foo'}},
                ]);

                expect(mock).toHaveBeenCalledTimes(1);
            });

            it('notifies "schema" watchers exactly one time for multiple changes', () => {
                const mock = jest.fn();
                sdk.base.watch('schema', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {path: ['appInterface'], value: {foo: 'foo'}},
                    {path: ['appInterface'], value: {foo: 'bar'}},
                    {path: ['appInterface'], value: {foo: 'baz'}},
                ]);

                expect(mock).toHaveBeenCalledTimes(1);
            });

            it('does not notify "schema" watchers when new value matches current', () => {
                const mock = jest.fn();
                sdk.base.watch('schema', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['appInterface'],
                        value: {},
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(0);
            });
        });
    });
});
