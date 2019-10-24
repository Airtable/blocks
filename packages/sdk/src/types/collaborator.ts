/** @module @airtable/blocks/models: Base */ /** */

/** */
export type UserId = string;

/** */
export interface CollaboratorData {
    /** */
    id: UserId;
    /** */
    email: string;
    /** */
    name?: string;
    /** */
    profilePicUrl?: string;
}
