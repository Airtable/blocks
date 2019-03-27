// @flow
import type {BlockBackendRouteMethod} from './block_backend_route_methods';

// This file is effectively copied over from
// client_server_shared/blocks/block_module_types.js
// in the hyperbase repo.

const BlockModuleTypes = Object.freeze({
    FRONTEND: ('frontend': 'frontend'),
    SHARED: ('shared': 'shared'),
    BACKEND_ROUTE: ('backendRoute': 'backendRoute'),
    BACKEND_EVENT: ('backendEvent': 'backendEvent'),
});
export type BlockModuleType = $Values<typeof BlockModuleTypes>;

export type BlockFrontendModuleMetadata = {
    type: typeof BlockModuleTypes.FRONTEND,
    name: string,
};
export type BlockSharedModuleMetadata = {
    type: typeof BlockModuleTypes.SHARED,
    name: string,
};
export type BlockBackendRouteModuleMetadata = {
    type: typeof BlockModuleTypes.BACKEND_ROUTE,
    name: string,
    method: BlockBackendRouteMethod,
    urlPath: string,
};

export type BlockModuleMetadata = BlockFrontendModuleMetadata
    | BlockSharedModuleMetadata
    | BlockBackendRouteModuleMetadata;

export type BlockModuleWithoutCode = {|
    id: string,
    revision: number,
    metadata: BlockModuleMetadata
|}
