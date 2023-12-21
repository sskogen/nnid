#!/usr/bin/env node
import path from "path";
import synthesize from "./synthesize.mjs";
import { program } from "commander";
import { createRandomSwedishPersonalNumber } from "./swedish.mjs";
import { createSyntheticID } from "./ids.mjs";

program
  .option(
    "-r, --replace-invalid",
    "Replace 11-digit numbers that are not valid with synthetic ones",
  )
  .option("-d, --directory <path>", "Directory to process")
  .option(
    "--swedish",
    "Replace valid swedish personal numbers (in 12-digit format) with synthetic ones",
  )
  .option(
    "--fake",
    "Create a fake norwegian national id number ('fødselsnummer')",
  )
  .option("--fake-d", "Create a fake norwegian D-number")
  .option(
    "--fake-swedish",
    "Create fake swedish personal numbers (in 12-digit format)",
  )
  .option("-v, --verbose", "Verbose output");

program.parse(process.argv);
const options = program.opts();
const {
  fake,
  fakeD,
  fakeSwedish,
  swedish,
  replaceInvalid,
  directory,
  verbose,
} = options;

const baseDirectory = directory ? path.resolve(directory) : process.cwd();
if (fake) {
  console.log(createSyntheticID());
} else if (fakeD) {
  console.log(createSyntheticID("dnr"));
} else if (fakeSwedish) {
  console.log(createRandomSwedishPersonalNumber());
} else {
  synthesize({
    dirPath: baseDirectory,
    swedish,
    replaceInvalid,
    verbose,
  });
}
