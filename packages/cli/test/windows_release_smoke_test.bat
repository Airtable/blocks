cd "%~dp0%.."
cmd /c yarn
cmd /c yarn run build:win
for /f %%x in ('npm config get prefix') do set "npm_prefix=%%x"
set npm_config_registry=https://registry.npmjs.org/
cmd /c node transpiled\test\smoke_test.js "--blocks_cli_command=%npm_prefix%\block" --reinstall_from_npm --blocks_cli_run_wait_ms=30000 --block_run_port=9002

