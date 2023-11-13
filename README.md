# NNID

Replace [norwegian national identity numbers](https://no.wikipedia.org/wiki/F%C3%B8dselsnummer) with fake ones to not expose real identities in your data. 

The synthetically generated IDs will still pass validation of check digits. The synthetic
IDs will have the month part of birth dates be between 80-92 to ensure that the ID never can be connected with a real one. 

## Usage
To replace all valid NNIDs in the current directory (and subdirectories) with synthetic ones:
```bash
npx nnid
```

Options:

* -r, --replace-invalid : Replace 11-digit numbers that do not qualify with any ID types with synthetic ones.
* -d, --dir: Directory to search for numbers in. Defaults to current directory.
