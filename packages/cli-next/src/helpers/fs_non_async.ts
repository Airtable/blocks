import * as originalFs from 'fs';

export interface NonAsyncFs {
    unwatchFile: typeof originalFs['unwatchFile'];
    watch: typeof originalFs['watch'];
    watchFile: typeof originalFs['watchFile'];
}

export default {
    unwatchFile: originalFs.unwatchFile,
    watch: originalFs.watch,
    watchFile: originalFs.watchFile,
};
