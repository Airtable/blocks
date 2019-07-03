// @flow
export type UserId = string;

export type CollaboratorStatus = 'former' | 'invited' | 'current';

export type CollaboratorData = {
    id: UserId,
    email: string,
    name?: string,
    profilePicUrl?: string,
    status: CollaboratorStatus,
};
