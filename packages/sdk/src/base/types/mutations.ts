/** @module @airtable/blocks: mutations */ /** */
import {ObjectValues} from '../../shared/private_utils';
import {TableId, FieldId, ViewId} from '../../shared/types/hyper_ids';
import {
    MutationTypesCore,
    MutationCore,
    PartialMutationCore,
} from '../../shared/types/mutations_core';
import {FieldTypeConfig} from '../../shared/types/airtable_interface_core';
import {NormalizedViewMetadata} from './airtable_interface';

/** @hidden */
export const MutationTypes = Object.freeze({
    ...MutationTypesCore,
    CREATE_SINGLE_FIELD: 'createSingleField' as const,
    UPDATE_SINGLE_FIELD_CONFIG: 'updateSingleFieldConfig' as const,
    UPDATE_SINGLE_FIELD_DESCRIPTION: 'updateSingleFieldDescription' as const,
    UPDATE_SINGLE_FIELD_NAME: 'updateSingleFieldName' as const,
    CREATE_SINGLE_TABLE: 'createSingleTable' as const,
    UPDATE_VIEW_METADATA: 'updateViewMetadata' as const,
});

/** @hidden */
export type MutationType = ObjectValues<typeof MutationTypes>;

/**
 * The Mutation emitted when the App creates a {@link Field}.
 *
 * @docsPath testing/mutations/CreateSingleFieldMutation
 */
export interface CreateSingleFieldMutation {
    /** This Mutation's [discriminant property](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) */
    readonly type: typeof MutationTypes.CREATE_SINGLE_FIELD;
    /** The identifier for the Table in which a Field is being created */
    readonly tableId: TableId;
    /** The identifier for the Field being created */
    readonly id: FieldId;
    /** The name of the Field being created */
    readonly name: string;
    /** The configuration for the Field being created */
    readonly config: FieldTypeConfig;
    /** The description for the Field being created */
    readonly description: string | null;
}

/** @hidden */
export interface PartialCreateSingleFieldMutation {
    readonly type: typeof MutationTypes.CREATE_SINGLE_FIELD;
    readonly tableId: TableId | undefined;
    readonly id: FieldId | undefined;
    readonly name: string | undefined;
    readonly config: FieldTypeConfig | undefined;
    readonly description: string | null | undefined;
}

/**
 * The Mutation emitted when the App modifies the options of a {@link Field}.
 *
 * @docsPath testing/mutations/UpdateSingleFieldConfigMutation
 */

export interface UpdateSingleFieldConfigMutation {
    /** This Mutation's [discriminant property](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) */
    readonly type: typeof MutationTypes.UPDATE_SINGLE_FIELD_CONFIG;
    /** The identifier for the Table in which a Field is being modified */
    readonly tableId: TableId;
    /** The identifier for the Field being modified */
    readonly id: FieldId;
    /** The new configuration for the Field being modified */
    readonly config: FieldTypeConfig;
    /** Optional options to affect the behavior of the update */
    readonly opts?: UpdateFieldOptionsOpts;
}

/** @hidden */
export interface PartialUpdateSingleFieldConfigMutation {
    readonly type: typeof MutationTypes.UPDATE_SINGLE_FIELD_CONFIG;
    readonly tableId: TableId | undefined;
    readonly id: FieldId | undefined;
    readonly config: FieldTypeConfig | undefined;
    readonly opts?: UpdateFieldOptionsOpts | undefined;
}

/**
 * The Mutation emitted when the App modifies the description of a {@link Field}.
 *
 * @docsPath testing/mutations/UpdateSingleFieldDescriptionMutation
 */
export interface UpdateSingleFieldDescriptionMutation {
    /** This Mutation's [discriminant property](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) */
    readonly type: typeof MutationTypes.UPDATE_SINGLE_FIELD_DESCRIPTION;
    /** The identifier for the Table in which a Field is being modified */
    readonly tableId: TableId;
    /** The identifier for the Field being modified */
    readonly id: FieldId;
    /** The new description for the Field being created */
    readonly description: string | null;
}

