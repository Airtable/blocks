import BlockSdk from '../src/sdk';
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
                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['tableOrder'],
                        value: ['tbly388E8NA1CNhnF', 'tblyt8B45wJQIx1c3'],
                    },
                ]);

                const ids = sdk.base.tables.map(({id}) => id);
                expect(ids).toStrictEqual(['tbly388E8NA1CNhnF', 'tblyt8B45wJQIx1c3']);
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
