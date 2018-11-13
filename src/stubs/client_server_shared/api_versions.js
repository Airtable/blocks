// @flow

const u = require('client_server_shared/u');

const PublicApiVersions = {
    API0: ('0.1': '0.1'),
    API2: ('2.0': '2.0'),
};

export type PublicApiVersion = $Values<typeof PublicApiVersions>;

function getAvailablePublicApiVersions(): Array<PublicApiVersion> {
    return [PublicApiVersions.API0, PublicApiVersions.API2];
}

function parsePublicApiVersionFromString(apiVersionString: string): PublicApiVersion {
    for (const availableVersion of getAvailablePublicApiVersions()) {
        if (apiVersionString === availableVersion) {
            return availableVersion;
        }
    }
    throw u.spawnError(`Invalid public api version ${apiVersionString}`);
}

module.exports = {
    PublicApiVersions,
    getAvailablePublicApiVersions,
    parsePublicApiVersionFromString,
};
