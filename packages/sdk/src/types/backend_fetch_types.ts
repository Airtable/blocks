/** @hidden **/
export interface RequestJson {
    method: string;
    url: string;
    headers: Array<[string, string]>;
    body: string | null;
    redirect: 'error' | 'manual';
    integrity: string | null;
}

/** @hidden **/
export interface ResponseJson {
    body: string;
    url: string;
    status: number;
    headers: Array<[string, string]>;
}
