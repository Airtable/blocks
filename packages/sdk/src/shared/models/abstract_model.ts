/** @module @airtable/blocks/models: Abstract models */ /** */
import {invariant, spawnError} from '../error_utils';
import Watchable from '../watchable';
import {type SdkMode} from '../../sdk_mode';

/**
 * Abstract superclass for all models. You won't use this class directly.
 *
 * @docsPath models/advanced/AbstractModel
 */
abstract class AbstractModel<
    SdkModeT extends SdkMode,
    DataType,
    WatchableKey extends string,
> extends Watchable<WatchableKey> {
    /** @internal */
    static _className = 'AbstractModel';
    /**
     * This method is essentially abstract, but as of this writing, TypeScript
     * does not support abstract static methods. This necessitates a concrete
     * implementation which must be explicitly ignored by the test coverage
     * tooling.
     *
     * @internal
     */
    static _isWatchableKey(key: string): boolean {
        return false;
    }
    /** @internal */
    _baseData: SdkModeT['BaseDataT'];
    /** @internal */
    _id: string;
    /** @internal */
    _sdk: SdkModeT['SdkT'];
    /**
     * @internal
     */
    constructor(sdk: SdkModeT['SdkT'], modelId: string) {
        super();

        invariant(
            typeof modelId === 'string',
            '%s id should be a string',
            (this.constructor as typeof AbstractModel)._className,
        );

        this._sdk = sdk;
        this._baseData = sdk.__airtableInterface.sdkInitData.baseData;
        this._id = modelId;
    }
    /**
     * The ID for this model.
     */
    get id(): string {
        return this._id;
    }
    /**
     * @internal
     */
    abstract get _dataOrNullIfDeleted(): DataType | null;
    /**
     * @internal
     */
    get _data(): DataType {
        const data = this._dataOrNullIfDeleted;
        if (data === null) {
            throw this._spawnErrorForDeletion();
        }
        return data;
    }
    /**
     * `true` if the model has been deleted, and `false` otherwise.
     *
     * In general, it's best to avoid keeping a reference to an object past the
     * current event loop, since it may be deleted and trying to access any data
     * of a deleted object (other than its ID) will throw. But if you keep a
     * reference, you can use `isDeleted` to check that it's safe to access the
     * model's data.
     */
    get isDeleted(): boolean {
        return this._dataOrNullIfDeleted === null;
    }
    /**
     * @internal
     */
    _spawnErrorForDeletion(): Error {
        return spawnError(
            '%s has been deleted',
            (this.constructor as typeof AbstractModel)._className,
        );
    }
    /**
     * A string representation of the model for use in debugging.
     */
    toString(): string {
        return `[${(this.constructor as typeof AbstractModel)._className} ${this.id}]`;
    }
}

export default AbstractModel;
