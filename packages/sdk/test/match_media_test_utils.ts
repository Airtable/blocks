/**
 * jsdom has no matchMedia; `useColorScheme` calls it. Use in Jest setup and in `afterEach` after
 * tests that assign `window.matchMedia` (e.g. dark-mode cases).
 */
export function resetMatchMediaToLightDefault(): void {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value(query: string) {
            return {
                matches: false,
                media: query,
                addEventListener: () => {},
                removeEventListener: () => {},
            };
        },
    });
}

/**
 * Override `matchMedia` so `(prefers-color-scheme: dark)` reports `matches: true`. Reset with
 * {@link resetMatchMediaToLightDefault} (e.g. in `afterEach`).
 */
export function mockMatchMediaForDarkColorScheme(): void {
    window.matchMedia = jest.fn().mockImplementation((query: string) => {
        if (query.includes('dark')) {
            return {
                matches: true,
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
            };
        }
        return {
            matches: false,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        };
    });
}
