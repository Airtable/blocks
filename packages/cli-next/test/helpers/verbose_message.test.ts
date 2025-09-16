import chalk from 'chalk';

import {test, expect} from '../mocks/test';

import {
    AirtableApiErrorName,
    AppConfigErrorName,
    BlockIdentifierErrorName,
    BuildErrorName,
    DevelopmentRunFrameMessageName,
    FindPortErrorName,
    InitCommandErrorName,
    InitCommandMessageName,
    MessageInfo,
    MessageName,
    ReleaseCommandErrorName,
    ReleaseCommandMessageName,
    RemoteCommandErrorName,
    RemoteCommandMessageName,
    RemoteConfigErrorName,
    RunCommandMessageName,
    S3ApiErrorName,
    SubmitCommandErrorName,
    SubmitCommandMessageName,
    SystemApiKeyErrorName,
    SystemConfigErrorName,
    SystemExtraErrorName,
    UserConfigErrorName,
    VerboseMessage,
} from '../../src/helpers/verbose_message';
import {SelectMessage} from '../../src/helpers/render_message';
import {
    BLOCK_CONFIG_DIR_NAME,
    BLOCK_FILE_NAME,
    INIT_DEFAULT_TEMPLATE_URL,
    REMOTE_JSON_BASE_FILE_PATH,
    USER_CONFIG_FILE_NAME,
} from '../../src/settings';

describe('verbose_message', function () {
    test.it('at least one test per message type', () => {
        const tests = testMessages();
        const missingTest = Object.values(MessageName).filter(
            (type) => !tests[type] || tests[type].length === 0,
        );
        expect(missingTest).to.deep.equal([]);
    });

    for (const [type, typeSuite] of Object.entries(testMessages())) {
        for (const info of typeSuite) {
            test.it(`formats ${type}`, () => {
                expect(
                    new VerboseMessage({chalk: new chalk.Instance({level: 3})}).renderMessage({
                        type: type as any,
                        ...info,
                    }),
                ).to.matchSnapshot();
            });
        }
    }
});

