import {expect} from '@oclif/test';

import {decorateModuleNotFoundError} from '../src/webpack_error_utils';

const getDefaultWebpackErrorForTest = (): Parameters<typeof decorateModuleNotFoundError>[0] => ({
    name: 'ModuleNotFoundError',
    message:
        "Module not found: Error: Can't resolve './Child' in '/Users/john.doe/Documents/my-app/frontend'",
    stack: '',
    loc: {
        start: {line: 3, column: 0},
        end: {line: 3, column: 28},
    },
    module: {
        nameForCondition: () => '/Users/john.doe/Documents/my-app/frontend/index.tsx',
    },
});

describe('webpack_error_utils', () => {
    describe('decorateModuleNotFoundError', () => {
        it('adds user-friendly error message for relative import', () => {
            const err = decorateModuleNotFoundError(
                getDefaultWebpackErrorForTest(),
                '/Users/john.doe/Documents/my-app',
            );
            expect(err.name).to.equal('ModuleNotFoundError');
            expect(err.message).to.equal(
                `Module not found: Error: Can't resolve './Child' in '/Users/john.doe/Documents/my-app/frontend'.\n❌ Please check that the import path "./Child" is correct in "/Users/john.doe/Documents/my-app/frontend/index.tsx" at line 3 column 0 to 28.`,
            );
        });

        it('adds user-friendly error message for npm package import', () => {
            const webpackError = getDefaultWebpackErrorForTest();
            webpackError.message =
                "Module not found: Error: Can't resolve 'react-dom' in '/Users/john.doe/Documents/my-app/frontend'";
            const err = decorateModuleNotFoundError(
                webpackError,
                '/Users/john.doe/Documents/my-app',
            );
            expect(err.name).to.equal('ModuleNotFoundError');
            expect(err.message).to.equal(
                `Module not found: Error: Can't resolve 'react-dom' in '/Users/john.doe/Documents/my-app/frontend'.\n❌ Please check that the import path "react-dom" is correct in "/Users/john.doe/Documents/my-app/frontend/index.tsx" at line 3 column 0 to 28 and run \`npm install\` in /Users/john.doe/Documents/my-app to install packages.`,
            );
        });

        it('reports errors that go across multiple lines', () => {
            const webpackError = getDefaultWebpackErrorForTest();
            webpackError.loc = {
                start: {line: 3, column: 0},
                end: {line: 5, column: 28},
            };
            const err = decorateModuleNotFoundError(
                webpackError,
                '/Users/john.doe/Documents/my-app',
            );
            expect(err.name).to.equal('ModuleNotFoundError');
            expect(err.message).to.equal(
                `Module not found: Error: Can't resolve './Child' in '/Users/john.doe/Documents/my-app/frontend'.\n❌ Please check that the import path "./Child" is correct in "/Users/john.doe/Documents/my-app/frontend/index.tsx" at line 3 column 0 to line 5 column 28.`,
            );
        });

        it('does not decorate error if location is missing end', () => {
            const webpackError = getDefaultWebpackErrorForTest();
            webpackError.loc = {
                start: {line: 3, column: 0},
            };
            const err = decorateModuleNotFoundError(
                webpackError,
                '/Users/john.doe/Documents/my-app',
            );
            expect(err.name).to.equal('ModuleNotFoundError');
            expect(err.message).to.equal(webpackError.message);
        });

        it('does not decorate error if location is missing column', () => {
            const webpackError = getDefaultWebpackErrorForTest();
            webpackError.loc = {
                start: {line: 3, column: 0},
                end: {line: 5},
            };
            const err = decorateModuleNotFoundError(
                webpackError,
                '/Users/john.doe/Documents/my-app',
            );
            expect(err.name).to.equal('ModuleNotFoundError');
            expect(err.message).to.equal(webpackError.message);
        });

        it('does not crash if format of WebpackError is unexpected', () => {
            const webpackError = new Error();
            const err = decorateModuleNotFoundError(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                webpackError as any,
                '/Users/john.doe/Documents/my-app',
            );
            expect(err).to.equal(webpackError);
        });
    });
});
