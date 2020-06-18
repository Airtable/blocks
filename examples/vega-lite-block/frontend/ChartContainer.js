import React, {Suspense} from 'react';
import {Box, Loader} from '@airtable/blocks/ui';
import ChartRenderer from './ChartRenderer';
import ErrorRenderer from './ErrorRenderer';
import {CANNOT_SHOW_EDITOR_OR_CHART} from './constants';

export default function ChartContainer(props) {
    const {
        errors: monacoErrors,
        height,
        width,
        validatedSettings: {code, errors: validationErrors},
    } = props;

    // Merge the errors that came directly from the spec editor
    // with the errors that came from data validation.
    const errors = [...monacoErrors, ...validationErrors];
    const errorProps = {
        ...props,
        errors,
    };
    const canShowChart = !(CANNOT_SHOW_EDITOR_OR_CHART & code) && !errors.length;
    const fallback = <Loader />;
    return (
        <Box
            position="absolute"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            overflow="hidden"
            padding={2}
            width={width}
            height={height}
            top={0}
            right={0}
            bottom={0}
        >
            {canShowChart ? (
                <Suspense fallback={fallback}>
                    <ChartRenderer {...props} />
                </Suspense>
            ) : (
                <ErrorRenderer {...errorProps} />
            )}
        </Box>
    );
}
