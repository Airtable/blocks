/** @module @airtable/blocks/models: Base */ /** */
import {type UserId} from './hyper_ids';

/**
 * An object representing a collaborator. You should not create these objects from scratch, but
 * should instead grab them from base data.
 */
export interface CollaboratorData {
    /** The user ID of the collaborator. */
    id: UserId;
    /** The email address of the collaborator. */
    email: string;
    /** The name of the collaborator. */
    name?: string;
    /** The URL of the collaborator's profile picture. */
    profilePicUrl?: string;
}
