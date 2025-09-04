import React from 'react';
import {act, render} from '@testing-library/react';
import Watchable from '../../../src/shared/watchable';
import useWatchable from '../../../src/shared/ui/use_watchable';

jest.useFakeTimers();

type ThingKey = 'name' | 'spice';
class Thing extends Watchable<ThingKey> {
    name: string;
    spice: string;
    _nameWatchCount: number = 0;

    static _isWatchableKey() {
        return true;
    }

    constructor(name: string) {
        super();
        this.name = name;
        this.spice = 'very';
    }

    watch(
        keys: ThingKey | ReadonlyArray<ThingKey>,
        callback: (model: this, key: ThingKey, ...args: Array<any>) => unknown,
    ): Array<ThingKey> {
        const validKeys = super.watch(keys, callback);

        for (const key of validKeys) {
            if (key === 'name') {
                if (this._nameWatchCount === 0) {
                    this.setupNameSideEffect();
                }
                this._nameWatchCount++;
            }
        }

        return validKeys;
    }

    unwatch(
        keys: ThingKey | ReadonlyArray<ThingKey>,
        callback: (model: this, key: ThingKey, ...args: Array<any>) => unknown,
    ): Array<ThingKey> {
        const validKeys = super.watch(keys, callback);

        for (const key of validKeys) {
            if (key === 'name') {
                this._nameWatchCount--;
                if (this._nameWatchCount === 0) {
                    this.teardownNameSideEffect();
                }
            }
        }

        return validKeys;
    }

    setName(newName: string) {
        this.name = newName;
        this._onChange('name');
    }

    setSpice(newSpice: string) {
        this.spice = newSpice;
        this._onChange('spice');
    }

    setupNameSideEffect = jest.fn();
    teardownNameSideEffect = jest.fn();
}

