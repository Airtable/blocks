#!/usr/bin/env /bin/bash

# Smoke test to verify the current release of blocks-cli on NPM.
# Usage:
#     ./release_smoke_test.sh

set -uo pipefail

BLOCKS_CLI_PACKAGE='@airtable/blocks-cli'

# TODO(Chuan): Make this shared?
function echoStep() {
  echo
  echo "$(tput bold)> $1$(tput sgr0)"
}

# Remove existing installation if exists.
if npm list -g "$BLOCKS_CLI_PACKAGE" | grep -q "$BLOCKS_CLI_PACKAGE"; then
  echoStep "Removing existing $BLOCKS_CLI_PACKAGE installation"
  npm uninstall -g "$BLOCKS_CLI_PACKAGE"
fi

# Install.
echoStep "Installing $BLOCKS_CLI_PACKAGE"
npm install -g "$BLOCKS_CLI_PACKAGE"

# Run smoke test.
"$(dirname "$0")"/smoke_test.sh
