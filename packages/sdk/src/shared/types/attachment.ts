import {AttachmentId} from './hyper_ids';

/** @hidden */
export interface AttachmentData {
    id: AttachmentId;
    url: string;
    filename: string;
    size?: number;
    type?: string;
    thumbnails?: {
        small?: {
            url: string;
            width: number;
            height: number;
        };
        large?: {
            url: string;
            width: number;
            height: number;
        };
        full?: {
            url: string;
            width: number;
            height: number;
        };
    };
}
