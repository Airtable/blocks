import fs from 'fs';
import {expect} from '@oclif/test';
import {test} from '../mocks/test';
import {System} from '../../src/helpers/system';
import {spawnUnexpectedError} from '../../src/helpers/error_utils';
import * as systemExtra from '../../src/helpers/system_extra';

const isFulfilledAsync = async (promise: Promise<any>): Promise<boolean> => {
    const immediateValue = {};
    const result = await Promise.race([promise, Promise.resolve(immediateValue)]);

    return result !== immediateValue;
};

describe('system_extra', () => {
    describe('dirExistsAsync', () => {
        const {dirExistsAsync} = systemExtra;

        test.it('identifies existing directories', async ({system}) => {
            expect(await dirExistsAsync(system, '/home')).equal(true);
            expect(await dirExistsAsync(system, '/home/projects')).equal(true);
            expect(await dirExistsAsync(system, '/home/projects/my-app')).equal(true);
        });

        test.it('identifies non-existent directories', async ({system}) => {
            expect(await dirExistsAsync(system, '/bowling-alley')).equal(false);
        });

        test.withFiles({'/home/gremlins.txt': Buffer.from('!!!')})
            .do(({system}: {system: System}) => dirExistsAsync(system, '/home/gremlins.txt'))
            .it('returns false if given a path to a file');
    });

    describe('watchFileAsync', () => {
        const {watchFileAsync} = systemExtra;
        const wfaTest = test.withFiles({'/subject.txt': Buffer.from('hello')});
        const disableOsChangeNotifications = (system: System) => {
            system.fs.watch = () => {
                throw spawnUnexpectedError('This simulated system is incapable of watching files');
            };
        };
        const triggerReadTimeUpdate = async (path: string) => {
            const readPromise = new Promise<void>(resolve => {
                fs.watchFile(path, {persistent: false, interval: 100}, function listener() {
                    fs.unwatchFile(path, listener);
                    resolve();
                });
            });

            while (!(await isFulfilledAsync(readPromise))) {
                const {atime, mtime} = fs.statSync(path);
                fs.utimesSync(path, new Date(atime.getTime() + 1), mtime);
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        };

        wfaTest.it('does not resolve immediately', async ({system}) => {
            const {whenModified} = await watchFileAsync(system, '/subject.txt');
            expect(await isFulfilledAsync(whenModified)).equal(false);
        });

        wfaTest.it('reacts to file modification', async ({system}) => {
            const {whenModified} = await watchFileAsync(system, '/subject.txt');
            await Promise.all([whenModified, system.fs.writeFileAsync('/subject.txt', 'goodbye')]);
        });

        wfaTest.it(
            'does not react to file modification with identical content',
            async ({system}) => {
                const {whenModified} = await watchFileAsync(system, '/subject.txt');
                await system.fs.writeFileAsync('/subject.txt', 'hello');
                expect(await isFulfilledAsync(whenModified)).equal(false);
            },
        );

        wfaTest
            .prepareFixture('task_resolve_local')
            .it('does not react to file access', async ({realSystem: system, tmpPath}) => {
                const subjectPath = system.path.join(tmpPath, 'block.json');

                const {whenModified} = await watchFileAsync(system, subjectPath);

                await triggerReadTimeUpdate(subjectPath);

                expect(await isFulfilledAsync(whenModified)).equal(false);
            });

        wfaTest.it('reacts to file deletion', async ({system}) => {
            const {whenModified} = await watchFileAsync(system, '/subject.txt');

            await Promise.all([whenModified, system.fs.unlinkAsync('/subject.txt')]);
        });

        wfaTest.it(
            'reacts to file modification when system cannot monitor files',
            async ({system}) => {
                const {whenModified} = await watchFileAsync(system, '/subject.txt');
                disableOsChangeNotifications(system);

                await Promise.all([
                    whenModified,
                    system.fs.writeFileAsync('/subject.txt', 'goodbye'),
                ]);
            },
        );

        wfaTest.it(
            'does not react to file modification with identical content when system cannot monitor files',
            async ({system}) => {
                disableOsChangeNotifications(system);
                const {whenModified} = await watchFileAsync(system, '/subject.txt');
                await system.fs.writeFileAsync('/subject.txt', 'hello');
                expect(await isFulfilledAsync(whenModified)).equal(false);
            },
        );

        wfaTest
            .prepareFixture('task_resolve_local')
            .it(
                'does not react to file access when system cannot monitor files',
                async ({realSystem: system, tmpPath}) => {
                    disableOsChangeNotifications(system);
                    const subjectPath = system.path.join(tmpPath, 'block.json');

                    const {whenModified} = await watchFileAsync(system, subjectPath);

                    await triggerReadTimeUpdate(subjectPath);

                    expect(await isFulfilledAsync(whenModified)).equal(false);
                },
            );

        wfaTest
            .prepareFixture('task_resolve_local')
            .it(
                'reacts to file deletion when system cannot monitor files',
                async ({realSystem: system, tmpPath}) => {
                    disableOsChangeNotifications(system);
                    const subjectPath = system.path.join(tmpPath, 'block.json');
                    const {whenModified} = await watchFileAsync(system, subjectPath);

                    await Promise.all([whenModified, system.fs.unlinkAsync(subjectPath)]);
                },
            );
    });
});
