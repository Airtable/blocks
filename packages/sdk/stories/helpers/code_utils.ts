import {has} from '../../src/shared/private_utils';

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
export function createJsxPropsStringFromValuesMap(
    values: {[key: string]: string | boolean | number | null},
    mappingConfig?: {
        [key: string]: (
            value: string | boolean | number | null,
        ) => string | boolean | null | number;
    },
): string {
    const output = [];
    for (const valueKey of Object.keys(values)) {
        let value;
        if (mappingConfig && has(mappingConfig, valueKey)) {
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
            case 'number': {
                output.push(`${valueKey}={${value}}`);
                break;
            }
            case 'boolean': {
                if (value === true) {
                    output.push(`${valueKey}={${value}}`);
                }
                break;
            }

            default:
                // eslint-disable-next-line @airtable/blocks/no-throw-new
                throw new Error('Unsupported value type');
        }
    }

    return output.join(' ');
}

export function createJsxComponentString(
    name: string,
    props: Array<string>,
    children?: string | null,
): string {
    const propsAsString = props.join(' ');
    if (children) {
        return `<${name} ${propsAsString}>${children}</${name}>`;
    }
    return `<${name} ${propsAsString} />`;
}

export const CONTROL_WIDTH = '320px';
