import BlockSdk from '../src/sdk';
import Table from '../src/models/table';
import View from '../src/models/view';
import AbstractModelWithAsyncData from '../src/models/abstract_model_with_async_data';
import getSdk, {clearSdkForTest} from '../src/get_sdk';
import MockAirtableInterface from './airtable_interface_mocks/mock_airtable_interface';

const mockAirtableInterface = MockAirtableInterface.projectTrackerExample();
jest.mock('../src/injected/airtable_interface', () => ({
    __esModule: true,
    default() {
        return mockAirtableInterface;
    },
}));

jest.useFakeTimers();

describe('sdk', () => {
    let sdk: BlockSdk;

    beforeEach(() => {
        clearSdkForTest();
        mockAirtableInterface.reset();
        sdk = getSdk();
    });

    afterEach(() => {
        mockAirtableInterface.reset();
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
                        value: ['tblTasks', 'tblDesignProjects', 'tblClients'],
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
                        value: ['tblTasks', 'tblDesignProjects', 'tblClients'],
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
                        value: ['tblDesignProjects', 'tblTasks', 'tblClients'],
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
                        value: ['tblDesignProjects', 'tblTasks', 'tblClients'],
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(0);
            });

            it('updates internal state - reordering', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tableOrder'],
                        value: ['tblTasks', 'tblDesignProjects', 'tblClients'],
                    },
                ]);

                const ids = sdk.base.tables.map(({id}) => id);
                expect(ids).toStrictEqual(['tblTasks', 'tblDesignProjects', 'tblClients']);
            });

            it('updates internal state - removal', () => {
                let ids = sdk.base.tables.map(({id}) => id);
                expect(ids).toStrictEqual(['tblDesignProjects', 'tblTasks', 'tblClients']);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tableOrder'],
                        value: ['tblDesignProjects', 'tblClients'],
                    },
                    {
                        path: ['tablesById', 'tblTasks'],
                        value: undefined,
                    },
                ]);

                ids = sdk.base.tables.map(({id}) => id);
                expect(ids).toStrictEqual(['tblDesignProjects', 'tblClients']);
            });

            it('updates internal state - removal and recreation', () => {
                let ids = sdk.base.tables.map(({id}) => id);
                expect(ids).toStrictEqual(['tblDesignProjects', 'tblTasks', 'tblClients']);
                const toRestore = sdk.base.getTableById(ids[1]);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tableOrder'],
                        value: ['tblDesignProjects', 'tblClients'],
                    },
                    {
                        path: ['tablesById', 'tblTasks'],
                        value: undefined,
                    },
                ]);

                ids = sdk.base.tables.map(({id}) => id);
                expect(ids).toStrictEqual(['tblDesignProjects', 'tblClients']);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tableOrder'],
                        value: ['tblDesignProjects', 'tblTasks', 'tblClients'],
                    },
                    {
                        path: ['tablesById', 'tblTasks'],
                        value: toRestore,
                    },
                ]);

                ids = sdk.base.tables.map(({id}) => id);
                expect(ids).toStrictEqual(['tblDesignProjects', 'tblTasks', 'tblClients']);
            });

            it('updates internal state - removal and recreation after loading records', async () => {
                let ids = sdk.base.tables.map(({id}) => id);
                expect(ids).toStrictEqual(['tblDesignProjects', 'tblTasks', 'tblClients']);

                const tableToDelete = sdk.base.getTableById('tblTasks');
                const deletedTableData = tableToDelete._data;
                mockAirtableInterface.fetchAndSubscribeToCellValuesInFieldsAsync.mockReturnValue(
                    Promise.resolve({recordsById: {}}),
                );
                mockAirtableInterface.fetchAndSubscribeToTableDataAsync.mockReturnValue(
                    Promise.resolve({
                        recordsById: {
                            recA: {
                                id: 'recA',
                                cellValuesByFieldId: {},
                                commentCount: 0,
                                createdTime: new Date().toJSON(),
                            },
                        },
                    }),
                );
                const query = await tableToDelete.selectRecordsAsync();
                expect(() => query.records).not.toThrow();

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tableOrder'],
                        value: ['tblDesignProjects', 'tblClients'],
                    },
                    {
                        path: ['tablesById', 'tblTasks'],
                        value: undefined,
                    },
                ]);

                ids = sdk.base.tables.map(({id}) => id);
                expect(ids).toStrictEqual(['tblDesignProjects', 'tblClients']);
                expect(query.isDeleted).toBe(true);
                expect(query.isDataLoaded).toBe(false);

                deletedTableData.recordsById = undefined;
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tableOrder'],
                        value: ['tblDesignProjects', 'tblTasks', 'tblClients'],
                    },
                    {
                        path: ['tablesById', 'tblTasks'],
                        value: deletedTableData,
                    },
                ]);
                ids = sdk.base.tables.map(({id}) => id);
                expect(ids).toStrictEqual(['tblDesignProjects', 'tblTasks', 'tblClients']);

                expect(query.isDeleted).toBe(true);
                expect(query.isDataLoaded).toBe(false);

                const restoredTable = sdk.base.getTableById('tblTasks');
                const newQuery = await restoredTable.selectRecordsAsync();
                expect(() => newQuery.records).not.toThrow();


                expect(query._recordStore._isDataLoaded).toBe(true);
                jest.advanceTimersByTime(AbstractModelWithAsyncData.__DATA_UNLOAD_DELAY_MS);
                expect(query._recordStore._isDataLoaded).toBe(false);
            });
        });

        describe('tablesById', () => {
            it('does not notify "tables" watchers', () => {
                const mock = jest.fn();
                sdk.base.watch('tables', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblTasks', 'name'],
                        value: 'a new name',
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(0);
            });

            it('notifies "schema" watchers', () => {
                const mock = jest.fn();

                sdk.base.watch('schema', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblTasks', 'name'],
                        value: 'a new name',
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(1);
            });

            it('does not notify "schema" watchers when new value matches current', () => {
                const mock = jest.fn();

                sdk.base.watch('schema', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblTasks', 'name'],
                        value: 'Tasks',
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(0);
            });

            it('updates internal state - modification', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblTasks', 'name'],
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
                expect(ids).toStrictEqual(['tblDesignProjects', 'tblTasks', 'tblClients']);
            });

            it('handles multiple updates', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblTasks', 'name'],
                        value: 'first',
                    },
                    {
                        path: ['tablesById', 'tblTasks', 'name'],
                        value: 'second',
                    },
                ]);

                const ids = sdk.base.tables.map(({id}) => id);
                expect(ids).toStrictEqual(['tblDesignProjects', 'tblTasks', 'tblClients']);
                expect(sdk.base.tables[1].name).toStrictEqual('second');
            });
        });

        describe('table name', () => {
            let table: Table;

            beforeEach(() => {
                table = sdk.base.tables.find(({id}) => id === 'tblDesignProjects') as Table;
            });

            it('notifies base "schema" watchers', () => {
                const mock = jest.fn();
                sdk.base.watch('schema', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblDesignProjects', 'name'],
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
                        path: ['tablesById', 'tblDesignProjects', 'name'],
                        value: 'Egon',
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(1);
            });

            it('updates internal state', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblDesignProjects', 'name'],
                        value: 'Egon',
                    },
                ]);

                expect(table.name).toStrictEqual('Egon');
            });
        });

        describe('table viewOrder', () => {
            let table: Table;

            beforeEach(() => {
                table = sdk.base.tables.find(({id}) => id === 'tblDesignProjects') as Table;
            });

            it('notifies base "schema" watchers', () => {
                const mock = jest.fn();
                sdk.base.watch('schema', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblDesignProjects', 'viewOrder'],
                        value: [
                            'viwPrjctIncmplt',
                            'viwPrjctAll',
                            'viwPrjctCompleted',
                            'viwPrjctCalendar',
                            'viwPrjctDueDates',
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
                        path: ['tablesById', 'tblDesignProjects', 'viewOrder'],
                        value: [
                            'viwPrjctIncmplt',
                            'viwPrjctAll',
                            'viwPrjctCompleted',
                            'viwPrjctCalendar',
                            'viwPrjctDueDates',
                        ],
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(1);
            });

            it('updates internal state - reordering', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblDesignProjects', 'viewOrder'],
                        value: [
                            'viwPrjctIncmplt',
                            'viwPrjctAll',
                            'viwPrjctCompleted',
                            'viwPrjctCalendar',
                            'viwPrjctDueDates',
                        ],
                    },
                ]);

                const ids = table.views.map(({id}) => id);
                expect(ids).toStrictEqual([
                    'viwPrjctIncmplt',
                    'viwPrjctAll',
                    'viwPrjctCompleted',
                    'viwPrjctCalendar',
                    'viwPrjctDueDates',
                ]);
            });

            it('updates internal state - removal', () => {
                let ids = table.views.map(({id}) => id);
                expect(ids).toStrictEqual([
                    'viwPrjctAll',
                    'viwPrjctIncmplt',
                    'viwPrjctCompleted',
                    'viwPrjctCalendar',
                    'viwPrjctDueDates',
                ]);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblDesignProjects', 'viewOrder'],
                        value: [
                            'viwPrjctAll',
                            'viwPrjctIncmplt',
                            'viwPrjctCalendar',
                            'viwPrjctDueDates',
                        ],
                    },
                    {
                        path: ['tablesById', 'tblDesignProjects', 'viewsById', 'viwPrjctCompleted'],
                        value: undefined,
                    },
                ]);

                ids = table.views.map(({id}) => id);
                expect(ids).toStrictEqual([
                    'viwPrjctAll',
                    'viwPrjctIncmplt',
                    'viwPrjctCalendar',
                    'viwPrjctDueDates',
                ]);
            });
        });

        describe('table lock', () => {
            it('notifies base "schema" watchers', () => {
                const mock = jest.fn();
                sdk.base.watch('schema', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblDesignProjects', 'lock'],
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

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblDesignProjects', 'externalSyncById'],
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
                table = sdk.base.tables.find(({id}) => id === 'tblDesignProjects') as Table;
            });

            it('notifies base "schema" watchers', () => {
                const mock = jest.fn();
                sdk.base.watch('schema', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblDesignProjects', 'description'],
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
                        path: ['tablesById', 'tblDesignProjects', 'description'],
                        value: 'a value',
                    },
                ]);

                expect(mock).toHaveBeenCalledTimes(1);
            });

            it('updates internal state', () => {
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tablesById', 'tblDesignProjects', 'description'],
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
                    ({id}) => id === 'tblDesignProjects',
                ) as Table).views.find(({id}) => id === 'viwPrjctCompleted') as View;
            });

            it('notifies base "schema" watchers', () => {
                const mock = jest.fn();
                sdk.base.watch('schema', mock);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: [
                            'tablesById',
                            'tblDesignProjects',
                            'viewsById',
                            'viwPrjctCompleted',
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
                            'tblDesignProjects',
                            'viewsById',
                            'viwPrjctCompleted',
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
                            'tblDesignProjects',
                            'viewsById',
                            'viwPrjctCompleted',
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
