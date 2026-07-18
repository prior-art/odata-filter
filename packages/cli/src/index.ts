#!/usr/bin/env node

import { createCommand } from './cli.js';

const program = createCommand();
program.parse(process.argv);
