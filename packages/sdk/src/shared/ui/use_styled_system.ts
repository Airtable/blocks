import {css} from 'emotion';
import {styleFn} from '@styled-system/core';
import useTheme from './theme/use_theme';
import {allStylesParser, AllStylesProps} from './system/index';

/** @internal */
export default function useStyledSystem<T = AllStylesProps>(
    styleProps: T,
    styleParser: styleFn = allStylesParser,
): string {
    const theme = useTheme();

    // Add the theme to the style props because that's how the parser expects it.
    const styles = styleParser({...styleProps, theme});

    // At this point `styles` is still an object, we need to turn it into a class name.
    const classNameForStyleProps = css(styles);

    return classNameForStyleProps;
}
