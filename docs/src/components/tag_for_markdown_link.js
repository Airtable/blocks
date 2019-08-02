import React from 'react';
import {Link} from 'gatsby';

export default function MarkdownLinkToLink({href, children}) {
    if (shouldUseATag(href)) {
        return <a href={href}>{children}</a>;
    }

    return <Link to={href}>{children}</Link>;
}

function isAnchorLinkToCurrentPage(href) {
    return href.startsWith('#');
}

function isEmailLink(href) {
    return href.startsWith('mailto:');
}

function isExternalLink(href) {
    return href.startsWith('http://') || href.startsWith('https://');
}

function shouldUseATag(href) {
    return isExternalLink(href) || isEmailLink(href) || isAnchorLinkToCurrentPage(href);
}
