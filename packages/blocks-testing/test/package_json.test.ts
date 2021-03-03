import fs from 'fs';
import path from 'path';

const loadAsync = async () => {
    const name = path.join(__dirname, '..', 'package.json');

    return JSON.parse(await fs.promises.readFile(name, 'utf-8'));
};

describe('package.json', () => {
    it('defines the same dependency on the Blocks SDK for development and for consumers', async () => {
        const packageJson = await loadAsync();

        expect(packageJson.devDependencies['@airtable/blocks']).toBeTruthy();
        expect(packageJson.devDependencies['@airtable/blocks']).toBe(
            packageJson.peerDependencies['@airtable/blocks'],
        );
    });
});