function testMessages(): {
    [key in MessageName]: Omit<SelectMessage<MessageInfo, key>, 'type'>[];
} {
    return {
        [AirtableApiErrorName.AIRTABLE_API_BLOCK_NOT_FOUND]: [{}],
        [AirtableApiErrorName.AIRTABLE_API_ERROR_STATUS_AND_MESSAGES]: [
            {status: 400, errors: []},
            {
                status: 400,
                errors: [{code: 'SOMETHING_WRONG', message: 'Something went wrong.'}],
            },
        ],
        [AirtableApiErrorName.AIRTABLE_API_KEY_MALFORMED]: [{}],
        [AirtableApiErrorName.AIRTABLE_API_KEY_NAME_INVALID]: [
            {name: 'a taxi cab covered in waffles'},
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

        [BlockIdentifierErrorName.BLOCK_IDENTIFIER_INVALID_BASE_ID]: [{}],
        [BlockIdentifierErrorName.BLOCK_IDENTIFIER_INVALID_BLOCK_ID]: [{}],
        [BlockIdentifierErrorName.BLOCK_IDENTIFIER_INVALID_FORMAT]: [{}],

        [BuildErrorName.BUILD_APP_CONFIG_MODIFIED]: [{}],
        [BuildErrorName.BUILD_BLOCK_DIRECTORY_NOT_FOUND]: [{}],

        [DevelopmentRunFrameMessageName.DEVELOPMENT_RUN_FRAME_NEW_BLOCK_INSTALLATION]: [{}],
        [DevelopmentRunFrameMessageName.DEVELOPMENT_RUN_FRAME_ORIGINAL_BASE_ONLY]: [{}],
        [DevelopmentRunFrameMessageName.DEVELOPMENT_RUN_FRAME_ORIGINAL_BLOCK_ONLY]: [{}],

        [FindPortErrorName.FIND_PORT_ASYNC_PORT_IS_NOT_NUMBER]: [{port: 'asdf'}],

        [InitCommandErrorName.INIT_COMMAND_DIRECTORY_EXISTS]: [
            {
                blockDirPath: 'my-app',
            },
        ],
        [InitCommandErrorName.INIT_COMMAND_INSTALLED_SDK_NO_VERSION]: [{}],
        [InitCommandErrorName.INIT_COMMAND_TEMPLATE_MISSING]: [
            {
                template: INIT_DEFAULT_TEMPLATE_URL,
            },
        ],
        [InitCommandErrorName.INIT_COMMAND_TEMPLATE_NO_BLOCK_JSON]: [
            {
                template: INIT_DEFAULT_TEMPLATE_URL,
            },
        ],
        [InitCommandErrorName.INIT_COMMAND_UNKNOWN_ERROR]: [{}],
        [InitCommandMessageName.INIT_COMMAND_READY]: [
            {
                blockDirPath: 'my-app',
                platform: 'win32',
            },
            {
                blockDirPath: 'my-app',
                platform: 'darwin',
            },
            {
                blockDirPath: 'my-app',
                platform: 'linux',
            },
        ],

        [ReleaseCommandErrorName.RELEASE_COMMAND_BLOCK1_COMMENT_UNSUPPORTED]: [{}],
        [ReleaseCommandMessageName.RELEASE_COMMAND_DEVELOPER_COMMENT_PROMPT]: [{}],

        [RemoteCommandErrorName.REMOTE_COMMAND_CONFIG_EXISTS]: [{remoteName: 'newremote'}],
        [RemoteCommandErrorName.REMOTE_COMMAND_CONFIG_MISSING]: [{remoteName: 'oldremote'}],
        [RemoteCommandErrorName.REMOTE_COMMAND_NO_CONFIGS]: [{}],
        [RemoteCommandMessageName.REMOTE_COMMAND_ADDED_NEW]: [
            {remoteFile: '.block/newremote.remote.json'},
            {remoteFile: '../.block/newremote.remote.json'},
        ],
        [RemoteCommandMessageName.REMOTE_COMMAND_BETA_WARNING]: [{}],
        [RemoteCommandMessageName.REMOTE_COMMAND_REMOVED_EXISTING]: [
            {remoteFile: '.block/oldremote.remote.json'},
            {remoteFile: '../.block/oldremote.remote.json'},
        ],

        [RemoteConfigErrorName.REMOTE_CONFIG_IS_NOT_VALID]: [
            {message: 'should be a non-null object'},
            {
                file: `../${BLOCK_CONFIG_DIR_NAME}/${REMOTE_JSON_BASE_FILE_PATH}`,
                message: 'should be a non-null object',
            },
        ],

        [RunCommandMessageName.RUN_COMMAND_INSTALLING_LOCAL_SDK]: [
            {
                sdkPath: 'path',
            },
        ],
        [S3ApiErrorName.S3_API_BUNDLE_TOO_LARGE]: [{}],
        [S3ApiErrorName.S3_API_FAILED]: [{}],

        [SubmitCommandErrorName.SUBMIT_COMMAND_WINDOWS_MULTIPLE_DISKS]: [{}],
        [SubmitCommandMessageName.SUBMIT_COMMAND_PACKAGED_CONTINUE_PROMPT]: [{}],
        [SubmitCommandMessageName.SUBMIT_COMMAND_STOP_AFTER_PACKAGING]: [{}],

        [SystemApiKeyErrorName.SYSTEM_API_KEY_NOT_FOUND]: [{}],

        [SystemConfigErrorName.SYSTEM_CONFIG_INVALID_REMOTE_NAME]: [{name: '@remotename'}],
        [SystemConfigErrorName.SYSTEM_CONFIG_APP_DIRECTORY_NOT_FOUND]: [{}],

        [SystemExtraErrorName.SYSTEM_EXTRA_DIR_WITH_FILE_NOT_FOUND]: [{file: 'block.json'}],

        [UserConfigErrorName.USER_CONFIG_IS_NOT_VALID]: [
            {message: 'should be a non-null object'},
            {
                file: `../../../.config/${USER_CONFIG_FILE_NAME}`,
                message: 'should be a non-null object',
            },
        ],
    };
}
