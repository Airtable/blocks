import {RecordData} from '../types/record';
import {SdkMode} from '../../sdk_mode';
import AbstractModel from './abstract_model';

/** @hidden */
export abstract class RecordCore<
    SdkModeT extends SdkMode,
    WatchableKeys extends string = never
> extends AbstractModel<SdkModeT, RecordData, WatchableKeys> {}
