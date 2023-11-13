import { expect, test } from 'vitest'
import {T_IDS} from "./ids.mjs";
import {
    tnr,
    fnr,
    getType,
    validate,
    isRandom11Digit,
} from "./validator.mjs";
test('validator', () => {
    T_IDS.forEach((id) => {
        expect(getType(id)).toBe('tnr');
        expect(validate(id, 'fnr').status).toBe('invalid');
        expect(validate(id, 'tnr').status).toBe('valid');
    });
});

test('isRandom11Digit', () => {
    expect(isRandom11Digit("11223344556")).toBe(true);
    expect(isRandom11Digit("123")).toBe(false);
    expect(isRandom11Digit("17842321212")).toBe(false);
});
