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

    initialize() {
        this.listenTo(this.owner, {
            [Converter.EVENT_BEGIN]: this.onBegin,
            [Converter.EVENT_CREATE_DECLARATION]: this.onCreateDeclarationOrSignature,
            [Converter.EVENT_CREATE_SIGNATURE]: this.onCreateDeclarationOrSignature,
            [Converter.EVENT_RESOLVE_BEGIN]: this.onBeginResolve,
        });
    }

    private onBegin() {
        this.reflectionsToExclude = [];
        this.modulesWithoutDocumentation = new Set();
        this.visitedModules = new Set();
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
            // assume this module has no documentation until we see some
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
            // HACK: functions don't get their comments parsed properly for some reason,
            // fallback to raw comment:
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
}

export default HideInternalPlugin;
