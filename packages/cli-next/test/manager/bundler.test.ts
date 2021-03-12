import {expect} from '@oclif/test';
import {resolveBundlerModuleAsync} from '../../src/manager/bundler';
import {test} from '../mocks/test';

describe('bundler manager', () => {
    test.prepareFixture('task_resolve_local').it(
        'resolve local bundler module',
        async ({realSystem: sys, tmpPath}) => {
            const bundlerPath = await resolveBundlerModuleAsync(sys, {
                module: './bundler',
                workingdir: tmpPath,
            });
            expect(bundlerPath).to.not.match(/bundler\.\w+$/);
            expect(bundlerPath).to.match(/index\.js$/);
        },
    );

    test.prepareFixture('task_resolve_node_module').it(
        'resolve node_modules bundler module',
        async ({realSystem: sys, tmpPath}) => {
            const bundlerPath = await resolveBundlerModuleAsync(sys, {
                module: '@airtable/block-cli-swap',
                workingdir: tmpPath,
            });
            expect(bundlerPath).to.not.match(/bundler\.\w+$/);
            expect(bundlerPath).to.match(/index\.js$/);
        },
    );
});
