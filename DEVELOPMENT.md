# Working in this repo

This is a [Lerna](https://github.com/lerna/lerna) monorepo containing projects related to Airtable
Blocks. Install `lerna` using `yarn global add lerna@3.15.0`.

## Managing dependencies

In this project, individual packages can have their own dependencies (check
`/{packages,tools}/*/package.json`), and the entire repo can have dependencies (check
`/package.json`) too. These are called _package_ and _root_ dependencies, respectively.

These dependencies can come from anywhere you can usually install npm packages, but also from within
this repo. List the packages' names and versions (always use the latest for local packages) in
`package.json`, and they'll be made available to you next time you run `lerna bootstrap`. These
packages can also be published to npm, but they don't have to be - the packages in `/tools` are all
private internal tools for developing in this repo - they're not available on the normal npm
registry.

In order to support both normal and local packages, we can't use vanilla `yarn` or `npm`. We need to
use `lerna`s equivalents for these commands. They correctly handle symlinking these internal
dependencies together. The main command you'll need is `lerna bootstrap`. Run this whenever you'd
usually run `yarn`. There are other useful commands in the [Useful commands](#useful-commands)
section.

## Branch naming

Use camel-case naming for branching, prefixed with the name of the package and a hyphen. For
example, if you were adding a friendship component to the SDK, you might name your branch
`sdk-addFriendship`.

## Publishing to npm

We use lerna to publish to npm at the moment as it meets the majority of our requirements. This
might change in the future though - one key requirement that it doesn't hit is the ability to
publish our packages separately from one another. Lerna enforces that we must publish all packages
with changes since the last publish at the same time. You can check which packages have changes to
be published with `lerna changed` and `lerna diff`.

To create a release, run `lerna publish` and follow the on-screen instructions. This will build and
release the packages and perform any other release-related chores that are necessary.

## Publishing to the public repo

When you run `lerna publish`, your changes will automatically be pushed to the public repo at
https://github.com/airtable/blocks. If you'd like to push to this repo without publishing to npm,
use `git push git@github.com:Airtable/blocks.git master`. Be careful though - this will push all the
in-progress changes that haven't been released yet.

## Useful commands

| Command                                                  | Description                                                                                                                                       |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `yarn format`                                            | Format all files in the repo with prettier                                                                                                        |
| `lerna bootstrap`                                        | Install all node_modules and symlink projects together that need it                                                                               |
| `lerna publish`                                          | Interactively publish the packages installed in this repo                                                                                         |
| `lerna add <package>[@version] --scope=<target package>` | Install `<package>` in the package `<target package>`. If you don't include `--scope`, `<package>` will be installed in all packages in the repo. |
