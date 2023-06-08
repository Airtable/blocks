# @airtable/blocks-cli

Command line tool for Airtable Blocks development.

<!-- toc -->

-   [@airtable/blocks-cli](#airtableblocks-cli)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Commands](#commands)
-   [New features in v2](#new-features-in-v2)
    <!-- tocstop -->

# Installation

To install or update the `block` cli, run:

    npm install --global @airtable/blocks-cli

# Usage

<!-- usage -->

```sh-session
$ npm install -g @airtable/blocks-cli-next
$ block COMMAND
running command...
$ block (-v|--version|version)
@airtable/blocks-cli-next/2.0.4 darwin-arm64 node-v16.17.0
$ block --help [COMMAND]
USAGE
  $ block COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

-   [`block add-remote BLOCKIDENTIFIER REMOTENAME`](#block-add-remote-blockidentifier-remotename)
-   [`block help [COMMAND]`](#block-help-command)
-   [`block init BLOCKIDENTIFIER BLOCKDIRPATH`](#block-init-blockidentifier-blockdirpath)
-   [`block list-remotes`](#block-list-remotes)
-   [`block release`](#block-release)
-   [`block remove-remote REMOTENAME`](#block-remove-remote-remotename)
-   [`block run`](#block-run)
-   [`block set-api-key [APIKEY]`](#block-set-api-key-apikey)
-   [`block submit`](#block-submit)

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

## `block init BLOCKIDENTIFIER BLOCKDIRPATH`

Initialize an Airtable extension project

```
USAGE
  $ block init BLOCKIDENTIFIER BLOCKDIRPATH

OPTIONS
  -h, --help           show CLI help
  --template=template  [default: https://github.com/Airtable/apps-hello-world]

EXAMPLE
  $ block init app12345678/blk12345678 hello-world-extension --template https://github.com/Airtable/apps-hello-world
```

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

## `block run`

Run the extension locally

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

## `block set-api-key [APIKEY]`

Set a personal access token (with block:manage scope) for an Airtable account to upload to

```
USAGE
  $ block set-api-key [APIKEY]

OPTIONS
  -h, --help             show CLI help
  --location=(user|app)  [default: user]

EXAMPLE
  $ block set-api-key
  $ block set-api-key TOKEN
  $ block set-api-key --location app TOKEN
```

## `block submit`

Submit extension for review for listing in the the Airtable Marketplace

```
USAGE
  $ block submit

OPTIONS
  -h, --help       show CLI help
  --remote=remote  Configure which remote to use

EXAMPLE
  $ block submit
```

<!-- commandsstop -->

# New features in v2

## CSS Support

The new CLI supports css files within your extension by default. The default webpack bundler is
configured with css-loader and style-loader. This means you can import a css file into your
extension. Example:

```
// styles.css
.red {
  color: red;
}
```

```
import {initializeBlock} from '@airtable/blocks/ui';
import React from 'react';
import './styles.css'

function MyExtension() {
    return <div className="red">Hello world</div>;
}

initializeBlock(() => <MyExtension />);
```

## Using code from other directories

The new CLI allows this method of code-sharing by allowing “sibling directories” outside the source
directory to be bundled. Those other directories can include npm imports based on link or file.

[More details and an example can be found here.](https://github.com/Airtable/apps-shared-code)

## Customizing the webpack config

By default, the CLI uses webpack to bundle your code. Out of the box, it supports using plain
JavaScript or TypeScript and styling via CSS files. If you want to customize the webpack config
further, you can do so by installing the `@airtable/blocks-webpack-bundler` package. For more
information about installing this package and customizing the webpack config, see the README for the
`@airtable/blocks-webpack-bundler` package at
[packages/webpack-bundler/README.md](https://github.com/Airtable/blocks/tree/master/packages/webpack-bundler/README.md).

## Using a custom bundler

If customizing the webpack config as described above does not solve your use case, it is also
possible to replace the bundler entirely with a custom implementation. This is will require a
significant amount of work.

Custom bundlers allow users to replace the CLI's built-in bundling functionality that turns
extension source code into publishable artifacts. Your custom bundler's output must conform to the
Airtable platform's expected format, calling convention, and file structure.

Unlike other bundling systems, which allow configurability by composing multiple single-purpose
plugins (or replacing just part of the bundling pipeline), this CLI exposes a simpler bundler
extension API that expects a single, complete replacement of bundling functionality.

To use a custom bundler:

1. Save your bundler as a JavaScript file (i.e. index.js). The bundler must be a CommonJS module. If
   your bundler in written in TypeScript, you must use the transpiled version as the entry file.

2. Then, change the block.json ‘bundler.module’ option to point at your new bundler entry file;
   i.e.:

```
// block.json
{
    “bundler”: {
        “module”: “./bundler/index.js”
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

    async findDependenciesAsync(options: SubmitFindDependenciesOptions): Promise<{files: Array<string>}> {
        // used in `block submit`
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
