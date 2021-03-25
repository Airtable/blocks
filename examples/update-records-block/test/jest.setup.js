import '@testing-library/jest-dom';
import MutationObserver from '@sheerun/mutationobserver-shim';

if ('MutationObserver' in window) {
    throw new Error(
        'MutationObserver present in `window`. If this is expected, remove the `@sheerun/mutationobserver-shim` package.',
    );
}

window.MutationObserver = MutationObserver;
