// @flow
import invariant from 'invariant';

/**
 * Injects CSS from a string into the page.
 *
 * @returns the style tag inserted into the page.
 *
 * @example
 * import {UI} from 'airtable-block';
 * UI.loadCSSFromString('body { background: red; }');
 */
export function loadCSSFromString(string: string): HTMLStyleElement {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = string;
    invariant(document.head, 'no document head');
    document.head.appendChild(styleTag);
    return styleTag;
}

/**
 * Injects CSS from a remote URL.
 *
 * @returns a Promise that resolves to the style tag inserted into the page.
 *
 * @example
 * import {UI} from 'airtable-block';
 * UI.loadCSSFromURLAsync('https://example.com/style.css');
 */
export function loadCSSFromURLAsync(url: string): Promise<HTMLLinkElement> {
    // Pre-create the error for a nicer stack trace.
    const loadError = new Error('Failed to load remote CSS: ' + url);
    return new Promise((resolve, reject) => {
        const linkTag = document.createElement('link');
        linkTag.setAttribute('rel', 'stylesheet');
        linkTag.setAttribute('href', url);
        linkTag.addEventListener('load', () => {
            resolve(linkTag);
        });
        linkTag.addEventListener('error', (event: Event) => {
            reject(loadError);
        });
        invariant(document.head, 'no document head');
        document.head.appendChild(linkTag);
    });
}

/**
 * Injects Javascript from a remote URL.
 *
 * @returns a Promise that resolves to the script tag inserted into the page.
 *
 * @example
 * import {UI} from 'airtable-block';
 * UI.loadScriptFromURLAsync('https://example.com/script.js');
 */
export function loadScriptFromURLAsync(url: string): Promise<HTMLScriptElement> {
    // Pre-create the error for a nicer stack trace.
    const loadError = new Error('Failed to load remote script: ' + url);
    return new Promise((resolve, reject) => {
        const scriptTag = document.createElement('script');
        scriptTag.addEventListener('load', () => {
            resolve(scriptTag);
        });
        scriptTag.addEventListener('error', (event: Event) => {
            reject(loadError);
        });
        scriptTag.setAttribute('src', url);
        invariant(document.head, 'no document head');
        document.head.appendChild(scriptTag);
    });
}
