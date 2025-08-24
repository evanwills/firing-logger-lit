export const round = (input : number, points: number = 0) : number => {
  if (points === 0) {
    return Math.round(input);
  }

  const factor = Math.pow(points, 10);

  return (Math.round(input * factor) / factor);
};
