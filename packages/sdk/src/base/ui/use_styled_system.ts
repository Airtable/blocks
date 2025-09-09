import {css} from 'emotion';
import {type styleFn} from '@styled-system/core';
import useTheme from './theme/use_theme';
import {allStylesParser, type AllStylesProps} from './system/index';

/** @internal */
export default function useStyledSystem<T = AllStylesProps>(
    styleProps: T,
    styleParser: styleFn = allStylesParser,
): string {
    const theme = useTheme();

    const styles = styleParser({...styleProps, theme});

    const classNameForStyleProps = css(styles);

    return classNameForStyleProps;
}
