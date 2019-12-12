import React from 'react';
import {mount} from 'enzyme';
import {act} from 'react-dom/test-utils';
import Watchable from '../../src/watchable';
import useWatchable from '../../src/ui/use_watchable';

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
            const wrapper = mount(<Component thing={thing} />);
            expect(wrapper.find('span').text()).toEqual('foo');

            act(() => {
                thing.setName('bar');
            });
            expect(wrapper.find('span').text()).toEqual('bar');
        });

        it('supports non-array watch keys', () => {
            const Component = ({thing}: {thing: Thing}) => {
                useWatchable(thing, 'name');
                return <span>{thing.name}</span>;
            };

            const thing = new Thing('foo');
            const wrapper = mount(<Component thing={thing} />);
            expect(wrapper.find('span').text()).toEqual('foo');

            act(() => {
                thing.setName('bar');
            });
            expect(wrapper.find('span').text()).toEqual('bar');
        });

        it('only renders once on initial mount', () => {
            let renderCount = 0;
            const Component = ({thing}: {thing: Thing}) => {
                renderCount++;
                useWatchable(thing, ['name']);
                return null;
            };

            mount(<Component thing={new Thing('foo')} />);
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
            const wrapper = mount(<Component thing={thing} />);
            expect(wrapper.find('span').text()).toEqual('foo very');

            act(() => thing.setName('bar'));
            expect(wrapper.find('span').text()).toEqual('bar very');

            act(() => thing.setSpice('not very'));
            expect(wrapper.find('span').text()).toEqual('bar not very');
        });

        it('will call the provided callback when values change', () => {
            const callback = jest.fn();
            const Component = ({thing}: {thing: Thing}) => {
                useWatchable(thing, ['name'], callback);
                return <span>{thing.name}</span>;
            };

            const thing = new Thing('foo');
            mount(<Component thing={thing} />);

            act(() => thing.setName('bar'));
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenLastCalledWith(thing, 'name');
        });

        it('will accept null as the model', () => {
            const Component = () => {
                useWatchable(null, ['name']);
                return null;
            };

            mount(<Component />);
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
            const wrapper = mount(<Component things={[thing1, thing2]} />);
            expect(wrapper.find('span').text()).toEqual('one, two');

            act(() => {
                thing1.setName('bar');
            });
            expect(wrapper.find('span').text()).toEqual('bar, two');
        });

        it('only renders once on initial mount', () => {
            let renderCount = 0;
            const Component = ({thing}: {thing: Thing}) => {
                renderCount++;
                useWatchable(thing, ['name']);
                return null;
            };

            mount(<Component thing={new Thing('foo')} />);
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
            const wrapper = mount(<Component things={[thing1, thing2]} />);
            expect(wrapper.find('span').text()).toEqual('one very, two very');

            act(() => thing1.setName('bar'));
            expect(wrapper.find('span').text()).toEqual('bar very, two very');

            act(() => thing2.setSpice('not very'));
            expect(wrapper.find('span').text()).toEqual('bar very, two not very');
        });

        it('will call the provided callback when values change', () => {
            const callback = jest.fn();
            const Component = ({things}: {things: Array<Thing>}) => {
                useWatchable(things, ['name'], callback);
                return <span>{things.map(thing => thing.name).join(', ')}</span>;
            };

            const thing1 = new Thing('one');
            const thing2 = new Thing('two');
            mount(<Component things={[thing1, thing2]} />);

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
            const wrapper = mount(<Component things={[thing1, thing2]} keys={['name']} />);

            expect(thing1.setupNameSideEffect).toHaveBeenCalledTimes(1);
            expect(thing2.setupNameSideEffect).toHaveBeenCalledTimes(1);
            expect(thing1.teardownNameSideEffect).toHaveBeenCalledTimes(0);
            expect(thing2.teardownNameSideEffect).toHaveBeenCalledTimes(0);

            wrapper.setProps({keys: ['name', 'spice']});
            expect(thing1.setupNameSideEffect).toHaveBeenCalledTimes(1);
            expect(thing2.setupNameSideEffect).toHaveBeenCalledTimes(1);
            expect(thing1.teardownNameSideEffect).toHaveBeenCalledTimes(0);
            expect(thing2.teardownNameSideEffect).toHaveBeenCalledTimes(0);

            wrapper.setProps({things: [thing1]});
            jest.runAllTimers();
            expect(thing1.setupNameSideEffect).toHaveBeenCalledTimes(1);
            expect(thing2.setupNameSideEffect).toHaveBeenCalledTimes(1);
            expect(thing1.teardownNameSideEffect).toHaveBeenCalledTimes(0);
            expect(thing2.teardownNameSideEffect).toHaveBeenCalledTimes(1);

            wrapper.unmount();
            jest.runAllTimers();
            expect(thing1.setupNameSideEffect).toHaveBeenCalledTimes(1);
            expect(thing2.setupNameSideEffect).toHaveBeenCalledTimes(1);
            expect(thing1.teardownNameSideEffect).toHaveBeenCalledTimes(1);
            expect(thing2.teardownNameSideEffect).toHaveBeenCalledTimes(1);
        });
    });
});
