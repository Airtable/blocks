// eslint-disable-next-line import/order
import {MockAirtableInterface} from './airtable_interface_mocks/mock_airtable_interface';
import * as sdk from '../../src/base/index';
import * as UI from '../../src/base/ui/ui';

jest.mock('../../src/injected/airtable_interface', () => {
    let mockAirtableInterface: jest.Mocked<MockAirtableInterface>;
    return {
        __esModule: true,
        default() {
            if (!mockAirtableInterface) {
                mockAirtableInterface = MockAirtableInterface.projectTrackerExample();
            }
            return mockAirtableInterface;
        },
    };
});

describe('index', () => {
    describe('legacy `cursor` property', () => {
        test('value', () => {
            expect(sdk.cursor.activeTableId).toBe('tblDesignProjects');
        });

        test('enumerability', () => {
            expect(Object.keys(sdk).some(key => key === 'cursor')).toBe(true);
        });
    });

    describe('legacy `session` property', () => {
        test('value', () => {
            expect(sdk.session.currentUser).toEqual({
                email: 'collab10@example.com',
                id: 'usrGalSamari',
                name: 'Gal Samari',
                profilePicUrl:
                    'https://dl.airtable.com/profilePics/qy4E6kRaaku2JJwXpjQb_headshot-purple-2.png',
            });
        });

        test('enumerability', () => {
            expect(Object.keys(sdk).some(key => key === 'session')).toBe(true);
        });
    });

    describe('legacy `UI` property', () => {
        test('value', () => {
            expect((sdk as any).UI).toBe(UI);
        });

        test('enumerability', () => {
            expect(Object.keys(sdk).some(key => key === 'UI')).toBe(true);
        });
    });

    describe('internal `undoRedo` property', () => {
        test('value', () => {
            expect((sdk as any).undoRedo).toBe(sdk.__sdk.undoRedo);
        });

        test('enumerability', () => {
            expect(Object.keys(sdk).some(key => key === 'undoRedo')).toBe(true);
        });
    });
});
