import * as ts from 'typescript';
import {
    ConverterTypeComponent,
    TypeNodeConverter,
    Component,
} from 'typedoc/dist/lib/converter/components';
import {Context} from 'typedoc/dist/lib/converter';
import {UnionType} from 'typedoc/dist/lib/models';


@Component({name: 'EnumFormattingPlugin'})
class EnumFormattingPlugin extends ConverterTypeComponent
    implements TypeNodeConverter<ts.UnionType, ts.TypeReferenceNode> {
    /**
     * The priority this converter should be executed with.
     * A higher priority means the converter will be applied earlier.
     * The highest built-in converter has a priority of 100. 200 ensures this will run before any
     * other.
     */
    priority = 200;

    /**
     * Test whether the given node and type definitions represent an EnumType<> type alias.
     *
     * Returns true when the given node and type look like an EnumType<>, otherwise false.
     *
     * @param context The context object describing the current state the converter is in.
     * @param node The node that should be tested.
     * @param type The type of the node that should be tested.
     */
    supportsNode(context: Context, node: ts.TypeReferenceNode, type: ts.UnionType): boolean {
        return (
            node.kind === ts.SyntaxKind.TypeReference &&
            node.typeName.kind === ts.SyntaxKind.Identifier &&
            (node.typeName.text === 'EnumType' || node.typeName.text === 'ObjectValues') &&
            type.isUnion()
        );
    }

    /**
     * Create a reflection for the given EnumType node.
     *
     * Use [[isTypeAlias]] beforehand to test whether a given type/node combination is
     * pointing to a type alias.
     *
     * Returns a typedoc type to be included in the documentation.
     *
     * @param node The typescript node whose type should be reflected.
     * @param type The typescript type whose type should be reflected.
     */
    convertNode(context: Context, node: ts.TypeReferenceNode, type: ts.UnionType): UnionType {
        const types = this.owner.convertTypes(context, undefined, type.types);
        return new UnionType(types);
    }
}

export default EnumFormattingPlugin;
