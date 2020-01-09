import {entries} from '../../src/private_utils';

const categories = {
    Appearance: ['backgroundColor', 'boxShadow', 'opacity'],
    Border: [
        'border',
        'borderRadius',
        'borderWidth',
        'borderStyle',
        'borderColor',
        'borderTop',
        'borderRight',
        'borderBottom',
        'borderLeft',
    ],
    Dimensions: ['height', 'minHeight', 'maxHeight', 'width', 'minWidth', 'maxWidth'],
    ['Flex container']: [
        'alignContent',
        'alignItems',
        'flexDirection',
        'flexWrap',
        'justifyContent',
        'justifyItems',
    ],
    ['Flex item']: [
        'alignSelf',
        'flexBasis',
        'flexGrow',
        'flexShrink',
        'flex',
        'justifySelf',
        'order',
    ],
    Position: ['bottom', 'left', 'position', 'right', 'top', 'zIndex'],
    Margin: [
        'margin',
        'marginX',
        'marginY',
        'marginTop',
        'marginRight',
        'marginBottom',
        'marginLeft',
    ],
    Padding: [
        'padding',
        'paddingX',
        'paddingY',
        'paddingTop',
        'paddingRight',
        'paddingBottom',
        'paddingLeft',
    ],
    Typography: [
        'fontFamily',
        'fontSize',
        'fontStyle',
        'fontWeight',
        'letterSpacing',
        'lineHeight',
        'textAlign',
        'textColor',
        'textDecoration',
        'textTransform',
    ],
    Other: ['display', 'overflow', 'overflowY', 'overflowX'],
};

// Using the categories above, create a map with key = style prop name, value = category name
let categoriesByStyleProp: {[styleProp: string]: string};
for (const [category, styleProps] of entries(categories)) {
    styleProps.forEach(styleProp => (categoriesByStyleProp[styleProp] = category));
}

/**
 * Given a list of style prop names, map each to its corresponding category and return
 * a map of style props grouped by category name.
 * e.g.
 * input: ['alignContent', 'justifyItems', 'fontSize']
 * output: {
 *     'Flex container': ['alignContent', 'justifyItems'],
 *     'Typography': ['fontSize'],
 * }
 */
export default function categorizeStyleProps(
    styleProps: Array<string>,
): {[category: string]: Array<string>} {
    const result: {[category: string]: Array<string>} = {};
    styleProps.forEach(styleProp => {
        const category = categoriesByStyleProp[styleProp];
        if (!result[category]) {
            result[category] = [];
        }
        result[category].push(styleProp);
    });
    return result;
}
