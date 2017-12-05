# Command line tool for local Blocks development

## Installation
`git clone https://github.com/Hyperbase/blocks-cli.git`<br>
`cd blocks-cli && npm install`<br><br>
Create a symlink to the script file:<br>
`ln -s run_block_cli.js /usr/local/bin/block`

## Usage
#### Clone a block from Airtable
`block clone <applicationId> <blockId> </path/to/blockDir>`
#### Install packages
`cd </path/to/blockDir> && npm install`
#### Run the block
`block run`
#### Push new changes to Airtable
`block push`
#### Pull new changes from Airtable
`block pull`
