#!/usr/bin/env node
'use strict';

require('@babel/polyfill');

const runBlockCli = require('../transpiled/run_block_cli');
runBlockCli();
