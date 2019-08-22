#!/usr/bin/env /bin/bash

# Smoke test for blocks-cli.
# Usage:
#     ./smoke_test.sh [path/to/block/command]
#
# Requires access to:
#     https://airtable.com/tbleA2gWqSbqgtXFD?blocks=bipHcxcRpB0ObTAGo

[ -n "$1" ] && block="$1" || block='block'

set -uo pipefail

BLOCK_ID="appQOxbW7k6mK0Eqd/blkDOYCZmdADueASi"
BLOCK_RUN_WAIT_SECONDS=10
BLOCK_RUN_PORT=9000

# TODO(Chuan): Make this shared?
function echoStep() {
  echo
  echo "$(tput bold)> $1$(tput sgr0)"
}

# Check block command exists.
block_path=$(command -v "$block")
if [ $? -ne 0 ]; then
  echoStep "Could not find block command '$block'"
  exit 1
fi
echoStep "Found blocks-cli at '$block_path'"

# Check if there is a blocks-cli process running elsewhere.
if lsof -i:${BLOCK_RUN_PORT} >/dev/null; then
  echoStep "Port ${BLOCK_RUN_PORT} is currently in use. Please kill or wait for termination before running this test."
  exit 1
fi

# Check block version.
version=$("$block" --version)
if [ $? -ne 0 ] || [ -z "$version" ]; then
  echoStep "Failed to get blocks-cli version"
  exit 1
fi
echoStep "blocks-cli reports version '${version}''"

# Set up temp dir for block code.
temp_dir=$(mktemp -d -t "blocks-cli-smoke-test")
echoStep "Using temporary directory '$temp_dir'"
cd "$temp_dir"

# Clean up at process exit.
function before_exit() {
  # Kill dangling child processes (e.g. block run)
  kill $(jobs -pr) 2>/dev/null
  # Clean up temp dir.
  if [ -e "$temp_dir" ]; then
    read -p "> Smoke test failed. Remove temporary directory? [Y/n]  " r
    if [ -z "$r" ] || [ "$r" == y ]; then
      echo "> Removing '$temp_dir'"
      rm -rf "$temp_dir"
    else
      echo "> Not removing '$temp_dir'"
    fi
  fi
  echo
}
trap before_exit EXIT

# Check block init.
echoStep "Creating block"
"$block" init "$BLOCK_ID" smoke_test
if [ $? -ne 0 ]; then
  echoStep "Failed to create block"
  exit 1
fi
cd smoke_test

# Check block run.
echoStep "Running block and waiting ${BLOCK_RUN_WAIT_SECONDS}s"
"$block" run &
block_pid=$!
echoStep "Started blocks-cli with PID $block_pid"
sleep $BLOCK_RUN_WAIT_SECONDS
if ! kill -0 $block_pid 2>/dev/null; then
  echoStep "blocks-cli is not running"
  exit 1
fi
block_run_url="https://localhost:${BLOCK_RUN_PORT}/"
echoStep "Checking ${block_run_url}"
resp=$(curl --max-time 5 --silent --fail --insecure "$block_run_url")
if [ $? -ne 0 ]; then
  echoStep "Could not fetch from $block_run_url"
  echo "$resp"
  exit 1
fi
echoStep "Content fetched from $block_run_url:"
echo "$resp"
echoStep "Stopping blocks-cli with PID $block_pid"
kill $block_pid
wait

# Check block release.
echoStep "Releasing block"
"$block" release
if [ $? -ne 0 ]; then
  echoStep "Failed to release block"
  exit 1
fi

# Clean up on success.
echoStep "Removing temporary directory '$temp_dir'"
rm -rf "$temp_dir"

echoStep "Success!"
exit 0
