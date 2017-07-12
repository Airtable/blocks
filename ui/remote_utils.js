// @flow
function loadCSSFromString(string: string): HTMLStyleElement {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = string;
    document.head.appendChild(styleTag);
    return styleTag;
}

function loadCSSFromURLAsync(url: string): Promise<HTMLLinkElement> {
    // Pre-create the error for a nicer stack trace.
    const loadError = new Error('Failed to load remote CSS: ' + url);
    return new Promise((resolve, reject) => {
        const linkTag = document.createElement('link');
        linkTag.setAttribute('rel', 'stylesheet');
        linkTag.setAttribute('href', url);
        linkTag.addEventListener('load', () => {
            resolve(linkTag);
        });
        linkTag.addEventListener('error', e => {
            reject(loadError, linkTag);
        });
        document.head.appendChild(linkTag);
    });
}

function loadScriptFromURLAsync(url: string): Promise<HTMLScriptElement> {
    // Pre-create the error for a nicer stack trace.
    const loadError = new Error('Failed to load remote script: ' + url);
    return new Promise((resolve, reject) => {
        const scriptTag = document.createElement('script');
        scriptTag.addEventListener('load', () => {
            resolve(scriptTag);
        });
        scriptTag.addEventListener('error', e => {
            reject(loadError, scriptTag);
        });
        scriptTag.setAttribute('src', url);
        document.head.appendChild(scriptTag);
    });
}

module.exports = {
    loadCSSFromString,
    loadScriptFromURLAsync,
    loadCSSFromURLAsync,
};