/** @hidden */
export interface PartialUpdateSingleFieldDescriptionMutation {
    readonly type: typeof MutationTypes.UPDATE_SINGLE_FIELD_DESCRIPTION;
    readonly tableId: TableId | undefined;
    readonly id: FieldId | undefined;
    readonly description: string | null | undefined;
}

/**
 * The Mutation emitted when the App modifies the name of a {@link Field}.
 *
 * @docsPath testing/mutations/UpdateSingleFieldNameMutation
 */
export interface UpdateSingleFieldNameMutation {
    /** This Mutation's [discriminant property](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) */
    readonly type: typeof MutationTypes.UPDATE_SINGLE_FIELD_NAME;
    /** The identifier for the Table in which a Field is being modified */
    readonly tableId: TableId;
    /** The identifier for the Field being modified */
    readonly id: FieldId;
    /** The new name for the Field being updated */
    readonly name: string;
}

/** @hidden */
export interface PartialUpdateSingleFieldNameMutation {
    readonly type: typeof MutationTypes.UPDATE_SINGLE_FIELD_NAME;
    readonly tableId: TableId | undefined;
    readonly id: FieldId | undefined;
    readonly name: string | undefined;
}

/**
 * Options that affect the behavior of an `UpdateSingleFieldConfigMutation`
 */
export interface UpdateFieldOptionsOpts {
    /**
     * Allowing select field choices to be deleted  is dangerous since any
     * records which use that choice will lose their cell value. By default,
     * calling `updateOptionsAsync` on a select field only allows choices to be
     *  added or modified. Passing this option will allow choices to be deleted.
     */
    enableSelectFieldChoiceDeletion?: boolean;
}

/**
 * The Mutation emitted when the App creates a {@link Table}
 *
 * @docsPath testing/mutations/CreateSingleTableMutation
 */
export interface CreateSingleTableMutation {
    /** This Mutation's [discriminant property](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) */
    readonly type: typeof MutationTypes.CREATE_SINGLE_TABLE;
    /** The identifier for the Table being created */
    readonly id: TableId;
    /** The name of the Table being created */
    readonly name: string;
    /** The Fields that are being created within the new Table */
    readonly fields: ReadonlyArray<{
        name: string;
        config: FieldTypeConfig;
        description: string | null;
    }>;
}

/** @hidden */
export interface PartialCreateSingleTableMutation {
    readonly type: typeof MutationTypes.CREATE_SINGLE_TABLE;
    readonly id: TableId | undefined;
    readonly name: string | undefined;
    readonly fields:
        | ReadonlyArray<{
              name: string | undefined;
              config: FieldTypeConfig | undefined;
              description: string | null | undefined;
          }>
        | undefined;
}

/**
 * The Mutation emitted when the App modifies a {@link View}.
 *
 * @docsPath testing/mutations/UpdateViewMetadataMutation
 */
export interface UpdateViewMetadataMutation {
    /** This Mutation's [discriminant property](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) */
    readonly type: typeof MutationTypes.UPDATE_VIEW_METADATA;
    /** The identifier for the Table in which a View is being modified */
    readonly tableId: TableId;
    /** The identifier for the View being modified */
    readonly viewId: ViewId;
    /** The metadata for the View being modified */
    readonly metadata: NormalizedViewMetadata;
}

/** @hidden */
export interface PartialUpdateViewMetadataMutation {
    readonly type: typeof MutationTypes.UPDATE_VIEW_METADATA;
    readonly tableId: TableId | undefined;
    readonly viewId: ViewId | undefined;
    readonly metadata: NormalizedViewMetadata | undefined;
}

/** @hidden */
export type Mutation =
    | MutationCore
    | CreateSingleFieldMutation
    | UpdateSingleFieldConfigMutation
    | UpdateSingleFieldDescriptionMutation
    | UpdateSingleFieldNameMutation
    | CreateSingleTableMutation
    | UpdateViewMetadataMutation;

/** @hidden */
export type PartialMutation =
    | PartialMutationCore
    | PartialCreateSingleFieldMutation
    | PartialUpdateSingleFieldConfigMutation
    | PartialUpdateSingleFieldDescriptionMutation
    | PartialUpdateSingleFieldNameMutation
    | PartialCreateSingleTableMutation
    | PartialUpdateViewMetadataMutation;
