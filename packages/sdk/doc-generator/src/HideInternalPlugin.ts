import * as path from 'path';
import * as ts from 'typescript';
import {ConverterComponent, Component} from 'typedoc/dist/lib/converter/components';
import {Converter, Context} from 'typedoc/dist/lib/converter';
import {
    Reflection,
    DeclarationReflection,
    ReflectionKind,
    SignatureReflection,
} from 'typedoc/dist/lib/models';
import {CommentPlugin} from 'typedoc/dist/lib/converter/plugins';
import {getRawComment} from 'typedoc/dist/lib/converter/factories/comment';

const internalTags = ['internal', 'hidden', 'ignore'];

const srcDirPath = path.resolve(__dirname, '../../src');

@Component({name: 'HideInternalPlugin'})
class HideInternalPlugin extends ConverterComponent {
    private reflectionsToExclude: Array<Reflection> = [];
    private visitedModules: Set<Reflection> = new Set();
    private modulesWithoutDocumentation: Set<Reflection> = new Set();
    private reflectionsMissingExplicitAnnotations: Set<Reflection> = new Set();

    initialize() {
        this.listenTo(this.owner, {
            [Converter.EVENT_BEGIN]: this.onBegin,
            [Converter.EVENT_CREATE_DECLARATION]: this.onCreateDeclarationOrSignature,
            [Converter.EVENT_CREATE_SIGNATURE]: this.onCreateDeclarationOrSignature,
            [Converter.EVENT_RESOLVE_BEGIN]: this.onBeginResolve,
            [Converter.EVENT_END]: this.onEnd,
        });
    }

    private onBegin() {
        this.reflectionsToExclude = [];
        this.modulesWithoutDocumentation = new Set();
        this.visitedModules = new Set();
        this.reflectionsMissingExplicitAnnotations = new Set();
    }

    private onEnd() {
        if (this.reflectionsMissingExplicitAnnotations.size > 0) {
            const lines = Array.from(this.reflectionsMissingExplicitAnnotations)
                .map(reflection => {
                    const source = reflection.sources ? reflection.sources[0] : undefined;
                    return {
                        description: `${reflection.name} (${ReflectionKind[reflection.kind]})`,
                        loc: source ? `${source.fileName}:${source.line}` : '<unknown>',
                    };
                })
                .sort((a, b) => (a.loc < b.loc ? -1 : 1))
                .map(({description, loc}) => `- ${description} at ${loc}`);

            const uniqueLines = new Set(lines);

            console.log(
                [
                    'Nodes missing explicit annotations:',
                    ...uniqueLines,
                    '',
                    `Total: ${uniqueLines.size}.`,
                    '',
                    'You need to add an explicit doc comment to these declarations to include or exclude them from the documentation:',
                    '  - Add /** */ (ideally with more details) to include the declaration in the docs.',
                    '  - Add /** @hidden */ to exclude the declaration from the docs, but keep its type information available to consumers (e.g. undocumented private APIs for 1st-party blocks).',
                    '  - Add /** @internal */ to exclude the declaration from both the docs and the generated type definitions for the SDK.',
                    '',
                ].join('\n'),
            );
            process.exit(1);
        }
    }

    private onCreateDeclarationOrSignature(
        context: Context,
        reflection: DeclarationReflection | SignatureReflection,
        node?: ts.Node,
    ) {
        if (
            context.scope.kind === ReflectionKind.ExternalModule &&
            !this.visitedModules.has(context.scope)
        ) {
            this.visitedModules.add(context.scope);
            this.modulesWithoutDocumentation.add(context.scope);
        }

        if (
            this.isMemberOfInternalApi(reflection, node) ||
            this.isFromExternalLibrary(reflection)
        ) {
            this.exclude(reflection);
        } else if (this.isModuleLevel(reflection.kind)) {
            if (this.hasDocComment(reflection, node)) {
                const moduleReflection = this.findExternalModule(reflection);
                this.modulesWithoutDocumentation.delete(moduleReflection);
            } else {
                this.exclude(reflection);

                if (this.doesRequireExplicitAnnotation(reflection.kind)) {
                    this.reflectionsMissingExplicitAnnotations.add(reflection);
                }
            }
        }
    }

    private onBeginResolve(context: Context) {
        for (const moduleWithoutDocumentation of this.modulesWithoutDocumentation) {
            this.exclude(moduleWithoutDocumentation);
        }

        for (const reflectionToExclude of this.reflectionsToExclude) {
            CommentPlugin.removeReflection(context.project, reflectionToExclude);
        }
    }

    private exclude(reflection: Reflection) {
        if (reflection.kind === ReflectionKind.CallSignature) {
            if (reflection.parent) {
                this.exclude(reflection.parent);
            }
        } else {
            this.reflectionsToExclude.push(reflection);
        }
    }

    private hasDocComment(reflection: Reflection, node: ts.Node | undefined): boolean {
        return reflection.hasComment() || !!(node && getRawComment(node));
    }

    private isMemberOfInternalApi(reflection: Reflection, node: ts.Node | undefined): boolean {
        const name = reflection.name || '';
        if (name.startsWith('_')) {
            return true;
        }

        if (reflection.comment) {
            for (const internalTag of internalTags) {
                if (reflection.comment.hasTag(internalTag)) {
                    return true;
                }
            }
        }

        if (reflection.kind === ReflectionKind.Function && node) {
            const rawComment = getRawComment(node);
            if (rawComment) {
                for (const internalTag of internalTags) {
                    if (rawComment.includes(`@${internalTag}`)) {
                        return true;
                    }
                }
            }
        }

        if (!reflection.parent) {
            return false;
        }

        return this.isMemberOfInternalApi(reflection.parent, node ? node.parent : undefined);
    }

    private isFromExternalLibrary(reflection: Reflection): boolean {
        return reflection.sources
            ? reflection.sources.every(source => !source.fileName.startsWith(srcDirPath))
            : false;
    }

    private findExternalModule(reflection: Reflection): Reflection {
        if (reflection.kind === ReflectionKind.ExternalModule) {
            return reflection;
        }

        if (reflection.parent) {
            return this.findExternalModule(reflection.parent);
        }

        throw new Error('Cannot find external module');
    }

    private isModuleLevel(kind: ReflectionKind): boolean {
        switch (kind) {
            case ReflectionKind.Event:
            case ReflectionKind.Function:
            case ReflectionKind.Method:
            case ReflectionKind.Enum:
            case ReflectionKind.Variable:
            case ReflectionKind.Class:
            case ReflectionKind.Interface:
            case ReflectionKind.Constructor:
            case ReflectionKind.Property:
            case ReflectionKind.Accessor:
            case ReflectionKind.TypeAlias:
                return true;
            default:
                return false;
        }
    }

    private doesRequireExplicitAnnotation(kind: ReflectionKind): boolean {
        return kind !== ReflectionKind.Variable;
    }
}

export default HideInternalPlugin;
