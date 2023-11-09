import { expect, test } from 'vitest'
import {T_IDS} from "./ids.mjs";
import {tnr, fnr, getType, validate} from "./validator.mjs";
test('validator', () => {
    T_IDS.forEach((id) => {
        expect(getType(id)).toBe('tnr');
        expect(validate(id, 'fnr').status).toBe('invalid');
        expect(validate(id, 'tnr').status).toBe('valid');
    });
})