import {loadCSSFromString, colorUtils, colors} from '@airtable/blocks/ui';

import {FONT_FAMILY, FONT_SIZE} from './constants';

const css = `
    .SchemaVisualizer {
        background-color: #F3F2F1;
    }

    .TableRow {
        font-family: ${FONT_FAMILY};
        font-size: ${FONT_SIZE};
        cursor: default;
    }

    .TableBorder {
        stroke-width: 0;
        fill: rgba(0, 0, 0, 0.1);
    }

    .TableRow:not(.TableHeader) {
        fill: #fff;
        stroke-width: 0;
    }

    .TableRow:not(.TableHeader):hover {
        fill: hsl(0, 0%, 91%);
    }

    .TableRow text {
        fill: #000000;
        stroke-width: 0;
        dominant-baseline: central;
    }

    .TableRow.highlighted rect {
        fill: hsl(0, 0%, 91%);
    }

    .TableRow.TableHeader {
        stroke-width: 0;
        font-weight: 600;
    }

    .TableRow.TableHeader text {
        fill: #ffffff;
    }
    
    .TableRow.draggable {
        cursor: grab;
    }

    .Link {
        fill: none;
        stroke: ${colorUtils.getHexForColor(colors.GRAY)};
        stroke-width: 2px;
        stroke-opacity: 0.6;
    }

    .Link.highlighted {
        stroke-width: 4px;
        stroke-opacity: 1;
        stroke-dasharray: 6px;
        stroke-dashoffset: 12px;
        animation: stroke 0.5s linear infinite;
        shape-rendering: geometricPrecision;
    }

    .Link.highlighted.multipleRecordLinks {
        stroke: ${colorUtils.getHexForColor(colors.GRAY_BRIGHT)};
        stroke-dasharray: initial;
    }
    
    .Link.highlighted.formula {
        stroke: ${colorUtils.getHexForColor(colors.BLUE_BRIGHT)};
    }
    
    .Link.highlighted.count {
        stroke: ${colorUtils.getHexForColor(colors.RED_BRIGHT)};        
    }

    .Link.highlighted.multipleLookupValues {
        stroke: ${colorUtils.getHexForColor(colors.ORANGE_BRIGHT)};
    }
    
    .Link.highlighted.rollup {
        stroke: ${colorUtils.getHexForColor(colors.PURPLE_BRIGHT)};
    }

    @keyframes stroke {
        to {
            stroke-dashoffset: 0;
        }
    }
`;

loadCSSFromString(css);
