// @flow
const getDeveloperCredentialsEncryptedIfExistsAsync = require('../get_developer_credentials_encrypted_if_exists_async');

import type {Argv} from 'yargs';

const REDACTED_CREDENTIAL_VALUE = ('********': '********');
const NUM_SPACES_BETWEEN_DISPLAY_VALUES = 8;

type DeveloperCredentialToDisplay = {|
    name: string,
    developmentValue: typeof REDACTED_CREDENTIAL_VALUE | null,
    releaseValue: typeof REDACTED_CREDENTIAL_VALUE | null,
|};

async function runCommandAsync(argv: Argv): Promise<void> {
    const developerCredentialsEncrypted = await getDeveloperCredentialsEncryptedIfExistsAsync();
    if (developerCredentialsEncrypted === null) {
        console.log('No developer credentials on the local system. If expecting credentials, try refreshing with \'block pull\'');
        return;
    }

    const developerCredentialsToDisplay: Array<DeveloperCredentialToDisplay> =
        developerCredentialsEncrypted
            .filter(developerCredentialEncrypted => !developerCredentialEncrypted.deleted)
            .map(developerCredentialEncrypted => {
                const developmentCredentialValueToDisplay = developerCredentialEncrypted.developmentCredentialValueEncrypted ?
                    REDACTED_CREDENTIAL_VALUE : null;
                const releaseCredentialValueToDisplay = developerCredentialEncrypted.releaseCredentialValueEncrypted ?
                    REDACTED_CREDENTIAL_VALUE : null;
                return {
                    name: developerCredentialEncrypted.name,
                    developmentValue: developmentCredentialValueToDisplay,
                    releaseValue: releaseCredentialValueToDisplay
                };
            });

    // Log title headers
    // There will be 3 headers: NAME, DEVELOPMENT, and RELEASE
    const lengthOfLongestName = Math.max(...(developerCredentialsToDisplay.map(devCred => devCred.name.length)));
    // Calculate whitespace width between columns
    const numSpacesAfterNameHeader = lengthOfLongestName + NUM_SPACES_BETWEEN_DISPLAY_VALUES - 4;
    const separatorAfterNameHeader = _whitespaceSeparator(numSpacesAfterNameHeader);
    const separatorAfterDevelopmentHeader = _whitespaceSeparator(NUM_SPACES_BETWEEN_DISPLAY_VALUES);

    console.log(`NAME${separatorAfterNameHeader}DEVELOPMENT${separatorAfterDevelopmentHeader}RELEASE`);
    console.log(`----${separatorAfterNameHeader}-----------${separatorAfterDevelopmentHeader}-------`);

    // Log the credentials
    for (const developerCredentialToDisplay of developerCredentialsToDisplay) {
        const {
            name,
            developmentValue,
            releaseValue,
        } = developerCredentialToDisplay;
        const numSpacesAfterNameColumn = (lengthOfLongestName - name.length) + NUM_SPACES_BETWEEN_DISPLAY_VALUES;
        const separatorAfterNameColumn = _whitespaceSeparator(numSpacesAfterNameColumn);

        // Whitespace width calculation depends on if developmentValue is null or '********'
        const numSpacesAfterDevelopmentColumn = developmentValue ? (NUM_SPACES_BETWEEN_DISPLAY_VALUES + 1) : (NUM_SPACES_BETWEEN_DISPLAY_VALUES * 2);
        const separatorAfterDevelopmentColumn = _whitespaceSeparator(numSpacesAfterDevelopmentColumn);

        console.log(`${name}${separatorAfterNameColumn}${JSON.stringify(developmentValue)}${separatorAfterDevelopmentColumn}${JSON.stringify(releaseValue)}`);
    }
}

function _whitespaceSeparator(numOfSpaces: number): string {
    return ' '.repeat(numOfSpaces);
}

module.exports = {runCommandAsync};
