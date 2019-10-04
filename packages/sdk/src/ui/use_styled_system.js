// @flow
import {css} from 'emotion';
import useTheme from './theme/use_theme';
import {allStylesParser} from './system/index';

export type StyleParser<T> = {
    (props: T): {},
    config: {+[string]: mixed},
    propNames: Array<string>,
    cache: {},
};

/** @private */
export default function useStyledSystem<T>(
    styleProps: T,
    styleParser: StyleParser<T> = allStylesParser,
): string {
    const theme = useTheme();

    const styles = styleParser({...styleProps, theme});

    const classNameForStyleProps = css(styles);

    return classNameForStyleProps;
}
