import React from 'react';
import {Link} from 'gatsby';
import {withPrefix} from 'gatsby';

export default function LinkFromMarkdown({href, children}) {
    if (shouldUseATag(href)) {
        return <a href={href}>{children}</a>;
    }

    return <LinkWithDedupedPrefix hrefWithPrefix={href}>{children}</LinkWithDedupedPrefix>;
}

function isAnchorLinkToCurrentPage(href) {
    return href.startsWith('#');
}

function isEmailLink(href) {
    return href.startsWith('mailto:');
}

function isExternalLink(href) {
    return href.startsWith('http://') || href.startsWith('https://') || href.startsWith('ftp://');
}

function shouldUseATag(href) {
    return isExternalLink(href) || isEmailLink(href) || isAnchorLinkToCurrentPage(href);
}

// In production, the site root is `/blocks/`.  This means that every
// URL is prefixed with `/blocks/`.  So, for example, the home page is
// served at `/blocks/`.  This prefix is configured in
// Gatsby. Internal markdown links that enter the top level
// `LinkFromMarkdown` component have already been rendered by the
// markdown renderer.  This render prepends the site prefix to the
// links.  Unfortunately, the `Link` component also adds the site
// prefix when it renders the link.  For example, a markdown link to
// `/guides` would be rendered as `/blocks/guides` by the markdown
// renderer, the `Link` component would add another `/blocks`, and so
// the URL would end up as `/blocks/blocks/guides` and wouldn't work.
// This component, `LinkWithDedupedPrefix` removes the prefix from the
// link rendered by markdown, thus clearing the way for Link to re-add
// the prefix.  (Note that in development, the prefix is omitted.)
function LinkWithDedupedPrefix({hrefWithPrefix, children}) {
    const prefix = withPrefix('/');
    const hrefWithoutPrefix = hrefWithPrefix.replace(prefix, '/');

    return <Link to={hrefWithoutPrefix}>{children}</Link>;
}
