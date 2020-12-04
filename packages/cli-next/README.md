# @airtable/blocks-cli-next

Airtable apps cli

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@airtable/blocks-cli-next.svg)](https://npmjs.org/package/@airtable/blocks-cli-next)
[![Codecov](https://codecov.io/gh/Airtable/blocks-cli-next/branch/master/graph/badge.svg)](https://codecov.io/gh/Airtable/blocks-cli-next)
[![Downloads/week](https://img.shields.io/npm/dw/@airtable/blocks-cli-next.svg)](https://npmjs.org/package/@airtable/blocks-cli-next)

<!-- toc -->

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
@airtable/blocks-cli-next/0.0.0 darwin-x64 node-v15.0.1
$ block --help [COMMAND]
USAGE
  $ block COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

-   [`block set-api-key`](#block-set-api-key)
-   [`block help [COMMAND]`](#block-help-command)

## `block set-api-key`

Save a key when `block` needs to contact the Airtable API.

```
USAGE
  $ block set-api-key

OPTIONS
  -h, --help       show CLI help

EXAMPLE
  $ block set-api-key
```

_See code:
[src/commands/set-api-key.ts](https://github.com/Airtable/blocks-cli-next/blob/v0.0.0/src/commands/set-api-key.ts)_

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
