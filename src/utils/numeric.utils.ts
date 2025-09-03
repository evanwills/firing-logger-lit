export const round = (input : number, points: number = 0) : number => {
  if (points === 0) {
    return Math.round(input);
  }

  const factor = Math.pow(10, points);

  return (Math.round(input * factor) / factor);
};
