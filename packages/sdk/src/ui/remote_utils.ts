/** @module @airtable/blocks/ui: Loading external resources */ /** */
import {spawnInvariantViolationError} from '../error_utils';

/**
 * Injects CSS from a string into the page.
 *
 * @param css The CSS string.
 * @returns The style tag inserted into the page.
 *
 * @example
 * ```js
 * import {loadCSSFromString} from '@airtable/blocks/ui';
 * loadCSSFromString('body { background: red; }');
 * ```
 */
export function loadCSSFromString(css: string): HTMLStyleElement {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = css;
    if (!document.head) {
        throw spawnInvariantViolationError('no document head');
    }
    document.head.appendChild(styleTag);
    return styleTag;
}

/**
 * Injects CSS from a remote URL.
 *
 * @param url The URL of the stylesheet.
 * @returns A Promise that resolves to the style tag inserted into the page.
 *
 * @example
 * ```js
 * import {loadCSSFromURLAsync} from '@airtable/blocks/ui';
 * loadCSSFromURLAsync('https://example.com/style.css');
 * ```
 */
export function loadCSSFromURLAsync(url: string): Promise<HTMLLinkElement> {
    const loadError = new Error('Failed to load remote CSS: ' + url);
    return new Promise((resolve, reject) => {
        const linkTag = document.createElement('link');
        linkTag.setAttribute('rel', 'stylesheet');
        linkTag.setAttribute('href', url);
        linkTag.addEventListener('load', () => {
            resolve(linkTag);
        });
        linkTag.addEventListener('error', () => {
            reject(loadError);
        });
        if (!document.head) {
            throw spawnInvariantViolationError('no document head');
        }
        document.head.appendChild(linkTag);
    });
}

/**
 * Injects Javascript from a remote URL.
 *
 * @param url The URL of the script.
 * @returns A Promise that resolves to the script tag inserted into the page.
 *
 * @example
 * ```js
 * import {loadScriptFromURLAsync} from '@airtable/blocks/ui';
 * loadScriptFromURLAsync('https://example.com/script.js');
 * ```
 */
export function loadScriptFromURLAsync(url: string): Promise<HTMLScriptElement> {
    const loadError = new Error('Failed to load remote script: ' + url);
    return new Promise((resolve, reject) => {
        const scriptTag = document.createElement('script');
        scriptTag.addEventListener('load', () => {
            resolve(scriptTag);
        });
        scriptTag.addEventListener('error', () => {
            reject(loadError);
        });
        scriptTag.setAttribute('src', url);
        if (!document.head) {
            throw spawnInvariantViolationError('no document head');
        }
        document.head.appendChild(scriptTag);
    });
}
