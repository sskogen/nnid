// Copied from https://github.com/navikt/fnrvalidator/blob/master/src/validator.js and modified to validate against
// a specific type instead of inferring the type before validation.

const elevenDigits = new RegExp('^\\d{11}$')

export const fnr = (digits) => {
    return validate(digits, 'fnr')
}

export const dnr = (digits) => {
    return validate(digits, 'dnr')
}

export const hnr = (digits) => {
    return validate(digits, 'hnr')
}

export const tnr = (digits) => {
    return validate(digits, 'tnr')
}

export const dnrAndHnr = (digits) => {
    return validate(digits, 'drn-and-hnr')
}

export const getType = (digits) => {
    if (digits.substring(0, 1) >= 4 && digits.substring(2, 3) >= 4) {
        return 'dnr-and-hnr'
    }
    else if (digits.substring(0, 1) >= 4) {
        return 'dnr'
    } else if (digits.substring(2, 3) >= 8) {
        return "tnr"
    } else if (digits.substring(2, 3) >= 4) {
        return 'hnr'
    }
    return 'fnr'
}

export const validate = (digits, type) => {
    if (!elevenDigits.test(digits)) {
        return {
            status: "invalid",
            reasons: ["fnr, tnr, dnr or hnr must consist of 11 digits"]
        }
    }

    const errMsgs = [...checksums(digits), ...birthdate(digits, type)]

    return errMsgs.length == 0 ? {status: "valid", type} :
        {
            status: "invalid",
            reasons: errMsgs
        }
}

const checksums = (digits) => {
    let k1 = 11 - ((3 * digits[0] + 7 * digits[1] + 6 * digits[2] + 1 * digits[3] + 8 * digits[4] +
        9 * digits[5] + 4 * digits[6] + 5 * digits[7] + 2 * digits[8]) % 11)
    let k2 = 11 - ((5 * digits[0] + 4 * digits[1] + 3 * digits[2] + 2 * digits[3] + 7 *
        digits[4] + 6 * digits[5] + 5 * digits[6] + 4 * digits[7] + 3 * digits[8] + 2 * k1) % 11)

    if (k1 === 11) k1 = 0
    if (k2 === 11) k2 = 0

    return k1 < 10 && k2 < 10 && k1 == digits[9] && k2 == digits[10] ?
        [] : ["checksums don't match"]
}

// copied from https://stackoverflow.com/questions/5812220/how-to-validate-a-date
export const birthdate = (digits, type) => {
    if (type === 'dnr') {
        digits = (digits.substring(0, 1) - 4) + digits.substring(1)
    } else if (type === 'hnr') {
        digits = digits.substring(0, 2) + (digits.substring(2, 3) - 4) + digits.substring(3)
    } else if (type === 'tnr') {
        digits = digits.substring(0, 2) + (digits.substring(2, 3) - 8) + digits.substring(3)
    } else if (type === 'dnr-and-hnr') {
        digits = (digits.substring(0, 1) - 4) + digits.substring(1, 2) + (digits.substring(2, 3) - 4) + digits.substring(3)
    }

    const day = digits.substring(0, 2)
    const month = digits.substring(2, 4)
    const year = digits.substring(4, 6)

    // set year 00 default to 2000 instead of 1900
    const date = new Date(year === '00' ? '2000' : year, month - 1, day)

    return (date && (date.getMonth() + 1) == month && date.getDate() == day) ?
        [] : ["invalid date"]
}