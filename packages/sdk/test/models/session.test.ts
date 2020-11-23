import MockAirtableInterface from '../airtable_interface_mocks/mock_airtable_interface';
import {UserId} from '../../src/types/collaborator';
import {PermissionLevel, PermissionLevels} from '../../src/types/permission_levels';
import {
    MutationTypes,
    DeleteMultipleRecordsMutation,
    CreateMultipleRecordsMutation,
    SetMultipleRecordsCellValuesMutation,
} from '../../src/types/mutations';
import getSdk, {clearSdkForTest} from '../../src/get_sdk';

const mockAirtableInterface = MockAirtableInterface.projectTrackerExample();
jest.mock('../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default() {
        return mockAirtableInterface;
    },
}));

interface SessionData {
    currentUserId?: UserId | null;
    permissionLevel?: PermissionLevel;
    enabledFeatureNames?: Array<string>;
}

const create = (sessionData: SessionData) => {
    clearSdkForTest();
    getSdk();

    mockAirtableInterface.triggerModelUpdates([
        {path: ['currentUserId'], value: sessionData.currentUserId || null},
        {path: ['permissionLevel'], value: sessionData.permissionLevel || PermissionLevels.NONE},
        {path: ['enabledFeatureNames'], value: sessionData.enabledFeatureNames || []},
    ]);

    clearSdkForTest();
    return getSdk().session;
};

