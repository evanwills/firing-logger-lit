export const round = (input : number, points: number = 0) : number => {
  if (points === 0) {
    return Math.round(input);
  }

  const factor = Math.pow(10, points);

  return (Math.round(input * factor) / factor);
};

export const numOrNan = (input : unknown) : number => {
  if (typeof input === 'number') {
    return (Number.isFinite(input))
      ? input
      : parseInt('Not a number');
  }

  if (typeof input === 'string' && /^\d+(?:\.\d+)?$/.test(input)) {
    return (input.includes('.'))
      ? parseFloat(input)
      : parseInt(input, 10);
  }

  return parseInt('Not a number');
};
