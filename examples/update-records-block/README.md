# Update records app

This example app updates the cell values of the selected records in your base, adding 1 to the
current cell value of a field in each record.

The code shows:

-   How to use the Cursor API to detect when a user has selected records in grid view, and how to
    get the selected records.

-   How to update multiple records from your app.

-   How to check if the user has write permissions before performing an update.

## How to run this app

1. Create a new base using the
   [Menu Planning template](https://airtable.com/templates/event-planning/expvAPRfjIaE5Js68/menu-planning)

2. Create a new app in your new base (see
   [Create a new app](https://airtable.com/developers/blocks/guides/hello-world-tutorial#create-a-new-app)),
   selecting "Update records" as your template.

3. From the root of your new app, run `block run`.

## See the app running

![App with a button that adds 1 to 'In Stock' for each selected record](media/block.gif)
