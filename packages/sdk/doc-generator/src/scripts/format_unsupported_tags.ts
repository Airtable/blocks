import * as path from 'path';
import * as fs from 'fs';
import glob from 'glob';

const tagsToReplace = {
    example: '**Example:**',
    alias: '**Alias:**',
    see: '**See:**',
    inheritdoc: '',
};

const apiDocsDir = path.join(__dirname, '..', '..', '..', 'docs', 'api');
const markdownFileNames = glob.sync(path.join(apiDocsDir, '**', '*.md'));
for (const fileName of markdownFileNames) {
    const originalContents = fs.readFileSync(fileName, 'utf-8');

    const tagMatchGroup = `(${Object.keys(tagsToReplace).join('|')})`;
    const updatedContents = originalContents.replace(
        new RegExp(`^\\*\\*\`${tagMatchGroup}\`\\*\\*`, 'gm'),
        (match: string, tagName: keyof typeof tagsToReplace) => {
            return tagsToReplace[tagName];
        },
    );

    fs.writeFileSync(fileName, updatedContents, 'utf-8');
}
