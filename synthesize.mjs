import fs from "fs";
import path from "path";
import { fnr, dnr, hnr, tnr, dnrAndHnr } from "./validator.mjs";
import {
  createRandomSwedishPersonalNumber,
  isValidSwedishPersonalNumber,
} from "./swedish.mjs";
import { createSyntheticID } from "./ids.mjs";

const excludeDirs = [".idea", ".git", "target", "node_modules"];

function isNumberInvalid(number) {
  // Check if number is invalid in all validation functions
  return ![fnr, dnr, hnr, tnr, dnrAndHnr].some(
    (func) => func(number).status === "valid",
  );
}

function isValidNNID(number) {
  return fnr(number).status === "valid";
}

function isValidDNumber(number) {
  return dnr(number).status === "valid";
}

function replaceNumbersInFile(filePath, numberMap, verbose) {
  let data = fs.readFileSync(filePath, "utf8");
  let result = data;
  let newFilePath = filePath;

  // Replace all occurrences of each number with its mapped replacement
  for (const [originalNumber, replacementNumber] of Object.entries(numberMap)) {
    if (verbose) {
      console.log(`${originalNumber} -> ${replacementNumber} in ${filePath}`);
    }
    result = result.replace(new RegExp(originalNumber, "g"), replacementNumber);

    // Replace occurrence if filepath contains originalNumber
    if (filePath.includes(originalNumber)) {
      newFilePath = filePath.replace(
        new RegExp("(.*)" + originalNumber + "(.*)"),
        "$1" + replacementNumber + "$2",
      );
    }
  }

  fs.writeFileSync(filePath, result, "utf8");
  if (filePath !== newFilePath) {
    fs.renameSync(filePath, newFilePath);
  }
}

export default function synthesize({
  dirPath,
  swedish,
  replaceInvalid,
  verbose,
}) {
  if (verbose) {
    console.log(
      `Synthesize${replaceInvalid ? " invalid " : ""} ${
        swedish ? "swedish" : "norwegian"
      } IDs in ${dirPath}`,
    );
  }
  const numberMap = {}; // Map of original numbers to their replacements
  const filesToProcess = [];
  const invalidIDs = new Set();
  let validate = (digits) => isValidNNID(digits) || isValidDNumber(digits);
  if (swedish) {
    validate = isValidSwedishPersonalNumber;
  } else if (replaceInvalid) {
    validate = isNumberInvalid;
  }

  function traverseFileSystem(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory() && !excludeDirs.includes(entry.name)) {
        traverseFileSystem(fullPath);
      } else if (entry.isFile()) {
        const data = fs.readFileSync(fullPath, "utf8");
        let match;
        const regex = swedish ? /\d{12}/g : /\d{11}/g;

        while ((match = regex.exec(data))) {
          const number = match[0];
          if (validate(number)) {
            const type = isValidDNumber(number) ? "dnr" : "fnr";
            numberMap[number] = swedish
              ? createRandomSwedishPersonalNumber()
              : createSyntheticID(type);
            if (!filesToProcess.includes(fullPath)) {
              filesToProcess.push(fullPath);
            }
          } else if (verbose && !replaceInvalid) {
            invalidIDs.add(number);
          }
        }
      }
    }
  }

  traverseFileSystem(dirPath);

  if (verbose) {
    invalidIDs.forEach((id) => {
      console.log(
        `${id} is not a valid ${
          swedish ? "swedish" : "norwegian"
        } ID and will not be replaced`,
      );
    });
  }
  // Replace numbers in the collected files
  for (const file of filesToProcess) {
    replaceNumbersInFile(file, numberMap, verbose);
  }
}
