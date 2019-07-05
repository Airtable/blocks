# @airtable-blocks-internal/changelog-publish

A tiny internal CLI tool for adding a version to unreleased changes in your changelog when you bump
the package version on your Node.js project.

It will:

-   Rename the 'Unreleased' section to the new version and add the date
-   Link the new version to a diff between it and the previous version on GitHub
-   Add a new empty 'Unreleased' section at the top and link it to a diff between the version you
    just released and `HEAD`

## Usage

This tool assumes you're keeping a changelog with a 2nd-level header called "Unreleased" for
unreleased changes, as per the [keep a changelog spec](https://keepachangelog.com/en/1.0.0/).

### 1: Install it

To add this utility to a package in this repo, use `lerna add
@airtable-blocks-internal/changelog-publish ../path/to/your/package'

### 2: Add a `version` script

In your package.json add a `version` entry under `scripts`:

```json
{
    "scripts": {
        "version": "changelog-publish --github-repo-url=<your github URL> --git-tag-prefix=<your package name>@ && git add CHANGELOG.md"
    }
}
```

Now, when you run `lerna publish`, any changes in the Unreleased section will be moved into a
section for your new package version.

The `git add` part is to make sure the changes to your changelog get included in the same commit as
your version-bump.

That's it! That's all this tool does! Ta-da!
