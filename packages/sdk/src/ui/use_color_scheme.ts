/** @module @airtable/blocks/ui: useColorScheme */ /** */
import {useState, useEffect} from 'react';

/**
 * A hook for checking whether Airtable is in light mode or dark mode.
 *
 * @returns An object with a `colorScheme` property, which can be `'light'` or `'dark'`.
 *
 * @example
 * ```js
 * import {useColorScheme} from '@airtable/blocks/ui';
 *
 * function MyApp() {
 *     const {colorScheme} = useColorScheme();
 *     return (
 *         <div style={colorScheme === 'dark' ?
 *             {color: 'white', backgroundColor: 'black'} :
 *             {color: 'black', backgroundColor: 'white'}
 *         }>
 *             Tada!
 *         </div>
 *     );
 * }
 * ```
 * @docsPath UI/hooks/useColorScheme
 * @hook
 */

export function useColorScheme(): {colorScheme: 'light' | 'dark'} {
    const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    );

    useEffect(() => {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const darkModeListener = (e: MediaQueryListEvent) => {
            setColorScheme(e.matches ? 'dark' : 'light');
        };

        darkModeQuery.addEventListener('change', darkModeListener);
        return () => {
            darkModeQuery.removeEventListener('change', darkModeListener);
        };
    }, []);

    return {colorScheme};
}
