# Simple chart

This example blocks shows a bar chart of data from a table.

The code shows:

-   How to use the Chart.js external library.

-   How to store block-related data using `globalConfig` and `Synced` UI components.

## How to run this block

1. Create a new base using the
   [Sales CRM template](https://airtable.com/templates/sales-and-customers/expvjTzYAZareV1pt/sales-crm).

2. Create a new block in your new base (see the [setup guide](/packages/sdk/docs/setup.md)).

3. Add the charting dependencies to your new block

```
npm install --save chart.js react-chartjs-2
```

4. Copy the code from the `frontend` directory of this block to the `frontend` directory of your new
   block.

5. From the root of your new block, run `block run`.

## See the block running

![Block updating chart as the user changes data](media/block.gif?raw=true)
