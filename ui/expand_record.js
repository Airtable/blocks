// @flow
const utils = require('client/blocks/sdk/utils');
const liveappInterface = require('client/blocks/sdk/liveapp_interface');
const {HostMethodNames} = require('client/blocks/block_message_types');

import type Record from 'client/blocks/sdk/models/record';

function expandRecord(record: Record) {
    // TODO(kasra): this will cause the liveapp page to force a refresh if the
    // tableId and recordId are both valid, but the recordId does not
    // exist in the table.
    utils.fireAndForgetPromise(liveappInterface.callHostMethodAsync.bind(
        liveappInterface,
        HostMethodNames.EXPAND_RECORD,
        {
            tableId: record.parentTable.id,
            recordId: record.id,
        },
    ));
}

module.exports = expandRecord;
