// @flow
import {css} from 'emotion';
import useTheme from './theme/use_theme';
import {allStylesParser} from './system/index';

// Imitate the Parser type from `@styled-system/core`.
export type StyleParser<T> = {
    (props: T): {},
    config: {+[string]: mixed},
    propNames: Array<string>,
    cache: {},
};

// TODO (jay): look into whether it's possible to pass in AllStylesProps as a default generic
/** @private */
export default function useStyledSystem<T>(
    styleProps: T,
    styleParser: StyleParser<T> = allStylesParser,
): string {
    const theme = useTheme();

    // Add the theme to the style props because that's how the parser expects it.
    const styles = styleParser({...styleProps, theme});

    // At this point `styles` is still an object, we need to turn it into a class name.
    const classNameForStyleProps = css(styles);

    return classNameForStyleProps;
}
