import {Color} from '../../shared/colors';
import useTheme from './theme/use_theme';

/** @internal */
export default function useTextColorForBackgroundColor(backgroundColor: Color): string {
    const {textColorsByBackgroundColor} = useTheme();
    return textColorsByBackgroundColor[backgroundColor];
}
