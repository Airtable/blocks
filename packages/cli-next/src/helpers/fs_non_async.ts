import * as originalFs from 'fs';

export interface NonAsyncFs {
    existsSync: typeof originalFs['existsSync'];
    unwatchFile: typeof originalFs['unwatchFile'];
    watch: typeof originalFs['watch'];
    watchFile: typeof originalFs['watchFile'];
}

export default {
    existsSync: originalFs.existsSync,
    unwatchFile: originalFs.unwatchFile,
    watch: originalFs.watch,
    watchFile: originalFs.watchFile,
};
