import React from 'react';
import {VegaLite} from 'react-vega';
import {useRecords, useViewport} from '@airtable/blocks/ui';
import {reduceRecords} from './data';

function hasUsableInlineData(spec) {
    return spec && spec.data && !spec.data.url;
}
/**
 * ChartRenderer   Combine data and specification to produce a
 *                 rendered Vega-Lite data visualization.
 * @param {object} options.validatedSettings
 */
function ChartRenderer({validatedSettings}) {
    const viewport = useViewport();
    const {
        settings: {specification, table, view},
    } = validatedSettings;

    const records = useRecords(view || table);
    const spec = JSON.parse(specification);
    const hasData = hasUsableInlineData(spec);
    const inlineData = hasData && spec.data;
    const values = !hasData && reduceRecords(table, records);
    const data = inlineData ? {...inlineData} : {values};

    // This tells <VegaLite> which key of the "data"
    // object below (props) will contain the records to use.
    spec.data = {
        name: 'values',
    };

    const style = {
        width: '100%',
        height: '100%',
    };

    // Special display tweaking when the rendered chart is seen in Grid view.
    if (!viewport.isFullscreen) {
        style.width = `calc(100% - 30px)`;
        style.height = `calc(100% - 20px)`;
    }

    const props = {
        actions: {
            compiled: false,
            editor: false,
            source: false,
        },
        data,
        loader: {
            // This forces vega to open urls in a new tab
            target: '_blank',
        },
        spec,
        style,
    };

    return <VegaLite {...props} />;
}

export default ChartRenderer;
