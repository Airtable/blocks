/** @module @airtable/blocks/ui: Loading external resources */ /** */
import {invariant} from '../error_utils';

/**
 * Injects CSS from a string into the page. Returns the HTML style element inserted into the page.
 *
 * @param css The CSS string.
 * @example
 * ```js
 * import {loadCSSFromString} from '@airtable/blocks/ui';
 * loadCSSFromString('body { background: red; }');
 * ```
 * @docsPath UI/utils/loadCSSFromString
 */
export function loadCSSFromString(css: string): HTMLStyleElement {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = css;
    invariant(document.head, 'no document head');
    document.head.appendChild(styleTag);
    return styleTag;
}

/**
 * Injects CSS from a remote URL.
 *
 * Returns a promise that resolves to the HTML style element inserted into the page.
 *
 * @param url The URL of the stylesheet.
 * @example
 * ```js
 * import {loadCSSFromURLAsync} from '@airtable/blocks/ui';
 * loadCSSFromURLAsync('https://example.com/style.css');
 * ```
 * @docsPath UI/utils/loadCSSFromURLAsync
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
        invariant(document.head, 'no document head');
        document.head.appendChild(linkTag);
    });
}

/**
 * Injects Javascript from a remote URL.
 *
 * Returns a promise that resolves to the HTML script element inserted into the page.
 *
 * @param url The URL of the script.
 * @example
 * ```js
 * import {loadScriptFromURLAsync} from '@airtable/blocks/ui';
 * loadScriptFromURLAsync('https://example.com/script.js');
 * ```
 * @docsPath UI/utils/loadScriptFromURLAsync
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
        invariant(document.head, 'no document head');
        document.head.appendChild(scriptTag);
    });
}
