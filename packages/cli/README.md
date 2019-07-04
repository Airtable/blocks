# Command line tool for Airtable Blocks development

## Installation

To install or update the `block` cli, run:

    npm install --global @airtable/blocks-cli

## Usage

#### Running the block locally

Go to the block's directory and run:

`block run`

This will start a local server and serve the bundle over https locally, with a
self-signed certificate. You'll need to follow the instructions in the command to get the
self-signed cert working in your browser. 

Once the server is started paste the bundle URL into the "Edit block
locally" dialog in Airtable.

The block's frame will switch to the local development bundle. It will automatically reload when you
update the code locally.

#### Updating your API key

To `block release`, you must have a valid Airtable API key configured. Use `block set-api-key` to
update it.

We support user (`~/.config/.airtableblocksrc.json`) and block (`.airtableblocksrc.json` within
block directory) scoped configs, and prefer the block scoped config if both exist.

## Limitations

-   Standalone CSS files are not supported
