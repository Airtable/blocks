cd "%~dp0\.."
cmd /c yarn
cmd /c yarn run build:win
set npm_config_registry=https://registry.npmjs.org/
cmd /c node transpiled\test\smoke_test.js "--blocks_cli_command=%cd%\bin\block.cmd" --blocks_cli_run_wait_ms=30000 --block_run_port=9002

