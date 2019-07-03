// @flow

// This file is effectively copied over from
// client_server_shared/blocks/block_backend_route_methods.js
// in the hyperbase repo.

const BlockBackendRouteMethods = {
    GET: ('get': 'get'),
    POST: ('post': 'post'),
    PUT: ('put': 'put'),
    PATCH: ('patch': 'patch'),
    DELETE: ('delete': 'delete'),
};

export type BlockBackendRouteMethod = $Values<typeof BlockBackendRouteMethods>;

module.exports = BlockBackendRouteMethods;
