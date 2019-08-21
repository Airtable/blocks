# Print records block

This example block shows artists and their artworks, grouped by collection.

The code shows how to create a printable record layout. It features:

-   Many records shown on the same page.

-   Records printed alongside their linked records.

-   Content areas that resize dynamically to the amount of content in a field.

-   A button to print the layout.

-   The use of `CellRenderer` to display rich base content with very little code.

-   Styling that changes, based on the base content.

## How to run this block

1. Create a new base using the
   [Art Gallery Management template](https://airtable.com/templates/creative/expAZgezgpfCF8wVH/art-gallery-management).

2. Create a new block in your new base (see the [setup guide](/packages/sdk/docs/setup.md)), pasting
   the template block token `@airtable/print-records-block` into the `template` field.

3. From the root of your new block, run `block run`.

## Template block token

The token for using this code as a starting point for a new block. (See above for further
instructions on how to do this.)

```
@airtable/print-records-block
```

## See the block running

![Seeing a layout of artists and their artworks grouped by collection, printing the layout](https://raw.githubusercontent.com/Airtable/blocks/master/examples/print-records-block/media/block.gif?token=AAAAVHASL5CUHN4FSG5GDXC5M3EZA)
