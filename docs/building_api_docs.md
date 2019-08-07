# Building API docs

The current version of the API docs is compiled by Documentation.js from the comments in the SDK
source code. This output is hosted in two places:

-   `packages/sdk/docs/api.md` (for browsing on GitHub).
-   `docs/src/pages/api.mdx` (served by the Gatsby docs site).

## Step 0 (optional): Change the table of contents

-   If you want to change the table of contents, change `packages/sdk/documentation_config.yml`.

-   Now build the docs (see below).

## Step 1: Build the api.md docs (for GitHub)

-   Run the following to generate a new version of `packages/sdk/docs/api.md` from the JS source
    code comments.

```
cd project_root/packages/sdk
npm run build:docs
```

The file will be updated with the latest docs.

-   Now follow the instructions for updating the Gatsby docs.

## Step 2: Build the api.mdx docs (for Gatsby)

This manual process will be deprecated and replaced with a GraphQL approach that is entirely
mechanical. In the interim, this file explains what to do if you need to generate new API docs for
the Gatsby site.

-   Follow the instructions for building the api.md docs (see above).

-   Copy the file at `packages/sdk/docs/api.md` to `docs/src/pages/api.mdx`. (Note the `x` at the
    end of the path to copy to.)

-   Because of a probable bug in the way `api.md` is built, a few of the intra-page anchor links
    will be broken. Find them by running the Gatsby site locally, navigating to `/api` and running
    this script in the console:

```js
function isLocalATag(aTag) {
    return aTag.origin + aTag.pathname === this.location.href;
}

function getAnchors() {
    return Array.from(document.querySelectorAll('a[name]'))
        .map(anchor => anchor.name)
        .reduce((anchors, anchor) => anchors.add(anchor), new Set());
}

function getLocalLinks() {
    return Array.from(document.querySelectorAll('a[href]'))
        .filter(isLocalATag)
        .map(link => link.href)
        .filter(link => link.match('#'))
        .map(link => link.match('#(.+)$')[1])
        .reduce((links, link) => links.add(link), new Set());
}

(function localAnchorLinksWithoutAnchors() {
    const anchors = getAnchors();
    return Array.from(getLocalLinks().keys()).filter(link => !anchors.has(link));
})();
```

-   Fix the anchor links listed. For example, here are three that will come up and what they should
    be transformed to:

    -   `#css--external-scripts` -> `#css-and-external-scripts`
    -   `#viewportaddmaxfullscreensize` -> `#addmaxfullscreensize`
    -   `#viewportminsize` -> `#minsize`

-   You'll also need to update this link to `icons.md`

    -   `/packages/sdk/docs/icons.md` ->
        `https://github.com/Airtable/blocks/blob/master/packages/sdk/docs/icons.md`

## Step 3: Commit

-   Commit the changes to `api.md` and `api.mdx`.

## Step 4: Release

-   Run `yarn release` after the changes are landed.
