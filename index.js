#!/usr/bin/env node
/* eslint-disable no-console */
'use strict';

require('regenerator-runtime/runtime');

const runBlockCli = require('./build/run_block_cli');
runBlockCli();
