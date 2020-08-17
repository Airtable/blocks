import {
    colors,
    Box,
    Button,
    FormField,
    Heading,
    Input,
    Link,
    Text,
    TextButton,
} from '@airtable/blocks/ui';
import React, {Fragment, useState} from 'react';
import {ConfigKeys} from './useSettingsStore';
import FullscreenBox from './FullscreenBox';
import SettingsStatus, {severityColorCode} from './SettingsStatus';
import StreetViewImage from './StreetViewImage';

const instructionsOrderedListProps = {
    style: {
        listStyle: 'none',
        paddingInlineStart: '0',
    },
};

const instructionsViewListItemNumberProps = {
    size: 'xlarge',
    style: {
        '-webkit-box-pack': 'center',
        '-webkit-box-align': 'center',
        alignItems: 'center',
        backgroundColor: severityColorCode(1),
        borderRadius: '50%',
        boxSizing: 'border-box',
        color: '#fff',
        display: 'flex',
        fontSize: '1rem',
        fontWeight: '500',
        height: '1.5rem',
        justifyContent: 'center',
        lineHeight: '1.5rem',
        marginRight: '.5rem',
        textAlign: 'left',
        width: '1.5rem',
    },
};

const InstructionsViewListItem = ({step, title, children}) => {
    console.log(step);

    return (
        <li>
            <Box display="flex" flex="none">
                <Text {...instructionsViewListItemNumberProps}>{step}</Text>
                <Text size="xlarge">{title}</Text>
            </Box>
            <Box display="flex" flex="none" marginTop={2} paddingLeft={4}>
                <Text size="large" variant="paragraph">
                    {children}
                </Text>
            </Box>
        </li>
    );
};

const InstructionsViewOrderedList = ({children}) => {
    return (
        <ol {...instructionsOrderedListProps}>
            {React.Children.toArray(children).map((child, i) =>
                React.cloneElement(child, {
                    step: i + 1,
                }),
            )}
        </ol>
    );
};

/**
 * @param {object} props
 * @param {import('./useSettingsStore').SettingsStore} props.settings
 */
export default function InstructionsView({settings}) {
    /**
     *  1) Welcome
     *  2) Reuse?
     *  3) Use your existing key
     *  4) Setup a new key
     *
     * All views include the banner image at the top, the form input at the bottom,
     * and the Done button panel.
     */
    const [instructionView, setInstructionView] = useState(1);
    const [apiKey, setApiKey] = useState('');

    const {
        validated: {severity, errorKey},
    } = settings;

    const xxlargeHeadingProps = {
        paddingBottom: 3,
        size: 'xxlarge',
        style: {
            marginBottom: '0',
        },
    };

    const borderColor = [severityColorCode(0), severityColorCode(1), severityColorCode(2)][
        severity
    ];

    const errorStyle = {
        border: `2px solid ${borderColor}`,
    };

    const startOverButton = (
        <TextButton style={{fontSize: 'inherit'}} onClick={() => setInstructionView(1)}>
            start over
        </TextButton>
    );

    const settingsStatusProps = {
        settings,
        showReason: false,
    };

    const doneButtonProps = {
        size: 'large',
        variant: 'primary',
        disabled: instructionView > 1 && apiKey.length < 10,
        onClick: () => {
            if (instructionView !== 1) {
                settings.googleApiKey = apiKey;
            } else {
                setInstructionView(2);
            }
        },
    };

    const doneButton = (
        <Button {...doneButtonProps}>{instructionView !== 1 ? 'Done' : 'Get started'}</Button>
    );

    return (
        <FullscreenBox display="flex" flexDirection="column">
            <Box backgroundColor={colors.PURPLE_BRIGHT} padding={3}>
                <StreetViewImage />
            </Box>
            <Box flex="auto" overflow="auto" padding={3}>
                {instructionView === 1 ? (
                    <Fragment>
                        <Heading {...xxlargeHeadingProps}>Welcome to Street View</Heading>
                        <Heading textColor="light">
                            See where your records take you in the world with Google Maps Street
                            View.
                        </Heading>
                    </Fragment>
                ) : null}

                {instructionView === 2 ? (
                    <Fragment>
                        <Heading paddingBottom={3}>Use your existing key</Heading>
                        <Text size="xlarge">
                            If you&apos;ve set up a map or street view block before, you may reuse
                            the same API key. If not, you&apos;ll need to{' '}
                            <TextButton size="xlarge" onClick={() => setInstructionView(3)}>
                                setup a new key
                            </TextButton>
                            , or {startOverButton}.
                        </Text>
                    </Fragment>
                ) : null}

                {instructionView === 3 ? (
                    <Fragment>
                        <Heading paddingBottom={3}>Setup a new key</Heading>
                        <Text size="xlarge">
                            Follow the steps below to set up a Google Maps API key, or{' '}
                            {startOverButton}.
                        </Text>
                        <InstructionsViewOrderedList>
                            <InstructionsViewListItem title="Create a Google Cloud project">
                                Go to the{' '}
                                <Link
                                    href="https://console.cloud.google.com/"
                                    rel="noopener noreferrer"
                                    size="large"
                                    target="_blank"
                                >
                                    Google Cloud Platform Console
                                </Link>{' '}
                                and create a new project. You may also use an existing project that
                                you own.
                            </InstructionsViewListItem>
                            <InstructionsViewListItem title="Enable billing for your project">
                                On the{' '}
                                <Link
                                    href="https://console.cloud.google.com/billing"
                                    rel="noopener noreferrer"
                                    size="large"
                                    target="_blank"
                                >
                                    Google Cloud Platform Billing page
                                </Link>
                                , add a payment method for your project. You will only be charged if
                                you exceed the daily limits for requests.
                            </InstructionsViewListItem>
                            <InstructionsViewListItem title="Enable the Google Maps Javascript and Geocoding APIs">
                                Go to the{' '}
                                <Link
                                    href="https://console.cloud.google.com/apis/library/maps-backend.googleapis.com"
                                    rel="noopener noreferrer"
                                    size="large"
                                    target="_blank"
                                >
                                    Google Maps API
                                </Link>{' '}
                                and add it to your project. Repeat this for the{' '}
                                <Link
                                    href="https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com"
                                    rel="noopener noreferrer"
                                    size="large"
                                    target="_blank"
                                >
                                    Google Maps Geocoding API
                                </Link>
                                .
                            </InstructionsViewListItem>
                            <InstructionsViewListItem title="Create a Google API key">
                                On the Credentials page, create an API key and paste it below:
                            </InstructionsViewListItem>
                        </InstructionsViewOrderedList>
                    </Fragment>
                ) : null}
                <Box flex="auto" overflow="auto" padding={3}>
                    {instructionView !== 1 ? (
                        <FormField label="Google API key">
                            <Input
                                autoFocus
                                value={apiKey}
                                style={errorKey === ConfigKeys.API_KEY ? errorStyle : {}}
                                onChange={({target}) => {
                                    setApiKey(target.value);
                                }}
                            />

                            <Text textColor="light" size="small">
                                Note: the API key will be visible to all collaborators.
                            </Text>
                        </FormField>
                    ) : null}
                </Box>
            </Box>
            <Box borderTop="thick" display="flex" flex="none" padding={3}>
                <Box
                    flex="auto"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    paddingRight={2}
                >
                    {instructionView !== 1 ? <SettingsStatus {...settingsStatusProps} /> : null}
                </Box>

                {doneButton}
            </Box>
        </FullscreenBox>
    );
}
