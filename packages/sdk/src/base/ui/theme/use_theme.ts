import {useContext} from 'react';
import ThemeContext from './theme_context';
const useTheme = () => useContext(ThemeContext);
export default useTheme;
