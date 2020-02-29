const fs = require('fs');

const docsJsonFilePath = process.argv[2];
const file = fs.readFileSync(docsJsonFilePath, 'utf8');
fs.writeFileSync(docsJsonFilePath, JSON.stringify(JSON.parse(file)), 'utf8');
