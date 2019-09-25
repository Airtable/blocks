// @flow
import {type Color} from '../colors';
import useTheme from './theme/use_theme';

/** @private */
export default function useTextColorForBackgroundColor(backgroundColor: Color): string {
    const {textColorsByBackgroundColor} = useTheme();
    return textColorsByBackgroundColor[backgroundColor];
}
