import React, {Fragment, useState} from 'react';
import {Box, Heading, Dialog, Text, TextButton} from '@airtable/blocks/ui';
import ExternalLink from './ExternalLink';

const URL_GOOGLE_CLOUD_PRICING = 'https://cloud.google.com/maps-platform/pricing';
const URL_MAPS_TOS =
    'https://cloud.google.com/maps-platform/terms/maps-service-terms#3.-geocoding-api';
const URL_MAPS_FAQ_USAGE = 'https://developers.google.com/maps/faq#usage_cap';

const body = (
    <Fragment>
        <Text size="default" paddingBottom={3}>
            This API key is used for two things: to display the map, and to geocode locations for
            display on the map. These use the Google Dynamic Maps and Google Geocoding APIs. You
            will be charged by Google if you exceed the free monthly usage credit. You can see more
            details about pricing <ExternalLink href={URL_GOOGLE_CLOUD_PRICING}>here</ExternalLink>.
        </Text>
        <Text size="default" paddingBottom={3}>
            The Google Dynamic Maps API is used whenever someone views the map.
        </Text>
        <Text size="default" paddingBottom={3}>
            The Google Geocoding API is used whenever a location is added or changed, or when the
            geocode cache field is changed or cleared. Additionally, these requests must be repeated
            every 30 days per{' '}
            <ExternalLink href={URL_MAPS_TOS}>Google&apos;s Terms of Service</ExternalLink>.
        </Text>
        <Text size="default" paddingBottom={3}>
            See <ExternalLink href={URL_MAPS_FAQ_USAGE}>this article</ExternalLink> for how to set
            usage caps and budget alerts for your Google API usage.
        </Text>
    </Fragment>
);

const title = 'What is this API key used for?';

const APIKeyInformationDialog = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const modalProps = {
        onClose() {
            setIsDialogOpen(false);
        },
        maxWidth: '500px',
        height: 'auto',
        padding: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    return (
        <Fragment>
            <TextButton style={{fontSize: 'inherit'}} onClick={() => setIsDialogOpen(true)}>
                {title}
            </TextButton>

            {isDialogOpen && (
                <Dialog {...modalProps}>
                    <Dialog.CloseButton />
                    <Box flex="auto" overflow="auto" padding={3}>
                        <Heading paddingBottom={3}>{title}</Heading>

                        {body}
                    </Box>
                </Dialog>
            )}
        </Fragment>
    );
};

export default React.forwardRef(APIKeyInformationDialog);
