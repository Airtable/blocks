// The following module simulates a Blocks context by injecting a definition of
// the AirtableInterface.
import './testing/inject_mock_airtable_interface';

import Sdk from './sdk';
import {SdkContext} from './ui/sdk_context';
import MockAirtableInterface, {FixtureData} from './testing/mock_airtable_interface_external';
import {Mutation} from './types/mutations';
import {invariant} from './error_utils';

export const SdkProvider = SdkContext.Provider;

export const createSdkFromFixtureData = (fixtureData: FixtureData): Sdk => {
    const mockAirtableInterface = new MockAirtableInterface(fixtureData);
    return new Sdk(mockAirtableInterface);
};

export const watchMutations = (sdk: Sdk, fn: (mutation: Mutation) => void) => {
    const {__airtableInterface} = sdk;
    invariant(
        __airtableInterface instanceof MockAirtableInterface,
        'SDK instance must use a mock version of AirtableInterface',
    );
    __airtableInterface.on('mutation', fn);
};

export const unwatchMutations = (sdk: Sdk, fn: (mutation: Mutation) => void) => {
    const {__airtableInterface} = sdk;
    invariant(
        __airtableInterface instanceof MockAirtableInterface,
        'SDK instance must use a mock version of AirtableInterface',
    );
    __airtableInterface.off('mutation', fn);
};
