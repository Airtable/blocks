# @airtable/blocks-cli-next

Airtable apps cli

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@airtable/blocks-cli-next.svg)](https://npmjs.org/package/@airtable/blocks-cli-next)
[![Codecov](https://codecov.io/gh/Airtable/blocks-cli-next/branch/master/graph/badge.svg)](https://codecov.io/gh/Airtable/blocks-cli-next)
[![Downloads/week](https://img.shields.io/npm/dw/@airtable/blocks-cli-next.svg)](https://npmjs.org/package/@airtable/blocks-cli-next)

<!-- toc -->

-   [@airtable/blocks-cli-next](#airtableblocks-cli-next)
-   [Usage](#usage)
-   [Commands](#commands)
    <!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @airtable/blocks-cli-next
$ block COMMAND
running command...
$ block (-v|--version|version)
$ block --help [COMMAND]
USAGE
  $ block COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

-   [`block init BLOCKIDENTIFIER BLOCKDIRPATH`](#block-init-blockidentifier-blockdirpath)
-   [`block set-api-key [APIKEY]`](#block-set-api-key-apikey)
-   [`block run`](#block-run)
-   [`block release`](#block-release)
-   [`block submit`](#block-submit)
-   [`block add-remote BLOCKIDENTIFIER REMOTENAME`](#block-add-remote-blockidentifier-remotename)
-   [`block list-remotes`](#block-list-remotes)
-   [`block remove-remote REMOTENAME`](#block-remove-remote-remotename)
-   [`block help [COMMAND]`](#block-help-command)

## `block init BLOCKIDENTIFIER BLOCKDIRPATH`

Initialize an Airtable app project

```
USAGE
  $ block init BLOCKIDENTIFIER BLOCKDIRPATH

OPTIONS
  -h, --help           show CLI help
  --template=template  [default: https://github.com/Airtable/apps-hello-world]

EXAMPLE
  $ block init app12345678/blk12345678 hellow-world-app --template https://github.com/Airtable/apps-hello-world
```

_See code:
[lib/commands/init.js](https://github.com/packages/cli-next/blob/v0.1.0/lib/commands/init.js)_

## `block set-api-key [APIKEY]`

Set an api key for an airtable account to upload to

```
USAGE
  $ block set-api-key [APIKEY]

OPTIONS
  -h, --help             show CLI help
  --location=(user|app)  [default: user]

EXAMPLE
  $ block set-api-key
  $ block set-api-key APIKEY
  $ block set-api-key --location app APIKEY
```

## `block run`

Run the app locally

```
USAGE
  $ block run

OPTIONS
  -h, --help       show CLI help
  --port=port      [default: 9000] HTTPS port the server listens on. The server will listen for HTTP on PORT + 1.
  --remote=remote  [Beta] Configure which remote to use

EXAMPLE
  $ block run
```

_See code:
[lib/commands/run.js](https://github.com/packages/cli-next/blob/v0.1.0/lib/commands/run.js)_

## `block release`

Release a build to an Airtable base

```
USAGE
  $ block release

OPTIONS
  -h, --help       show CLI help
  --remote=remote  [Beta] Configure which remote to use

EXAMPLE
  $ block release
```

_See code:
[lib/commands/release.js](https://github.com/packages/cli-next/blob/v0.1.0/lib/commands/release.js)_

## `block submit`

Submit app for review for listing in the the Airtable Marketplace

```
USAGE
  $ block submit

OPTIONS
  -h, --help       show CLI help
  --remote=remote  Configure which remote to use

EXAMPLE
  $ block submit
```

## `block add-remote BLOCKIDENTIFIER REMOTENAME`

[Beta] Add a new remote configuration

```
USAGE
  $ block add-remote BLOCKIDENTIFIER REMOTENAME

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ block add-remote app12345678/blk12345678 new-remote
```

_See code:
[lib/commands/add-remote.js](https://github.com/packages/cli-next/blob/v0.1.0/lib/commands/add-remote.js)_

## `block list-remotes`

[Beta] List remote configurations

```
USAGE
  $ block list-remotes

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ block list-remotes
```

## `block remove-remote REMOTENAME`

[Beta] Remove a remote configuration

```
USAGE
  $ block remove-remote REMOTENAME

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ block remove-remote old-remote

```

## `block help [COMMAND]`

display help for block

```
USAGE
  $ block help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code:
[@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

<!-- commandsstop -->
