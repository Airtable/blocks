// @flow
import getSdk from '../get_sdk';
import Base from '../models/base';
import useWatchable from './use_watchable';

export default function useBase(): Base {
    const base = getSdk().base;
    useWatchable(base, ['__schema']);
    return base;
}
