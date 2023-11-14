import fs from 'fs';
import path from 'path';
import {T_IDS} from './ids.mjs';
import {fnr, dnr, hnr, tnr, dnrAndHnr} from './validator.mjs';
import {generateRandomSwedishPersonalNumber, isValidSwedishPersonalNumber} from "./swedish.mjs";

const excludeDirs = ['.idea', '.git', 'target', 'node_modules'];
const replacementNumbers = T_IDS;
let usedReplacements = {}; // Object to keep track of used replacement numbers

function isNumberInvalid(number) {
    // Check if number is invalid in all validation functions
    return ![fnr, dnr, hnr, tnr, dnrAndHnr].some(func => func(number).status === 'valid');
}

function isValidNNID(number) {
    return fnr(number).status === 'valid';
}

function replaceNumbersInFile(filePath, numberMap, verbose) {
    let data = fs.readFileSync(filePath, 'utf8');
    let result = data;
    let newFilePath = filePath;

    // Replace all occurrences of each number with its mapped replacement
    for (const [originalNumber, replacementNumber] of Object.entries(numberMap)) {
        if (verbose) {
            console.log(`${originalNumber} -> ${replacementNumber} in ${filePath}`);
        }
        result = result.replace(new RegExp('\\b' + originalNumber + '\\b', 'g'), replacementNumber);

        // Replace occurrence if filepath contains originalNumber
        if (filePath.includes(originalNumber)) {
            newFilePath=filePath.replace(new RegExp('(.*)' + originalNumber + '(.*)'), '$1' + replacementNumber + '$2');
        }
    }

    fs.writeFileSync(filePath, result, 'utf8');
    if (filePath !== newFilePath) {
        fs.renameSync(filePath, newFilePath);
    };
}

function getReplacementNumber(originalNumber) {
    if (!usedReplacements[originalNumber]) {
        if (replacementNumbers.length === 0) {
            console.error('No more replacement numbers available.');
            process.exit(1);
        }
        usedReplacements[originalNumber] = replacementNumbers.shift();
    }
    return usedReplacements[originalNumber];
}

function getSwedishReplacementNumber(originalNumber) {
    if (!usedReplacements[originalNumber]) {
        usedReplacements[originalNumber] = generateRandomSwedishPersonalNumber();
    }
    return usedReplacements[originalNumber];
}

export default function synthesize({dirPath, swedish, replaceInvalid, verbose}) {
    if (verbose) {
        console.log(`Synthesize${replaceInvalid ? ' invalid ' : ''} ${swedish ? 'swedish' : 'norwegian'} IDs in ${dirPath}`);
    }
    const numberMap = {}; // Map of original numbers to their replacements
    const filesToProcess = [];
    const invalidIDs = new Set();
    const validate = swedish ? isValidSwedishPersonalNumber : replaceInvalid ? isNumberInvalid : isValidNNID;

    function traverseFileSystem(currentPath) {
        const entries = fs.readdirSync(currentPath, {withFileTypes: true});

        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);

            if (entry.isDirectory() && !excludeDirs.includes(entry.name)) {
                traverseFileSystem(fullPath);
            } else if (entry.isFile()) {
                const data = fs.readFileSync(fullPath, 'utf8');
                let match;
                const regex = swedish ? /\b\d{12}\b/g : /\b\d{11}\b/g;

                while ((match = regex.exec(data))) {
                    const number = match[0];
                    if (validate(number)) {
                        numberMap[number] = swedish ? getSwedishReplacementNumber(number) : getReplacementNumber(number);
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
        invalidIDs.forEach(id => {
            console.log(`${id} is not a valid ${swedish ? 'swedish' : 'norwegian'} ID and will not be replaced`);
        });
    }
    // Replace numbers in the collected files
    for (const file of filesToProcess) {
        replaceNumbersInFile(file, numberMap, verbose);
    }
}