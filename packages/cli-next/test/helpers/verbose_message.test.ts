import {test, expect} from '../mocks/test';

import {
    AirtableApiErrorName,
    FindPortErrorName,
    S3ApiErrorName,
    MessageName,
    MessageInfo,
    VerboseMessage,
} from '../../src/helpers/verbose_message';
import {SelectMessage} from '../../src/helpers/render_message';
import {SystemApiKeyErrorName} from '../../src/helpers/system_api_key';
import {AppConfigErrorName} from '../../src/helpers/config_app';
import {RemoteConfigErrorName} from '../../src/helpers/config_remote';
import {UserConfigErrorName} from '../../src/helpers/config_user';
import {
    BLOCK_CONFIG_DIR_NAME,
    BLOCK_FILE_NAME,
    REMOTE_JSON_BASE_FILE_PATH,
    USER_CONFIG_FILE_NAME,
} from '../../src/settings';

type RequiredKeys<T> = {[key in keyof T]: T[key] extends undefined ? never : key}[any];
type OptionalKeys<T> = {[key in keyof T]: T[key] extends undefined ? key : never}[any];
type ExcludeKey<T, K extends keyof T> = {[key in Exclude<RequiredKeys<T>, K>]: T[key]} &
    {[key in Exclude<OptionalKeys<T>, K>]?: T[key]};

describe('verbose_message', function() {
    test.it('at least one test per message type', () => {
        const tests = testMessages();
        const missingTest = Object.values(MessageName).filter(
            type => !tests[type] || tests[type].length === 0,
        );
        expect(missingTest).to.deep.equal([]);
    });

    for (const [type, typeSuite] of Object.entries(testMessages())) {
        for (const info of typeSuite) {
            test.it(`formats ${type}`, () => {
                expect(
                    new VerboseMessage().renderMessage({type: type as any, ...info}),
                ).to.matchSnapshot();
            });
        }
    }
});

function testMessages(): {
    [key in MessageName]: ExcludeKey<SelectMessage<MessageInfo, key>, 'type'>[];
} {
    return {
        [AirtableApiErrorName.AIRTABLE_API_BASE_NOT_FOUND]: [{}],
        [AirtableApiErrorName.AIRTABLE_API_ERROR_STATUS_AND_MESSAGES]: [
            {status: 400, errors: []},
            {
                status: 400,
                errors: [{code: 'SOMETHING_WRONG', message: 'Something went wrong.'}],
            },
        ],
        [AirtableApiErrorName.AIRTABLE_API_MULTIPLE_ERRORS]: [
            {errors: []},
            {
                errors: [
                    {type: AirtableApiErrorName.AIRTABLE_API_WITH_INVALID_API_KEY},
                    {
                        type: AirtableApiErrorName.AIRTABLE_API_UNEXPECTED_ERROR,
                        serverMessage: 'Something went wrong.',
                    },
                ],
            },
        ],
        [AirtableApiErrorName.AIRTABLE_API_UNSUPPORTED_BLOCKS_CLI_VERSION]: [
            {serverMessage: 'Please update @airtable/blocks-cli.'},
        ],
        [AirtableApiErrorName.AIRTABLE_API_WITH_INVALID_API_KEY]: [{}],
        [AirtableApiErrorName.AIRTABLE_API_UNEXPECTED_ERROR]: [
            {serverMessage: 'Something went wrong.'},
        ],

        [AppConfigErrorName.APP_CONFIG_IS_NOT_VALID]: [
            {message: 'should be a non-null object'},
            {file: `../${BLOCK_FILE_NAME}`, message: 'should be a non-null object'},
        ],

        [FindPortErrorName.FIND_PORT_ASYNC_PORT_IS_NOT_NUMBER]: [{port: 'asdf'}],

        [RemoteConfigErrorName.REMOTE_CONFIG_IS_NOT_VALID]: [
            {message: 'should be a non-null object'},
            {
                file: `../${BLOCK_CONFIG_DIR_NAME}/${REMOTE_JSON_BASE_FILE_PATH}`,
                message: 'should be a non-null object',
            },
        ],

        [S3ApiErrorName.S3_API_BUNDLE_TOO_LARGE]: [{}],
        [S3ApiErrorName.S3_API_FAILED]: [{}],

        [SystemApiKeyErrorName.SYSTEM_API_KEY_NOT_FOUND]: [{}],

        [UserConfigErrorName.USER_CONFIG_IS_NOT_VALID]: [
            {message: 'should be a non-null object'},
            {
                file: `../../../.config/${USER_CONFIG_FILE_NAME}`,
                message: 'should be a non-null object',
            },
        ],
    };
}
