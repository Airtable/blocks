"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.loadCSSFromString = loadCSSFromString;
exports.loadCSSFromURLAsync = loadCSSFromURLAsync;
exports.loadScriptFromURLAsync = loadScriptFromURLAsync;

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _invariant = _interopRequireDefault(require("invariant"));

/**
 * Injects CSS from a string into the page.
 *
 * @returns the style tag inserted into the page.
 *
 * @example
 * import {UI} from 'airtable-block';
 * UI.loadCSSFromString('body { background: red; }');
 */
function loadCSSFromString(string) {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = string;
  (0, _invariant.default)(document.head, 'no document head');
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


function loadCSSFromURLAsync(url) {
  // Pre-create the error for a nicer stack trace.
  const loadError = new Error('Failed to load remote CSS: ' + url);
  return new _promise.default((resolve, reject) => {
    const linkTag = document.createElement('link');
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
 * @returns a Promise that resolves to the script tag inserted into the page.
 *
 * @example
 * import {UI} from 'airtable-block';
 * UI.loadScriptFromURLAsync('https://example.com/script.js');
 */


function loadScriptFromURLAsync(url) {
  // Pre-create the error for a nicer stack trace.
  const loadError = new Error('Failed to load remote script: ' + url);
  return new _promise.default((resolve, reject) => {
    const scriptTag = document.createElement('script');
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