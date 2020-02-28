# @airtable-blocks-internal/git-mirror

An internal tool used for syncing a partial copy of the monorepo to a public repository while
scrubbing git history.

## Configuration

It relies on `git-mirror.json` which defines the following properties:

-   authorName: the committer name for publish commits
-   authorEmail: the committer email for publish commits
-   remote: the git remote to mirror to
-   subdirectory: the path to the root of the directory being published. used to create relative
    paths for the folders / files listed in `global`. can be omitted if running from the root.
-   global: an allow-list of files which should be included in every publish commit

## Usage

The git-mirror command has two subcommands: create and sync. The create command uses the existing
history to create a new repo with only publish commits and no progress commits. This should only
need to run one time, after which the repo will be updated with sync. The sync command takes a tag
name and creates a commit in the remote repository that publishes the state of the source repo at
that tag in a single public-facing commit & tag. Progress non-tag commits are therefore ignored.

The sync command will be used as part of our standard yarn release process for the SDK from now on.

## Example

create: `/git-mirror/bin/git-mirror create /path/to/new/repo`

sync: `/git-mirror/bin/git-mirror sync @airtable/blocks@0.0.40`
