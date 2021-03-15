import {V2_BLOCKS_BASE_ID} from '../settings';
import {spawnUserError} from './error_utils';
import {Result} from './result';

export enum BlockIdentifierErrorName {
    BLOCK_IDENTIFIER_INVALID_FORMAT = 'blockIdentifierInvalidFormat',
    BLOCK_IDENTIFIER_INVALID_BASE_ID = 'blockIdentifierInvalidBaseId',
    BLOCK_IDENTIFIER_INVALID_BLOCK_ID = 'blockIdentifierInvalidBlockId',
}

export interface BlockIdentifierError {
    type:
        | BlockIdentifierErrorName.BLOCK_IDENTIFIER_INVALID_FORMAT
        | BlockIdentifierErrorName.BLOCK_IDENTIFIER_INVALID_BASE_ID
        | BlockIdentifierErrorName.BLOCK_IDENTIFIER_INVALID_BLOCK_ID;
}

export type BlockIdentifierErrorInfo = BlockIdentifierError;

export interface BlockIdentifier {
    baseId: string;
    blockId: string;
}

export function parseBlockIdentifier(blockIdentifier: unknown): Result<BlockIdentifier> {
    if (typeof blockIdentifier !== 'string') {
        return {
            err: spawnUserError({
                type: BlockIdentifierErrorName.BLOCK_IDENTIFIER_INVALID_FORMAT,
            }),
        };
    }

    const remoteSplit = blockIdentifier.split('/');
    if (remoteSplit.length !== 2) {
        return {
            err: spawnUserError({
                type: BlockIdentifierErrorName.BLOCK_IDENTIFIER_INVALID_FORMAT,
            }),
        };
    }

    const [baseId, blockId] = remoteSplit;
    if (!baseId.startsWith('app') && baseId !== V2_BLOCKS_BASE_ID) {
        return {
            err: spawnUserError({
                type: BlockIdentifierErrorName.BLOCK_IDENTIFIER_INVALID_BASE_ID,
            }),
        };
    }
    if (!blockId.startsWith('blk')) {
        return {
            err: spawnUserError({
                type: BlockIdentifierErrorName.BLOCK_IDENTIFIER_INVALID_BLOCK_ID,
            }),
        };
    }

    return {
        value: {
            baseId,
            blockId,
        },
    };
}
