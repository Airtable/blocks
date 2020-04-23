/** @ignore */ /** */
import * as recordColoring from './record_coloring';
import createAggregators from './create_aggregators';
export {FieldType} from '../types/field';
export {ViewType} from '../types/view';
export {default as Base} from './base';
export {default as Table} from './table';
export {default as Field} from './field';
export {default as View} from './view';
export {default as Record} from './record';
export {default as RecordQueryResult} from './record_query_result';
export {default as TableOrViewQueryResult} from './table_or_view_query_result';
export {default as LinkedRecordsQueryResult} from './linked_records_query_result';
export {recordColoring};

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
