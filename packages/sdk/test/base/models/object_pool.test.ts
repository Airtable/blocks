import ObjectPool, {Poolable} from '../../../src/base/models/object_pool';

class TestPoolable implements Poolable {
    __poolKey: string;
    args: any[];

    constructor(...args: any[]) {
        this.args = args;
        this.__poolKey = String(args[0]);
    }
}

const simulateOneMinute = () => jest.advanceTimersByTime(60 * 1000);

describe('ObjectPool', () => {
    let pool: ObjectPool<TestPoolable, typeof TestPoolable>;

    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    beforeEach(() => {
        pool = new ObjectPool(TestPoolable);
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    it('returns a new object when pool is empty', () => {
        const obj = pool.getObjectForReuse('a', 'b', 'c');

        expect(obj.args).toEqual(['a', 'b', 'c']);
    });

    it("returns a new object when existing objects don't match", () => {
        const first = pool.getObjectForReuse();
        const second = pool.getObjectForReuse('d');

        expect(first.args).toEqual([]);
        expect(second.args).toEqual(['d']);
    });

    it('returns matching weakly-held object', () => {
        const first = pool.getObjectForReuse('a');
        const second = pool.getObjectForReuse('b');
        const third = pool.getObjectForReuse('c');
        const fourth = pool.getObjectForReuse('b');

        expect(first.args).toEqual(['a']);
        expect(second.args).toEqual(['b']);
        expect(third.args).toEqual(['c']);
        expect(fourth).toEqual(second);
    });

    it('recognizes key changes in weakly-held objects', () => {
        const first = pool.getObjectForReuse('a');
        const second = pool.getObjectForReuse('b');
        const third = pool.getObjectForReuse('c');

        second.__poolKey = 'definitely not b';
        const fourth = pool.getObjectForReuse('b');

        expect(first.args).toEqual(['a']);
        expect(second.args).toEqual(['b']);
        expect(third.args).toEqual(['c']);
        expect(fourth.args).toEqual(['b']);
        expect(fourth).not.toEqual(second);
    });

    it('eventually releases weakly-held objects', () => {
        const first = pool.getObjectForReuse('a');

        simulateOneMinute();

        const second = pool.getObjectForReuse('a');

        expect(first.args).toEqual(['a']);
        expect(second.args).toEqual(['a']);
        expect(first).not.toBe(second);
    });

    it('eventually releases weakly-held objects whose key has changed', () => {
        const first = pool.getObjectForReuse('a');
        const second = pool.getObjectForReuse('b');
        const third = pool.getObjectForReuse('c');

        second.__poolKey = 'definitely not b';
        simulateOneMinute();
        const fourth = pool.getObjectForReuse('b');

        expect(first.args).toEqual(['a']);
        expect(second.args).toEqual(['b']);
        expect(third.args).toEqual(['c']);
        expect(fourth.args).toEqual(['b']);
        expect(fourth).not.toEqual(second);
    });

    it('is capable of tracking weak references to multiple objects for the same key', () => {
        const first = pool.getObjectForReuse('a');
        const second = pool.getObjectForReuse('b');
        const third = pool.getObjectForReuse('c');

        second.__poolKey = 'definately not b';
        pool.getObjectForReuse('b');

        second.__poolKey = 'b';
        simulateOneMinute();
        const fourth = pool.getObjectForReuse('b');

        expect(first.args).toEqual(['a']);
        expect(second.args).toEqual(['b']);
        expect(third.args).toEqual(['c']);
        expect(fourth).toEqual(second);
    });

    it('renews hold on weakly-held objects with each reference', () => {
        const first = pool.getObjectForReuse('a');

        setInterval(() => pool.getObjectForReuse('a'), 20);
        simulateOneMinute();

        const second = pool.getObjectForReuse('a');

        expect(first).toBe(second);
    });

    it('eventually releases weakly-held objects even following reference', () => {
        const first = pool.getObjectForReuse('a');

        pool.getObjectForReuse('a');
        simulateOneMinute();

        const second = pool.getObjectForReuse('a');

        expect(first.args).toEqual(['a']);
        expect(second.args).toEqual(['a']);
        expect(first).not.toBe(second);
    });

    it('does not automatically release strongly-held objects (introduced via registration)', () => {
        const first = new TestPoolable('a');

        pool.registerObjectForReuseStrong(first);
        simulateOneMinute();

        const second = pool.getObjectForReuse('a');

        expect(first).toBe(second);
    });

    it('immediately removes weak reference when a strong reference is created', () => {
        const first = pool.getObjectForReuse('a');

        pool.registerObjectForReuseStrong(first);
        pool.unregisterObjectForReuseStrong(first);

        const second = pool.getObjectForReuse('a');

        expect(first.args).toEqual(['a']);
        expect(second.args).toEqual(['a']);
        expect(first).not.toBe(second);
    });

    it('does not automatically release strongly-held objects (introduced via retrieval)', () => {
        const first = pool.getObjectForReuse('a');

        pool.registerObjectForReuseStrong(first);
        simulateOneMinute();

        const second = pool.getObjectForReuse('a');

        expect(first).toBe(second);
    });

    it('recognizes key changes when creating strong references', () => {
        const first = pool.getObjectForReuse('a');
        pool.getObjectForReuse('b');
        first.__poolKey = 'b';

        pool.registerObjectForReuseStrong(first);

        const second = pool.getObjectForReuse('b');

        expect(second).toBe(first);
    });

    it('recognizes key changes in strongly-held object', () => {
        const first = pool.getObjectForReuse('a');

        pool.registerObjectForReuseStrong(first);
        simulateOneMinute();
        first.__poolKey = 'definitely not a';

        const second = pool.getObjectForReuse('a');

        expect(first.args).toEqual(['a']);
        expect(second.args).toEqual(['a']);
        expect(first).not.toBe(second);
    });

    it('releases objects when all strongly-held references are removed', () => {
        const first = new TestPoolable('a');

        pool.registerObjectForReuseStrong(first);
        simulateOneMinute();
        pool.unregisterObjectForReuseStrong(first);

        const second = pool.getObjectForReuse('a');

        expect(first.args).toEqual(['a']);
        expect(second.args).toEqual(['a']);
        expect(first).not.toBe(second);
    });

    it('does not release objects while at least one strongly-held reference exists', () => {
        const first = new TestPoolable('a');

        pool.registerObjectForReuseStrong(first);
        pool.registerObjectForReuseStrong(first);
        simulateOneMinute();
        pool.unregisterObjectForReuseStrong(first);

        const second = pool.getObjectForReuse('a');

        expect(first).toBe(second);
    });
});
