import {entries} from '../../src/shared/private_utils';
import {
    backgroundColor,
    boxShadow,
    opacity,
    borderRadius,
    border,
    dimensionsSet,
    flexContainerSet,
    flexItemSet,
    positionSet,
    margin,
    padding,
    typographySet,
    display,
    overflow,
} from '../../src/base/ui/system';

const categories = {
    Appearance: [
        ...backgroundColor.propNames!,
        ...borderRadius.propNames!,
        ...boxShadow.propNames!,
        ...opacity.propNames!,
    ],
    Border: border.propNames!,
    Dimensions: dimensionsSet.propNames!,
    'Flex container': flexContainerSet.propNames!,
    'Flex item': flexItemSet.propNames!,
    Position: positionSet.propNames!,
    Margin: margin.propNames!,
    Padding: padding.propNames!,
    Typography: typographySet.propNames!,
    Other: [...display.propNames!, ...overflow.propNames!],
};

let categoriesByStyleProp: {[styleProp: string]: string} = {};
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
