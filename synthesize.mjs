import fs from 'fs';
import path from 'path';
import { T_IDS } from './ids.mjs';
import { program } from 'commander';
import { fnr, dnr, hnr, tnr, dnrAndHnr } from './validator.mjs';

program
    .option('-r, --replace-invalid', 'Replace 11-digit numbers that are not valid with synthetic ones')
    .option('-d, --dir <path>', 'Directory to process')

program.parse(process.argv);
const options = program.opts();

const baseDirectory = options.directory ? path.resolve(options.directory) : process.cwd();
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

function replaceNumbersInFile(filePath, numberMap) {
    let data = fs.readFileSync(filePath, 'utf8');
    let result = data;

    // Replace all occurrences of each number with its mapped replacement
    for (const [originalNumber, replacementNumber] of Object.entries(numberMap)) {
        result = result.replace(new RegExp('\\b' + originalNumber + '\\b', 'g'), replacementNumber);
    }

    fs.writeFileSync(filePath, result, 'utf8');
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

export default function synthesize(dirPath = baseDirectory) {
    const numberMap = {}; // Map of original numbers to their replacements
    const filesToProcess = [];
    const validate = options.replaceInvalid ? isNumberInvalid : isValidNNID;

    function traverseFileSystem(currentPath) {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);

            if (entry.isDirectory() && !excludeDirs.includes(entry.name)) {
                traverseFileSystem(fullPath);
            } else if (entry.isFile()) {
                const data = fs.readFileSync(fullPath, 'utf8');
                let match;
                const regex = /\b\d{11}\b/g;

                while ((match = regex.exec(data))) {
                    const number = match[0];
                    if (validate(number)) {
                        numberMap[number] = getReplacementNumber(number);
                        if (!filesToProcess.includes(fullPath)) {
                            filesToProcess.push(fullPath);
                        }
                    }
                }
            }
        }
    }

    traverseFileSystem(dirPath);

    // Replace numbers in the collected files
    for (const file of filesToProcess) {
        replaceNumbersInFile(file, numberMap);
    }
}