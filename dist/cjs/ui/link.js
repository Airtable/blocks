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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91aS9saW5rLmpzIl0sIm5hbWVzIjpbInJlYXNvbmFibGVVcmxTY2hlbWVSZWdleCIsIkxpbmsiLCJwcm9wcyIsInJlbCIsInRhcmdldCIsImhyZWYiLCJzYW5pdGl6ZWRIcmVmIiwiaGFzU2NoZW1lIiwidGVzdCIsInRhYkluZGV4IiwiY2xhc3NOYW1lIiwic3R5bGUiLCJjaGlsZHJlbiIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsInN0cmluZyIsImlzUmVxdWlyZWQiLCJvbmVPZlR5cGUiLCJudW1iZXIiLCJvYmplY3QiLCJub2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7O0FBQ0E7O0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU1BLHdCQUF3QixHQUFHLGtCQUFqQztBQUVBOztBQUNBLE1BQU1DLElBQUksR0FBSUMsS0FBRCxJQUFrQjtBQUMzQjtBQUNBO0FBQ0EsUUFBTUMsR0FBRyxHQUFHRCxLQUFLLENBQUNFLE1BQU4sR0FBZSxxQkFBZixHQUF1QyxJQUFuRDtBQUVBLFFBQU07QUFBQ0MsSUFBQUE7QUFBRCxNQUFTSCxLQUFmO0FBQ0EsTUFBSUksYUFBSjs7QUFDQSxNQUFJRCxJQUFKLEVBQVU7QUFDTixVQUFNRSxTQUFTLEdBQUcsc0JBQUFGLElBQUksTUFBSixDQUFBQSxJQUFJLEVBQVMsS0FBVCxDQUFKLEtBQXdCLENBQUMsQ0FBM0M7O0FBQ0EsUUFBSSxDQUFDRSxTQUFMLEVBQWdCO0FBQ1o7QUFDQUQsTUFBQUEsYUFBYSxHQUFHRCxJQUFoQjtBQUNILEtBSEQsTUFHTyxJQUNITCx3QkFBd0IsQ0FBQ1EsSUFBekIsQ0FBOEJILElBQTlCLEtBQ0EsQ0FBQyxnQkFBZ0JHLElBQWhCLENBQXFCSCxJQUFyQixDQURELElBRUEsQ0FBQyxVQUFVRyxJQUFWLENBQWVILElBQWYsQ0FIRSxFQUlMO0FBQ0U7QUFDQTtBQUNBQyxNQUFBQSxhQUFhLEdBQUdELElBQWhCO0FBQ0gsS0FSTSxNQVFBO0FBQ0g7QUFDQTtBQUNBO0FBQ0FDLE1BQUFBLGFBQWEsR0FBRyxZQUFZRCxJQUE1QjtBQUNIO0FBQ0o7O0FBRUQsU0FDSTtBQUNBO0FBQ0ksTUFBQSxJQUFJLEVBQUVDLGFBRFY7QUFFSSxNQUFBLE1BQU0sRUFBRUosS0FBSyxDQUFDRSxNQUZsQjtBQUdJLE1BQUEsR0FBRyxFQUFFRCxHQUhUO0FBSUksTUFBQSxRQUFRLEVBQUVELEtBQUssQ0FBQ08sUUFKcEI7QUFLSSxNQUFBLFNBQVMsRUFBRVAsS0FBSyxDQUFDUSxTQUxyQjtBQU1JLE1BQUEsS0FBSyxFQUFFUixLQUFLLENBQUNTO0FBTmpCLE9BUUtULEtBQUssQ0FBQ1UsUUFSWDtBQUZKO0FBYUgsQ0F6Q0Q7O0FBMkNBWCxJQUFJLENBQUNZLFNBQUwsR0FBaUI7QUFDYlIsRUFBQUEsSUFBSSxFQUFFUyxtQkFBVUMsTUFBVixDQUFpQkMsVUFEVjtBQUViWixFQUFBQSxNQUFNLEVBQUVVLG1CQUFVQyxNQUZMO0FBR2JOLEVBQUFBLFFBQVEsRUFBRUssbUJBQVVHLFNBQVYsQ0FBb0IsQ0FBQ0gsbUJBQVVDLE1BQVgsRUFBbUJELG1CQUFVSSxNQUE3QixDQUFwQixDQUhHO0FBSWJSLEVBQUFBLFNBQVMsRUFBRUksbUJBQVVDLE1BSlI7QUFLYkosRUFBQUEsS0FBSyxFQUFFRyxtQkFBVUssTUFMSjtBQU1iUCxFQUFBQSxRQUFRLEVBQUVFLG1CQUFVTTtBQU5QLENBQWpCO2VBU2VuQixJIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbnR5cGUgUHJvcHMgPSB7XG4gICAgaHJlZjogc3RyaW5nLFxuICAgIHRhcmdldD86IHN0cmluZyxcbiAgICB0YWJJbmRleD86IG51bWJlciB8IHN0cmluZyxcbiAgICBjbGFzc05hbWU/OiBzdHJpbmcsXG4gICAgc3R5bGU/OiBPYmplY3QsXG4gICAgY2hpbGRyZW46IFJlYWN0Lk5vZGUsXG59O1xuXG4vLyBBIFwicmVhc29uYWJsZVwiIHNjaGVtZSBpcyBvbmUgd2hpY2ggZG9lcyBub3QgaGF2ZSBhbnkgZXNjYXBlZCBjaGFyYWN0ZXJzLlxuLy8gVGhpcyBtZWFucyBpZiBpdCBwYXNzZXMgdGhpcyByZWdleCwgd2UgY2FuIGNvbmZpZGVudGx5IGNoZWNrIHRvIG1ha2Ugc3VyZSB0aGVcbi8vIHNjaGVtZSBpcyBub3QgXCJqYXZhc2NyaXB0Oi8vXCIgdG8gYXZvaWQgWFNTLiBPdGhlcndpc2UsIFwiamF2YXNjcmlwdFwiIG1heSBiZSBlbmNvZGVkXG4vLyBhcyBcIiYjMTA2YXZhc2NyaXB0Oi8vXCIgb3IgYW55IG90aGVyIHBlcm11dGF0aW9uIG9mIGVzY2FwZWQgY2hhcmFjdGVycy5cbi8vIFJlZjogaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODYjc2VjdGlvbi0zLjFcbmNvbnN0IHJlYXNvbmFibGVVcmxTY2hlbWVSZWdleCA9IC9eW2EtejAtOV0rOlxcL1xcLy9pO1xuXG4vKiogKi9cbmNvbnN0IExpbmsgPSAocHJvcHM6IFByb3BzKSA9PiB7XG4gICAgLy8gU2V0IHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIiB0byBhdm9pZCByZXZlcnNlIHRhYm5hYmJpbmcuXG4gICAgLy8gaHR0cHM6Ly93d3cub3dhc3Aub3JnL2luZGV4LnBocC9SZXZlcnNlX1RhYm5hYmJpbmdcbiAgICBjb25zdCByZWwgPSBwcm9wcy50YXJnZXQgPyAnbm9vcGVuZXIgbm9yZWZlcnJlcicgOiBudWxsO1xuXG4gICAgY29uc3Qge2hyZWZ9ID0gcHJvcHM7XG4gICAgbGV0IHNhbml0aXplZEhyZWY7XG4gICAgaWYgKGhyZWYpIHtcbiAgICAgICAgY29uc3QgaGFzU2NoZW1lID0gaHJlZi5pbmRleE9mKCc6Ly8nKSAhPT0gLTE7XG4gICAgICAgIGlmICghaGFzU2NoZW1lKSB7XG4gICAgICAgICAgICAvLyBJZiBpdCdzIGEgcmVsYXRpdmUgVVJMIChsaWtlICcvZm9vJyksIGxlYXZlIGl0IGFsb25lLlxuICAgICAgICAgICAgc2FuaXRpemVkSHJlZiA9IGhyZWY7XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICByZWFzb25hYmxlVXJsU2NoZW1lUmVnZXgudGVzdChocmVmKSAmJlxuICAgICAgICAgICAgIS9eamF2YXNjcmlwdDovaS50ZXN0KGhyZWYpICYmXG4gICAgICAgICAgICAhL15kYXRhOi9pLnRlc3QoaHJlZilcbiAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBJZiBpdCBoYXMgYSBzY2hlbWUgYW5kIHdlIGNhbiBiZSAxMDAlIHN1cmUgdGhlIHNjaGVtZSBpc1xuICAgICAgICAgICAgLy8gbm90IGphdmFzY3JpcHQgb3IgZGF0YSwgdGhlbiBsZWF2ZSBpdCBhbG9uZS5cbiAgICAgICAgICAgIHNhbml0aXplZEhyZWYgPSBocmVmO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gV2UgY2FuJ3QgYmUgY29uZmlkZW50IHRoYXQgdGhlIHNjaGVtZSBpc24ndCBqYXZhc2NyaXB0IG9yIGRhdGEsXG4gICAgICAgICAgICAvLyAocG9zc2libHkgd2l0aCBlc2NhcGVkIGNoYXJhY3RlcnMpLCBzbyBwcmVwZW5kIGh0dHA6Ly8gdG8gYXZvaWRcbiAgICAgICAgICAgIC8vIFhTUy5cbiAgICAgICAgICAgIHNhbml0aXplZEhyZWYgPSAnaHR0cDovLycgKyBocmVmO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGFpcnRhYmxlL25vb3BlbmVyLW5vcmVmZXJyZXJcbiAgICAgICAgPGFcbiAgICAgICAgICAgIGhyZWY9e3Nhbml0aXplZEhyZWZ9XG4gICAgICAgICAgICB0YXJnZXQ9e3Byb3BzLnRhcmdldH1cbiAgICAgICAgICAgIHJlbD17cmVsfVxuICAgICAgICAgICAgdGFiSW5kZXg9e3Byb3BzLnRhYkluZGV4fVxuICAgICAgICAgICAgY2xhc3NOYW1lPXtwcm9wcy5jbGFzc05hbWV9XG4gICAgICAgICAgICBzdHlsZT17cHJvcHMuc3R5bGV9XG4gICAgICAgID5cbiAgICAgICAgICAgIHtwcm9wcy5jaGlsZHJlbn1cbiAgICAgICAgPC9hPlxuICAgICk7XG59O1xuXG5MaW5rLnByb3BUeXBlcyA9IHtcbiAgICBocmVmOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgdGFyZ2V0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHRhYkluZGV4OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtQcm9wVHlwZXMuc3RyaW5nLCBQcm9wVHlwZXMubnVtYmVyXSksXG4gICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHN0eWxlOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMubm9kZSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IExpbms7XG4iXX0=