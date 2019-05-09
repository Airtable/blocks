// @flow
import type {BlockDeveloperCredentialEncrypted} from './block_developer_credential_types';
import type {BlockModuleMetadata, BlockModuleValueAndRevision} from './block_module_types';

type BlockModuleId = string;

export type UpdateBlockParams = {|
    packageVersionByName: {[string]: string},
    modules: Array<{|id?: BlockModuleId | null, code: string, metadata: Object, revision?: number|}>,
    developerCredentialsEncrypted?: Array<BlockDeveloperCredentialEncrypted>,
|};

export type UpdateBlockResponse = {|
    createdModules: Array<{|id: BlockModuleId, metadata: BlockModuleMetadata|}>,
    moduleRevisionById: {[BlockModuleId]: BlockModuleValueAndRevision},
    developerCredentialsEncrypted: Array<BlockDeveloperCredentialEncrypted>,
|};

export type FetchBlockResponse = {|
    modules: Array<{id: BlockModuleId, code: string, revision: number, metadata: BlockModuleMetadata}>,
    packageVersionByName: {[string]: string},
    frontendEntryModuleId: BlockModuleId,
    developerCredentialsEncrypted?: Array<BlockDeveloperCredentialEncrypted>,
|};
