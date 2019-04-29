// @flow

const ApiCellFormats = {
    JSON: ('json': 'json'),
    STRING: ('string': 'string'),
};

export type ApiCellFormat = $Values<typeof ApiCellFormats>;

module.exports = ApiCellFormats;
