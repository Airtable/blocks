import {
    spawnError,
    invariant,
    spawnAbstractMethodError,
    spawnUnknownSwitchCaseError,
} from '../../src/shared/error_utils';

describe('spawnError', () => {
    it('returns an error with message set to the first argument', () => {
        const error = spawnError('hello, world');
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'hello, world');
    });

    it('interpolates arguments into the message format string', () => {
        expect(spawnError('hello, %s', 'world')).toHaveProperty('message', 'hello, world');
        expect(spawnError('hello, %s %s', 'world')).toHaveProperty(
            'message',
            'hello, world undefined',
        );
        expect(spawnError('%s %s %s %s', 'hello', 123, true, null)).toHaveProperty(
            'message',
            'hello 123 true null',
        );
    });

    it('strips itself from the stack trace', () => {
        const errorStack = spawnError('test').stack;
        expect(errorStack).not.toContain('at spawnError');
    });

    it('includes a __safeMessage prop with the unformatted message', () => {
        expect(spawnError('hello, %s', 'world')).toHaveProperty('__safeMessage', 'hello, %s');
    });
});

describe('invariant', () => {
    it('does not error when the first argument is truthy', () => {
        expect(() => {
            invariant(true, 'true');
            invariant({}, 'object');
            invariant('hi', 'string');
            invariant(123, 'number');
        }).not.toThrow();
    });

    it('throws when the first argument is falsey', () => {
        expect(() => invariant(false, 'false')).toThrow();
        expect(() => invariant(null, 'null')).toThrow();
        expect(() => invariant(undefined, 'undefined')).toThrow();
        expect(() => invariant('', 'empty string')).toThrow();
    });

    const expectError = (fn: () => void) => {
        try {
            fn();
        } catch (err) {
            return err;
        }

        // eslint-disable-next-line @airtable/blocks/no-throw-new
        throw new Error('expected fn to throw');
    };

    it('interpolates args into error message and includes __safeMessage and package name prefix', () => {
        const err = expectError(() => invariant(false, 'hello, %s %s', 'world', 123));
        expect(err).toHaveProperty('message', 'hello, world 123');
        expect(err).toHaveProperty('__safeMessage', 'hello, %s %s');
    });

    it('excludes invariant from stack trace', () => {
        const err = expectError(() => invariant(false, 'test'));
        expect(err.stack).not.toContain('at invariant');
    });
});

describe('spawnAbstractMethodError', () => {
    it('returns an error with the message "Abstract method"', () => {
        const error = spawnAbstractMethodError();
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Abstract method');
    });

    it("doesn't include itself in its stacktrace", () => {
        const error = spawnAbstractMethodError();
        expect(error.stack).not.toContain('at spawnAbstractMethodError');
        expect(error.stack).not.toContain('at spawnError');
    });
});

describe('spawnUnknownSwitchCaseError', () => {
    it('returns an error with a helpful message', () => {
        const val = {type: 'foo'} as never;
        const error = spawnUnknownSwitchCaseError('some enum', val, 'type');
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Unknown value foo for some enum');
    });

    it("doesn't include itself in its stacktrace", () => {
        const val = {type: 'foo'} as never;
        const error = spawnUnknownSwitchCaseError('some enum', val, 'type');
        expect(error.stack).not.toContain('at spawnUnknownSwitchCaseError');
        expect(error.stack).not.toContain('at spawnError');
    });
});
