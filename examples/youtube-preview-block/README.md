# YouTube preview block

When the user selects a record in grid view, this block gets a YouTube URL from the record and plays
the corresponding video.

The code shows:

-   How to use the Cursor API to detect when a user has selected a record in grid view, and how to
    get the selected record.

-   How to embed a YouTube video in a block.

## How to run this block

1. Copy [this base](https://airtable.com/shrg3CySSks0nRw5w).

2. Create a new block in your new base (see the [setup guide](/packages/sdk/docs/setup.md)), pasting
   the template block token `@airtable/youtube-preview-block` into the `template` field.

3. From the root of your new block, run `block run`.

## Template block token

The token for using this code as a starting point for a new block. (See above for further
instructions on how to do this.)

```
@airtable/youtube-preview-block
```

## See the block running

![Block showing YouTube video when user selects record in grid view](media/block.gif)
