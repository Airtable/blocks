/** @hidden */
export interface Stat {
    metricType: string;
    stat: string;
    value: number;
    tags?: {[key: string]: string};
}
