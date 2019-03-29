#!/usr/bin/env node
/* eslint-disable no-console */
'use strict';

require('@babel/polyfill');

const runBlockCli = require('./build/run_block_cli');
runBlockCli();
