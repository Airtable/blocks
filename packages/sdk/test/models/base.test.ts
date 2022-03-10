import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import {FieldType} from '../../src/types/field';
import {MutationTypes} from '../../src/types/mutations';
import Base from '../../src/models/base';
import Sdk from '../../src/sdk';
import Table from '../../src/models/table';

const mockAirtableInterface = MockAirtableInterface.projectTrackerExample();
jest.mock('../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default() {
        return mockAirtableInterface;
    },
}));

describe('Base', () => {
    let base: Base;
    let sdk: Sdk;

    beforeEach(() => {
        mockAirtableInterface.reset();
        sdk = new Sdk(mockAirtableInterface);
        base = sdk.base;
    });

    describe('__sdk', () => {
        it('exposes its instance', () => {
            expect(base.__sdk).toBe(sdk);
        });
    });

    describe('tables', () => {
        it('lists all tables in the expected order', () => {
            expect(base.tables.map(({id}) => id)).toMatchInlineSnapshot(`
                Array [
                  "tblDesignProjects",
                  "tblTasks",
                  "tblClients",
                ]
            `);
        });

        it('omits tables which have no corresponding schema', async () => {
            const {tablesById} = mockAirtableInterface.sdkInitData.baseData;
            delete tablesById.tblDesignProjects;
            base = new Sdk(mockAirtableInterface).base;

            expect(base.tables.map(({id}) => id)).toMatchInlineSnapshot(`
                Array [
                  "tblTasks",
                  "tblClients",
                ]
            `);
        });
    });

    describe('getCollaboratorIfExists', () => {
        it('returns collaborator by id', () => {
            const collaborator1 = base.getCollaboratorIfExists('usrAshQuintana');
            const collaborator2 = base.getCollaboratorIfExists('usrParisFotiou');
            expect(collaborator1).toMatchInlineSnapshot(`
                Object {
                  "email": "collab4@example.com",
                  "id": "usrAshQuintana",
                  "name": "Ash Quintana",
                  "profilePicUrl": "https://dl.airtable.com/profilePics/7KX9bnbqQyGvWGArbTXB_headshot-yellow-1.png",
                }
            `);
            expect(collaborator2).toMatchInlineSnapshot(`
                Object {
                  "email": "collab26@example.com",
                  "id": "usrParisFotiou",
                  "name": "Paris Fotiou",
                  "profilePicUrl": "https://dl.airtable.com/profilePics/xoafD4NRXGRLcx3qilRg_Screen%20Shot%202019-01-17%20at%201.20.14%20PM.png",
                }
            `);
        });

        it('returns collaborator by name', () => {
            const collaborator1 = base.getCollaboratorIfExists('Bailey Mirza');
            const collaborator2 = base.getCollaboratorIfExists('Gal Samari');
            expect(collaborator1).toMatchInlineSnapshot(`
                Object {
                  "email": "collab5@example.com",
                  "id": "usrBaileyMirza",
                  "name": "Bailey Mirza",
                  "profilePicUrl": "https://dl.airtable.com/profilePics/7pprdNqqQuSWWN7zeavM_headshot-pink-1.png",
                }
            `);
            expect(collaborator2).toMatchInlineSnapshot(`
                Object {
                  "email": "collab10@example.com",
                  "id": "usrGalSamari",
                  "name": "Gal Samari",
                  "profilePicUrl": "https://dl.airtable.com/profilePics/qy4E6kRaaku2JJwXpjQb_headshot-purple-2.png",
                }
            `);
        });

        it('returns collaborator by email', () => {
            const collaborator1 = base.getCollaboratorIfExists('collab16@example.com');
            const collaborator2 = base.getCollaboratorIfExists('collab4@example.com');
            expect(collaborator1).toMatchInlineSnapshot(`
                Object {
                  "email": "collab16@example.com",
                  "id": "usrJordanPeretz",
                  "name": "Jordan Peretz",
                  "profilePicUrl": "https://dl.airtable.com/profilePics/jCMoXFziQcD0XkHMxhwQ_Screen%20Shot%202019-01-17%20at%201.19.59%20PM.png",
                }
            `);
            expect(collaborator2).toMatchInlineSnapshot(`
                Object {
                  "email": "collab4@example.com",
                  "id": "usrAshQuintana",
                  "name": "Ash Quintana",
                  "profilePicUrl": "https://dl.airtable.com/profilePics/7KX9bnbqQyGvWGArbTXB_headshot-yellow-1.png",
                }
            `);
        });

        it('gracefully handles collaborators with identical names', () => {
            const {collaboratorsById} = mockAirtableInterface.sdkInitData.baseData;
            collaboratorsById.usrFAKE0000000001 = {
                email: 'fake1@example.com',
                id: 'usrFAKE0000000001',
                name: 'Gristle McThornbody',
                profilePicUrl: 'https://example.com/fake1.jpg',
            };
            collaboratorsById.usrFAKE0000000002 = {
                email: 'fake2@example.com',
                id: 'usrFAKE0000000002',
                name: 'Gristle McThornbody',
                profilePicUrl: 'https://example.com/fake2.jpg',
            };
            base = new Sdk(mockAirtableInterface).base;
            expect(base.getCollaboratorIfExists('fake1@example.com')).toMatchInlineSnapshot(`
                Object {
                  "email": "fake1@example.com",
                  "id": "usrFAKE0000000001",
                  "name": "Gristle McThornbody",
                  "profilePicUrl": "https://example.com/fake1.jpg",
                }
            `);
            expect(base.getCollaboratorIfExists('fake2@example.com')).toMatchInlineSnapshot(`
                Object {
                  "email": "fake2@example.com",
                  "id": "usrFAKE0000000002",
                  "name": "Gristle McThornbody",
                  "profilePicUrl": "https://example.com/fake2.jpg",
                }
            `);
            expect([
                collaboratorsById.usrFAKE0000000001,
                collaboratorsById.usrFAKE0000000002,
            ]).toContainEqual(base.getCollaboratorIfExists('Gristle McThornbody'));
        });

        it('returns null if no collaborator is found', () => {
            expect(base.getCollaboratorIfExists('usr3VLCpyqgc1FAKE')).toBe(null);
            expect(base.getCollaboratorIfExists('fake@example.com')).toBe(null);
            expect(base.getCollaboratorIfExists('Mary Face')).toBe(null);
        });
    });

    describe('getCollaborator', () => {
        beforeEach(() => {
            base = new Sdk(mockAirtableInterface).base;
        });

        it('returns collaborator by id', () => {
            const collaborator1 = base.getCollaborator('usrAshQuintana');
            const collaborator2 = base.getCollaborator('usrParisFotiou');
            expect(collaborator1).toMatchInlineSnapshot(`
                Object {
                  "email": "collab4@example.com",
                  "id": "usrAshQuintana",
                  "name": "Ash Quintana",
                  "profilePicUrl": "https://dl.airtable.com/profilePics/7KX9bnbqQyGvWGArbTXB_headshot-yellow-1.png",
                }
            `);
            expect(collaborator2).toMatchInlineSnapshot(`
                Object {
                  "email": "collab26@example.com",
                  "id": "usrParisFotiou",
                  "name": "Paris Fotiou",
                  "profilePicUrl": "https://dl.airtable.com/profilePics/xoafD4NRXGRLcx3qilRg_Screen%20Shot%202019-01-17%20at%201.20.14%20PM.png",
                }
            `);
        });

        it('returns collaborator by name', () => {
            const collaborator1 = base.getCollaborator('Bailey Mirza');
            const collaborator2 = base.getCollaborator('Gal Samari');
            expect(collaborator1).toMatchInlineSnapshot(`
                Object {
                  "email": "collab5@example.com",
                  "id": "usrBaileyMirza",
                  "name": "Bailey Mirza",
                  "profilePicUrl": "https://dl.airtable.com/profilePics/7pprdNqqQuSWWN7zeavM_headshot-pink-1.png",
                }
            `);
            expect(collaborator2).toMatchInlineSnapshot(`
                Object {
                  "email": "collab10@example.com",
                  "id": "usrGalSamari",
                  "name": "Gal Samari",
                  "profilePicUrl": "https://dl.airtable.com/profilePics/qy4E6kRaaku2JJwXpjQb_headshot-purple-2.png",
                }
            `);
        });

        it('returns collaborator by email', () => {
            const collaborator1 = base.getCollaborator('collab16@example.com');
            const collaborator2 = base.getCollaborator('collab4@example.com');
            expect(collaborator1).toMatchInlineSnapshot(`
                Object {
                  "email": "collab16@example.com",
                  "id": "usrJordanPeretz",
                  "name": "Jordan Peretz",
                  "profilePicUrl": "https://dl.airtable.com/profilePics/jCMoXFziQcD0XkHMxhwQ_Screen%20Shot%202019-01-17%20at%201.19.59%20PM.png",
                }
            `);
            expect(collaborator2).toMatchInlineSnapshot(`
                Object {
                  "email": "collab4@example.com",
                  "id": "usrAshQuintana",
                  "name": "Ash Quintana",
                  "profilePicUrl": "https://dl.airtable.com/profilePics/7KX9bnbqQyGvWGArbTXB_headshot-yellow-1.png",
                }
            `);
        });

        it('returns throws if no collaborator is found', () => {
            expect(() =>
                base.getCollaborator('usr3VLCpyqgc1FAKE'),
            ).toThrowErrorMatchingInlineSnapshot(
                `"No collaborator with ID, name, or email of 'usr3VLCpyqgc1FAKE' is in base 'Project tracker'"`,
            );
            expect(() =>
                base.getCollaborator('fake@example.com'),
            ).toThrowErrorMatchingInlineSnapshot(
                `"No collaborator with ID, name, or email of 'fake@example.com' is in base 'Project tracker'"`,
            );
            expect(() => base.getCollaborator('Mary Face')).toThrowErrorMatchingInlineSnapshot(
                `"No collaborator with ID, name, or email of 'Mary Face' is in base 'Project tracker'"`,
            );
        });
    });

    describe('getCollaboratorById', () => {
        it('returns collaborator by id', () => {
            const collaborator1 = base.getCollaboratorById('usrAshQuintana');
            const collaborator2 = base.getCollaboratorById('usrParisFotiou');
            expect(collaborator1).toMatchInlineSnapshot(`
                Object {
                  "email": "collab4@example.com",
                  "id": "usrAshQuintana",
                  "name": "Ash Quintana",
                  "profilePicUrl": "https://dl.airtable.com/profilePics/7KX9bnbqQyGvWGArbTXB_headshot-yellow-1.png",
                }
            `);
            expect(collaborator2).toMatchInlineSnapshot(`
                Object {
                  "email": "collab26@example.com",
                  "id": "usrParisFotiou",
                  "name": "Paris Fotiou",
                  "profilePicUrl": "https://dl.airtable.com/profilePics/xoafD4NRXGRLcx3qilRg_Screen%20Shot%202019-01-17%20at%201.20.14%20PM.png",
                }
            `);
        });

        it('throws when no collaborator is found', () => {
            expect(() =>
                base.getCollaboratorById('usrDoesNotExist'),
            ).toThrowErrorMatchingInlineSnapshot(
                `"No collaborator with ID usrDoesNotExist has access to base 'Project tracker'"`,
            );
        });
    });

    describe('getTableIfExists', () => {
        it('returns table by id', () => {
            const table1 = base.getTableIfExists('tblDesignProjects');
            const table2 = base.getTableIfExists('tblTasks');
            expect(table1).toBeInstanceOf(Table);
            expect(table1?.id).toBe('tblDesignProjects');
            expect(table2).toBeInstanceOf(Table);
            expect(table2?.id).toBe('tblTasks');
        });

        it('returns table by name', () => {
            const table1 = base.getTableIfExists('Design projects');
            const table2 = base.getTableIfExists('Tasks');
            expect(table1).toBeInstanceOf(Table);
            expect(table1?.id).toBe('tblDesignProjects');
            expect(table2).toBeInstanceOf(Table);
            expect(table2?.id).toBe('tblTasks');
        });

        it('returns null when not found', () => {
            expect(base.getTableIfExists('tbly388E8NA1cFAKE')).toBe(null);
            expect(base.getTableIfExists('Injustices')).toBe(null);
        });
    });

    describe('getTable', () => {
        it('returns table by id', () => {
            const table1 = base.getTable('tblDesignProjects');
            const table2 = base.getTable('tblTasks');
            expect(table1).toBeInstanceOf(Table);
            expect(table1.id).toBe('tblDesignProjects');
            expect(table2).toBeInstanceOf(Table);
            expect(table2.id).toBe('tblTasks');
        });

        it('returns table by name', () => {
            const table1 = base.getTable('Design projects');
            const table2 = base.getTable('Tasks');
            expect(table1).toBeInstanceOf(Table);
            expect(table1.id).toBe('tblDesignProjects');
            expect(table2).toBeInstanceOf(Table);
            expect(table2.id).toBe('tblTasks');
        });

        it('throws when not found', () => {
            expect(() => base.getTable('tbly388E8NA1cFAKE')).toThrowErrorMatchingInlineSnapshot(
                `"No table with ID or name 'tbly388E8NA1cFAKE' in base 'Project tracker'"`,
            );
            expect(() => base.getTable('Injustices')).toThrowErrorMatchingInlineSnapshot(
                `"No table with ID or name 'Injustices' in base 'Project tracker'"`,
            );
        });
    });

    describe('getTableById', () => {
        it('returns table', () => {
            const table1 = base.getTableById('tblDesignProjects');
            const table2 = base.getTableById('tblTasks');
            expect(table1).toBeInstanceOf(Table);
            expect(table1.id).toBe('tblDesignProjects');
            expect(table2).toBeInstanceOf(Table);
            expect(table2.id).toBe('tblTasks');
        });

        it('throws when not found', () => {
            expect(() => base.getTableById('tbly388E8NA1cFAKE')).toThrowErrorMatchingInlineSnapshot(
                `"No table with ID tbly388E8NA1cFAKE in base 'Project tracker'"`,
            );
        });
    });

    describe('getTableByName', () => {
        it('returns table', () => {
            const table1 = base.getTableByName('Design projects');
            const table2 = base.getTableByName('Tasks');
            expect(table1).toBeInstanceOf(Table);
            expect(table1.id).toBe('tblDesignProjects');
            expect(table2).toBeInstanceOf(Table);
            expect(table2.id).toBe('tblTasks');
        });

        it('throws when not found', () => {
            expect(() => base.getTableByName('Susan')).toThrowErrorMatchingInlineSnapshot(
                `"No table named 'Susan' in base 'Project tracker'"`,
            );
        });
    });

    describe('checkPermissionsForCreateTable', () => {
        let mockCheck: jest.SpyInstance;

        beforeEach(() => {
            mockCheck = mockAirtableInterface.checkPermissionsForMutation;
        });

        it('operates without arguments', () => {
            expect(base.checkPermissionsForCreateTable()).toEqual({hasPermission: true});

            expect(mockCheck).toHaveBeenCalledTimes(1);
            expect(mockCheck.mock.calls[0][0]).toMatchInlineSnapshot(`
                Object {
                  "fields": undefined,
                  "id": undefined,
                  "name": undefined,
                  "type": "createSingleTable",
                }
            `);
        });

        it('operates with table name only', () => {
            expect(base.checkPermissionsForCreateTable('Obadiah')).toEqual({hasPermission: true});

            expect(mockCheck).toHaveBeenCalledTimes(1);
            expect(mockCheck.mock.calls[0][0]).toMatchInlineSnapshot(`
                Object {
                  "fields": undefined,
                  "id": undefined,
                  "name": "Obadiah",
                  "type": "createSingleTable",
                }
            `);
        });

        it('operates with table name and fields (without field type)', () => {
            const fields = [{name: 'foo'}];
            expect(base.checkPermissionsForCreateTable('Obadiah', fields)).toEqual({
                hasPermission: true,
            });

            expect(mockCheck).toHaveBeenCalledTimes(1);
            expect(mockCheck.mock.calls[0][0]).toMatchInlineSnapshot(`
                Object {
                  "fields": Array [
                    Object {
                      "config": undefined,
                      "description": undefined,
                      "name": "foo",
                    },
                  ],
                  "id": undefined,
                  "name": "Obadiah",
                  "type": "createSingleTable",
                }
            `);
        });

        it('operates with table name and fields (including options)', () => {
            const fields = [{name: 'foo', type: FieldType.SINGLE_LINE_TEXT, options: {bar: 'baz'}}];
            expect(base.checkPermissionsForCreateTable('Obadiah', fields)).toEqual({
                hasPermission: true,
            });

            expect(mockCheck).toHaveBeenCalledTimes(1);
            expect(mockCheck.mock.calls[0][0]).toMatchInlineSnapshot(`
                Object {
                  "fields": Array [
                    Object {
                      "config": Object {
                        "options": Object {
                          "bar": "baz",
                        },
                        "type": "singleLineText",
                      },
                      "description": undefined,
                      "name": "foo",
                    },
                  ],
                  "id": undefined,
                  "name": "Obadiah",
                  "type": "createSingleTable",
                }
            `);
        });

        it('operates with table name and fields (without options)', () => {
            const fields = [{name: 'foo', type: FieldType.SINGLE_LINE_TEXT}];
            expect(base.checkPermissionsForCreateTable('Obadiah', fields)).toEqual({
                hasPermission: true,
            });

            expect(mockCheck).toHaveBeenCalledTimes(1);
            expect(mockCheck.mock.calls[0][0]).toMatchInlineSnapshot(`
                Object {
                  "fields": Array [
                    Object {
                      "config": Object {
                        "type": "singleLineText",
                      },
                      "description": undefined,
                      "name": "foo",
                    },
                  ],
                  "id": undefined,
                  "name": "Obadiah",
                  "type": "createSingleTable",
                }
            `);
        });
    });

    describe('hasPermissionToCreateTable', () => {
        let mockCheck: jest.SpyInstance;

        beforeEach(() => {
            mockCheck = mockAirtableInterface.checkPermissionsForMutation;
        });

        it('operates without arguments', () => {
            expect(base.hasPermissionToCreateTable()).toEqual(true);
        });

        it('reports rejection', () => {
            mockCheck.mockReturnValueOnce({
                hasPermission: false,
                reasonDisplayString: 'No',
            });

            expect(base.hasPermissionToCreateTable()).toEqual(false);
        });
    });

    describe('createTableAsync', () => {
        let mockGetTableById: any;

        beforeEach(() => {
            mockGetTableById = jest.spyOn(base, 'getTableById').mockImplementation(tableId => {
                const recordStore = undefined as any;
                return new Table(base, recordStore, tableId, sdk);
            });
        });

        it('accepts null, undefined and non-null field options', async () => {
            await base.createTableAsync('new table', [
                {name: 'field 1', type: FieldType.SINGLE_LINE_TEXT},
                {name: 'field 2', type: FieldType.SINGLE_LINE_TEXT, options: null},
                {
                    name: 'field 3',
                    type: FieldType.SINGLE_SELECT,
                    options: {choices: [{name: 'pick me'}]},
                },
            ]);

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenCalledTimes(1);
            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_SINGLE_TABLE,
                    id: 'tblGeneratedMockId',
                    name: 'new table',
                    fields: [
                        {
                            name: 'field 1',
                            config: {type: FieldType.SINGLE_LINE_TEXT},
                            description: null,
                        },
                        {
                            name: 'field 2',
                            config: {type: FieldType.SINGLE_LINE_TEXT},
                            description: null,
                        },
                        {
                            name: 'field 3',
                            config: {
                                type: FieldType.SINGLE_SELECT,
                                options: {choices: [{name: 'pick me'}]},
                            },
                            description: null,
                        },
                    ],
                },
                {holdForMs: 100},
            );

            expect(mockGetTableById).toHaveBeenCalledTimes(1);
            expect(mockGetTableById).toHaveBeenLastCalledWith('tblGeneratedMockId');
        });

        it('accepts null, undefined and non-null field description', async () => {
            await base.createTableAsync('new table', [
                {name: 'field 1', type: FieldType.SINGLE_LINE_TEXT},
                {name: 'field 2', type: FieldType.SINGLE_LINE_TEXT, description: 'wow'},
                {name: 'field 3', type: FieldType.SINGLE_LINE_TEXT, description: null},
            ]);

            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenCalledTimes(1);
            expect(mockAirtableInterface.applyMutationAsync).toHaveBeenLastCalledWith(
                {
                    type: MutationTypes.CREATE_SINGLE_TABLE,
                    id: 'tblGeneratedMockId',
                    name: 'new table',
                    fields: [
                        {
                            name: 'field 1',
                            config: {type: FieldType.SINGLE_LINE_TEXT},
                            description: null,
                        },
                        {
                            name: 'field 2',
                            config: {type: FieldType.SINGLE_LINE_TEXT},
                            description: 'wow',
                        },
                        {
                            name: 'field 3',
                            config: {type: FieldType.SINGLE_LINE_TEXT},
                            description: null,
                        },
                    ],
                },
                {holdForMs: 100},
            );

            expect(mockGetTableById).toHaveBeenCalledTimes(1);
            expect(mockGetTableById).toHaveBeenLastCalledWith('tblGeneratedMockId');
        });
    });

    describe('getMaxRecordsPerTable', () => {
        it('returns the correct limit', () => {
            expect(base.getMaxRecordsPerTable()).toEqual(50000);
        });
    });

    describe('workspaceId', () => {
        it('returns the correct workspace id', () => {
            expect(base.workspaceId).toEqual('wspUai0ZmWFWfSBtb');
        });
    });
});
