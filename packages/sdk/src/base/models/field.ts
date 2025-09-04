/** @module @airtable/blocks/models: Field */ /** */
import {FieldCore} from '../../shared/models/field_core';
import {FieldOptions} from '../../shared/types/field_core';
import {UpdateFieldOptionsOpts, MutationTypes} from '../types/mutations';
import {BaseSdkMode} from '../../sdk_mode';
import {PermissionCheckResult} from '../../shared/types/mutations_core';
import {values} from '../../shared/private_utils';
import {AggregatorKey} from '../types/aggregators';
import {Aggregator} from './create_aggregators';

/**
 * Model class representing a field in a table.
 *
 * @example
 * ```js
 * import {base} from '@airtable/blocks/base';
 *
 * const table = base.getTableByName('Table 1');
 * const field = table.getFieldByName('Name');
 * console.log('The type of this field is', field.type);
 * ```
 * @docsPath models/Field
 */
class Field extends FieldCore<BaseSdkMode> {
    /** @internal */
    static _className = 'Field';

    /**
     * A list of available aggregators given this field's configuration.
     *
     * @example
     * ```js
     * const fieldAggregators = myField.availableAggregators;
     * ```
     */
    get availableAggregators(): Array<Aggregator> {
        const airtableInterface = this._sdk.__airtableInterface;
        const availableAggregatorKeysSet = new Set(
            airtableInterface.aggregators.getAvailableAggregatorKeysForField(this._data),
        );

        const base = this.parentTable.parentBase;
        return values(base.aggregators).filter(aggregator => {
            return availableAggregatorKeysSet.has(aggregator.key);
        });
    }
    /**
     * Checks if the given aggregator is available for this field.
     *
     * @param aggregator The aggregator object or aggregator key.
     * @example
     * ```js
     * import {base} from '@airtable/blocks/base';
     *
     * const aggregator = base.aggregators.totalAttachmentSize;
     *
     * // Using an aggregator object
     * console.log(myAttachmentField.isAggregatorAvailable(aggregator));
     * // => true
     *
     * // Using an aggregator key
     * console.log(myTextField.isAggregatorAvailable('totalAttachmentSize'));
     * // => false
     * ```
     */
    isAggregatorAvailable(aggregator: Aggregator | AggregatorKey): boolean {
        const aggregatorKey = typeof aggregator === 'string' ? aggregator : aggregator.key;

        const airtableInterface = this._sdk.__airtableInterface;
        const availableAggregatorKeys = airtableInterface.aggregators.getAvailableAggregatorKeysForField(
            this._data,
        );

        return availableAggregatorKeys.some(key => key === aggregatorKey);
    }

    /**
     * Checks whether the current user has permission to perform the given name update.
     *
     * Accepts partial input, in the same format as {@link updateNameAsync}.
     *
     * Returns `{hasPermission: true}` if the current user can update the specified field,
     * `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be
     * used to display an error message to the user.
     *
     * @param name new name for the field
     *
     * @example
     * ```js
     * const updateFieldCheckResult = field.checkPermissionsForUpdateName();
     *
     * if (!updateFieldCheckResult.hasPermission) {
     *     alert(updateFieldCheckResult.reasonDisplayString);
     * }
     * ```
     */
    checkPermissionsForUpdateName(name?: string): PermissionCheckResult {
        return this._sdk.__mutations.checkPermissionsForMutation({
            type: MutationTypes.UPDATE_SINGLE_FIELD_NAME,
            tableId: this.parentTable.id,
            id: this.id,
            name,
        });
    }

    /**
     * An alias for `checkPermissionsForUpdateName(options).hasPermission`.
     *
     * Checks whether the current user has permission to perform the name update.
     *
     * Accepts partial input, in the same format as {@link updateNameAsync}.
     *
     * @param name new name for the field
     *
     * @example
     * ```js
     * const canUpdateField = field.hasPermissionToUpdateName();
     *
     * if (!canUpdateField) {
     *     alert('not allowed!');
     * }
     * ```
     */
    hasPermissionToUpdateName(name?: string): boolean {
        return this.checkPermissionsForUpdateName(name).hasPermission;
    }

    /**
     * Updates the name for this field.
     *
     * Throws an error if the user does not have permission to update the field, or if an invalid
     * name is provided.
     *
     * This action is asynchronous. Unlike updates to cell values, updates to field name are
     * **not** applied optimistically locally. You must `await` the returned promise before
     * relying on the change in your extension.
     *
     * @param name new name for the field
     *
     * @example
     * ```js
     * await myTextField.updateNameAsync('My New Name');
     * ```
     */
    async updateNameAsync(name: string): Promise<void> {
        await this._sdk.__mutations.applyMutationAsync({
            type: MutationTypes.UPDATE_SINGLE_FIELD_NAME,
            tableId: this.parentTable.id,
            id: this.id,
            name,
        });
    }

