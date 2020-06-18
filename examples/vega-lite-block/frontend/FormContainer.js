import React, {Fragment} from 'react';
import {Box} from '@airtable/blocks/ui';
import BannerBar from './BannerBar';
import SettingsForm from './SettingsForm';
import {BANNER_BAR_BOX_HEIGHT} from './constants';

/**
 * FormContainer   Display wrapper.
 * @param {object} props
 */
export default function FormContainer(props) {
    const {isSettingsOpen, width} = props;
    const height = props.height - BANNER_BAR_BOX_HEIGHT;
    const settingsFormProps = {
        ...props,
        height,
    };

    return isSettingsOpen ? (
        <Fragment>
            <Box
                position="absolute"
                display="flex"
                borderRight="thick"
                flexDirection="column"
                justifyContent="center"
                overflow="hidden"
                width={width}
                height={height}
                top={0}
                left={0}
                bottom={0}
            >
                <SettingsForm {...settingsFormProps} />
            </Box>
            <Box
                position="absolute"
                bottom={0}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                borderTop="thick"
                borderRight="thick"
                backgroundColor="grayLight2"
                width={width}
                height={BANNER_BAR_BOX_HEIGHT}
            >
                <BannerBar />
            </Box>
        </Fragment>
    ) : null;
}
