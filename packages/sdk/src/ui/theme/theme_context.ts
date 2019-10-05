import {createContext} from 'react';
import defaultTheme from './default_theme/';

type ThemeSpec = typeof defaultTheme;

const ThemeContext = createContext<ThemeSpec>(defaultTheme);
export default ThemeContext;
