#!/usr/bin/env node
import synthesize from "./synthesize.mjs";

// Get the third argument from the command line, default to '.' (current working directory)
const directory = process.argv[2] || '.';

synthesize(directory);