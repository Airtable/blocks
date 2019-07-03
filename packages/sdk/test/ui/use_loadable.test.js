// @flow
import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import {mount} from 'enzyme';
import {act} from 'react-dom/test-utils';
import AbstractModelWithAsyncData from '../../src/models/abstract_model_with_async_data';
import useLoadable from '../../src/ui/use_loadable';
import {actAsync} from '../test_helpers';

jest.useFakeTimers();

class Thing extends AbstractModelWithAsyncData<{name: string}, 'name' | 'isDataLoaded'> {
    _resolve: (Array<'name' | 'isDataLoaded'>) => void;

    static _isWatchableKey() {
        return true;
    }

    constructor() {
        super(({}: any), 'abc123');
    }

    get name() {
        return this._data.name;
    }

    get _dataOrNullIfDeleted() {
        return this._baseData;
    }

    _onChangeIsDataLoaded() {
        this._onChange('isDataLoaded');
    }

    async _loadDataAsync() {
        return new Promise(resolve => {
            this._resolve = resolve;
        });
    }

    resolveLoading(name) {
        this._data.name = name;
        this._resolve(['name', 'isDataLoaded']);
    }

    _unloadData() {
        this._data.name = '';
    }
}

describe('useLoadable', () => {
    it('without suspense, it loads the passed model on mount and re-renders, then unloads on unmount', async () => {
        const Component = ({thing}: {thing: Thing}) => {
            useLoadable(thing, {shouldSuspend: false});
            return (
                <span>
                    {thing.isDataLoaded ? 'loaded' : 'not loaded'}, {thing.name || 'no name'}
                </span>
            );
        };

        const thing = new Thing();
        const wrapper = mount(<Component thing={thing} />);
        expect(wrapper.find('span').text()).toBe('not loaded, no name');

        await actAsync(async () => {
            thing.resolveLoading('foo');
            await Promise.resolve();
        });
        expect(wrapper.find('span').text()).toBe('loaded, foo');

        act(() => {
            wrapper.unmount();
        });
        jest.runAllTimers();
        expect(thing.isDataLoaded).toBe(false);
    });

    it('renders immediately if already loaded and keeps loaded throughout', async () => {
        const Component = ({thing}: {thing: Thing}) => {
            useLoadable(thing);
            return (
                <span>
                    {thing.isDataLoaded ? 'loaded' : 'not loaded'}, {thing.name || 'no name'}
                </span>
            );
        };

        const thing = new Thing();
        thing.loadDataAsync();
        thing.resolveLoading('foo');

        await thing.loadDataAsync();
        thing.unloadData();

        const wrapper = mount(<Component thing={thing} />);
        expect(wrapper.find('span').text()).toBe('loaded, foo');

        thing.unloadData();
        jest.runAllTimers();
        expect(thing.isDataLoaded).toBe(true);

        act(() => {
            wrapper.unmount();
        });
        jest.runAllTimers();
        expect(thing.isDataLoaded).toBe(false);
    });

    it('with suspense, suspend until loaded then render then unload when unmounted', async () => {
        const Component = ({thing}: {thing: Thing}) => {
            useLoadable(thing);
            return (
                <span>
                    {thing.isDataLoaded ? 'loaded' : 'not loaded'}, {thing.name || 'no name'}
                </span>
            );
        };

        const thing = new Thing();

        const el = document.createElement('div');
        act(() => {
            ReactDOM.render(
                <Suspense fallback={<span>suspended</span>}>
                    <Component thing={thing} />
                </Suspense>,
                el,
            );
        });

        expect(el.textContent).toBe('suspended');

        await actAsync(async () => {
            thing.resolveLoading('foo');
            await Promise.resolve();
        });
        expect(el.textContent).toBe('loaded, foo');

        act(() => {
            ReactDOM.unmountComponentAtNode(el);
        });
        jest.runAllTimers();
        expect(thing.isDataLoaded).toBe(false);
    });
});
