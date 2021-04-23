import {Sdk} from '@airtable/blocks/unstable_testing_utils';
import semver from 'semver';
import './inject_mock_airtable_interface';
import {invariant} from './error_utils';

export {default} from './test_driver';
export {MutationTypes} from '@airtable/blocks/unstable_testing_utils';

invariant(
    semver.satisfies(Sdk.VERSION, global.COMPATIBLE_SDK_VERSIONS),
    'Version %s of the blocks-testing library does not support version %s of the Blocks SDK library.',
    global.PACKAGE_VERSION,
    Sdk.VERSION,
);