describe('useWatchable', () => {
    describe('with a single model', () => {
        it('re-renders when a watched key changes', () => {
            const Component = ({thing}: {thing: Thing}) => {
                useWatchable(thing, ['name']);
                return <span>{thing.name}</span>;
            };

            const thing = new Thing('foo');
            const {getByText} = render(<Component thing={thing} />);
            expect(getByText('foo')).toBeInTheDocument();

            act(() => {
                thing.setName('bar');
            });
            expect(getByText('bar')).toBeInTheDocument();
        });

        it('supports non-array watch keys', () => {
            const Component = ({thing}: {thing: Thing}) => {
                useWatchable(thing, 'name');
                return <span>{thing.name}</span>;
            };

            const thing = new Thing('foo');
            const {getByText} = render(<Component thing={thing} />);
            expect(getByText('foo')).toBeInTheDocument();

            act(() => {
                thing.setName('bar');
            });
            expect(getByText('bar')).toBeInTheDocument();
        });

        it('only renders once on initial mount', () => {
            let renderCount = 0;
            const Component = ({thing}: {thing: Thing}) => {
                renderCount++;
                useWatchable(thing, ['name']);
                return null;
            };

            render(<Component thing={new Thing('foo')} />);
            expect(renderCount).toEqual(1);
        });

        it('can watch several keys', () => {
            const Component = ({thing}: {thing: Thing}) => {
                useWatchable(thing, ['name', 'spice', null]);
                return (
                    <span>
                        {thing.name} {thing.spice}
                    </span>
                );
            };

            const thing = new Thing('foo');
            const {getByText} = render(<Component thing={thing} />);
            expect(getByText('foo very')).toBeInTheDocument();

            act(() => thing.setName('bar'));
            expect(getByText('bar very')).toBeInTheDocument();

            act(() => thing.setSpice('not very'));
            expect(getByText('bar not very')).toBeInTheDocument();
        });

        it('will call the provided callback when values change', () => {
            const callback = jest.fn();
            const Component = ({thing}: {thing: Thing}) => {
                useWatchable(thing, ['name'], callback);
                return <span>{thing.name}</span>;
            };

            const thing = new Thing('foo');
            render(<Component thing={thing} />);

            act(() => thing.setName('bar'));
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenLastCalledWith(thing, 'name');
        });

        it('will accept null as the model', () => {
            const Component = () => {
                useWatchable(null, ['name']);
                return null;
            };

            render(<Component />);
        });

        it('will not accept undefined as the keys', () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});

            const Component = () => {
                // @ts-ignore
                useWatchable(null, undefined);
                return null;
            };

            expect(() => render(<Component />)).toThrowError(
                'Invalid call to useWatchable: keys cannot be undefined. ' +
                    'Pass a key or array of keys corresponding to the model being watched as the ' +
                    'second argument.',
            );
        });
    });

    describe('with several models', () => {
        it('re-renders when a watched key changes', () => {
            const Component = ({things}: {things: Array<Thing>}) => {
                useWatchable(things, ['name']);
                return <span>{things.map(thing => thing.name).join(', ')}</span>;
            };

            const thing1 = new Thing('one');
            const thing2 = new Thing('two');
            const {getByText} = render(<Component things={[thing1, thing2]} />);
            expect(getByText('one, two')).toBeInTheDocument();

            act(() => {
                thing1.setName('bar');
            });
            expect(getByText('bar, two')).toBeInTheDocument();
        });

        it('only renders once on initial mount', () => {
            let renderCount = 0;
            const Component = ({thing}: {thing: Thing}) => {
                renderCount++;
                useWatchable(thing, ['name']);
                return null;
            };

            render(<Component thing={new Thing('foo')} />);
            expect(renderCount).toEqual(1);
        });

        it('can watch several keys', () => {
            const Component = ({things}: {things: Array<Thing>}) => {
                useWatchable(things, ['name', 'spice', null]);
                return (
                    <span>{things.map(thing => `${thing.name} ${thing.spice}`).join(', ')}</span>
                );
            };

            const thing1 = new Thing('one');
            const thing2 = new Thing('two');
            const {getByText} = render(<Component things={[thing1, thing2]} />);
            expect(getByText('one very, two very')).toBeInTheDocument();

            act(() => thing1.setName('bar'));
            expect(getByText('bar very, two very')).toBeInTheDocument();

            act(() => thing2.setSpice('not very'));
            expect(getByText('bar very, two not very')).toBeInTheDocument();
        });

        it('will call the provided callback when values change', () => {
            const callback = jest.fn();
            const Component = ({things}: {things: Array<Thing>}) => {
                useWatchable(things, ['name'], callback);
                return <span>{things.map(thing => thing.name).join(', ')}</span>;
            };

            const thing1 = new Thing('one');
            const thing2 = new Thing('two');
            render(<Component things={[thing1, thing2]} />);

            act(() => thing1.setName('bar'));
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenLastCalledWith(thing1, 'name');

            act(() => thing2.setName('bean'));
            expect(callback).toHaveBeenCalledTimes(2);
            expect(callback).toHaveBeenLastCalledWith(thing2, 'name');
        });

        it("won't let ref-count hit 0 when changing keys/models", () => {
            const Component = ({things, keys}: {things: Array<Thing>; keys: Array<ThingKey>}) => {
                useWatchable(things, keys);
                return <span>{things.map(thing => thing.name).join(', ')}</span>;
            };

            const thing1 = new Thing('one');
            const thing2 = new Thing('two');
            const {rerender, unmount} = render(
                <Component things={[thing1, thing2]} keys={['name']} />,
            );

            expect(thing1.setupNameSideEffect).toHaveBeenCalledTimes(1);
            expect(thing2.setupNameSideEffect).toHaveBeenCalledTimes(1);
            expect(thing1.teardownNameSideEffect).toHaveBeenCalledTimes(0);
            expect(thing2.teardownNameSideEffect).toHaveBeenCalledTimes(0);

            rerender(<Component things={[thing1, thing2]} keys={['name', 'spice']} />);
            expect(thing1.setupNameSideEffect).toHaveBeenCalledTimes(1);
            expect(thing2.setupNameSideEffect).toHaveBeenCalledTimes(1);
            expect(thing1.teardownNameSideEffect).toHaveBeenCalledTimes(0);
            expect(thing2.teardownNameSideEffect).toHaveBeenCalledTimes(0);

            rerender(<Component things={[thing1]} keys={['name', 'spice']} />);
            jest.runAllTimers();
            expect(thing1.setupNameSideEffect).toHaveBeenCalledTimes(1);
            expect(thing2.setupNameSideEffect).toHaveBeenCalledTimes(1);
            expect(thing1.teardownNameSideEffect).toHaveBeenCalledTimes(0);
            expect(thing2.teardownNameSideEffect).toHaveBeenCalledTimes(1);

            unmount();
            jest.runAllTimers();
            expect(thing1.setupNameSideEffect).toHaveBeenCalledTimes(1);
            expect(thing2.setupNameSideEffect).toHaveBeenCalledTimes(1);
            expect(thing1.teardownNameSideEffect).toHaveBeenCalledTimes(1);
            expect(thing2.teardownNameSideEffect).toHaveBeenCalledTimes(1);
        });
    });
});