    /**
     * Checks whether the current user has permission to perform the given description update.
     *
     * Accepts partial input, in the same format as {@link updateDescriptionAsync}.
     *
     * Returns `{hasPermission: true}` if the current user can update the specified field,
     * `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be
     * used to display an error message to the user.
     *
     * @param description new description for the field
     *
     * @example
     * ```js
     * const updateFieldCheckResult = field.checkPermissionsForUpdateDescription();
     *
     * if (!updateFieldCheckResult.hasPermission) {
     *     alert(updateFieldCheckResult.reasonDisplayString);
     * }
     * ```
     */
    checkPermissionsForUpdateDescription(description?: string | null): PermissionCheckResult {
        return this._sdk.__mutations.checkPermissionsForMutation({
            type: MutationTypes.UPDATE_SINGLE_FIELD_DESCRIPTION,
            tableId: this.parentTable.id,
            id: this.id,
            description,
        });
    }

    /**
     * An alias for `checkPermissionsForUpdateDescription(options).hasPermission`.
     *
     * Checks whether the current user has permission to perform the description update.
     *
     * Accepts partial input, in the same format as {@link updateDescriptionAsync}.
     *
     * @param description new description for the field
     *
     * @example
     * ```js
     * const canUpdateField = field.hasPermissionToUpdateDescription();
     *
     * if (!canUpdateField) {
     *     alert('not allowed!');
     * }
     * ```
     */
    hasPermissionToUpdateDescription(description?: string | null): boolean {
        return this.checkPermissionsForUpdateDescription(description).hasPermission;
    }

    /**
     * Updates the description for this field.
     *
     * To remove an existing description, pass `''` as the new description.
     * `null` is also accepted and will be coerced to `''` for consistency with field creation.
     *
     * Throws an error if the user does not have permission to update the field, or if an invalid
     * description is provided.
     *
     * This action is asynchronous. Unlike updates to cell values, updates to field descriptions are
     * **not** applied optimistically locally. You must `await` the returned promise before
     * relying on the change in your extension.
     *
     * @param description new description for the field
     *
     * @example
     * ```js
     * await myTextField.updateDescriptionAsync('This is a text field');
     * ```
     */
    async updateDescriptionAsync(description: string | null): Promise<void> {
        await this._sdk.__mutations.applyMutationAsync({
            type: MutationTypes.UPDATE_SINGLE_FIELD_DESCRIPTION,
            tableId: this.parentTable.id,
            id: this.id,
            description,
        });
    }

    /**
     * Checks whether the current user has permission to perform the given options update.
     *
     * Accepts partial input, in the same format as {@link updateOptionsAsync}.
     *
     * Returns `{hasPermission: true}` if the current user can update the specified field,
     * `{hasPermission: false, reasonDisplayString: string}` otherwise. `reasonDisplayString` may be
     * used to display an error message to the user.
     *
     * @param options new options for the field
     *
     * @example
     * ```js
     * const updateFieldCheckResult = field.checkPermissionsForUpdateOptions();
     *
     * if (!updateFieldCheckResult.hasPermission) {
     *     alert(updateFieldCheckResult.reasonDisplayString);
     * }
     * ```
     */
    checkPermissionsForUpdateOptions(options?: FieldOptions): PermissionCheckResult {
        return this._sdk.__mutations.checkPermissionsForMutation({
            type: MutationTypes.UPDATE_SINGLE_FIELD_CONFIG,
            tableId: this.parentTable.id,
            id: this.id,
            config: {
                type: this.type,
                options: options,
            },
        });
    }

    /**
     * An alias for `checkPermissionsForUpdateOptions(options).hasPermission`.
     *
     * Checks whether the current user has permission to perform the options update.
     *
     * Accepts partial input, in the same format as {@link updateOptionsAsync}.
     *
     * @param options new options for the field
     *
     * @example
     * ```js
     * const canUpdateField = field.hasPermissionToUpdateOptions();
     *
     * if (!canUpdateField) {
     *     alert('not allowed!');
     * }
     * ```
     */
    hasPermissionToUpdateOptions(options?: FieldOptions): boolean {
        return this.checkPermissionsForUpdateOptions(options).hasPermission;
    }

    /**
     * Updates the options for this field.
     *
     * Throws an error if the user does not have permission to update the field, if invalid
     * options are provided, if this field has no writable options, or if updates to this field
     * type is not supported.
     *
     * Refer to {@link FieldType} for supported field types, the write format for options, and
     * other specifics for certain field types.
     *
     * This action is asynchronous. Unlike updates to cell values, updates to field options are
     * **not** applied optimistically locally. You must `await` the returned promise before
     * relying on the change in your extension.
     *
     * Optionally, you can pass an `opts` object as the second argument. See {@link UpdateFieldOptionsOpts}
     * for available options.
     *
     * @param options new options for the field
     * @param opts optional options to affect the behavior of the update
     *
     * @example
     * ```js
     * async function addChoiceToSelectField(selectField, nameForNewOption) {
     *     const updatedOptions = {
     *         choices: [
     *             ...selectField.options.choices,
     *             {name: nameForNewOption},
     *         ]
     *     };
     *
     *     if (selectField.hasPermissionToUpdateOptions(updatedOptions)) {
     *         await selectField.updateOptionsAsync(updatedOptions);
     *     }
     * }
     * ```
     */
    async updateOptionsAsync(
        options: FieldOptions,
        opts: UpdateFieldOptionsOpts = {},
    ): Promise<void> {
        await this._sdk.__mutations.applyMutationAsync({
            type: MutationTypes.UPDATE_SINGLE_FIELD_CONFIG,
            tableId: this.parentTable.id,
            id: this.id,
            config: {
                type: this.type,
                options: options,
            },
            opts,
        });
    }
}

export default Field;
