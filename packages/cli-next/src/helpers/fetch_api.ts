import fetch, {Response, RequestInit} from 'node-fetch';

export {Response};

export type FetchInit = {url: string; body?: any} & Omit<RequestInit, 'body'>;

export abstract class FetchApi {
    protected abstract _invariantOkResponseAsync(
        init: FetchInit,
        response: Response,
    ): Promise<void>;

    protected async _fetchAsync(fullInit: FetchInit) {
        const {url = '', body: _body, ...init} = fullInit;
        const body =
            typeof _body === 'object' && !Buffer.isBuffer(_body) ? JSON.stringify(_body) : _body;

        const response = await fetch(url, {
            ...init,
            body,
        });
        await this._invariantOkResponseAsync(fullInit, response);

        return response;
    }

    protected async fetchJsonAsync(init: FetchInit) {
        return await (await this._fetchAsync(init)).json();
    }

    protected async fetchVoidAsync(init: FetchInit) {
        await (await this._fetchAsync(init)).arrayBuffer();
    }
}
