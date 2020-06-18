import React, {Fragment} from 'react';
import {Box, FormField, TablePickerSynced, ViewPickerSynced} from '@airtable/blocks/ui';
import {ConfigKeys, ConfigKeysLabels} from './settings';
import SpecificationEditor from './SpecificationEditor';
import {DATA_SOURCE_FORM_HEIGHT, CANNOT_SHOW_SPEC_EDITOR} from './constants';

function SettingsForm(props) {
    const {
        code,
        settings: {table},
    } = props.validatedSettings;

    const canShowSpecificationEditor = !(CANNOT_SHOW_SPEC_EDITOR & code);
    const specificationEditorProps = {
        ...props,
        height: props.height - DATA_SOURCE_FORM_HEIGHT,
    };
    return (
        <Fragment>
            <Box display="flex" flex="auto" padding={2}>
                <FormField label={ConfigKeysLabels[ConfigKeys.TABLE_ID]}>
                    <TablePickerSynced globalConfigKey={ConfigKeys.TABLE_ID} />
                </FormField>
                {table ? (
                    <FormField label={ConfigKeysLabels[ConfigKeys.VIEW_ID]} marginLeft={2}>
                        <ViewPickerSynced
                            globalConfigKey={[
                                ConfigKeys.SPECIFICATIONS,
                                table.id,
                                ConfigKeys.VIEW_ID,
                            ]}
                            shouldAllowPickingNone={true}
                            table={table}
                        />
                    </FormField>
                ) : null}
            </Box>
            {canShowSpecificationEditor ? (
                <SpecificationEditor {...specificationEditorProps} />
            ) : null}
        </Fragment>
    );
}

export default SettingsForm;
