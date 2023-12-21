import { expect, test } from "vitest";
import {
  createRandomSwedishPersonalNumber,
  isValidSwedishPersonalNumber,
  luhnAlgorithm,
} from "./swedish.mjs";

test("isValidSwedishPersonalNumber", () => {
  expect(isValidSwedishPersonalNumber("123")).toBe(false);
  expect(isValidSwedishPersonalNumber("202301011234")).toBe(false);
  expect(isValidSwedishPersonalNumber("191402306085")).toBe(false);
});

test("generateRandomSwedishPersonalNumber", () => {
  for (let i = 0; i < 10; i++) {
    const number = createRandomSwedishPersonalNumber();
    expect(number.length).toBe(12);
    expect(luhnAlgorithm(number)).toBe(true);
    expect(isValidSwedishPersonalNumber(number)).toBe(false);
  }
});