describe('Session', () => {
    afterEach(() => {
        mockAirtableInterface.reset();
    });

    describe('#currentUser', () => {
        it('returns `null` when there is no current user', () => {
            const session = create({currentUserId: null});

            expect(session.currentUser).toBe(null);
        });

        it('returns `null` when the current user is not recognized', () => {
            const session = create({currentUserId: 'usrNonExistentUser'});

            expect(session.currentUser).toBe(null);
        });

        it('returns profile information of current user', () => {
            const session = create({currentUserId: 'usrGalSamari'});

            expect(session.currentUser).toStrictEqual({
                id: 'usrGalSamari',
                email: 'collab10@example.com',
                name: 'Gal Samari',
                profilePicUrl:
                    'https://dl.airtable.com/profilePics/qy4E6kRaaku2JJwXpjQb_headshot-purple-2.png',
            });
        });
    });

    describe('#checkPermissionsForUpdateRecords', () => {
        it('queries AirtableInterface with the appropriate information', () => {
            const session = create({});

            session.checkPermissionsForUpdateRecords();

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenCalledTimes(1);
            const mutation = mockAirtableInterface.checkPermissionsForMutation.mock
                .calls[0][0] as SetMultipleRecordsCellValuesMutation;
            expect(mutation.type).toBe(MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES);
            expect(mutation.tableId).toBe(undefined);
            expect(mutation.records).toBe(undefined);
        });

        it('returns affirmative result provided by AirtableInterface', () => {
            const session = create({});

            mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                hasPermission: true,
            });

            expect(session.checkPermissionsForUpdateRecords()).toStrictEqual({
                hasPermission: true,
            });
        });

        it('returns negative result provided by AirtableInterface', () => {
            const session = create({});

            mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                hasPermission: false,
                reasonDisplayString: 'mock reason',
            });

            expect(session.checkPermissionsForUpdateRecords()).toStrictEqual({
                hasPermission: false,
                reasonDisplayString: 'mock reason',
            });
        });
    });

    describe('#hasPermissionToUpdateRecords', () => {
        it('queries AirtableInterface with the appropriate information', () => {
            const session = create({});

            session.hasPermissionToUpdateRecords();

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenCalledTimes(1);
            const mutation = mockAirtableInterface.checkPermissionsForMutation.mock
                .calls[0][0] as SetMultipleRecordsCellValuesMutation;
            expect(mutation.type).toBe(MutationTypes.SET_MULTIPLE_RECORDS_CELL_VALUES);
            expect(mutation.tableId).toBe(undefined);
            expect(mutation.records).toBe(undefined);
        });

        it('returns affirmative result provided by AirtableInterface', () => {
            const session = create({});

            mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                hasPermission: true,
            });

            expect(session.hasPermissionToUpdateRecords()).toBe(true);
        });

        it('returns negative result provided by AirtableInterface', () => {
            const session = create({});

            mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                hasPermission: false,
                reasonDisplayString: 'mock reason',
            });

            expect(session.hasPermissionToUpdateRecords()).toBe(false);
        });
    });

    describe('#checkPermissionsForCreateRecords', () => {
        it('queries AirtableInterface with the appropriate information', () => {
            const session = create({});

            session.checkPermissionsForCreateRecords();

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenCalledTimes(1);
            const mutation = mockAirtableInterface.checkPermissionsForMutation.mock
                .calls[0][0] as CreateMultipleRecordsMutation;
            expect(mutation.type).toBe(MutationTypes.CREATE_MULTIPLE_RECORDS);
            expect(mutation.tableId).toBe(undefined);
            expect(mutation.records).toBe(undefined);
        });

        it('returns affirmative result provided by AirtableInterface', () => {
            const session = create({});

            mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                hasPermission: true,
            });

            expect(session.checkPermissionsForCreateRecords()).toStrictEqual({
                hasPermission: true,
            });
        });

        it('returns negative result provided by AirtableInterface', () => {
            const session = create({});

            mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                hasPermission: false,
                reasonDisplayString: 'mock reason',
            });

            expect(session.checkPermissionsForCreateRecords()).toStrictEqual({
                hasPermission: false,
                reasonDisplayString: 'mock reason',
            });
        });
    });

    describe('#hasPermissionToCreateRecords', () => {
        it('queries AirtableInterface with the appropriate information', () => {
            const session = create({});

            session.hasPermissionToCreateRecords();

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenCalledTimes(1);
            const mutation = mockAirtableInterface.checkPermissionsForMutation.mock
                .calls[0][0] as CreateMultipleRecordsMutation;
            expect(mutation.type).toBe(MutationTypes.CREATE_MULTIPLE_RECORDS);
            expect(mutation.tableId).toBe(undefined);
            expect(mutation.records).toBe(undefined);
        });

        it('returns affirmative result provided by AirtableInterface', () => {
            const session = create({});

            mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                hasPermission: true,
            });

            expect(session.hasPermissionToCreateRecords()).toBe(true);
        });

        it('returns negative result provided by AirtableInterface', () => {
            const session = create({});

            mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                hasPermission: false,
                reasonDisplayString: 'mock reason',
            });

            expect(session.hasPermissionToCreateRecords()).toBe(false);
        });
    });

    describe('#checkPermissionsForDeleteRecords', () => {
        it('queries AirtableInterface with the appropriate information', () => {
            const session = create({});

            session.checkPermissionsForDeleteRecords();

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenCalledTimes(1);
            const mutation = mockAirtableInterface.checkPermissionsForMutation.mock
                .calls[0][0] as DeleteMultipleRecordsMutation;
            expect(mutation.type).toBe(MutationTypes.DELETE_MULTIPLE_RECORDS);
            expect(mutation.tableId).toBe(undefined);
            expect(mutation.recordIds).toBe(undefined);
        });

        it('returns affirmative result provided by AirtableInterface', () => {
            const session = create({});

            mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                hasPermission: true,
            });

            expect(session.checkPermissionsForDeleteRecords()).toStrictEqual({
                hasPermission: true,
            });
        });

        it('returns negative result provided by AirtableInterface', () => {
            const session = create({});

            mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                hasPermission: false,
                reasonDisplayString: 'mock reason',
            });

            expect(session.checkPermissionsForDeleteRecords()).toStrictEqual({
                hasPermission: false,
                reasonDisplayString: 'mock reason',
            });
        });
    });

    describe('#hasPermissionToDeleteRecords', () => {
        it('queries AirtableInterface with the appropriate information', () => {
            const session = create({});

            session.hasPermissionToDeleteRecords();

            expect(mockAirtableInterface.checkPermissionsForMutation).toHaveBeenCalledTimes(1);
            const mutation = mockAirtableInterface.checkPermissionsForMutation.mock
                .calls[0][0] as DeleteMultipleRecordsMutation;
            expect(mutation.type).toBe(MutationTypes.DELETE_MULTIPLE_RECORDS);
            expect(mutation.tableId).toBe(undefined);
            expect(mutation.recordIds).toBe(undefined);
        });

        it('returns affirmative result provided by AirtableInterface', () => {
            const session = create({});

            mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                hasPermission: true,
            });

            expect(session.hasPermissionToDeleteRecords()).toBe(true);
        });

        it('returns negative result provided by AirtableInterface', () => {
            const session = create({});

            mockAirtableInterface.checkPermissionsForMutation.mockReturnValue({
                hasPermission: false,
                reasonDisplayString: 'mock reason',
            });

            expect(session.hasPermissionToDeleteRecords()).toBe(false);
        });
    });

    describe('#id', () => {
        it('returns `"session"` when there is no current user', () => {
            const session = create({currentUserId: null});

            expect(session.id).toBe('session');
        });

        it('returns `"session"` when this is a current user', () => {
            const session = create({currentUserId: 'usrGalSamari'});

            expect(session.id).toBe('session');
        });
    });

    describe('#isDeleted', () => {
        it('always returns `false`', () => {
            const session = create({});

            expect(session.isDeleted).toBe(false);
        });
    });

    describe('#watch', () => {
        it('rejects unrecognized keys', () => {
            const session = create({currentUserId: null});
            const noop = () => {};

            expect(() =>
                session.watch('name' as 'permissionLevel', noop),
            ).toThrowErrorMatchingInlineSnapshot(`"Invalid key to watch for Session: name"`);
        });

        it('key: permissionLevel', () => {
            const session = create({permissionLevel: PermissionLevels.NONE});
            const spy = jest.fn();
            session.watch('permissionLevel', spy);

            expect(spy).toHaveBeenCalledTimes(0);

            mockAirtableInterface.triggerModelUpdates([
                {
                    path: ['permissionLevel'],
                    value: PermissionLevels.COMMENT,
                },
            ]);

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(session, 'permissionLevel');
        });

        describe('key: currentUser', () => {
            it('notifies when the current user changes', () => {
                const session = create({currentUserId: 'usrGalSamari'});
                const spy = jest.fn();
                session.watch('currentUser', spy);

                expect(spy).toHaveBeenCalledTimes(0);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['collaboratorsById', 'usrGalSamari', 'email'],
                        value: 'roll@fizzlebeef.com',
                    },
                ]);

                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(session, 'currentUser');
            });

            it('notifies when a user other than the current user changes', () => {
                const session = create({currentUserId: 'usrGalSamari'});
                const spy = jest.fn();
                session.watch('currentUser', spy);

                expect(spy).toHaveBeenCalledTimes(0);

                mockAirtableInterface.triggerModelUpdates([
                    {
                        path: ['collaboratorsById', 'usrSamEpps', 'email'],
                        value: 'roll@fizzlebeef.com',
                    },
                ]);

                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(session, 'currentUser');
            });
        });
    });
});
