// By default Typedoc JSON output has white space, this can mean the output is twice as large sometimes.
// This helper script rewrites the file without whitespace.
const fs = require('fs');

const docsJsonFilePath = process.argv[2];
const file = fs.readFileSync(docsJsonFilePath, 'utf8');
fs.writeFileSync(docsJsonFilePath, JSON.stringify(JSON.parse(file)), 'utf8');
