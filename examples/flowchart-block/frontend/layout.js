import workerize from 'workerize';
import {colorUtils} from '@airtable/blocks/ui';

import {LinkStyle, ChartOrientation, RecordShape} from './settings';

const DEBUG_OUTPUT = false; // Set to true to log layout source string to console
let worker;

const workerString = `
    // Run viz.js in a worker to avoid blocking the main thread.
    self.importScripts('https://unpkg.com/viz.js@2.1.2/viz.js', 'https://unpkg.com/viz.js@2.1.2/full.render.js');

    let viz;

    function restart() {
        viz = new Viz();
        viz.renderString('digraph {}', {
            format: 'svg',
            engine: 'dot',
        }).catch(() => {});
    }

    restart();

    export function layout(source) {
        return new Promise((resolve, reject) => {
            let timeoutTimer = setTimeout(() => {
                restart();
                reject(new Error('timeout'));
            }, 10000);

            return viz.renderString(source, {
                format: 'svg',
                engine: 'dot',
            }).then(resolve).catch(err => {
                clearTimeout(timeoutTimer);
                restart();
                reject(err);
            });
        });
    }
`;

/**
 * Creates a string representation of the graph based on the passed in settings
 * Uses the viz worker to convert this string to an svg
 * See https://www.graphviz.org/documentation/ for more details.
 * @param settings
 * @returns {Promise<string>} The returned promise should resolve to an svg
 */
export function createLayout(settings) {
    if (!worker) {
        worker = workerize(workerString);
    }
    const {chartOrientation, linkStyle, recordShape, queryResult, field} = settings;
    let source = 'digraph {\n\t';
    source += 'bgcolor=transparent\n\t';
    source += 'pad=0.25\n\t';
    source += 'nodesep=0.75\n\t';

    if (chartOrientation === ChartOrientation.HORIZONTAL) {
        source += 'rankdir=LR\n\t';
    }

    switch (linkStyle) {
        case LinkStyle.STRAIGHT_LINES:
            source += 'splines=line\n\n\t';
            break;
        case LinkStyle.CURVED_LINES:
            source += 'splines=curved\n\n\t';
            break;
        case LinkStyle.RIGHT_ANGLES:
        default:
            source += 'splines=ortho\n\n\t';
            break;
    }

    source += 'node [\n\t\t';
    switch (recordShape) {
        case RecordShape.ELLIPSE:
            source += 'shape=ellipse\n\t\t';
            break;
        case RecordShape.CIRCLE:
            source += 'shape=circle\n\t\t';
            break;
        case RecordShape.DIAMOND:
            source += 'shape=diamond\n\t\t';
            break;
        case RecordShape.ROUNDED:
        case RecordShape.RECTANGLE:
        default:
            source += 'shape=rect\n\t\t';
            break;
    }
    source += `style="filled${recordShape === RecordShape.ROUNDED ? ',rounded' : ''}"\n\t\t`;
    source += 'fontname=Helvetica\n\t';
    source += ']\n\n\t';

    const nodes = [];
    const edges = [];
    for (const record of queryResult.records) {
        if (record.isDeleted) {
            continue;
        }
        const recordColor = queryResult.getRecordColor(record);
        const shouldUseLightText = record
            ? colorUtils.shouldUseLightTextOnColor(recordColor)
            : false;
        nodes.push(
            `${record.id} [id="${record.id}" label="${record.primaryCellValueAsString}" 
            tooltip="${record.primaryCellValueAsString}" 
            fontcolor="${shouldUseLightText ? 'white' : 'black'}" 
            fillcolor="${recordColor ? colorUtils.getHexForColor(recordColor) : 'white'}"]`,
        );

        const linkedRecordCellValues = record.getCellValue(field.id) || [];
        for (const linkedRecordCellValue of linkedRecordCellValues) {
            // The record might be in the cell value but not in the query result when it is deleted
            const linkedRecord = queryResult.getRecordByIdIfExists(linkedRecordCellValue.id);
            if (!linkedRecord || linkedRecord.isDeleted) {
                continue;
            }
            edges.push(
                `${record.id} -> ${linkedRecord.id} [id="${record.id}->${linkedRecord.id}"]`,
            );
        }
    }

    source += nodes.join('\n\t');
    source += '\n\n\t';
    source += edges.join('\n\t');
    source += '\n}';

    if (DEBUG_OUTPUT) {
        console.log(source);
    }
    return worker.layout(source);
}
