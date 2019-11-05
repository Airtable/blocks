import * as path from 'path';
import * as fs from 'fs';
import glob from 'glob';

const apiDocsDir = path.join(__dirname, '..', '..', '..', 'docs', 'api');
const markdownFileNames = glob.sync(path.join(apiDocsDir, '**', '*.md'));
for (const fileName of markdownFileNames) {
    const originalContents = fs.readFileSync(fileName, 'utf-8');
    const updatedContents = originalContents.replace(/^\*\*`example`\*\* ?$/gm, '**Example:**');
    fs.writeFileSync(fileName, updatedContents, 'utf-8');
}
