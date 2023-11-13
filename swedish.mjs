export function luhnAlgorithm(number, isCheck = false) {
    let sum = 0;
    for (let i = 0; i < number.length; i++) {
        let digit = parseInt(number[i], 10);
        if ((number.length - i + (isCheck ? 1 : 0)) % 2 === 0) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
    }

    if (isCheck) {
        // Return check digit
        const modulo = sum % 10;
        return modulo === 0 ? 0 : 10 - modulo;
    } else {
        // Check if valid (sum divisible by 10)
        return sum % 10 === 0;
    }
}

export function isValidSwedishPersonalNumber(number) {
    if (!/^\d{12}$/.test(number)) {
        return false;
    }

    // Extract year, month, day
    const year = parseInt(number.substring(0, 4), 10);
    const month = parseInt(number.substring(4, 6), 10) - 1;
    const day = parseInt(number.substring(6, 8), 10);

    // Check valid date
    const date = new Date(year, month, day);
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
        return false;
    }

    // Check using Luhn algorithm
    return luhnAlgorithm(number.substring(2));
}

export function generateRandomSwedishPersonalNumber() {
    // Generate a random year between 1900 and 1999
    const year = Math.floor(Math.random() * 100) + 1900;

    //For the date part, we can select a date that is unlikely to correspond to an actual birth date,
    // such as February 30th (which is not a valid date in the Gregorian calendar).
    const month = '02';
    const day = '30';

    // Generate a random individual number (3 digits)
    const individualNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    // Combine to form the first 11 digits
    let first11Digits = `${year}${month}${day}${individualNumber}`;

    // Calculate the check digit using Luhn algorithm
    const checkDigit = luhnAlgorithm(first11Digits, true);

    // Combine all to form the 12-digit personal number
    return first11Digits + checkDigit;
}
