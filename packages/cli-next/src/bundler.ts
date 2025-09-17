const defaultBundler = require('@airtable/blocks-esbuild-bundler').default;

export default async function () {
    return defaultBundler();
}
