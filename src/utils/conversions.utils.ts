import { round } from "./numeric.utils";

export const f2c = (input : number) : number => round(((input - 32) / 1.8), 1);

export const c2f = (input : number) : number => round(((input * 1.8) + 32), 1);

export const m2i = (input : number) : number => round((input / 25.4), 2);
export const i2m = (input : number) : number => round((input * 25.4));
export const x2x = (input : number) : number => input;
