# @airtable/blocks-cli

Command line tool for Airtable Blocks development.<br /> This README is specifically for the v2
version of the CLI, which is in public beta

<!-- toc -->

-   [Installation](#installation)
-   [Usage](#usage)
-   [Commands](#commands)
-   [New features in v2](#new-features-in-v2)
    <!-- tocstop -->

# Installation

To install or update the `block` cli, run:

    npm install --global @airtable/blocks-cli@2.0.0-beta

# Usage

<!-- usage -->

```sh-session
$ npm install -g @airtable/blocks-cli
$ block COMMAND
running command...
$ block (-v|--version|version)
@airtable/blocks-cli/2.0.0-beta.2 darwin-x64 node-v12.20.1
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

# New features in v2

## Using code from other directories

The new CLI allows this method of code-sharing by allowing “sibling directories” outside the source
directory to be bundled. Those other directories can include npm imports based on link or file.

## Using a custom bundler

Custom bundlers allow users to replace the CLI's built-in bundling functionality that turns app
source code into publishable artifacts. Your custom bundler's output must conform to the Airtable
platform's expected format, calling convention, and file structure.

Unlike other bundling systems, which allow configurability by composing multiple single-purpose
plugins (or replacing just part of the bundling pipeline), this CLI exposes a simpler bundler
extension API that expects a single, complete replacement of bundling functionality.

To use a custom bundler:

1. Save your bundler as a TypeScript file (i.e. index.ts).
2. Then, change the block.json ‘bundler.module’ option to point at your new bundler entry file;
   i.e.:

```
# block.json
{
    “bundler”: {
        “module”: “./bundler/index.ts”
    }
}
```

3. Once the change is made, restart your dev server (if running on a dev server).

A bundler needs to implement the following APIs:

```
class Bundler {
    async bundleAsync(options: ReleaseBundleOptions): Promise<void> {
        // implement release build
    }

    async startDevServerAsync(options: RunDevServerOptions & RunDevServerMethods): Promise<void> {
        // implement run development build
    }

    async teardownAsync(): Promise<void> {
        // implement any work needed to gracefully
        // close bundler process
    }
}

export default function() {
    return new Bundler();
}

For more details about the bundler API, see src/bundler/bundler.ts
```

Static assets are still not supported by default, but you can now swap in your own bundler that
supports this.
