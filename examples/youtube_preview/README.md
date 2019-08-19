# YouTube preview block

When the user selects a record in grid view, this block gets a YouTube URL from the record and plays
the corresponding video.

The code shows:

-   How to use the Cursor API to detect when a user has selected a record in grid view, and how to
    get the selected record.

-   How to embed a YouTube video in a block.

## How to run this block

1. Copy [this base](https://airtable.com/shrg3CySSks0nRw5w).

2. Create a new block in your new copied base (see the [setup guide](/packages/sdk/docs/setup.md)).

3. Copy the code from the `frontend` directory of this block to the `frontend` directory of your new
   block.

4. From the root of your new block, run `block run`.

## See the block running

![Block showing YouTube video when user selects record in grid view](media/block.gif?raw=true)
