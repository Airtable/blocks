import airtableInterface, {AirtableInterface} from '../injected/airtable_interface';


/** @hidden */
class BlockStats {
    private _airtableInterface: AirtableInterface;

    constructor(injectedAirtableInterface: AirtableInterface) {
        this._airtableInterface = injectedAirtableInterface;
    }

    increment(stat: string, tags?: {[key: string]: string}) {
        this.incrementBy(stat, 1, tags);
    }
    incrementBy(stat: string, value: number, tags?: {[key: string]: string}) {
        this._airtableInterface.sendStat({
            metricType: 'incrementBy',
            stat,
            value,
            tags,
        });
    }
    decrement(stat: string, tags?: {[key: string]: string}) {
        this.decrementBy(stat, 1, tags);
    }
    decrementBy(stat: string, value: number, tags?: {[key: string]: string}) {
        this._airtableInterface.sendStat({
            metricType: 'decrementBy',
            stat,
            value,
            tags,
        });
    }
    gauge(stat: string, value: number, tags?: {[key: string]: string}) {
        this._airtableInterface.sendStat({
            metricType: 'gauge',
            stat,
            value,
            tags,
        });
    }
    histogram(stat: string, value: number, tags?: {[key: string]: string}) {
        this._airtableInterface.sendStat({
            metricType: 'histogram',
            stat,
            value,
            tags,
        });
    }
    timing(stat: string, time: number, tags?: {[key: string]: string}) {
        this._airtableInterface.sendStat({
            metricType: 'timing',
            stat,
            value: time,
            tags,
        });
    }
    timingWithSum(stat: string, time: number, tags?: {[key: string]: string}) {
        this.timing(stat, time, tags);
        this.incrementBy(stat + '.sum', time, tags);
    }
}

export const blockStats = new BlockStats(airtableInterface);
