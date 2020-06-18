import React from 'react';
import {colorUtils, colors, Box, Icon} from '@airtable/blocks/ui';

function ErrorBox({children}) {
    return (
        <Box display="flex" alignItems="center">
            {children}
        </Box>
    );
}
/**
 * ErrorDisplay
 * @param  {object | React Element | string} error
 *                   Can be either a React Element, or string from settings
 *                   validation or a Monaco error object that will be made
 *                   into a React Element.
 * @return {React Element}
 */
function ErrorDisplay({error}) {
    if (!error) {
        return null;
    }

    if (typeof error === 'string' || React.isValidElement(error)) {
        return <ErrorBox>{error}</ErrorBox>;
    }

    const {message, startLineNumber, startColumn} = error;

    return (
        <ErrorBox>
            Line {startLineNumber}, column {startColumn} : {message}
        </ErrorBox>
    );
}

/**
 * ErrorRenderer   Render any errors that have been encountered
 * @param {object} props
 */
function ErrorRenderer(props) {
    const {
        errors,
        height,
        width,
        validatedSettings: {message},
    } = props;

    // Error display priority:
    //
    //  1. Monaco editor, in "errors"
    //  2. Data validation, in "errors"
    //  3. Settings validation, as "message"
    //
    const error = <ErrorDisplay error={errors.length ? errors[0] : message} />;
    if (!error) {
        return null;
    }
    const fillColor = colorUtils.getHexForColor(colors.ORANGE);
    return (
        <Box
            position="absolute"
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            width={width}
            height={height}
            padding={4}
            top={0}
            right={0}
            bottom={0}
            left={0}
        >
            <Icon name="warning" size={20} marginRight={2} marginBottom={2} fillColor={fillColor} />
            {error}
        </Box>
    );
}

export default ErrorRenderer;
