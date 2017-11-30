// @flow
const utils = require('client/blocks/sdk/utils');
const liveappInterface = require('client/blocks/sdk/liveapp_interface');
const {HostMethodNames} = require('client/blocks/block_message_types');

import type Record from 'client/blocks/sdk/models/record';

/** */
function expandRecord(record: Record, opts?: {
    /** If provided, will enable paging between records from the expanded record. */
    records?: Array<Record>,
}) {
    // TODO(kasra): this will cause the liveapp page to force a refresh if the
    // tableId and recordId are both valid, but the recordId does not
    // exist in the table.

    let recordIds = null;
    if (opts && opts.records) {
        recordIds = opts.records.map(r => r.id);
    }

    utils.fireAndForgetPromise(liveappInterface.callHostMethodAsync.bind(
        liveappInterface,
        HostMethodNames.EXPAND_RECORD,
        {
            tableId: record.parentTable.id,
            recordId: record.id,
            opts: {
                recordIds,
            },
        },
    ));
}

module.exports = expandRecord;
