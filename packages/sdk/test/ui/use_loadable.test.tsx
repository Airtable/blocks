import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import {mount} from 'enzyme';
import {act} from 'react-dom/test-utils';
import AbstractModelWithAsyncData from '../../src/base/models/abstract_model_with_async_data';
import useLoadable from '../../src/base/ui/use_loadable';
import {MockAirtableInterface} from '../airtable_interface_mocks/mock_airtable_interface';
import Sdk from '../../src/base/sdk';

jest.useFakeTimers();

async function tickAsync() {
    await new Promise(resolve => process.nextTick(resolve));
    jest.advanceTimersByTime(0);
}

class Thing extends AbstractModelWithAsyncData<{name: string}, 'name' | 'isDataLoaded'> {
    _resolve: (arg1: Array<'name' | 'isDataLoaded'>) => void = () => {};
    name: string;

    static _isWatchableKey() {
        return true;
    }

    constructor(sdk: Sdk) {
        super(sdk, 'abc123');
        this.name = '';
    }

    toString(): string {
        return `Thing(id: ${this._watchableId}, rc: ${this._dataRetainCount})`;
    }

    get _dataOrNullIfDeleted() {
        return this._baseData;
    }

    _onChangeIsDataLoaded() {
        this._onChange('isDataLoaded');
    }

    async _loadDataAsync(): Promise<Array<'name' | 'isDataLoaded'>> {
        return new Promise(resolve => {
            this._resolve = resolve;
        });
    }

    resolveLoading(name: string) {
        this.name = name;
        this._resolve(['name', 'isDataLoaded']);
    }

    _unloadData() {
        this.name = '';
    }
}

