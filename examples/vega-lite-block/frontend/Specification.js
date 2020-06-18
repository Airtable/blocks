import findNominalFieldName from './findNominalFieldName';
import schema from './schema/v4.json';
import visitor from './visitor';

const DefaultSpecification = Object.freeze({
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    title: '',
    width: 'container',
    height: 'container',
    mark: 'bar',
    encoding: null,
});

const DefaultChannelDefinitionX = Object.freeze({
    field: null,
    type: 'nominal',
});

const DefaultChannelDefinitionY = Object.freeze({
    aggregate: 'count',
    type: 'quantitative',
});

/**
 * Specification
 *
 * @return {Object}     Specification instances are actually plain objects to
 *                      ensure that they can be saved in globalConfig
 */
export default class Specification {
    constructor(table) {
        Object.assign(this, DefaultSpecification, {
            encoding: {
                x: {...DefaultChannelDefinitionX},
                y: {...DefaultChannelDefinitionY},
            },
        });

        if (table) {
            const field = findNominalFieldName(table);
            const x = field ? {...DefaultChannelDefinitionX, field} : {};
            const encoding = {
                ...this.encoding,
                x,
            };

            Object.assign(this, {
                title: table.name,
                encoding,
            });
        }
        // This explicit return allows new Specification()
        // objects to be stored in globalConfig
        return Specification.normalize(this);
    }
    /**
     * normalize converts a Specification instance into a plain object
     * to make it safe for storage in globalConfig
     * @param  {Specification} spec A Specification instance object
     * @return {Object}             A plain object
     */
    static normalize(spec) {
        return Object.assign({}, spec);
    }
}

visitor(schema, (object, key, value) => {
    // This is required for monaco to correctly display vega-lite/v4.json's
    // markdown formatted descriptions.
    //
    // See:
    //
    // - https://github.com/microsoft/monaco-editor/issues/885
    // - https://github.com/vega/editor/commit/6ea5c005c6a0099a096dd3352e3877c2d72268be#diff-1dbb8e80b4b056c30e8258166878038fR4
    //
    //
    if (key === 'description') {
        object.markdownDescription = object.description;
    }

    // The following conditions serve to prevent the validator treating
    // our specifications as invalid for not having the required `"data": "..."`
    // key/value pair.
    //
    // "required": ["data", "x, "y", "z"] => "required": ["x, "y", "z"]
    //
    if (key === 'required') {
        if (Array.isArray(value) && value.includes('data')) {
            value.splice(value.indexOf('data'), 1);
        }
    }
});

export const schemas = [
    {
        schema,
        uri: DefaultSpecification.$schema,
    },
];
