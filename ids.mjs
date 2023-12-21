const randomSyntheticDate = (type) => {
  // random day between 01 and 28, or 41 and 78 if type is dnr
  const day = (Math.floor(Math.random() * 28) + 1 + (type === "dnr" ? 40 : 0))
    .toString()
    .padStart(2, "0");

  // random month between 81 and 92
  const month = (Math.floor(Math.random() * 12) + 81)
    .toString()
    .padStart(2, "0");
  // random year between 1900 and 1999 in YY format
  const year = (Math.floor(Math.random() * 100) + 1900).toString().substring(2);

  return `${day}${month}${year}`;
};

export const createSyntheticID = (type = "fnr") => {
  let first9Digits, k1, k2;
  do {
    const randomDate = randomSyntheticDate(type);
    // random 3 digit individual number between 000 and 499 (for persons born in 1900-1999)
    const individualNumber = Math.floor(Math.random() * 500)
      .toString()
      .padStart(3, "0");
    // Combine to form the first 9 digits
    first9Digits = `${randomDate}${individualNumber}`;
    // checksums
    [k1, k2] = checksums(first9Digits);
  } while (k1 >= 10 || k2 >= 10);
  return `${first9Digits}${k1}${k2}`;
};

export const checksums = (digits) => {
  let k1 =
    11 -
    ((3 * digits[0] +
      7 * digits[1] +
      6 * digits[2] +
      1 * digits[3] +
      8 * digits[4] +
      9 * digits[5] +
      4 * digits[6] +
      5 * digits[7] +
      2 * digits[8]) %
      11);
  let k2 =
    11 -
    ((5 * digits[0] +
      4 * digits[1] +
      3 * digits[2] +
      2 * digits[3] +
      7 * digits[4] +
      6 * digits[5] +
      5 * digits[6] +
      4 * digits[7] +
      3 * digits[8] +
      2 * k1) %
      11);

  if (k1 === 11) k1 = 0;
  if (k2 === 11) k2 = 0;

  return [k1, k2];
};
