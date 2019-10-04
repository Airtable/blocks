// @flow
import {createContext} from 'react';
import defaultTheme from './default_theme/';

// eslint-disable-next-line no-unused-vars
type ThemeSpec = typeof defaultTheme;

const ThemeContext = createContext/* :: <ThemeSpec> */(defaultTheme);
export default ThemeContext;
