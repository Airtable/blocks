#!/bin/bash
set -eux

function create_package {
    (
        cd ${1}
        yarn run build >&2
        package_file_name=$(npm pack --quiet)

        echo $(pwd)/$package_file_name
    )
}

blocks_sdk_package_file=$(create_package ../sdk)
blocks_testing_package_file=$(create_package .)

work_dir=$(mktemp -d -t blocks_testing_check_XXXXXXXX)

function clean {
    rm -rf $work_dir
}
trap clean EXIT

cd "$work_dir"
cat - > tsconfig.json <<'EOF'
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es2018",
        "allowSyntheticDefaultImports": true
    },
    "include": ["index.test.ts"]
}
EOF

cat - > package.json <<EOF
{
    "dependencies": {
        "@airtable/blocks": "${blocks_sdk_package_file}",
        "@airtable/blocks-testing": "${blocks_testing_package_file}",
        "@types/jest": "^24.0.23",
        "jest": "^26.6.3",
        "react": "^16.8.0",
        "react-dom": "^16.8.0",
        "typescript": "^4.9.5"
    }
}
EOF

cat - > index.test.ts <<'EOF'
const TestDriver = require('@airtable/blocks-testing').default;
test('anything', () => {
  expect(typeof TestDriver).toBe('function');
});
EOF

npm install
rm ${blocks_sdk_package_file} ${blocks_testing_package_file}

cat - <<'EOF'
/------------------------------------------------------------------------------\
|          CHECKING TYPESCRIPT AND SDK WHEN INSTALLED IN BLOCK                 |
|                                                                              |
| If this step fails but running `yarn types` passes, it may be because        |
| something is incorrectly marked as `@internal`. `@internal` strips the type  |
| from the generated type definition file entirely, which means that if        |
| anything refers to it that then gets included in the generated type          |
| definition files, end-users will see a type error when developing their      |
| block. To check the generated files, run `yarn build` and check the          |
| dist/types folder.                                                           |
|                                                                              |
| Failure may also occur if the development version of the SDK no longer       |
| exports a binding upon which the testing library depends.                    |
|                                                                              |
| To run this test locally:                                                    |
| $ ./scripts/check_integration_with_sdk.sh                                    |
\------------------------------------------------------------------------------/
EOF

./node_modules/.bin/tsc --build
./node_modules/.bin/jest index.test.ts
