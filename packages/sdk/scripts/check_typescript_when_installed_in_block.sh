#!/bin/sh
set -eux

yarn run build

package_file_name=$(npm pack --quiet)
package_file_path="$(pwd)/$package_file_name"

work_dir=$(mktemp -d -t sdk_ts_check_XXXXXXXX)
cd "$work_dir"
cat - > tsconfig.json <<'EOF'
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es2018",
        "allowSyntheticDefaultImports": true
    },
    "include": ["source.ts"]
}
EOF

cat - > package.json <<EOF
{
    "dependencies": {
        "@airtable/blocks": "$package_file_path",
        "typescript": "latest"
    }
}
EOF

cat - > source.ts <<'EOF'
import * as sdk from '@airtable/blocks';
import * as ui from '@airtable/blocks/ui';
import {Box} from '@airtable/blocks/unstable_standalone_ui';
console.log(sdk);
EOF

npm install
rm -rf "$package_file_path"

cat - <<'EOF'
/------------------------------------------------------------------------------\
|                  CHECKING TYPESCRIPT WHEN INSTALLED IN BLOCK                 |
|                                                                              |
| If this step fails but running `yarn types` passes, it's likely because      |
| something is incorrectly marked as `@internal`. `@internal` strips the type  |
| from the generated type definition file entirely, which means that if        |
| anything refers to it that then gets included in the generated type          |
| definition files, end-users will see a type error when developing their      |
| block. To check the generated files, run `yarn build` and check the          |
| dist/types folder.                                                           |
|                                                                              |
| To run this test locally:                                                    |
| $ ./scripts/check_typescript_when_installed_in_block.sh                      |
\------------------------------------------------------------------------------/
EOF

./node_modules/.bin/tsc --build
rm -rf $work_dir
