import {createContext, useContext} from 'react';

export const FormFieldIdContext = createContext<string>('');

/**
 * Returns the ID for a control (eg input, select, etc.) inside of a `FormField`.
 *
 * @internal
 */
export default function useFormFieldId(): string {
    return useContext(FormFieldIdContext);
}
