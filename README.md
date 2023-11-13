# NNID

[![Node.js CI](https://github.com/sskogen/nnid/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/sskogen/nnid/actions/workflows/node.js.yml)

Replace [norwegian](https://no.wikipedia.org/wiki/F%C3%B8dselsnummer) and [swedish](https://en.wikipedia.org/wiki/Personal_identity_number_(Sweden)) identity numbers with fake ones to not expose real identities in your data. 

The synthetically generated IDs will still pass validation of check digits. The synthetic
IDs will have the birth date part set to an invalid date to ensure that they will never match a real identity. 

## Usage
To replace all valid NNIDs in the current directory (and subdirectories) with synthetic ones:
```bash
npx nnid
```

Options:

* -r, --replace-invalid : Replace 11-digit numbers that do not qualify with any ID types with synthetic ones.
* -d, --dir: Directory to search for numbers in. Defaults to current directory.
* --swedish: Replace 12-digit numbers that are valid swedish personal numbers with synthetic ones.
* --fake-swedish: Generate a random synthetic swedish personal number.
