// @flow

// NOTE: for the most part, these are going to have identical keys and values, but we want
// to explicitly define this mapping so we have more control over the SDK.
// For instance, if we decide to change a key on the liveapp side, we can just update the
// value here without breaking existing blocks.
const liveappSummaryFunctionKeyByAggregatorKey = {
    none: 'none',
    sum: 'sum',
    average: 'average',
    median: 'median',
    min: 'min',
    max: 'max',
    range: 'range',
    stDev: 'stDev',
    countBlank: 'countBlank',
    count: 'count',
    countUnique: 'countUnique',
    percentEmpty: 'percentEmpty',
    percentFilled: 'percentFilled',
    percentUnique: 'percentUnique',
    earliestDate: 'earliestDate',
    latestDate: 'latestDate',
    dateRangeInDays: 'dateRangeInDays',
    dateRangeInMonths: 'dateRangeInMonths',
    totalAttachmentSize: 'totalAttachmentSize',

    // NOTE: histogram is not included at the moment, since that would mean exposing
    // the format of the histogram object to external users.
};

module.exports = liveappSummaryFunctionKeyByAggregatorKey;
