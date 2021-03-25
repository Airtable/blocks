import '@testing-library/jest-dom';
import MutationObserver from '@sheerun/mutationobserver-shim';

// Shim the MutationObserver constructor in browser-like environments. This is
// a workaround for the older release of JSDOM which is used by the version of
// Jest upon which this project depends.
//
// https://github.com/testing-library/dom-testing-library/releases/tag/v7.0.0
if (typeof window === 'object' && window) {
    if ('MutationObserver' in window) {
        throw new Error(
            'MutationObserver present in `window`. If this is expected, remove the `@sheerun/mutationobserver-shim` package.',
        );
    }

    window.MutationObserver = MutationObserver;
}
