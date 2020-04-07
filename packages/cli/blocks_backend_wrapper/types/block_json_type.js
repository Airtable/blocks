// @flow

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type BackendRoute = {|
    // The URL path pattern to handle.
    urlPath: string,

    // The file path to the module for this route. This module's default export must be a function
    // that returns an HTTP response.
    handler: string,

    methods: Array<HttpMethod>,
|};

export type BlockJson = {|
    // TODO(richsinn): version is optional because there already exists in the wild some
    //   block.json files without the `version` attribute. Ideally, we should require this
    //   and try to come up with some automated migration for files that are missing `version`.
    version?: '1.0',
    frontendEntry: string,
    routes?: Array<BackendRoute>,
    __hyperbase?: {
        absoluteImportRoot?: string,
    },
|};
