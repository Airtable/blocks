import {mkdirpAsync} from '../../src/helpers/system_extra';
import {createSystem, System} from '../../src/helpers/system';

import {mapFancyTestAsyncPlugin} from './FancyTestAsync';

async function cleanRecursivelyAsync(sys: System, path: string) {
    try {
        for (const name of await sys.fs.readdirAsync(path)) {
            await cleanRecursivelyAsync(sys, sys.path.join(path, name));
        }
    } catch (err) {
        if (err.code === 'ENOTDIR') {
            await sys.fs.unlinkAsync(path);
        }
    }
}

async function copyRecursivelyAsync(sys: System, src: string, dest: string) {
    try {
        const names = await sys.fs.readdirAsync(src);
        await mkdirpAsync(sys, dest);
        for (const name of names) {
            await copyRecursivelyAsync(sys, sys.path.join(src, name), sys.path.join(dest, name));
        }
    } catch (err) {
        if (err.code === 'ENOTDIR') {
            await sys.fs.writeFileAsync(dest, await sys.fs.readFileAsync(src));
        }
    }
}

export function prepareFixtureTempCopy(fixtureName: string, tempName: string = fixtureName) {
    return mapFancyTestAsyncPlugin({
        async runAsync(ctx: {realSystem: System; fixtureName: string; tmpPath: string}) {
            if (!ctx.realSystem) {
                ctx.realSystem = createSystem();
            }

            const sys = ctx.realSystem;

            const fixtureHome = sys.path.join(__dirname, '..', 'fixtures');
            const fixturePath = sys.path.join(fixtureHome, fixtureName);
            const tempRoot = sys.path.join(__dirname, '..', '..', '.test-tmp');
            const tempPath = sys.path.join(tempRoot, tempName);

            await mkdirpAsync(sys, tempPath);
            await cleanRecursivelyAsync(sys, tempPath);
            await copyRecursivelyAsync(sys, fixturePath, tempPath);

            ctx.fixtureName = tempName;
            ctx.tmpPath = tempPath;
        },
    });
}

export function wroteFilesInFixture() {}
