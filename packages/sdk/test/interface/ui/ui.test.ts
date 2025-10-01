import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';

jest.mock('../../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default() {
        return MockAirtableInterface.projectTrackerExample();
    },
}));

const run = (bindingIdentifier: string) => {
    const exported = require('../../../src/interface/ui/ui')[bindingIdentifier];

    expect(exported).toBeTruthy();
};

describe('ui entry point', () => {
    test('expandRecord', () => run('expandRecord'));
    test('initializeBlock', () => run('initializeBlock'));
    test('useBase', () => run('useBase'));
    test('useColorScheme', () => run('useColorScheme'));
    test('useCustomProperties', () => run('useCustomProperties'));
    test('useRecords', () => run('useRecords'));
    test('useRunInfo', () => run('useRunInfo'));
    test('useSession', () => run('useSession'));
    test('useGlobalConfig', () => run('useGlobalConfig'));
    test('useSynced', () => run('useSynced'));
    test('useWatchable', () => run('useWatchable'));
    test('colors', () => run('colors'));
    test('colorUtils', () => run('colorUtils'));
    test('loadCSSFromString', () => run('loadCSSFromString'));
    test('loadCSSFromURLAsync', () => run('loadCSSFromURLAsync'));
    test('loadScriptFromURLAsync', () => run('loadScriptFromURLAsync'));
});
