import * as originalFs from 'fs';

import * as fs from 'graceful-fs';

export type StreamFS = Pick<typeof originalFs, 'createReadStream' | 'createWriteStream'>;

export function streamify(streamFs: StreamFS): StreamFS {
    return {
        createReadStream: streamFs.createReadStream.bind(streamFs),
        createWriteStream: streamFs.createWriteStream.bind(streamFs),
    };
}

export default streamify(fs);
