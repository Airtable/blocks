/** @ignore */ /** */
import * as recordColoring from './record_coloring';
import createAggregators from './create_aggregators';
export {FieldType, FieldConfig} from '../../shared/types/field';
export {ViewType} from '../types/view';
export {default as Base} from './base';
export {default as Table} from './table';
export {default as Field} from './field';
export {default as View} from './view';
export {default as Record} from './record';
export {default as RecordQueryResult} from './record_query_result';
export {default as TableOrViewQueryResult} from './table_or_view_query_result';
export {default as GroupedRecordQueryResult} from './grouped_record_query_result';
export {default as LinkedRecordsQueryResult} from './linked_records_query_result';
export {default as ViewMetadataQueryResult} from './view_metadata_query_result';
export {default as Session} from './session';
export {default as Cursor} from './cursor';
export {recordColoring};

// eslint-disable-next-line no-var
export declare var aggregators: ReturnType<typeof createAggregators>;
let initializedAggregators: null | typeof aggregators = null;
Object.defineProperty(exports, 'aggregators', {
    enumerable: true,
    get: () => {
        if (!initializedAggregators) {
            initializedAggregators = createAggregators();
        }
        return initializedAggregators;
    },
});
