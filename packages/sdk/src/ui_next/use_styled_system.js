// @flow
import {css} from 'emotion';
import useTheme from './theme/use_theme';

type Parser<T> = {
    (props: T): {},
    config: {+[string]: mixed},
    propNames: Array<string>,
    cache: {},
};

/** @private */
export default function useStyledSystem<T>(styleProps: T, parser: Parser<T>): string {
    const theme = useTheme();

    const styles = parser({...styleProps, theme});

    const classNameForStyleProps = css(styles);

    return classNameForStyleProps;
}
