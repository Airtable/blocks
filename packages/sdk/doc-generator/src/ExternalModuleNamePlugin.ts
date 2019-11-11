/**
 * This entire file is copy-pasted & modified from https://github.com/christopherthielen/typedoc-plugin-external-module-name
 */

import * as ts from 'typescript';
import {Reflection, ReflectionKind} from 'typedoc/dist/lib/models/reflections/abstract';
import {DeclarationReflection} from 'typedoc/dist/lib/models/reflections/declaration';
import {Component, ConverterComponent} from 'typedoc/dist/lib/converter/components';
import {Converter} from 'typedoc/dist/lib/converter/converter';
import {Context} from 'typedoc/dist/lib/converter/context';
import {CommentPlugin} from 'typedoc/dist/lib/converter/plugins/CommentPlugin';
import {ContainerReflection} from 'typedoc/dist/lib/models/reflections/container';
import {getRawComment} from 'typedoc/dist/lib/converter/factories/comment';

function assertExists<T>(value: T | null | undefined): T {
    if (value === null || value === undefined) {
        throw new Error('Value should exist');
    }
    return value;
}

/**
 * This plugin allows an ES6 module to specify its TypeDoc name.
 * It also allows multiple ES6 modules to be merged together into a single TypeDoc module.
 *
 * @usage
 * At the top of an ES6 module, add a "dynamic module comment".  Insert "@module typedocModuleName" to
 * specify that this ES6 module should be merged with module: "typedocModuleName".
 *
 * Similar to the {@link DynamicModulePlugin}, ensure that there is a comment tag (even blank) for the
 * first symbol in the file.
 *
 * @example
 * ```
 *
 * &#47;**
 *  * @module newModuleName
 *  *&#47;
 * &#47;** for typedoc &#47;
 * import {foo} from "../foo";
 * export let bar = "bar";
 * ```
 *
 * Also similar to {@link DynamicModulePlugin}, if @preferred is found in a dynamic module comment, the comment
 * will be used as the module comment, and documentation will be generated from it (note: this plugin does not
 * attempt to count lengths of merged module comments in order to guess the best one)
 */
@Component({name: 'external-module-name'})
export default class ExternalModuleNamePlugin extends ConverterComponent {
    /** List of module reflections which are models to rename */
    private moduleRenames: ModuleRename[] = [];

    initialize() {
        this.listenTo(this.owner, {
            [Converter.EVENT_BEGIN]: this.onBegin,
            [Converter.EVENT_CREATE_DECLARATION]: this.onDeclaration,
            [Converter.EVENT_RESOLVE_BEGIN]: this.onBeginResolve,
        });
    }

    /**
     * Triggered when the converter begins converting a project.
     *
     * @param context  The context object describing the current state the converter is in.
     */
    private onBegin(context: Context) {
        this.moduleRenames = [];
    }

    /**
     * Triggered when the converter has created a declaration reflection.
     *
     * @param context  The context object describing the current state the converter is in.
     * @param reflection  The reflection that is currently processed.
     * @param node  The node that is currently processed if available.
     */
    private onDeclaration(context: Context, reflection: Reflection, node?: ts.Node) {
        if (reflection.kindOf(ReflectionKind.ExternalModule) && node) {
            let comment = getRawComment(node);
            if (comment) {
                let match = /@module\s+([\w\u4e00-\u9fa5\.\-_/@: "]+)/.exec(comment);
                if (match) {
                    let preferred = /@preferred/.exec(comment);
                    this.moduleRenames.push({
                        renameTo: match[1].trim(),
                        preferred: preferred != null,
                        reflection: reflection as ContainerReflection,
                    });
                }
            }
        }

        if (reflection.comment) {
            CommentPlugin.removeTags(reflection.comment, 'module');
            CommentPlugin.removeTags(reflection.comment, 'preferred');
        }
    }

    /**
     * Triggered when the converter begins resolving a project.
     *
     * @param context  The context object describing the current state the converter is in.
     */
    private onBeginResolve(context: Context) {
        let projRefs = context.project.reflections;
        let refsArray: Reflection[] = Object.keys(projRefs).reduce(
            (m, k) => {
                m.push(projRefs[Number(k)]);
                return m;
            },
            [] as Array<Reflection>,
        );

        this.moduleRenames.forEach(item => {
            let renaming = item.reflection as ContainerReflection;

            let nameParts = item.renameTo.split('.');
            let parent: ContainerReflection = context.project;
            for (let i = 0; i < nameParts.length - 1; ++i) {
                let child: DeclarationReflection | undefined = assertExists(parent.children).find(
                    ref => ref.name === nameParts[i],
                );
                if (!child) {
                    child = new DeclarationReflection(
                        nameParts[i],
                        ReflectionKind.ExternalModule,
                        parent,
                    );
                    child.parent = parent;
                    child.children = [];
                    context.project.reflections[child.id] = child;
                    assertExists(parent.children).push(child);
                }
                parent = child;
            }

            let mergeTarget =
                parent.children &&
                (parent.children.find(
                    ref =>
                        ref.kind === renaming.kind && ref.name === nameParts[nameParts.length - 1],
                ) as ContainerReflection);

            if (!mergeTarget) {
                renaming.name = nameParts[nameParts.length - 1];
                let oldParent = renaming.parent as ContainerReflection;
                const oldParentChildren = assertExists(oldParent.children);
                for (let i = 0; i < oldParentChildren.length; ++i) {
                    if (oldParentChildren[i] === renaming) {
                        oldParentChildren.splice(i, 1);
                        break;
                    }
                }
                item.reflection.parent = parent;
                assertExists(parent.children).push(renaming as DeclarationReflection);
                return;
            }

            if (!mergeTarget.children) {
                mergeTarget.children = [];
            }

            let childrenOfRenamed = refsArray.filter(ref => ref.parent === renaming);
            childrenOfRenamed.forEach((ref: Reflection) => {
                ref.parent = mergeTarget;
                assertExists(assertExists(mergeTarget).children).push(ref as any);
            });

            if (item.preferred) mergeTarget.comment = renaming.comment;

            if (renaming.children) renaming.children.length = 0;
            CommentPlugin.removeReflection(context.project, renaming);

            CommentPlugin.removeTags(mergeTarget.comment, 'module');
            CommentPlugin.removeTags(mergeTarget.comment, 'preferred');
        });
    }
}

interface ModuleRename {
    renameTo: string;
    preferred: boolean;
    reflection: ContainerReflection;
}
