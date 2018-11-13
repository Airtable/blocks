// @flow
const React = require('block_sdk/frontend/ui/react');
const PropTypes = require('prop-types');

type Props = {
    href: string,
    target?: string,
    tabIndex?: number | string,
    className?: string,
    style?: Object,
    children: React.Node,
};

// A "reasonable" scheme is one which does not have any escaped characters.
// This means if it passes this regex, we can confidently check to make sure the
// scheme is not "javascript://" to avoid XSS. Otherwise, "javascript" may be encoded
// as "&#106avascript://" or any other permutation of escaped characters.
// Ref: https://tools.ietf.org/html/rfc3986#section-3.1
const reasonableUrlSchemeRegex = /^[a-z0-9]+:\/\//i;

/** */
const Link = (props: Props) => {
    // Set rel="noopener noreferrer" to avoid reverse tabnabbing.
    // https://www.owasp.org/index.php/Reverse_Tabnabbing
    const rel = props.target ? 'noopener noreferrer' : null;

    const {href} = props;
    let sanitizedHref;
    if (href) {
        const hasScheme = href.indexOf('://') !== -1;
        if (!hasScheme) {
            // If it's a relative URL (like '/foo'), leave it alone.
            sanitizedHref = href;
        } else if (reasonableUrlSchemeRegex.test(href) && !(/^javascript:/i.test(href)) && !(/^data:/i.test(href))) {
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

    return (
        // eslint-disable-next-line airtable/noopener-noreferrer
        <a
            href={sanitizedHref}
            target={props.target}
            rel={rel}
            tabIndex={props.tabIndex}
            className={props.className}
            style={props.style}>
            {props.children}
        </a>
    );
};

Link.propTypes = {
    href: PropTypes.string.isRequired,
    target: PropTypes.string,
    tabIndex: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
};

module.exports = Link;
