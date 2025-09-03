import type { TSvgLogPathD } from "../types/data";
import { round } from "./numeric.utils";

/**
 * Convert degrees in fahrenheit to degrees celsius
 *
 * @param input degrees in fahrenheit
 *
 * @returns degrees in celsius
 */
export const f2c = (input : number) : number => round(((input - 32) / 1.8), 1);

/**
 * Convert degrees in celsius to degrees fahrenheit
 *
 * @param input degrees in celsius
 *
 * @returns degrees in fahrenheit
 */
export const c2f = (input : number) : number => round(((input * 1.8) + 32), 1);

/**
 * Convert length in millimetres to length in inches
 *
 * @param input length in millimetres
 *
 * @returns length in inches
 */
export const m2i = (input : number) : number => round((input / 25.4), 2);

/**
 * Convert length in inches to length in millimetres
 *
 * @param input length in inches
 *
 * @returns length in millimetres
 */
export const i2m = (input : number) : number => round((input * 25.4));

/**
 * x2x() is a dummy function used when no conversion is required but
 * a function is needed.
 *
 * @param input input number
 * @returns unchanged input number
 */
export const x2x = (input : number) : number => input;

export const getMax = (input : TSvgLogPathD[], key : string, max: number = 0) : number => {
  const getter = (key === 'temp')
    ? (item : TSvgLogPathD) : number => item.temp
    : (item : TSvgLogPathD) : number => item.time;

  return input.reduce(
    (output, item : TSvgLogPathD) => {
      const tmp = getter(item)
      return (tmp > output)
        ? tmp
        : output;
    },
    max,
  );
}
