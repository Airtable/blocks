# Working in this repo

This is a [Lerna](https://github.com/lerna/lerna) monorepo containing projects related to Airtable
Blocks.

## Branch naming

Use camel-case naming for branching, prefixed with the name of the package and a hyphen. For
example, if you were adding a friendship component to the SDK, you might name your branch
`sdk-addFriendship`.

## Useful commands

| Command                   | Description                                                         |
| ------------------------- | ------------------------------------------------------------------- |
| `yarn format`             | Format all files in the repo with prettier                          |
| `yarn lerna <subcommand>` | Run `lerna` commands                                                |
| `yarn lerna bootstrap`    | Install all node_modules and symlink projects together that need it |
| `yarn lerna publish`      | Interactively publish the packages installed in this repo           |
