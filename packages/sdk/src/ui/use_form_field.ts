import {createContext, useContext} from 'react';

/** @internal */
interface FormFieldContextValue {
    controlId: string;
    descriptionId: string;
}

export const FormFieldContext = createContext<FormFieldContextValue | null>(null);

/**
 * Returns the ID for a control (eg input, select, etc.) inside of a `FormField`.
 *
 * @internal
 */
export default function useFormField(): FormFieldContextValue | null {
    return useContext(FormFieldContext);
}
