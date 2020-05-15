import {useEffect} from 'react';
import {RecordActionDataCallback} from '../injected/airtable_interface';
import {registerRecordActionDataCallback} from '../perform_record_action';

/**
 * A hook for registering a callback to handle "open block" / "perform record action" events (from
 * button field).
 *
 * Should only be used once in your block, ideally in the top level component: will throw otherwise.
 * Your block will not receive "perform record action" events until a callback is registered.
 *
 * TODO(emma): write better documentation when we make this public
 *
 * @hidden
 */

export const useRecordActionData = (callback: RecordActionDataCallback): void => {
    // registerRecordActionDataCallback returns the unsubscribe function.
    useEffect(() => registerRecordActionDataCallback(callback), [callback]);
};

// TODO(emma): switch to default export when exposing outside of private utils
