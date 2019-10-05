import BaseMarkdownTheme from 'typedoc-plugin-markdown/dist/theme';
import {TemplateMapping} from 'typedoc/dist/lib/output/themes/DefaultTheme';
import {ReflectionKind, DeclarationReflection, UrlMapping} from 'typedoc';

export default class Theme extends BaseMarkdownTheme {
    static MAPPINGS: TemplateMapping[] = [
        {
            kind: [ReflectionKind.Module, ReflectionKind.ExternalModule],
            isLeaf: false,
            directory: 'modules',
            template: 'reflection.hbs',
        },
    ];

    buildUrls(reflection: DeclarationReflection, urls: UrlMapping[]): UrlMapping[] {
        const mapping = Theme.MAPPINGS.find(mapping => reflection.kindOf(mapping.kind));
        if (mapping) {
            if (!reflection.url || !Theme.URL_PREFIX.test(reflection.url)) {
                const url = this.toUrl(mapping, reflection);
                urls.push(new UrlMapping(url, reflection, mapping.template));
                reflection.url = url;
                reflection.hasOwnDocument = true;
            }
            for (const child of reflection.children || []) {
                if (mapping.isLeaf) {
                    this.applyAnchorUrl(child, reflection);
                } else {
                    this.buildUrls(child, urls);
                }
            }
        } else if (reflection.parent) {
            this.applyAnchorUrl(reflection, reflection.parent);
        }
        return urls;
    }
}
