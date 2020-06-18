export const BANNER_BAR_BOX_HEIGHT = 40;
export const ERROR_BAR_BOX_HEIGHT = 40;
export const DATA_SOURCE_FORM_HEIGHT = 85;
// .vega-embed.has-actions padding-right: 38px
export const CHART_BOX_PADDING = 38;
export const SETTINGS_FORM_BOX_WIDTH = 575;
export const MINIMUM_VIEWPORT_WIDTH_FOR_CHART = SETTINGS_FORM_BOX_WIDTH + CHART_BOX_PADDING;
export const MINIMUM_VIEWPORT_WIDTH_FOR_SETTINGS = 1000;

/**
 * The following bit value constants are used to set the 'code'
 * field of settings within settings.js.
 */
export const VALID = 0b00000000;
export const MISSING_TABLE = 0b00000001;
export const SELECTED_MISSING_TABLE = 0b00000010;
export const SELECTED_MISSING_VIEW = 0b00000100;
export const INVALID_SPEC_EMPTY = 0b00001000;
export const INVALID_SPEC_PARSE = 0b00010000;
export const INVALID_SPEC_UNDEFINED = 0b00100000;
export const INVALID_FIELD_NAME = 0b01000000;

/**
 * The following bit mask constants are used to validate the
 * value of the 'code' field of settings, both within and
 * without settings.js
 */
export const CANNOT_SHOW_SPEC_EDITOR = 0b00000011;
export const CANNOT_SHOW_EDITOR_OR_CHART = 0b01111111;
