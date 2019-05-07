#!/usr/bin/env node
'use strict';

require('@babel/polyfill');

const runBlockCli = require('../build/run_block_cli');
runBlockCli();
