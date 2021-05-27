import {System} from './system';
import {readJsonIfExistsAsync} from './system_extra';

export async function createUserAgentAsync(sys: System) {
    const blockCliPackagePath = sys.path.join(__dirname, '..', '..', 'package.json');
    const packageJson = await readJsonIfExistsAsync(sys, blockCliPackagePath);
    return `airtable-blocks-cli/${packageJson.version} Node/${
        sys.process.version
    } OS/${sys.os.platform()}`;
}
