/**
 * Helper function to turn an object keyed by prop name into JSX properties.
 *
 * ```
 * valuesAsJsxProps({ size: 'large', disabled: true }) => `size="large" disabled="true"`
 * ```
 *
 * False boolean values are ignored:
 *
 * ```
 * valuesAsJsxProps({ disabled: false }) => ``
 * ```
 *
 * Provide a `mappingConfig` object to map certain keys:
 *
 * ```
 * valuesAsJsxProps(
 *     { icon: true },
 *     {
 *         icon: value => (value ? 'edit' : null)
 *     }
 * ) => `icon="edit"`
 * ```
 */
export default function valuesAsJsxProps(
    values: {[key: string]: unknown},
    mappingConfig?: {[key: string]: (value: unknown) => string | boolean | null},
): string {
    const output = [];
    for (const valueKey of Object.keys(values)) {
        let value;
        if (mappingConfig && mappingConfig.hasOwnProperty(valueKey)) {
            value = mappingConfig[valueKey](values[valueKey]);
        } else {
            value = values[valueKey];
        }

        if (value === null) {
            continue;
        }

        switch (typeof value) {
            case 'string': {
                if (value !== 'default') {
                    output.push(`${valueKey}="${value}"`);
                }
                break;
            }
            case 'boolean': {
                if (value === true) {
                    output.push(`${valueKey}={${value}}`);
                }
                break;
            }

            default:
                throw new Error('Unsupported value type');
        }
    }

    return output.join(' ');
}
