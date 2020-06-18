/**
 * EncodingChannels
 *
 * https://vega.github.io/vega-lite/docs/encoding.html#channels
 *
 * Any of these can have a ChannelDefinition value:
 *
 * https://vega.github.io/vega-lite/docs/encoding.html#channel-definition
 *
 * To validate user typed `"field": "..."` values, this list can be used to
 * find all Channel Definition values that may contain `"field": "..."`.
 *
 */
export default [
    // Position Channels
    'x',
    'y',
    'x2',
    'y2',
    'xError',
    'yError',
    'xError2',
    'yError2',
    // Polar Position Channels
    'theta',
    'radius',
    'theta2',
    'radius2',
    // Geographic Position Channels
    'longtitude',
    'latitude',
    'longtitude2',
    'latitude2',
    // Mark Properties Channels
    'color',
    'opacity',
    'fillOpacity',
    'strokeOpacity',
    'strokeWidth',
    'strokeDash',
    'size',
    'angle',
    'shape',
    // Text and Tooltip Channels
    'text',
    'tooltip',
    // Hyperlink Channel
    'href',
    // Key Channel
    'key',
    // Order Channel
    'order',
    // Level of Detail Channel
    'detail',
    // Facet Channels
    'facet',
    'row',
    'column',
];
