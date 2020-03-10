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
https://github.com/Airtable/blocks. This will push _all_ changes to the public repo - not just the
ones for the package you're releasing - so be careful.

> _BE CAREFUL:_ If a package has any local dependencies, make sure you
>
> 1. Release those first
> 2. Bump the version number in the dependents `package.json` to the newly released version

## Publishing to the public repo

When you run `yarn release`, your changes will automatically be pushed to the public repo at
https://github.com/Airtable/blocks.

## Useful commands

| Command       | Description                                |
| ------------- | ------------------------------------------ |
| `yarn format` | Format all files in the repo with prettier |

# Developing the Airtable Blocks SDK

The below is specific to development in the SDK repo (`/packages/sdk`). We don't include a
development guide in the repo itself, because we copy all file contents from /packages/sdk over to
the public-facing repo and are not currently encouraging public development of the SDK itself.

## Commands

Run with `yarn <command>`.

| Command       | Description                                                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------------------------- |
| `format`      | Format all files in the project with prettier                                                                        |
| `lint`        | Run eslint on all source files in the project                                                                        |
| `lint:quiet`  | Run eslint on all source files, but only report errors - not warnings.                                               |
| `flow`        | Check the source with Flow.                                                                                          |
| `jest`        | Run Jest tests.                                                                                                      |
| `jest:watch`  | Run Jest tests in watch mode, re-running tests when files change.                                                    |
| `test`        | Run `lint`, `flow`, and `jest` tasks (in that order).                                                                |
| `build:clean` | Delete any build files                                                                                               |
| `build:babel` | Transpile the contents of `src` to `dist` using Babel                                                                |
| `docs`        | Use [`TypeDoc`](https://github.com/TypeStrong/typedoc) to build docs into the `docs` directory                       |
| `build`       | Build the project. Runs `build:clean`, `build:babel`, and `build:flow`                                               |
| `watch:babel` | Runs `build:babel` in watch mode to re-transpile files as they change                                                |
| `watch:flow`  | Runs `build:flow` in watch mode to re-copy files as the change                                                       |
| `watch`       | Runs `build:clean`, then concurrently runs `watch:babel` and `watch:flow` to keep `dist` up to date as files change. |
| `release`     | Creates a new version and publishes it to npm & the Airtable org on GitHub.                                          |
| `storybook`   | Runs Storybook, which is a development environment for presentational UI components                                  |

## Versioning

Whilst we're still in beta, every version should be `patch`. We can start following semver later.

## Writing TypeDoc links

### Top-level links

Occasionally, you will want to create a link in a comment that points to a top-level entity in the
api docs. To do this, use the `{@link}` syntax.

For example, the `@link` below points at the `RecordQueryResult` section of the API docs:

```js
/**
 * Select records referenced in a `multipleRecordLinks` cell value. Returns a query result.
 * See {@link RecordQueryResult} for more.
 * etc...
 */
```

By default, the displayed text will be the name of the linked entity. You can override this by
providing a display name after a pipe, eg `{@link RecordQueryResult|record query result}`.

Note: this will only work for entities that are accessible at the top level.

### Links to a member of a module

If you want to link to the documentation about a module sub-member (e.g. a method like `bar`,
below), you can't use a `{@link}`. This can instead be achieved by linking directly to the anchor
link for that member in the docs.

As an example, see the link to `bar` below:

```js
/**
 * Example docs for Foo class.
 * Includes the [bar](/developers/blocks/api/models/Foo#bar) method.
 */
class Foo
    /**
     * Example docs for bar method.
     */
    bar() {

    }
}
```
