// @flow
const remark = require('remark');
const mdastToString = require('mdast-util-to-string');

const formatDate = date =>
    [
        date
            .getFullYear()
            .toString(10)
            .padStart(4, '0'),
        (date.getMonth() + 1).toString(10).padStart(2, '0'),
        date
            .getDate()
            .toString(10)
            .padStart(2, '0'),
    ].join('-');

function getLastVersion(
    nodes,
) /*: {|isValid: true, version: string | null|} | {|isValid: false, message: string|} */ {
    const lastVersionHeading = nodes.find(child => child.type === 'heading' && child.depth === 2);

    if (!lastVersionHeading) {
        return {isValid: true, version: null};
    }

    const link = lastVersionHeading.children[0];
    if (
        !link ||
        link.type !== 'link' ||
        link.children.length !== 1 ||
        link.children[0].type !== 'text'
    ) {
        return {
            isValid: false,
            message: `Version heading "${mdastToString(
                lastVersionHeading,
            )}" isn't correctly linked`,
        };
    }

    return {isValid: true, version: link.children[0].value};
}

function changelogPublish(
    changelogMarkdown /*: string */,
    {
        version,
        date,
        githubRepoUrl,
        gitTagPrefix,
    } /*: {|version: string, date: Date, githubRepoUrl: string, gitTagPrefix: string|} */,
) /*: {|isValid: true, changelog: string|} | {|isValid: false, message: string|} */ {
    const ast = remark.parse(changelogMarkdown);

    const unreleasedHeadingIndex = ast.children.findIndex(
        child => child.type === 'heading' && child.depth === 2,
    );
    const unreleasedHeading = ast.children[unreleasedHeadingIndex];
    if (!unreleasedHeading || mdastToString(unreleasedHeading) !== 'Unreleased') {
        return {
            isValid: false,
            message: "Changelog must have an 'Unreleased' section",
        };
    }

    // figure out which versions to link to:
    const lastVersionResult = getLastVersion(ast.children.slice(unreleasedHeadingIndex + 1));
    if (!lastVersionResult.isValid) {
        return lastVersionResult;
    }
    const lastVersion = lastVersionResult.version;
    const versionLinkUrl = lastVersion
        ? `${githubRepoUrl}/compare/${gitTagPrefix}${lastVersion}...${gitTagPrefix}${version}`
        : `${githubRepoUrl}/releases/tag/${gitTagPrefix}${version}`;
    const unreleasedLinkUrl = `${githubRepoUrl}/compare/${gitTagPrefix}${version}...HEAD`;

    // change the current unreleased heading to match the new version
    unreleasedHeading.children = [
        {
            type: 'link',
            title: null,
            url: versionLinkUrl,
            children: [
                {
                    type: 'text',
                    value: version,
                },
            ],
        },
        {
            type: 'text',
            value: ` - ${formatDate(date)}`,
        },
    ];

    ast.children.splice(
        unreleasedHeadingIndex,
        0,
        {
            type: 'heading',
            depth: 2,
            children: [
                {
                    type: 'link',
                    title: null,
                    url: unreleasedLinkUrl,
                    children: [
                        {
                            type: 'text',
                            value: 'Unreleased',
                        },
                    ],
                },
            ],
        },
        {
            type: 'text',
            value: 'No changes.',
        },
    );

    return {isValid: true, changelog: remark.stringify(ast)};
}

module.exports = changelogPublish;
