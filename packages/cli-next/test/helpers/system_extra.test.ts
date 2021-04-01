import {expect} from '@oclif/test';
import {test} from '../mocks/test';
import {System} from '../../src/helpers/system';
import * as systemExtra from '../../src/helpers/system_extra';

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

        test.withFiles({'/home/gremlins': Buffer.from('!!!')})
            .do(({system}: {system: System}) => dirExistsAsync(system, '/home/gremlins'))
            .catch(/ENOTDIR/)
            .it('fails in the presence of files');
    });
});
