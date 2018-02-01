# Command line tool for local Blocks development

## Installation

To install or update the `blocks` cli, run:

    npm install --global https://github.com/Hyperbase/blocks-cli.git

## Usage
#### Clone a specific block from Airtable

Go to the base where the block lives, click the block's name, then click “Edit block locally”.

Copy the clone command and paste into your terminal:

`block clone <applicationId>/<blockId> </path/to/blockDir>`

Once the block is cloned, install the block's npm packages:

`cd </path/to/blockDir> && npm install`

Now would be a good time to set up version control. **Do not check in the .airtableAPIKey file!**

#### Running the block locally

Go to the block's directory and run:

`block run`

Paste the bundle URL into the "Edit block locally" dialog in Airtable.

The block's frame will switch to the local development bundle. It will automatically reload when you update the code locally.

#### Pushing and pulling changes

Once you're happy with your changes, use `block push` to upload the code to the block. Pushing will update the code others users see when they open the web IDE or when they pull.

To pull other users' changes, use `block pull`.

To release a block, push your code, then go into the web IDE (“Edit block”), click “Run”, then open the Builds popover, then click “Release” on the latest build.

## Limitations

- Directories are not supported. Don't create new folders or delete the existing folders.
- If you want to rename the entry module, use `block rename-entry <new name>` instead of renaming the file directly (rename-entry will also update the metadata so the block syncs properly the next time you push)
