import OrtonConeChart from '../../public/data/orton-cones.json' with { type: 'json' };
import type { FiringStep } from '../types/programs.d.ts';

type TConeData = {
  cone: string,
  rate: number,
  temp: number
};

export const getCone = (temp : number, rate : number) : string => {
  const _rate = (rate <= 105)
    ? 60
    : 160;
  console.log('_rate:', _rate);

  let previousCone : TConeData|null = null;
  let nextCone : TConeData|null = null;

  for (const cone of OrtonConeChart) {
    if ((cone as TConeData).rate === _rate) {
      if ((cone as TConeData).temp > temp) {
        nextCone = (cone as TConeData);
        console.info('matched!!!')
        console.groupEnd();
        break;
      } else {
        previousCone = (cone as TConeData);
      }
    }
    console.groupEnd();
  }

  if (previousCone !== null && nextCone !== null) {
    const diff = ((nextCone.temp - previousCone.temp) / 2) + previousCone.temp;

    return (temp >= diff)
      ? nextCone.cone
      : previousCone.cone;
  }

  return '[UNKNOWN]';
};

export const getTopCone = (steps: FiringStep[], maxTemp : number) : string => {
  let startTemp = 0;

  for (const step of steps) {
    if (step.endTemp === maxTemp) {
      return getCone(maxTemp, (((step.endTemp - startTemp) / step.rate) + (step.hold / 60)));
    }
    startTemp = step.endTemp;
  }

  return '[[UNKOWN]]';
};
