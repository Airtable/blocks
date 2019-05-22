"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = void 0;

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

// A "reasonable" scheme is one which does not have any escaped characters.
// This means if it passes this regex, we can confidently check to make sure the
// scheme is not "javascript://" to avoid XSS. Otherwise, "javascript" may be encoded
// as "&#106avascript://" or any other permutation of escaped characters.
// Ref: https://tools.ietf.org/html/rfc3986#section-3.1
const reasonableUrlSchemeRegex = /^[a-z0-9]+:\/\//i;
/** */

const Link = props => {
  // Set rel="noopener noreferrer" to avoid reverse tabnabbing.
  // https://www.owasp.org/index.php/Reverse_Tabnabbing
  const rel = props.target ? 'noopener noreferrer' : null;
  const {
    href
  } = props;
  let sanitizedHref;

  if (href) {
    const hasScheme = (0, _indexOf.default)(href).call(href, '://') !== -1;

    if (!hasScheme) {
      // If it's a relative URL (like '/foo'), leave it alone.
      sanitizedHref = href;
    } else if (reasonableUrlSchemeRegex.test(href) && !/^javascript:/i.test(href) && !/^data:/i.test(href)) {
      // If it has a scheme and we can be 100% sure the scheme is
      // not javascript or data, then leave it alone.
      sanitizedHref = href;
    } else {
      // We can't be confident that the scheme isn't javascript or data,
      // (possibly with escaped characters), so prepend http:// to avoid
      // XSS.
      sanitizedHref = 'http://' + href;
    }
  }

  return (// eslint-disable-next-line airtable/noopener-noreferrer
    React.createElement("a", {
      href: sanitizedHref,
      target: props.target,
      rel: rel,
      tabIndex: props.tabIndex,
      className: props.className,
      style: props.style
    }, props.children)
  );
};

Link.propTypes = {
  href: _propTypes.default.string.isRequired,
  target: _propTypes.default.string,
  tabIndex: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  className: _propTypes.default.string,
  style: _propTypes.default.object,
  children: _propTypes.default.node
};
var _default = Link;
exports.default = _default;