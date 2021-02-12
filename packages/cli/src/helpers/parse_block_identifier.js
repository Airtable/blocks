// @flow

import {V2_BLOCKS_BASE_ID} from '../config/block_cli_config_settings';

type ParseResult =
    | {|
          success: true,
          value: {|
              baseId: string,
              blockId: string,
          |},
      |}
    | {|
          success: false,
          error: Error,
      |};

function parseBlockIdentifier(blockIdentifier: string): ParseResult {
    const blockIdentifierSplit = blockIdentifier.split('/');
    if (
        blockIdentifierSplit.length !== 2 ||
        !(
            blockIdentifierSplit[0].startsWith('app') ||
            blockIdentifierSplit[0] === V2_BLOCKS_BASE_ID
        ) ||
        !blockIdentifierSplit[1].startsWith('blk')
    ) {
        return {
            success: false,
            error: new Error('Block identifier must be of format <baseId>/<blockId>'),
        };
    }
    const [baseId, blockId] = blockIdentifierSplit;
    return {
        success: true,
        value: {
            baseId,
            blockId,
        },
    };
}

module.exports = parseBlockIdentifier;
