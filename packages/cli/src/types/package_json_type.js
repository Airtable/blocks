// @flow

/**
 * An incomplete flow type for the shape of a package.json file.
 * see https://docs.npmjs.com/files/package.json
 */
export type PackageJson = {
    name?: string, // technically required if you want to publish to the registry
    version?: string, // technically required if you want to publish to the registry
    description?: string,
};
