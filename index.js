#!/usr/bin/env node
import path from 'path';
import synthesize from "./synthesize.mjs";
import {program} from "commander";
import {generateRandomSwedishPersonalNumber} from "./swedish.mjs";

program
    .option('-r, --replace-invalid', 'Replace 11-digit numbers that are not valid with synthetic ones')
    .option('-d, --directory <path>', 'Directory to process')
    .option('--swedish', 'Replace valid swedish personal numbers (in 12-digit format) with synthetic ones')
    .option('--fake-swedish', 'Create fake swedish personal numbers (in 12-digit format)')
    .option('-v, --verbose', 'Verbose output')

program.parse(process.argv);
const options = program.opts();
const {fakeSwedish, swedish, replaceInvalid, directory, verbose} = options;

const baseDirectory = directory ? path.resolve(directory) : process.cwd();

if (fakeSwedish) {
    console.log(generateRandomSwedishPersonalNumber());
} else {
    synthesize({dirPath: baseDirectory, swedish, replaceInvalid, verbose});
}

