import {MockAirtableInterface} from './airtable_interface_mocks/mock_airtable_interface';
// eslint-disable-next-line import/order
import * as sdk from '../../src/base/index';

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
    describe('internal `undoRedo` property', () => {
        test('value', () => {
            expect((sdk as any).undoRedo).toBe(sdk.__sdk.undoRedo);
        });

        test('enumerability', () => {
            expect(Object.keys(sdk).some((key) => key === 'undoRedo')).toBe(true);
        });
    });
});
