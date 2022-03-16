cd "%~dp0\.."
cmd /c yarn
set npm_config_registry=https://registry.npmjs.org/
cmd /c yarn run build:compileSmokeTest
cmd /c node transpiled\test\smoke_test.js "--blocks_cli_command=%cd%\bin\run" --blocks_cli_run_wait_ms=30000 --block_run_port=9002

