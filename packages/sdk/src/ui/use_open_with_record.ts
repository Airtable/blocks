import {useEffect} from 'react';
import {OpenWithRecordCallback} from '../injected/airtable_interface';
import {registerOpenWithRecordCallback} from '../open_with_record';

/**
 * A hook for registering a callback to handle "open with record" events (from button field).
 *
 * Should only be used once in your block, ideally in the top level component: will throw otherwise.
 * Your block will not receive "open with record" events until a callback is registered.
 *
 * TODO(emma): write better documentation when we make this public
 *
 * @hidden
 */

export const useOpenWithRecord = (callback: OpenWithRecordCallback): void => {
    useEffect(() => registerOpenWithRecordCallback(callback), [callback]);
};

