# Working in this repo

This project uses [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/). You must have
`yarn` installed to work with it: `npm install -g yarn@1.13.0`.

## Managing dependencies

In this project, individual packages can have their own dependencies (check
`/{packages,tools}/*/package.json`), and the entire repo can have dependencies (check
`/package.json`) too. These are called _package_ and _root_ dependencies, respectively.

These dependencies can come from anywhere you can usually install npm packages (_remote_
dependencies), but also from within this repo (_local_ dependencies).

For remote packages, you can `yarn add` them as usual.

For local packages, open up `package.json` where you want to be installed, and add the name and
_latest version_ of the local package you want as a dependency. Make sure you use the full name as
published on npm, not the name of the folder within this repo. For example, to add the blocks eslint
plugin to the cli, I would open `packages/cli/package.json` and add
`"@airtable/eslint-plugin-blocks": "^1.0.2"` to the `"devDependencies"` field.

In order to support both normal and local packages, we can't use vanilla `npm`. You always need to
use `yarn` when working in this repo.

## Public and internal packages

There are two main top-level folders in this repo that contain node packages. One is `packages`, and
the other is `tools`.

The packages in `packages` are the main public packages that this repo exists for. They're all
published to npm, and all under the `@airtable/` scope.

The packages in `tools` are internal packages used to support the development of the public
packages. They're full, self-contained node projects - they have their own `package.json` and
dependencies etc, but aren't published to npm. They have `"private": true` set in `package.json` and
are all under the `@airtable-blocks-internal/` scope.

## Branch naming

Use camel-case naming for branching, prefixed with the name of the package and a hyphen. For
example, if you were adding a friendship component to the SDK, you might name your branch
`sdk-addFriendship`.

## Publishing to npm

To publish a package, `cd` into its folder, run `yarn release`, and follow the onscreen
instructions - you should only need to choose a new version then hit "Yes" a bunch of times.

This will release to npm, create tags in git, and push them to our development repo and to
https://github.com/airtable/blocks. This will push _all_ changes to the public repo - not just the
ones for the package you're releasing - so be careful.

> _BE CAREFUL:_ If a package has any local dependencies, make sure you
>
> 1. Release those first
> 2. Bump the version number in the dependents `package.json` to the newly released version

## Publishing to the public repo

When you run `yarn release`, your changes will automatically be pushed to the public repo at
https://github.com/airtable/blocks. If you'd like to push to this repo without publishing to npm,
use `git push git@github.com:Airtable/blocks.git master`.

## Useful commands

| Command       | Description                                |
| ------------- | ------------------------------------------ |
| `yarn format` | Format all files in the repo with prettier |
