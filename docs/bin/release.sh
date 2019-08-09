#!/usr/bin/env bash
set -e
set -u
set -o pipefail

docs_bin_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
docs_dir="$(cd "$docs_bin_dir/.." && pwd)"
project_root_dir="$(cd "$docs_dir/.." && pwd)"

cd "$docs_dir"

"$project_root_dir/bin/check-repo-for-release"

# NOTE(evanhahn) gh-pages's .cache directy can cause problems, so we remove it.
rm -rf "$docs_dir/node_modules/gh-pages/.cache"

# NOTE(evanhahn) Yarn is unable to find `gh-pages` for some reason, so we use
# this trick instead of calling `yarn run gh-pages`.
"$(yarn bin)/gh-pages" \
  --git "$(command -v git)" \
  --dist 'public' \
  --message 'Update docs' \
  --repo 'git@github.com:Airtable/blocks.git'
