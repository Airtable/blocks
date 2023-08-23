import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';

jest.mock('../../src/injected/airtable_interface', () => ({
    __esModule: true,
    default() {
        return MockAirtableInterface.projectTrackerExample();
    },
}));

const run = (bindingIdentifier: string) => {
    const exported = require('../../src/ui/ui')[bindingIdentifier];

    expect(exported).toBeTruthy();

    expect(exported).toBe(require('../../src/ui/unstable_standalone_ui')[bindingIdentifier]);
};

describe('ui entry point', () => {
    test('Box', () => run('Box'));
    test('Button', () => run('Button'));
    test('ChoiceToken', () => run('ChoiceToken'));
    test('CollaboratorToken', () => run('CollaboratorToken'));
    test('ConfirmationDialog', () => run('ConfirmationDialog'));
    test('Dialog', () => run('Dialog'));
    test('FormField', () => run('FormField'));
    test('Heading', () => run('Heading'));
    test('Icon', () => run('Icon'));
    test('Input', () => run('Input'));
    test('Label', () => run('Label'));
    test('Link', () => run('Link'));
    test('Loader', () => run('Loader'));
    test('Modal', () => run('Modal'));
    test('Popover', () => run('Popover'));
    test('Select', () => run('Select'));
    test('SelectButtons', () => run('SelectButtons'));
    test('Switch', () => run('Switch'));
    test('TextButton', () => run('TextButton'));
    test('Text', () => run('Text'));
    test('Tooltip', () => run('Tooltip'));
    test('loadCSSFromString', () => run('loadCSSFromString'));
    test('loadCSSFromURLAsync', () => run('loadCSSFromURLAsync'));
    test('loadScriptFromURLAsync', () => run('loadScriptFromURLAsync'));
});
