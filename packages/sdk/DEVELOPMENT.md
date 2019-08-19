# Developing the Airtable Blocks SDK

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
| `build:flow`  | Use [`flow-copy-source`](https://github.com/Macil/flow-copy-source) to make `src` flowtypes available in `dist`      |
| `build:docs`  | Use [`documentation`](https://github.com/documentationjs/documentation) to build docs into the `docs` directory      |
| `build`       | Build the project. Runs `build:clean`, `build:babel`, and `build:flow`                                               |
| `watch:babel` | Runs `build:babel` in watch mode to re-transpile files as they change                                                |
| `watch:flow`  | Runs `build:flow` in watch mode to re-copy files as the change                                                       |
| `watch:docs`  | Runs `build:docs` in watch mode to re-copy files as the change                                                       |
| `watch`       | Runs `build:clean`, then concurrently runs `watch:babel` and `watch:flow` to keep `dist` up to date as files change. |
| `release`     | Creates a new version and publishes it to npm & the Airtable org on GitHub.                                          |
| `storybook`   | Runs Storybook, which is a development environment for presentational UI components                                  |

## Versioning

Whilst we're still in pre-alpha, every version should be `patch`. We can start following semver
later.

## Writing JSDoc links

### Top-level links

Occasionally, you will want to create a link in a comment that points to a top-level entity in the
[api docs](packages/sdk/docs/api.md). To do this, use a JSDoc `{@link}`.

For example, the `@link` below points at the `RecordQueryResult` section of the API docs:

```js
/**
 * Select records referenced in a `multipleRecordLinks` cell value. Returns a query result.
 * See {@link RecordQueryResult} for more.
 * etc...
 */
```

Note: this will only work for entities that are accessible at the top level.

### Links to a member of a module

If you want to link to the documentation about a module sub-member (e.g. a method like `bar`,
below), you can't use a `{@link}`. See
https://airtable.quip.com/Zh56A9fEsvZR/Reasoning-behind-using-Markdown-links-to-link-to-module-sub-members-in-the-blocks-SDK-API-docs
for details on why. Instead, you need to use a Markdown link that points at `#thenameofthemember`.
As an example, see the link to `bar` below:

```js
/**
 * Example docs for Foo class.
 * Includes the [bar](#bar) method.
 */
class Foo
    /**
     * Example docs for bar method.
     */
    bar() {

    }
}
```

### Disambiguating links

GitHub anchor header names can and often do conflict. Usually, this is fine. For example, a link to
`#globalconfig` resolves to the first header in the Markdown below, which is what you want:

```md
### globalConfig

#### GlobalConfig

**Extends Watchable**

A key-value store for...
```

If you want to link to a header that is not the first instance of its name in the document, you can
disambiguate. First, put an `@alias` on the member you want to link to. Second,
[turn that alias into a slug](https://stackoverflow.com/a/45508928) and use it in a Markdown link.
In the example below, the first link points at the docs for the `foo.bar()` method, whereas the
second link points at the docs for the `baz.bar()` method:

```js
/**
 * Example docs for Foo class.
 * Contains the [bar](#bar) method.
 */
class Foo {
    /**
     * Example docs for bar method.
     */
    bar() {}
}

/**
 * Example docs for Baz class.
 * Contains the [bar](#bazbar) method.
 */
class Baz {
    /**
     * Example docs for bar method.
     * @alias Baz#bar
     */
    bar() {}
}
```

Note that you can link to the docs for one of these methods from any source file, not just the
source file in which these methods appear.
