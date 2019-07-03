// @flow
import React from 'react';
import {mount} from 'enzyme';
import {act} from 'react-dom/test-utils';
import Watchable from '../../src/watchable';
import useWatchable from '../../src/ui/use_watchable';

class Thing extends Watchable<'name' | 'spice'> {
    name: string;
    spice: string;

    static _isWatchableKey() {
        return true;
    }

    constructor(name: string) {
        super();
        this.name = name;
        this.spice = 'very';
    }

    setName(newName: string) {
        this.name = newName;
        this._onChange('name');
    }

    setSpice(newSpice: string) {
        this.spice = newSpice;
        this._onChange('spice');
    }
}

describe('useWatchable', () => {
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
