"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadCSSFromString = loadCSSFromString;
exports.loadCSSFromURLAsync = loadCSSFromURLAsync;
exports.loadScriptFromURLAsync = loadScriptFromURLAsync;

var _invariant = _interopRequireDefault(require("invariant"));

/**
 * Injects CSS from a string into the page.
 *
 * @param css {string}
 * @returns the style tag inserted into the page.
 *
 * @example
 * import {loadCSSFromString} from '@airtable/blocks/ui';
 * loadCSSFromString('body { background: red; }');
 */
function loadCSSFromString(css) {
  var styleTag = document.createElement('style');
  styleTag.innerHTML = css;
  (0, _invariant.default)(document.head, 'no document head');
  document.head.appendChild(styleTag);
  return styleTag;
}
/**
 * Injects CSS from a remote URL.
 *
 * @param url {string}
 * @returns a Promise that resolves to the style tag inserted into the page.
 *
 * @example
 * import {loadScriptFromURLAsync} from '@airtable/blocks/ui';
 * loadCSSFromURLAsync('https://example.com/style.css');
 */


function loadCSSFromURLAsync(url) {
  // Pre-create the error for a nicer stack trace.
  var loadError = new Error('Failed to load remote CSS: ' + url);
  return new Promise((resolve, reject) => {
    var linkTag = document.createElement('link');
    linkTag.setAttribute('rel', 'stylesheet');
    linkTag.setAttribute('href', url);
    linkTag.addEventListener('load', () => {
      resolve(linkTag);
    });
    linkTag.addEventListener('error', event => {
      reject(loadError);
    });
    (0, _invariant.default)(document.head, 'no document head');
    document.head.appendChild(linkTag);
  });
}
/**
 * Injects Javascript from a remote URL.
 *
 * @param url {string}
 * @returns a Promise that resolves to the script tag inserted into the page.
 *
 * @example
 * import {loadScriptFromURLAsync} from '@airtable/blocks/ui';
 * loadScriptFromURLAsync('https://example.com/script.js');
 */


function loadScriptFromURLAsync(url) {
  // Pre-create the error for a nicer stack trace.
  var loadError = new Error('Failed to load remote script: ' + url);
  return new Promise((resolve, reject) => {
    var scriptTag = document.createElement('script');
    scriptTag.addEventListener('load', () => {
      resolve(scriptTag);
    });
    scriptTag.addEventListener('error', event => {
      reject(loadError);
    });
    scriptTag.setAttribute('src', url);
    (0, _invariant.default)(document.head, 'no document head');
    document.head.appendChild(scriptTag);
  });
}