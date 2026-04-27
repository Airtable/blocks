import {invariant} from '../../shared/error_utils';
import {isEnumValue, type ObjectValues} from '../../shared/private_utils';
import Watchable from '../../shared/watchable';
import {type InterfaceBlockSdk} from '../sdk';

/** @internal */
const WatchableSearchParamsKeys = Object.freeze({
    searchParams: 'searchParams' as const,
});

/** @internal */
type WatchableSearchParamsKey = ObjectValues<typeof WatchableSearchParamsKeys>;

/** @internal */
export class SearchParams extends Watchable<WatchableSearchParamsKey> {
    static _className = 'SearchParams';

    _searchParams: Record<string, string>;

    static _isWatchableKey(key: string): boolean {
        return isEnumValue(WatchableSearchParamsKeys, key);
    }

    _sdk: InterfaceBlockSdk;

    constructor(initialSearchParams: Record<string, string>, sdk: InterfaceBlockSdk) {
        super();
        this._sdk = sdk;
        this._searchParams = initialSearchParams;
    }

    getSearchParams(): Record<string, string> {
        return this._searchParams;
    }

    setSearchParamsAsync(searchParams: Record<string, string>): Promise<boolean> {
        for (const key of Object.keys(searchParams)) {
            invariant(
                /^\w+$/.test(key),
                'Invalid search param key "%s". Keys must only contain letters, digits, and underscores.',
                key,
            );
        }
        return this._sdk.__airtableInterface.setSearchParamsAsync(searchParams);
    }

    /**
     * This shouldn't be called directly - instead, use this._sdk.__applySearchParamsUpdates().
     * This is called by the SDK when hyperbase sends a message with new search params.
     */
    __set(searchParams: Record<string, string>) {
        this._searchParams = searchParams;
        this._onChange(WatchableSearchParamsKeys.searchParams);
    }
}
