import React from 'react';
import {Box, Button, Heading, SwitchSynced} from '@airtable/blocks/ui';
import {FieldType} from '@airtable/blocks/models';
import PropTypes from 'prop-types';

import FullscreenBox from './FullscreenBox';
import {ConfigKeys} from './settings';

/**
 * Settings form component.
 * Allows the user to toggle link types.
 *
 * @param {Function} props.setShouldShowSettings Function to toggle settings visibility
 */
export default function SettingsForm({setShouldShowSettings}) {
    return (
        <FullscreenBox
            left="initial" // show settings in right sidebar
            width="360px"
            backgroundColor="white"
            display="flex"
            flexDirection="column"
            borderLeft="thick"
        >
            <Box flex="auto" display="flex" justifyContent="center" overflow="auto">
                <Box paddingTop={4} paddingBottom={2} maxWidth={300} flex="auto">
                    <Heading marginBottom={2}>Settings</Heading>
                    <SwitchSynced
                        marginY={3}
                        label="Show linked record relationships"
                        globalConfigKey={[
                            ConfigKeys.ENABLED_LINKS_BY_TYPE,
                            FieldType.MULTIPLE_RECORD_LINKS,
                        ]}
                    />
                    <SwitchSynced
                        marginY={3}
                        label="Show formula relationships"
                        globalConfigKey={[ConfigKeys.ENABLED_LINKS_BY_TYPE, FieldType.FORMULA]}
                    />
                    <SwitchSynced
                        marginY={3}
                        label="Show rollup relationships"
                        globalConfigKey={[ConfigKeys.ENABLED_LINKS_BY_TYPE, FieldType.ROLLUP]}
                    />
                    <SwitchSynced
                        marginY={3}
                        label="Show lookup relationships"
                        globalConfigKey={[
                            ConfigKeys.ENABLED_LINKS_BY_TYPE,
                            FieldType.MULTIPLE_LOOKUP_VALUES,
                        ]}
                    />
                    <SwitchSynced
                        marginY={3}
                        label="Show count relationships"
                        globalConfigKey={[ConfigKeys.ENABLED_LINKS_BY_TYPE, FieldType.COUNT]}
                    />
                </Box>
            </Box>
            <Box
                flex="none"
                borderTop="thick"
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
            >
                <Button
                    margin={3}
                    variant="primary"
                    size="large"
                    onClick={() => setShouldShowSettings(false)}
                >
                    Done
                </Button>
            </Box>
        </FullscreenBox>
    );
}

SettingsForm.propTypes = {
    setShouldShowSettings: PropTypes.func.isRequired,
};
