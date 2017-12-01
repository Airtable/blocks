# Command line tool for local Blocks development

## Installation
`git clone https://github.com/Hyperbase/blocks-cli.git`<br>
`cd blocks-cli && npm install`<br><br>
Create a symlink to the script file:<br>
`ln -s run_block_bundle_server.js /usr/local/bin/block-run`

## Usage
#### Clone a block
`block-clone <applicationId>/<blockId> /path/to/blockDir apiKey`
#### Install packages
`cd /path/to/blockDir && npm install`
#### Run the block
`block-run`
