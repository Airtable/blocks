import {System} from './system';

interface EntryPointOptions {
    destination: string;
    userEntryPoint: string;
}

export async function renderEntryPointAsync(
    sys: System,
    {destination, userEntryPoint}: EntryPointOptions,
): Promise<string> {
    return `module.exports = require(${JSON.stringify(
        `./${sys.path.relative(sys.path.dirname(destination), userEntryPoint)}`,
    )});
`;
}
