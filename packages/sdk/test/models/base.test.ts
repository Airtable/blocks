import mockProjectTrackerAirtableInterface from '../airtable_interface_mocks/project_tracker';
import {FieldType} from '../../src/types/field';
import {MutationTypes} from '../../src/types/mutations';
import Base from '../../src/models/base';
import Table from '../../src/models/table';

jest.mock('../../src/injected/airtable_interface', () => mockProjectTrackerAirtableInterface);

let mockMutations: any;
jest.mock('../../src/get_sdk', () => () => ({
    __mutations: mockMutations,
    runInfo: {
        isDevelopment: true,
    },
}));

describe('Base', () => {
    let base: Base;
    beforeEach(() => {
        base = new Base(
            mockProjectTrackerAirtableInterface.sdkInitData.baseData as any,
            mockProjectTrackerAirtableInterface as any,
        );
    });

    describe('getCollaboratorIfExists', () => {
        it('returns collaborator by id', () => {
            const collaborator1 = base.getCollaboratorIfExists('usrTv3tPZmP3GYJ9K');
            const collaborator2 = base.getCollaboratorIfExists('usr8e9aJ8jHSg29YV');
            expect(collaborator1).toMatchInlineSnapshot(`
                Object {
                  "email": "collab4@example.com",
                  "id": "usrTv3tPZmP3GYJ9K",
                  "name": "Ash Quintana",
                  "profilePicUrl": "https://dl.airtable.com/profilePics/7KX9bnbqQyGvWGArbTXB_headshot-yellow-1.png",
                }
            `);
            expect(collaborator2).toMatchInlineSnapshot(`
                Object {
                  "email": "collab26@example.com",
                  "id": "usr8e9aJ8jHSg29YV",
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
                  "id": "usrArxKAc5yNZQfxl",
                  "name": "Bailey Mirza",
                  "profilePicUrl": "https://dl.airtable.com/profilePics/7pprdNqqQuSWWN7zeavM_headshot-pink-1.png",
                }
            `);
            expect(collaborator2).toMatchInlineSnapshot(`
                Object {
                  "email": "collab10@example.com",
                  "id": "usr3VLCpyqgcI46Sh",
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
                  "id": "usrQjmKTBNxfXNmmR",
                  "name": "Jordan Peretz",
                  "profilePicUrl": "https://dl.airtable.com/profilePics/jCMoXFziQcD0XkHMxhwQ_Screen%20Shot%202019-01-17%20at%201.19.59%20PM.png",
                }
            `);
            expect(collaborator2).toMatchInlineSnapshot(`
                Object {
                  "email": "collab4@example.com",
                  "id": "usrTv3tPZmP3GYJ9K",
                  "name": "Ash Quintana",
                  "profilePicUrl": "https://dl.airtable.com/profilePics/7KX9bnbqQyGvWGArbTXB_headshot-yellow-1.png",
                }
            `);
        });

        it('returns null if no collaborator is found', () => {
            expect(base.getCollaboratorIfExists('usr3VLCpyqgc1FAKE')).toBe(null);
            expect(base.getCollaboratorIfExists('fake@example.com')).toBe(null);
            expect(base.getCollaboratorIfExists('Mary Face')).toBe(null);
        });
    });

    describe('getCollaborator', () => {
        beforeEach(() => {
            base = new Base(
                mockProjectTrackerAirtableInterface.sdkInitData.baseData as any,
                mockProjectTrackerAirtableInterface as any,
            );
        });

        it('returns collaborator by id', () => {
            const collaborator1 = base.getCollaborator('usrTv3tPZmP3GYJ9K');
            const collaborator2 = base.getCollaborator('usr8e9aJ8jHSg29YV');
            expect(collaborator1).toMatchInlineSnapshot(`
                Object {
                  "email": "collab4@example.com",
                  "id": "usrTv3tPZmP3GYJ9K",
                  "name": "Ash Quintana",
                  "profilePicUrl": "https://dl.airtable.com/profilePics/7KX9bnbqQyGvWGArbTXB_headshot-yellow-1.png",
                }
            `);
            expect(collaborator2).toMatchInlineSnapshot(`
                Object {
                  "email": "collab26@example.com",
                  "id": "usr8e9aJ8jHSg29YV",
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
                  "id": "usrArxKAc5yNZQfxl",
                  "name": "Bailey Mirza",
                  "profilePicUrl": "https://dl.airtable.com/profilePics/7pprdNqqQuSWWN7zeavM_headshot-pink-1.png",
                }
            `);
            expect(collaborator2).toMatchInlineSnapshot(`
                Object {
                  "email": "collab10@example.com",
                  "id": "usr3VLCpyqgcI46Sh",
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
                  "id": "usrQjmKTBNxfXNmmR",
                  "name": "Jordan Peretz",
                  "profilePicUrl": "https://dl.airtable.com/profilePics/jCMoXFziQcD0XkHMxhwQ_Screen%20Shot%202019-01-17%20at%201.19.59%20PM.png",
                }
            `);
            expect(collaborator2).toMatchInlineSnapshot(`
                Object {
                  "email": "collab4@example.com",
                  "id": "usrTv3tPZmP3GYJ9K",
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

    describe('getTableIfExists', () => {
        it('returns table by id', () => {
            const table1 = base.getTableIfExists('tbly388E8NA1CNhnF');
            const table2 = base.getTableIfExists('tblcstEo50YXLJcK4');
            expect(table1).toBeInstanceOf(Table);
            expect(table1?.id).toBe('tbly388E8NA1CNhnF');
            expect(table2).toBeInstanceOf(Table);
            expect(table2?.id).toBe('tblcstEo50YXLJcK4');
        });

        it('returns table by name', () => {
            const table1 = base.getTableIfExists('Design projects');
            const table2 = base.getTableIfExists('Tasks');
            expect(table1).toBeInstanceOf(Table);
            expect(table1?.id).toBe('tbly388E8NA1CNhnF');
            expect(table2).toBeInstanceOf(Table);
            expect(table2?.id).toBe('tblcstEo50YXLJcK4');
        });

        it('returns null when not found', () => {
            expect(base.getTableIfExists('tbly388E8NA1cFAKE')).toBe(null);
            expect(base.getTableIfExists('Injustices')).toBe(null);
        });
    });

    describe('getTable', () => {
        it('returns table by id', () => {
            const table1 = base.getTable('tbly388E8NA1CNhnF');
            const table2 = base.getTable('tblcstEo50YXLJcK4');
            expect(table1).toBeInstanceOf(Table);
            expect(table1.id).toBe('tbly388E8NA1CNhnF');
            expect(table2).toBeInstanceOf(Table);
            expect(table2.id).toBe('tblcstEo50YXLJcK4');
        });

        it('returns table by name', () => {
            const table1 = base.getTable('Design projects');
            const table2 = base.getTable('Tasks');
            expect(table1).toBeInstanceOf(Table);
            expect(table1.id).toBe('tbly388E8NA1CNhnF');
            expect(table2).toBeInstanceOf(Table);
            expect(table2.id).toBe('tblcstEo50YXLJcK4');
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

    describe('createTableAsync', () => {
        let mockGetTableById: any;
        beforeEach(() => {
            mockMutations = {
                applyMutationAsync: jest.fn(),
            };

            mockGetTableById = jest.spyOn(base, 'getTableById').mockImplementation(tableId => {
                const airtableInterface = mockProjectTrackerAirtableInterface as any;
                const recordStore = undefined as any;
                return new Table(base.__baseData, base, recordStore, tableId, airtableInterface);
            });
        });

        it('accepts null, undefined and non-null field options', async () => {
            await base.unstable_createTableAsync('new table', [
                {name: 'field 1', type: FieldType.SINGLE_LINE_TEXT},
                {name: 'field 2', type: FieldType.SINGLE_LINE_TEXT, options: null},
                {
                    name: 'field 3',
                    type: FieldType.SINGLE_SELECT,
                    options: {choices: [{name: 'pick me'}]},
                },
            ]);

            expect(mockMutations.applyMutationAsync).toHaveBeenCalledTimes(1);
            expect(mockMutations.applyMutationAsync).toHaveBeenLastCalledWith({
                type: MutationTypes.CREATE_SINGLE_TABLE,
                id: 'tblGeneratedMockId',
                name: 'new table',
                fields: [
                    {name: 'field 1', config: {type: FieldType.SINGLE_LINE_TEXT}},
                    {name: 'field 2', config: {type: FieldType.SINGLE_LINE_TEXT}},
                    {
                        name: 'field 3',
                        config: {
                            type: FieldType.SINGLE_SELECT,
                            options: {choices: [{name: 'pick me'}]},
                        },
                    },
                ],
            });

            expect(mockGetTableById).toHaveBeenCalledTimes(1);
            expect(mockGetTableById).toHaveBeenLastCalledWith('tblGeneratedMockId');
        });
    });
});
