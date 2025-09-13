import type { TSvgPathItem } from "../types/data.d.ts";
import type { FiringStep } from "../types/data.d.ts";
import { round } from "./numeric.utils.ts";

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

export const getMax = (input : TSvgPathItem[], key : string, max: number = 0) : number => {
  const getter = (key === 'temp')
    ? (item : TSvgPathItem) : number => item.temp
    : (item : TSvgPathItem) : number => item.timeOffset

  return input.reduce(
    (output, item : TSvgPathItem) => {
      const tmp = getter(item)
      return (tmp > output)
        ? tmp
        : output;
    },
    max,
  );
}

export const hoursFromSeconds = (input : number) : string => {
  const hrs = Math.floor(input / 3600);
  const mins = Math.round((input - (hrs * 3600)) / 60);

  return (mins === 0)
    ? `${hrs}h`
    : `${hrs}h ${mins}m`;
};

export const durationFromSteps = (steps: FiringStep[]) : number => {
  let output : number = 0;
  let lastEndTemp : number = 0;


  for (const step of steps) {
    if (step.hold > 0) {
      output += step.hold * 60;
    }
    if (step.rate > 0 && step.endTemp > 0) {
      const diff = (step.endTemp > lastEndTemp)
        ? (step.endTemp - lastEndTemp)
        : (lastEndTemp - step.endTemp);

      output += (diff / step.rate) * 3600;
    }

    lastEndTemp = step.endTemp;
  }

  return Math.round(output);
};

export const durationFromStep = (steps: FiringStep[], i : number) : string => {
  let diff : number = 0;

  if (steps.length > 0) {
    if (i === 0) {
      diff = steps[0].endTemp;
    } else if (i > 0 && i < steps.length) {
      diff = Math.abs(steps[i].endTemp - steps[i - 1].endTemp);
    }
  }

  return hoursFromSeconds((diff / steps[i].rate) * 3600 + (steps[i].hold * 60));
}

export const maxTempFromSteps = (steps: FiringStep[]) : number => {
  if (steps.length === 0) {
    return 0;
  }

  return steps.reduce(
    (output, step) => (step.endTemp > output)
      ? step.endTemp
      : output,
    0,
  );
};

export const plotPointsFromSteps = (
  steps: FiringStep[],
) : TSvgPathItem[] => {
  const output : TSvgPathItem[] = [];
  let lastEndTemp : number = 0;
  let timeOffset : number = 0;

  for (const step of steps) {
    if (step.rate > 0 && step.endTemp > 0) {
      const diff = (step.endTemp > lastEndTemp)
        ? (step.endTemp - lastEndTemp)
        : (lastEndTemp - step.endTemp);

      const timeToTarget = (diff / step.rate) * 3600;

      timeOffset += timeToTarget;
      output.push({
        timeOffset: timeOffset,
        temp: step.endTemp,
      });
    } else if (output.length === 0) {
      output.push({
        timeOffset: 0,
        temp: 0,
      });
    }

    if (step.hold > 0) {
      timeOffset += (step.hold * 60);
      output.push({
        timeOffset: timeOffset,
        temp: step.endTemp,
      });
    }

    lastEndTemp = step.endTemp;
  }

  return output;
};

export const bool2YN = (input : boolean) : string => (input === true) ? 'Yes' : 'No';
