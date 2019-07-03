// @flow

export type AttachmentId = string;

export type AttachmentData = {|
    id: AttachmentId,
    url: string,
    filename: string,
    s3Key?: string,
    size?: number,
    type?: string,
    width?: number,
    height?: number,
    smallThumbUrl?: string,
    smallThumbWidth?: number,
    smallThumbHeight?: number,
    largeThumbUrl?: string,
    largeThumbWidth?: number,
    largeThumbHeight?: number,
    fullThumbUrl?: string,
    fullThumbWidth?: number,
    fullThumbHeight?: number,
    mediumThumbUrl?: string,
|};
