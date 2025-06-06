import React from 'react';
import {mount} from 'enzyme';
import {act} from 'react-dom/test-utils';
import {useColorScheme} from '../../src/ui/use_color_scheme';

describe('useColorScheme', () => {
    it('returns light by default when the actual color scheme is unknown', () => {
        window.matchMedia = jest.fn().mockImplementation(query => {
            return {
                matches: false,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
            };
        });
        const Component = () => {
            const {colorScheme} = useColorScheme();
            return <div>{colorScheme}</div>;
        };
        const wrapper = mount(<Component />);
        expect(wrapper.text()).toBe('light');
    });

    it('returns dark when the actual color scheme is dark', () => {
        window.matchMedia = jest.fn().mockImplementation(query => {
            if (query.includes('dark')) {
                return {
                    matches: true,
                    addEventListener: jest.fn(),
                    removeEventListener: jest.fn(),
                };
            } else {
                return {
                    matches: false,
                    addEventListener: jest.fn(),
                    removeEventListener: jest.fn(),
                };
            }
        });
        const Component = () => {
            const {colorScheme} = useColorScheme();
            return <div>{colorScheme}</div>;
        };
        const wrapper = mount(<Component />);
        expect(wrapper.text()).toBe('dark');
    });

    type MockMediaQueryListEventListener = (e: Partial<MediaQueryListEvent>) => void;
    it('updates when the actual color scheme changes', () => {
        let isCurrentlyDarkMode = true;
        const darkChangeListeners: Array<MockMediaQueryListEventListener> = [];
        const lightChangeListeners: Array<MockMediaQueryListEventListener> = [];
        window.matchMedia = jest.fn().mockImplementation(query => {
            if (query.includes('dark')) {
                return {
                    matches: isCurrentlyDarkMode,
                    addEventListener: (
                        eventName: 'change',
                        listenerFn: MockMediaQueryListEventListener,
                    ) => {
                        darkChangeListeners.push(listenerFn);
                    },
                    removeEventListener: jest.fn(),
                };
            } else {
                return {
                    matches: !isCurrentlyDarkMode,
                    addEventListener: (
                        eventName: 'change',
                        listenerFn: MockMediaQueryListEventListener,
                    ) => {
                        lightChangeListeners.push(listenerFn);
                    },
                    removeEventListener: jest.fn(),
                };
            }
        });
        const Component = () => {
            const {colorScheme} = useColorScheme();
            return <div>{colorScheme}</div>;
        };
        const wrapper = mount(<Component />);
        expect(wrapper.text()).toBe('dark');

        const darkChangeEvent: Partial<MediaQueryListEvent> = {
            matches: false,
            media: '(prefers-color-scheme: dark)',
        };
        const lightChangeEvent: Partial<MediaQueryListEvent> = {
            matches: true,
            media: '(prefers-color-scheme: light)',
        };
        act(() => {
            isCurrentlyDarkMode = false;

            darkChangeListeners.forEach(listenerFn => listenerFn(darkChangeEvent));
            lightChangeListeners.forEach(listenerFn => listenerFn(lightChangeEvent));
        });
        expect(wrapper.text()).toBe('light');
    });
});
