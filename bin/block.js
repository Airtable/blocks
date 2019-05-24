#!/usr/bin/env node
'use strict';

require('@babel/polyfill');

const runBlockCliAsync = require('../transpiled/run_block_cli_async');
runBlockCliAsync();
