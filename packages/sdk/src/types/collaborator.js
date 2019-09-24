// @flow
export type UserId = string;

export const CollaboratorStatuses = Object.freeze({
    FORMER: 'former',
    INVITED: 'invited',
    CURRENT: 'current',
});
export type CollaboratorStatus = $Values<typeof CollaboratorStatuses>;

export type CollaboratorData = {
    id: UserId,
    email: string,
    name?: string,
    profilePicUrl?: string,
    status: CollaboratorStatus,
};
