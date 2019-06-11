# Developing the Airtable Blocks SDK

## Commands

Run with `npm run <command>` or `yarn run <command>`.

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

## Publishing

Publish the package with [`np`](https://github.com/sindresorhus/np), which runs some extra checks
and makes sure tags etc. get pushed to GitHub. Whilst we're in pre-alpha, every version bump can be
`patch` - we can start following semver later.

Publish using this command:

```sh
npx np patch --any-branch
```
