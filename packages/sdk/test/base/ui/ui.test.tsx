import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';

jest.mock('../../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default() {
        return MockAirtableInterface.projectTrackerExample();
    },
}));

const run = (bindingIdentifier: string) => {
    const exported = require('../../../src/base/ui/ui')[bindingIdentifier];

    expect(exported).toBeTruthy();

    expect(exported).toBe(
        require('../../../src/base/ui/unstable_standalone_ui')[bindingIdentifier],
    );
};

describe('ui entry point', () => {
    test('loadCSSFromString', () => run('loadCSSFromString'));
    test('loadCSSFromURLAsync', () => run('loadCSSFromURLAsync'));
    test('loadScriptFromURLAsync', () => run('loadScriptFromURLAsync'));
});
