cd "%~dp0%.."
cmd /c yarn
for /f %%x in ('npm config get prefix') do set "npm_prefix=%%x"
set npm_config_registry=https://registry.npmjs.org/
cmd /c yarn run build:compileSmokeTest
cmd /c node transpiled\test\smoke_test.js "--blocks_cli_command=%npm_prefix%\run" --reinstall_from_npm --blocks_cli_run_wait_ms=30000
