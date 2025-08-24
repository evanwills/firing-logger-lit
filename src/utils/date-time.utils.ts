const twoDigit = (input: number) : string => {
  return (input < 10)
    ? `0${input.toString()}`
    : input.toString();
};

export const getISO8601time = (when : number) : string => {
  const _when = new Date(when);

  return `${twoDigit(_when.getHours())}:`
    + `${twoDigit(_when.getMinutes())}:`
    + `${twoDigit(_when.getSeconds())}`;
}