describe('useLoadable', () => {
    // eslint-disable-next-line prefer-const
    let mockAirtableInterface = MockAirtableInterface.projectTrackerExample();
    let sdk: Sdk;

    beforeEach(() => {
        mockAirtableInterface.reset();
        sdk = new Sdk(mockAirtableInterface);
    });

    describe('with a single model', () => {
        const Component = ({
            thing,
            shouldSuspend = true,
        }: {
            thing: Thing;
            shouldSuspend?: boolean;
        }) => {
            useLoadable(thing, {shouldSuspend});
            return (
                <span>
                    {thing.isDataLoaded ? 'loaded' : 'not loaded'}, {thing.name || 'no name'}
                </span>
            );
        };

        it('without suspense, it loads the passed model on mount and re-renders, then unloads on unmount', async () => {
            const thing = new Thing(sdk);
            const wrapper = mount(<Component thing={thing} shouldSuspend={false} />);
            expect(wrapper.find('span').text()).toBe('not loaded, no name');

            await act(async () => {
                thing.resolveLoading('foo');
                await tickAsync();
            });
            expect(wrapper.find('span').text()).toBe('loaded, foo');

            act(() => {
                wrapper.unmount();
            });
            jest.runAllTimers();
            expect(thing.isDataLoaded).toBe(false);
        });

        it('renders immediately if already loaded and keeps loaded throughout', async () => {
            const thing = new Thing(sdk);
            // eslint-disable-next-line airtable/no-missing-await
            thing.loadDataAsync();
            thing.resolveLoading('foo');

            await tickAsync();

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
            const thing = new Thing(sdk);

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

            await act(async () => {
                thing.resolveLoading('foo');
                await tickAsync();
            });
            expect(el.textContent).toBe('loaded, foo');

            act(() => {
                ReactDOM.unmountComponentAtNode(el);
            });
            jest.runAllTimers();
            expect(thing.isDataLoaded).toBe(false);
        });
    });

    describe('with multiple models', () => {
        const Component = ({
            things,
            shouldSuspend = true,
        }: {
            things: Array<Thing>;
            shouldSuspend?: boolean;
        }) => {
            useLoadable(things, {shouldSuspend});

            const status = things
                .map(
                    (thing, i) =>
                        `${i}: ${thing.isDataLoaded ? 'loaded' : 'not loaded'}, ${thing.name ||
                            'no name'}`,
                )
                .join('; ');

            return <span>{status}</span>;
        };

        it('without suspense, it loads the passed models on mount, re-renders when any of their load-states change, then unloads on unmount', async () => {
            const thing1 = new Thing(sdk);
            const thing2 = new Thing(sdk);
            const wrapper = mount(<Component things={[thing1, thing2]} shouldSuspend={false} />);
            expect(wrapper.find('span').text()).toBe(
                '0: not loaded, no name; 1: not loaded, no name',
            );

            await act(async () => {
                thing1.resolveLoading('one');
                await tickAsync();
            });
            expect(wrapper.find('span').text()).toBe('0: loaded, one; 1: not loaded, no name');

            await act(async () => {
                thing2.resolveLoading('two');
                await tickAsync();
            });
            expect(wrapper.find('span').text()).toBe('0: loaded, one; 1: loaded, two');

            act(() => {
                wrapper.unmount();
            });
            jest.runAllTimers();
            expect(thing1.isDataLoaded).toBe(false);
            expect(thing2.isDataLoaded).toBe(false);
        });

        it('without suspense, loads additional models added to the array', async () => {
            const thing1 = new Thing(sdk);
            const thing2 = new Thing(sdk);
            const thing3 = new Thing(sdk);
            const wrapper = mount(<Component things={[thing1]} shouldSuspend={false} />);
            wrapper.mount();
            expect(wrapper.find('span').text()).toBe('0: not loaded, no name');

            await act(async () => {
                thing1.resolveLoading('one');
                await tickAsync();
            });
            expect(wrapper.find('span').text()).toBe('0: loaded, one');

            act(() => {
                wrapper.setProps({things: [thing1, thing2]});
            });
            expect(wrapper.find('span').text()).toBe('0: loaded, one; 1: not loaded, no name');

            await act(async () => {
                thing2.resolveLoading('two');
                await tickAsync();
            });
            expect(wrapper.find('span').text()).toBe('0: loaded, one; 1: loaded, two');

            act(() => {
                wrapper.setProps({things: [thing3, thing2]});
            });
            expect(wrapper.find('span').text()).toBe('0: not loaded, no name; 1: loaded, two');

            jest.runAllTimers();
            expect(thing1.isDataLoaded).toBe(false);

            await act(async () => {
                thing3.resolveLoading('three');
                await tickAsync();
            });
            expect(wrapper.find('span').text()).toBe('0: loaded, three; 1: loaded, two');

            act(() => {
                wrapper.unmount();
            });
            jest.runAllTimers();
            expect(thing2.isDataLoaded).toBe(false);
            expect(thing3.isDataLoaded).toBe(false);
        });

        it('renders immediately if already loaded and keeps loaded throughout', async () => {
            const thing1 = new Thing(sdk);
            // eslint-disable-next-line airtable/no-missing-await
            thing1.loadDataAsync();
            thing1.resolveLoading('one');
            const thing2 = new Thing(sdk);
            // eslint-disable-next-line airtable/no-missing-await
            thing2.loadDataAsync();
            thing2.resolveLoading('two');

            await tickAsync();

            const wrapper = mount(<Component things={[thing1, thing2]} />);
            expect(wrapper.find('span').text()).toBe('0: loaded, one; 1: loaded, two');

            thing1.unloadData();
            thing2.unloadData();
            jest.runAllTimers();
            expect(thing1.isDataLoaded).toBe(true);
            expect(thing2.isDataLoaded).toBe(true);

            act(() => {
                wrapper.unmount();
            });
            jest.runAllTimers();
            expect(thing1.isDataLoaded).toBe(false);
            expect(thing2.isDataLoaded).toBe(false);
        });

        class Wrapper extends React.Component<
            {initialThings: Array<Thing>},
            {things: Array<Thing>}
        > {
            state = {
                things: this.props.initialThings,
            };

            setThings(things: Array<Thing>) {
                this.setState({things});
            }

            render() {
                return (
                    <Suspense fallback={<span>suspended</span>}>
                        <Component things={this.state.things} />
                    </Suspense>
                );
            }
        }

        it('with suspense, suspend until loaded then render, handle new models getting added, unload when unmounted', async () => {
            const thing1 = new Thing(sdk);
            const thing2 = new Thing(sdk);
            const thing3 = new Thing(sdk);

            const el = document.createElement('div');
            let wrapper: any;
            await act(() => {
                return new Promise<void>(resolve => {
                    ReactDOM.render(
                        <Wrapper
                            initialThings={[thing1, thing2]}
                            ref={wrapperRef => {
                                wrapper = wrapperRef;
                                resolve();
                            }}
                        />,
                        el,
                    );
                });
            });

            expect(el.innerHTML).toMatchInlineSnapshot('"<span>suspended</span>"');

            await act(async () => {
                thing1.resolveLoading('one');
                await tickAsync();
            });
            expect(el.innerHTML).toMatchInlineSnapshot('"<span>suspended</span>"');

            await act(async () => {
                thing2.resolveLoading('two');
                await tickAsync();
            });
            expect(el.innerHTML).toMatchInlineSnapshot(
                '"<span>0: loaded, one; 1: loaded, two</span>"',
            );

            act(() => {
                wrapper.setThings([thing3, thing2]);
            });
            expect(el.innerHTML).toMatchInlineSnapshot(
                '"<span style=\\"display: none;\\">0: loaded, one; 1: loaded, two</span><span>suspended</span>"',
            );

            await act(async () => {
                thing3.resolveLoading('three');
                await tickAsync();
            });

            jest.runAllTimers();
            expect(thing1.isDataLoaded).toBe(false);

            act(() => {
                ReactDOM.unmountComponentAtNode(el);
            });
            jest.runAllTimers();
            expect(thing2.isDataLoaded).toBe(false);
            expect(thing3.isDataLoaded).toBe(false);
        });
    });
});
