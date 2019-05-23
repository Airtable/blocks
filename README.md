# Command line tool for local Blocks development

## Installation

To install or update the `block` cli, run:

    npm install --global git+ssh://git@github.com:Hyperbase/blocks-cli.git

## Usage
#### Clone a specific block from Airtable

Go to the base where the block lives, click the block's name, then click “Edit block locally”.

Copy the clone command and paste into your terminal:

`block clone <applicationId>/<blockId> </path/to/blockDir>`

Once the block is cloned, install the block's node modules:

`cd </path/to/blockDir> && yarn`

Now would be a good time to set up version control. **Do not check in the .airtableAPIKey file!**

#### Running the block locally

Go to the block's directory and run:

`block run`

This will start a local server and create a tunnel with ngrok.io to make the URL accessible remotely. If you don't want to use the tunnel (for example, if you're on a slow internet connection) you can start the server in local mode:

`block run --local`

This will skip setting up the ngrok tunnel and instead serve the bundle over https locally, with a self-signed certificate. You'll need to follow the instructions in the command to get the self-signed cert working in your browser.

Once the server is started (in both local or ngrok mode) paste the bundle URL into the "Edit block locally" dialog in Airtable.

The block's frame will switch to the local development bundle. It will automatically reload when you update the code locally.

#### Pushing and pulling changes

Once you're happy with your changes, use `block push` to upload the code to the block. Pushing will update the code others users see when they open the web IDE or when they pull.

To pull other users' changes, use `block pull`.

To release a block, push your code, then go into the web IDE (“Edit block”), click “Run”, then open the Builds popover, then click “Release” on the latest build.

## Limitations

- Directories are not supported. Don't create new folders or delete the existing folders.
- If you want to rename the entry module, use `block rename-entry <new name>` instead of renaming the file directly (rename-entry will also update the metadata so the block syncs properly the next time you push)
